const { BlobServiceClient } = require('@azure/storage-blob');

const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
const containerClient = blobServiceClient.getContainerClient('jsondata');

async function uploadJsonToBlob(data, blobName) {
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    await blockBlobClient.upload(data, data.length);
}

module.exports = uploadJsonToBlob;
