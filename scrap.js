import axios from "axios";
import fs from "fs";
import path from "path";
import readline from "readline";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const baseUrl = 'https://api.mangadex.org';

async function getMangaIdByTitle(title) {
    try {
        const res = await axios({
            method: 'GET',
            url: `${baseUrl}/manga`,
            params: {
                title: title
            }
        });

        if (res.data.data.length === 0) {
            throw new Error("Manga introuvable.");
        }

        const manga = res.data.data[0];

        const mangaTitle = manga.attributes.title.en || Object.values(manga.attributes.title)[0] || Object.values(manga.attributes.altTitles)[0]
        return { id: manga.id, mangaTitle };
    } catch (error) {
        console.error("Erreur lors de la requête : ", error.message);
        return null;
    }
};

async function getCovers(mangaId) {
    try {
        const res = await axios({
            method: 'GET',
            url: `${baseUrl}/cover`,
            params: {
                'manga[]': mangaId,
                'order[volume]': 'asc',
                'locales[]': 'ja',
                limit: 100
            }
        });

        const covers = res.data.data;
        return covers.map(cover => cover.attributes.fileName);

    } catch (error) {
        console.error("Erreur : ", error.message);
    }
};

async function downloadCover(mangaId, fileName, folder, saveName) {
    const url = `https://uploads.mangadex.org/covers/${mangaId}/${fileName}`;
    const res = await axios.get(url, { responseType: "stream" });

    const filePath = path.join(folder, saveName);
    res.data.pipe(fs.createWriteStream(filePath));

    return new Promise(resolve => {
        res.data.on("end", () => {
            console.log(`✅ ${saveName}`);
            resolve();
        })
    })
};

async function main(title) {
    try {
        const mangaInfo = await getMangaIdByTitle(title);
        if (!mangaInfo) {
            console.error("❌ Manga introuvable.");
            return;
        }

        const { id: mangaId, mangaTitle } = mangaInfo;

        const cleanMangaTitle = mangaTitle
                                .replace(/[\\\/:*?"<>|]/g, '')
                                .replace(/[. ]+$/, '');

        const coversRoot = path.join(__dirname, 'covers');
        if (!fs.existsSync(coversRoot)) {
            fs.mkdirSync(coversRoot);
        }
        const folder = path.join(coversRoot, cleanMangaTitle);
        if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder);
            console.log(`📂 Dossier créé : ${folder}`)
        }

        const covers = await getCovers(mangaId);

        if (!covers || covers.length === 0) {
            console.log("❌ Aucune cover trouvée pour ce manga.");
            return;
        }

        for (const [i, fileName] of covers.entries()) {
            const saveName = `Volume ${i + 1}${path.extname(fileName)}`;
            const filePath = path.join(folder, saveName);

            if (fs.existsSync(filePath)) {
                continue;
            }

            await downloadCover(mangaId, fileName, folder, saveName);
        }

        console.log(`Tous les téléchargements sont terminés dans covers/${cleanMangaTitle} !`)
    } catch (error) {
        console.error("Erreur : ", error.message);
    }
}

rl.question("Entrez le titre du manga : ", (title) => {
    rl.close();
    main(title);
})