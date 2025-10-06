# MangaDex Cover Downloader

Un outil en ligne de commande (CLI) simple et efficace pour trouver et télécharger toutes les couvertures de volumes disponibles pour n'importe quel manga depuis l'API de [MangaDex](https://api.mangadex.org).

## Prérequis

Avant de commencer, assurez-vous d'avoir installé les éléments suivants :

  - [Node.js](https://nodejs.org/) (version 18.0.0 ou supérieure recommandée).
  - npm (généralement inclus avec Node.js).

## Installation

1.  **Clonez le dépôt :**

    ```sh
    git clone https://github.com/Childew23/DL-Cover-Mangadex.git
    ```

2.  **Accédez au répertoire du projet :**

    ```sh
    cd DL-Cover-Mangadex
    ```

3.  **Installez les dépendances requises :**

    ```sh
    npm i
    ```

## Utilisation

Lancez l'application en utilisant la commande suivante dans votre terminal :

```sh
npm start
```

L'outil vous invitera alors à saisir le titre du manga que vous souhaitez rechercher.

#### Exemple d'utilisation

```sh
$ npm start

> mangadex-cover-downloader@1.0.0 start
> node cli.js

? Entrez le titre du manga : Kaguya

? Sélectionnez le manga : (Use arrow keys)
> Kaguya-sama: Love is War Official Doujin
  Kaguya-sama wa Kokurasetai: Tensai-tachi no Renai Zunousen
  Ludwig Fantasia
  We Want to Talk About Kaguya-sama
  Touhou - Kaguya ga Koumakan no Maid ni Narusoudesu (Doujinshi)

📂 Dossier créé : /chemin/vers/le/projet/covers/Kaguya-sama wa Kokurasetai Tensai-tachi no Renai Zunousen
Progress: [██████████░░░░░░░░░░░░░░] 45% | 25/56 volumes

...
Tous les téléchargements sont terminés dans covers/Kaguya-sama wa Kokurasetai Tensai-tachi no Renai Zunousen !
```

Toutes les couvertures téléchargées seront sauvegardées dans le dossier `covers/[Titre du Manga]` à la racine du projet.

## Licence

Ce projet est sous licence MIT.