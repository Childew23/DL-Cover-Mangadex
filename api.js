import axios from "axios";

const baseUrl = 'https://api.mangadex.org';

export async function getMangaIdByTitle(title) {
    try {
        const res = await axios({
            method: 'GET',
            url: `${baseUrl}/manga`,
            params: {
                title: title,
                limit: 5
            }
        });

        if (res.data.data.length === 0) {
            throw new Error("Manga introuvable.");
        }

        const mangas = res.data.data.map(manga => {
            const mangaTitle =
                manga.attributes.title.en ||
                Object.values(manga.attributes.title)[0] ||
                (manga.attributes.altTitles.length > 0
                    ? Object.values(manga.attributes.altTitles)[0]
                    : "NoTitle");

            return { id: manga.id, mangaTitle };
        });

        return mangas;

    } catch (error) {
        console.error("Erreur lors de la requête : ", error.message);
        return null;
    }
};

export async function getCovers(mangaId) {
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
