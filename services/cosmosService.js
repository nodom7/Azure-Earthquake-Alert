const { CosmosClient } = require("@azure/cosmos");

const connectionString = process.env.COSMOS_CONNECTION_STRING;
const databaseId = "EmailDatabase";
const containerId = "EmailContainer";

if (!connectionString) {
    throw new Error("COSMOS_CONNECTION_STRING is not set in environment variables");
}

const client = new CosmosClient(connectionString);

async function initializeCosmosDB() {
    const { database } = await client.databases.createIfNotExists({ id: databaseId });
    const { container } = await database.containers.createIfNotExists({ id: containerId });
    console.log("CosmosDB initialized");
    return container;
}

async function addEmailToDatabase(email) {
    const container = await initializeCosmosDB();
    const { resource } = await container.items.create({ email: email });
    console.log(`Email added to database: ${email}`);
    return resource;
}

module.exports = {
    addEmailToDatabase
};