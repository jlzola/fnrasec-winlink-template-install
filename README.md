# FNRASEC Winlink Template Install

## Table des matières
1. [Présentation du projet](#présentation-du-projet)
2. [Fonctionnalités](#fonctionnalités)
3. [Options et paramètres](#options-et-paramètres)
4. [Utilisation et exemples](#utilisation-et-exemples)
5. [Développement et contribution](#développement-et-contribution)
6. [Dépendances](#dépendances)
7. [Liens utiles](#liens-utiles)

---

## Présentation du projet
Ce projet permet de télécharger et d’installer automatiquement les templates FNRASEC pour Winlink à partir des releases GitHub. Il facilite la mise à jour ou l'installation de fichiers modèles (.txt, .html) dans le dossier Winlink de votre choix, en mode interactif ou automatisé.

---

## Fonctionnalités
- Téléchargement automatique de la *dernière version* ou d'une *version spécifique* des templates FNRASEC depuis GitHub.
- Installation dans le dossier de votre choix ou dans le dossier par défaut défaut : `C:\RMS Express\Global Folders\Templates\FNRASEC\XX.Y.Z`).
- Mode interactif (avec confirmation) ou silencieux (sans prompt).
- Possibilité d'écraser un dossier existant après confirmation.

---

## Options et paramètres

| Option / Argument         | Description                                                                                 |
|--------------------------|--------------------------------------------------------------------------------------------|
| `[dossier]`               | Dossier de destination (optionnel). Par défaut : `C:\RMS Express\Global Folders\Templates\FNRASEC` |
| `--version`, `-v`        | Télécharge une version spécifique  depuis GitHub. Exemple : `-v 25.9.5`        |
| `--no-prompt`, `-np`     | Installation sans confirmation (mode silencieux)                                            |
| `--help`, `-h`           | Affiche l’aide et quitte le script                                                          |

Toutes les options sont *facultatives*.
Si vous ne mettez aucune option le programme se lance en mode interactif : il vous pose des question.


Toutes les options sont *combinables*. Exemple : installation silencieuse d'une version précise dans un dossier personnalisé.

---

## Utilisation et exemples

### Installation des dépendances
```bash
npm install
```

### Lancer le script principal
```bash
npm start
```

#### Exemples d'utilisation
- Installer la dernière version des templates Winlink en mode interactif :
   ```bash
   npm start
   ```
- Installer une version précise des templates Winlink en mode interactif :
   ```bash
   npm start -- -v 25.9.5
   ```
- Installer les templates Winlink dans un dossier personnalisé sans confirmation :
   ```bash
   npm start -- "D:\\Winlink\\Templates" -v 25.9.5 -np
   ```


### Générer un exécutable Windows
```bash
npm run build
```
L'exécutable sera généré dans le dossier `dist`.

#### Utiliser l'exécutable Windows
Après génération, vous pouvez utiliser `fnrasec-winlink-template-install.exe` avec exactement les mêmes paramètres que le script Node.js :

- Installer la dernière version en mode interactif :
   ```bash
   fnrasec-winlink-template-install.exe
   ```
- Installer une version précise :
   ```bash
   fnrasec-winlink-template-install.exe -v 25.9.5
   ```
- Installer dans un dossier personnalisé sans confirmation :
   ```bash
   fnrasec-winlink-template-install.exe "D:\\Winlink\\Templates" -v 25.9.5 -np
   ```

### Générer des exécutables pour Windows, Linux, MacOS
```bash
npm run build-all
```

---

## Développement et contribution

### Cloner le dépôt et installer les dépendances
```bash
git clone https://github.com/jlzola/fnrasec-winlink-template-install.git
cd fnrasec-winlink-template-install
npm install
```

### Lancer le programme depuis VS Code
- Ouvre le dossier dans VS Code.
- Va dans l’onglet "Exécuter et déboguer".
- Sélectionne la configuration `Debug: app.js -v 25.9.5` (ou modifie les arguments dans `.vscode/launch.json`).
- Clique sur "Démarrer le débogage". La saisie utilisateur se fait dans le terminal intégré.

### Lancer le programme en debug
- Place des points d’arrêt dans `app.js`.
- Lance le debug comme ci-dessus pour suivre l’exécution pas à pas.

### Conseils pour contribuer
- Respecte la structure du projet et la convention de nommage.
- Documente toute nouvelle fonctionnalité dans ce README.
- Propose tes modifications via une Pull Request sur GitHub.

---

## Dépendances
- Node.js >= 14
- node-fetch
- pkg (pour la génération d’exécutables)

---

## Liens utiles
- [Dépôt GitHub des templates Winlink](https://github.com/jlzola/fnrasec-winlink-template)
- [Dépôt GitHub de ce script](https://github.com/jlzola/fnrasec-winlink-template-install)

---

73 de Jelo F4IXH

