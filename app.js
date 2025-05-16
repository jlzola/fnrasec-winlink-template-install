#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");
const readline = require('readline');

const config = require("./config.json");


const DEFAULT_REPO_API = config.githubRepo;
const DEFAULT_EXTENSIONS = [".txt", ".html"];
const DEFAULT_OUTPUT = config.defaultOutputDir;

// récupère tous les argument sauf les 2 premiers
const args = process.argv.slice(2);

// no prompt option
const noPrompt = process.argv.includes('--no-prompt') || process.argv.includes('-np');


const help = `
Installation des fichiers FNRASEC templates pour Winlink.

Ce programme télécharge les fichiers .txt et .html de la dernière release GitHub du dépôt : 
https://github.com/jlzola/fnrasec-winlink-template

Utilisation :
  install-fnrasec-template [dossier] 

Arguments :
  [dossier]  Dossier de destination (optionnel)
             Si omis, l'installation se fait dans le dossier par défaut : 
             "${DEFAULT_OUTPUT}"

Options :
  -h, --help  Affiche cette aide
  -np, --no-prompt  Installation directement dans le dossier par défaut sans question
  `


// Affichage de l'aide
if (args.includes("--help") || args.includes("-h")) {
  console.log(help);
  process.exit(0);
}


// Dossier de sortie
let outputDirBase = DEFAULT_OUTPUT;

if (args.length > 0 && !args[0].startsWith("-"))
  outputDirBase = path.resolve(args[0])


// Confirme l'installation
async function confirmeInstallation() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question('Voulez-vous continuer l\'installation des fichiers templates FNRASEC Winlink (Entrée pour OUI) ? [Oui]/Non \n', (answer) => {
      rl.close();
      const reponse = answer.trim().toLowerCase();
      resolve(reponse === 'oui' || reponse === 'o' || reponse === '');
    });
  });
}


// Attend la saisie d'un touche pour continuer
function waitForHiddenKey(msg, callback) {
  const stdin = process.stdin;
  stdin.setRawMode(true);
  stdin.resume();

  process.stdout.write(msg);

  stdin.once('data', () => {
    stdin.setRawMode(false);
    stdin.pause();
    process.stdout.write('\n');
    callback();
  });
}

// Définition du dossier cible pour l'installation
async function getTargetFolder(defaultOutputDir) {

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const userInput = await new Promise(resolve => {
    rl.question(`Saisir le dossier d'installation des fichiers (Entrée pour le dossier par défaut) [${defaultOutputDir}]: `, resolve);
    rl.on('close', () => resolve(''));
  });

  rl.close();
  return path.resolve(userInput.trim() || defaultOutputDir);
}


// Récupération des fichiers de la dernière release
async function fetchLatestRelease() {
  const response = await fetch(DEFAULT_REPO_API, {
    headers: { "User-Agent": "nodejs" }
  });

  if (!response.ok) {
    throw new Error(`Erreur HTTP ${response.status}`);
  }

  const data = await response.json();
  //console.log(data)
  return data;
}

// Téléchargement d’un fichier
async function downloadFile(url, outputPath) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Erreur téléchargement ${url} - HTTP ${response.status}`);
  }

  const fileStream = fs.createWriteStream(outputPath);
  return new Promise((resolve, reject) => {
    response.body.pipe(fileStream);
    response.body.on("error", reject);
    fileStream.on("finish", resolve);
  });
}


// Filtre sur les extensions
function matchExtension(filename) {
  return DEFAULT_EXTENSIONS.some(ext => filename.endsWith(ext));
}


//--------------------------------------------------------------------
// Programme principal
//--------------------------------------------------------------------
(async () => {
  try {

    if (!noPrompt) {
      const confirmation = await confirmeInstallation();
      if (!confirmation) {
        console.log('Installation abandonnée.');
        process.exit(0);
      }
    }

    console.log("Recherche de la dernière release...");

    // appel le service pour récupérer la dernière version 
    const data = await fetchLatestRelease();
    const assets = data.assets; // les fichiers
    const version = data.name; // la version

    console.log(`Installation de la version ${version} ...`);

    const defaultOutputDir = `${outputDirBase}\\${version}\\`;

    let outputDir = defaultOutputDir;

    if (!noPrompt) {
      // Saisi du dossier cible pour l'installation
      outputDir = await getTargetFolder(defaultOutputDir);
    }


    // création du dossier s'il n'existe pas
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }


    // Ne prendre que les fichiers avec les exetensions souhaitées
    const files = assets.filter(asset => matchExtension(asset.name));

    if (files.length === 0) {
      console.error("Aucun fichier .txt ou .html trouvé dans la release.");
      process.exit(2);
    }

    // 
    // Pour chaque fichier, on télécharge
    for (const file of files) {
      const destination = path.join(outputDir, file.name);
      console.log(`Téléchargement de ${file.name} dans ${outputDir}`);
      await downloadFile(file.browser_download_url, destination);
    }

    console.log("Téléchargement terminé.");

    if (!noPrompt) {
      // Faire une pause et attendre que l'utilisateur appuie sur une touche
      waitForHiddenKey('\nAppuyez sur une touche pour fermer... ', () => {
        console.log('\nA bientôt \n73');
      });
    }

  } catch (err) {
    console.error("Erreur :", err.message);
    process.exit(1);
  }
})();
