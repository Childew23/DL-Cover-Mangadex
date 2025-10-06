import fs from "fs";
import path from "path";
import cliProgress from "cli-progress";
import api from "./axiosInstance.js";

const progressBar = new cliProgress.SingleBar({
    format: "Téléchargment [{bar}] {percentage}% | {value}/{total} volumes",
    barCompleteChar: '\u2588',
    barIncompleteChar: '\u2591',
    hideCursor: true
}, cliProgress.Presets.shades_classic);

async function downloadCover(mangaId, fileName, folder, saveName) {
    try {
        const url = `https://uploads.mangadex.org/covers/${mangaId}/${fileName}`;
        const res = await api.get(url, { responseType: "stream" });

        const filePath = path.join(folder, saveName);
        res.data.pipe(fs.createWriteStream(filePath));

        return new Promise(resolve => {
            res.data.on("end", () => {
                resolve();
            });
        });
    } catch (error) {
        console.error(`❌ Échec lors du téléchargement de la cover : ${saveName}`, error);
    }

};

export async function downloadInBatches(covers, mangaId, folder, batchSize = 5) {
    progressBar.start(covers.length, 0);

    let downloaded = 0;
    for (let i = 0; i < covers.length; i += batchSize) {
        const batch = covers.slice(i, i + batchSize);

        await Promise.all(
            batch.map(async (cover) => {
                const volumeLabel = cover.volume ? `Volume ${cover.volume}` : "Oneshot";
                const saveName = `${volumeLabel}${path.extname(cover.fileName)}`;
                const filePath = path.join(folder, saveName);

                if (fs.existsSync(filePath)) {
                    downloaded++;
                    progressBar.update(downloaded);
                    return;
                }

                await downloadCover(mangaId, cover.fileName, folder, saveName);
                downloaded++;
                progressBar.update(downloaded);
            })
        )
    }

    progressBar.stop();
}

