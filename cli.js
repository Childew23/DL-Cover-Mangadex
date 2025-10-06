import inquirer from "inquirer";
import { getMangaIdByTitle } from "./api.js";
import { run } from "./main.js";

async function startCLI() {
    const { title } = await inquirer.prompt([
        {
            type: "input",
            name: "title",
            message: "Entrez le titre du manga :",
        },
    ]);

    const mangas = await getMangaIdByTitle(title);

    if (!mangas || mangas.length === 0) {
        console.error("❌ Aucun manga trouvé.");
        return;
    }

    const { selected } = await inquirer.prompt([
        {
            type: "list",
            name: "selected",
            message: "Sélectionnez le manga :",
            choices: mangas.map((m) => ({
                name : `${m.mangaTitle}`,
                value: m
            }))
        }
    ]);

    await run(selected);
}

startCLI();

