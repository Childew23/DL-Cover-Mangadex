import fs from "fs";
import path from "path";
import { getCovers } from "./api.js";
import { downloadInBatches } from "./download.js";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function run(mangaInfo) {
    try {
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
};
