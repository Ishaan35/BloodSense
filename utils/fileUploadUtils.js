const {
  BlobServiceClient,
  StorageSharedKeyCredential,
} = require("@azure/storage-blob");
const { uuid } = require("uuidv4");
require('dotenv').config();
const fs = require('fs')
const path = require('path')


const connectionString1 = process.env.AZURE_BLOB_STORAGE_CONTAINER_CONNECTION_STRING;

const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString1);
const containerName = "bloodtesttracker2files";
const containerNameDocuments = "bloodtesttracker2documents"

const uploadProfileImage = async (file) => {
    const containerClient = blobServiceClient.getContainerClient(containerName);

    const fileExtension = path.extname(file.originalname);
    const blobName = uuid() + Date.now() + fileExtension;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    const options = { blobHTTPHeaders: { blobContentDisposition: "inline" } };
    const uploadBlobResponse = await blockBlobClient.uploadFile(
      file.path,
      options
    );
    return blockBlobClient.url;
};

const uploadDocument = async (file, encryptedFilePath) =>{
  const containerClient = blobServiceClient.getContainerClient(containerNameDocuments);
  const fileExtension = path.extname(file.originalname);
  const blobName = uuid() + Date.now() + fileExtension;
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);
  const options = { blobHTTPHeaders: { blobContentDisposition: "inline" } };

  const uploadFilePath = encryptedFilePath ? encryptedFilePath : file.path
  const uploadBlobResponse = await blockBlobClient.uploadFile(
    uploadFilePath,
    options
  );

    //sql user, document id, and document url relation

  return blockBlobClient.url;
}

const deleteDocumentById = async (documentId) => {
  try {
    const containerClient = blobServiceClient.getContainerClient(containerNameDocuments);

    // Assuming your documents have unique IDs as part of the blob name
    const blobClient = containerClient.getBlobClient(documentId);
    const deleteResponse = await blobClient.delete();

    if (deleteResponse.errorCode) {
      throw new Error(deleteResponse.errorCode);
    }

    return true; // File deleted successfully
  } catch (error) {
    console.error('Error deleting document:', error);
    throw new Error("Error deleting document")
  }
};

const getUrlFromFileName = (filename) =>{
    const url = `${process.env.AZURE_BLOB_BASE_URL}/${filename}?${process.env.AZURE_BLOB_SAS_TOKEN}`;
    return url;
}

const getDocumentUrlFromFileName = (filename) =>{
  const url = `${process.env.AZURE_BLOB_BASE_URL_DOCUMENTS}/${filename}?${process.env.AZURE_BLOB_SAS_TOKEN_DOCUMENTS}`;
  return url;
}

function wait(duration) {
  return new Promise(resolve => {
    setTimeout(resolve, duration);
  });
}


module.exports = { uploadProfileImage, uploadDocument, getUrlFromFileName, getDocumentUrlFromFileName, wait, deleteDocumentById };