const { BlobServiceClient } = require('@azure/storage-blob');

const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;

if (!AZURE_STORAGE_CONNECTION_STRING) {
  throw new Error('Azure Storage Connection string not found');
}

const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
console.log("Connection String found");

const containerName = 'quakejsondata';
let containerClient;

async function ensureContainerExists() {
  containerClient = blobServiceClient.getContainerClient(containerName);
  const exists = await containerClient.exists();
  if (!exists) {
    console.log(`Container "${containerName}" does not exist. Creating it now...`);
    await containerClient.create();
    console.log(`Container "${containerName}" created successfully.`);
  } else {
    console.log(`Container "${containerName}" already exists.`);
  }
}

async function uploadJsonToBlob(data, blobName) {
  console.log(`Starting upload for ${blobName}`);
  try {
    await ensureContainerExists();
    
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    console.log(`BlockBlobClient created for ${blobName}`);
    
    const uploadBlobResponse = await blockBlobClient.upload(data, data.length);
    console.log(`Upload block blob ${blobName} successfully`, uploadBlobResponse.requestId);
    
    // Verify the upload
    const properties = await blockBlobClient.getProperties();
    console.log(`Blob ${blobName} properties:`, properties);
    
    return true;
  } catch (error) {
    console.error(`Error uploading ${blobName}:`, error);
    return false;
  }
}

module.exports = uploadJsonToBlob;