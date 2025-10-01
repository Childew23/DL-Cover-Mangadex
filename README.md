# MangaDex Cover Downloader

Un outil en ligne de commande (CLI) simple et efficace pour trouver et télécharger toutes les couvertures de volumes disponibles pour n'importe quel manga depuis l'API de MangaDex.

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
    cd mangadex-cover-downloader
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

Entrez le titre du manga : Kaguya

Résultats trouvés :
1. Kaguya-sama: Love is War Official Doujin
2. Kaguya-sama wa Kokurasetai: Tensai-tachi no Renai Zunousen
3. Ludwig Fantasia
4. We Want to Talk About Kaguya-sama
5. Touhou - Kaguya ga Koumakan no Maid ni Narusoudesu (Doujinshi)

Choisissez un numéro : 2

📂 Dossier créé : /chemin/vers/le/projet/covers/Kaguya-sama wa Kokurasetai Tensai-tachi no Renai Zunousen
Téléchargement en cours...
✅ Volume 1.jpg
✅ Volume 2.jpg
✅ Volume 3.jpg
✅ Volume 4.jpg
✅ Volume 5.jpg
...
Tous les téléchargements sont terminés dans covers/Kaguya-sama wa Kokurasetai Tensai-tachi no Renai Zunousen !
```

Toutes les couvertures téléchargées seront sauvegardées dans le dossier `covers/[Titre du Manga]` à la racine du projet.


## Fonctionnement

1.  **Recherche** : Le script `cli.js` prend votre saisie et utilise `api.js` pour interroger l'API MangaDex à la recherche de mangas correspondant au titre.
2.  **Sélection** : Une liste de correspondances potentielles est affichée. Une fois que vous avez choisi un numéro, l'ID et le titre du manga sont transmis au processus principal.
3.  **Récupération** : `main.js` nettoie le titre pour créer un nom de dossier valide. Ensuite, il appelle à nouveau `api.js` pour obtenir la liste complète de toutes les couvertures associées à l'ID de ce manga.
4.  **Téléchargement** : La liste des couvertures est transmise à `download.js`, qui télécharge les images par petits lots concurrents pour améliorer la vitesse. Il les enregistre dans le dossier nouvellement créé.

## Remerciements

Cet outil est alimenté par l'API publique de [MangaDex](https://api.mangadex.org/docs/). Un grand merci à l'équipe de MangaDex de fournir ce service gratuit et complet.

## Licence

Ce projet est sous licence MIT.