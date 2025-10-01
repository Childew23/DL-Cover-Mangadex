import readline from "readline";
import { getMangaIdByTitle } from "./api.js";
import { run } from "./main.js";


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question("Entrez le titre du manga : ", async (title) => {
    const mangas = await getMangaIdByTitle(title);

    if (!mangas) {
        console.error("❌ Aucun manga trouvé.");
        rl.close();
        return;
    }

    console.log("\nRésultats trouvés :");
    mangas.forEach((m, index) => {
        console.log(`${index + 1}. ${m.mangaTitle}`)
    });

    rl.question("\nChoisissez un numéro : ", async (answer) => {
        const choice = parseInt(answer, 10);

        let selected;
        if (isNaN(choice) || choice < 1 || choice > mangas.length) {
            console.log("❌ Choix invalide, utilisation du premier résultat.");
            selected = mangas[0];
        } else {
            selected = mangas[choice - 1];
        }

        await run(selected);
        rl.close();
    });
});