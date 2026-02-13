import { AppDataSource } from "./src/config/data-source";

async function test() {
    try {
        console.log("Connecting...");
        await AppDataSource.initialize();
        console.log("Connected!");

        const entities = AppDataSource.entityMetadatas;
        console.log("Entities found:", entities.map(e => e.name));

        for (const entity of entities) {
            const repo = AppDataSource.getRepository(entity.target);
            const count = await repo.count();
            console.log(`Entity ${entity.name}: ${count} records`);
        }

        await AppDataSource.destroy();
    } catch (err) {
        console.error("Diagnostic failed:", err);
        process.exit(1);
    }
}

test();
