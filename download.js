import fs from "fs";
import path from "path";
import api from "./axiosInstance.js";


async function downloadCover(mangaId, fileName, folder, saveName) {
    try {
        const url = `https://uploads.mangadex.org/covers/${mangaId}/${fileName}`;
        const res = await api.get(url, { responseType: "stream" });

        const filePath = path.join(folder, saveName);
        res.data.pipe(fs.createWriteStream(filePath));

        return new Promise(resolve => {
            res.data.on("end", () => {
                console.log(`✅ ${saveName}`);
                resolve();
            });
        });
    } catch (error) {
        console.error(`❌ Échec définitif : ${saveName}`, error);
    }

};

export async function downloadInBatches(covers, mangaId, folder, batchSize = 5) {
    for (let i = 0; i < covers.length; i += batchSize) {
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

