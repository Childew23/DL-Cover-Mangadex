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

        const mangaTitle = manga.attributes.title.en || Object.values(manga.attributes.title)[0] || (manga.attributes.altTitles.length > 0 ? Object.values(manga.attributes.altTitles)[0] : "NoTitle");
        return { id: manga.id, mangaTitle };
    } catch (error) {
        console.error("Erreur lors de la requête : ", error.message);
        return null;
    }
};

async function getCovers(mangaId) {
    const allCovers = [];
    let offset = 0;
    const limit = 100;
    let hasMore = true;

    while (hasMore) {
        try {
            const res = await axios({
                method: 'GET',
                url: `${baseUrl}/cover`,
                params: {
                    'manga[]': mangaId,
                    'order[volume]': 'asc',
                    'locales[]': 'ja',
                    limit: 100,
                    offset
                }
            });

            const covers = res.data.data;
            allCovers.push(...covers.map(cover => ({
                fileName: cover.attributes.fileName,
                volume: cover.attributes.volume
            })));

            if (covers.length < limit) {
                hasMore = false;
            } else {
                offset += limit;
            }
        } catch (error) {
            console.error("Erreur : ", error.message);
            hasMore = false;
        }
    }

    return allCovers;
};

async function downloadCover(mangaId, fileName, folder, saveName, retry = 2) {
    try {
        const url = `https://uploads.mangadex.org/covers/${mangaId}/${fileName}`;
        const res = await axios.get(url, { responseType: "stream" });

        const filePath = path.join(folder, saveName);
        res.data.pipe(fs.createWriteStream(filePath));

        return new Promise(resolve => {
            res.data.on("end", () => {
                console.log(`✅ ${saveName}`);
                resolve();
            });
        });
    } catch (error) {
        if (retry > 0) {
            console.log(`⚠️ Erreur téléchargement ${saveName}, retry...`);
            return downloadCover(mangaId, fileName, folder, saveName, retry - 1);
        } else {
            console.error(`❌ Échec définitif : ${saveName}`, error);
        }
    }

};

async function downloadInBatches(covers, mangaId, folder, batchSize = 5) {
    for (let i = 0; i < covers.length; i+= batchSize) {
        const batch = covers.slice(i, i + batchSize);

        await Promise.all(
            batch.map(cover => {
                const volumeLabel = cover.volume ? `Volume ${cover.volume}` : "Oneshot";
                const saveName = `${volumeLabel}${path.extname(cover.fileName)}`;
                const filePath = path.join(folder, saveName);

                if (fs.existsSync(filePath)) {
                    return Promise.resolve();
                }

                return downloadCover(mangaId, cover.fileName, folder, saveName);
            })
        )
        
    }
}

async function main(title) {
    try {
        const mangaInfo = await getMangaIdByTitle(title);
        if (!mangaInfo) {
            console.error("❌ Manga introuvable.");
            return;
        }

        const { id: mangaId, mangaTitle } = mangaInfo;

        const cleanMangaTitle = mangaTitle
            .replace(/[\\/:*?"<>|]/g, '')
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

        console.log("Téléchargement en cours...");
        await downloadInBatches(covers, mangaId, folder, 5);

        console.log(`Tous les téléchargements sont terminés dans covers/${cleanMangaTitle} !`)
    } catch (error) {
        console.error("Erreur : ", error.message);
    }
}

rl.question("Entrez le titre du manga : ", (title) => {
    rl.close();
    main(title);
})