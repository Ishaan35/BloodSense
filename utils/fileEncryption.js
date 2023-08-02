const fs = require('fs')
const crypto = require('crypto')
const path = require('path')
require('dotenv').config()

const KeyHex = process.env.ENC_KEY_HEX;
const key = Buffer.from(KeyHex, 'hex');

// Test IV (128-bit IV represented in hexadecimal)
const IVHex = process.env.ENC_IV_HEX;
const iv = Buffer.from(IVHex, 'hex');

function encryptFile(inputFile, outputFile) {
    const algorithm = 'aes-256-cbc';
    const readStream = fs.createReadStream(inputFile);
    const writeStream = fs.createWriteStream(outputFile);
  
    // Ensure the directory exists for the output file
    const outputDir = path.dirname(outputFile);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
  
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    readStream.pipe(cipher).pipe(writeStream);
  
    return new Promise((resolve, reject) => {
        writeStream.on('finish', () => {
          console.log('Write stream finished. Resolving promise:', `${outputFile}`);
          resolve(`${outputFile}`);
        });
    
        writeStream.on('error', (err) => {
          console.error('Write stream error:', err);
          reject(err);
        });
    
        cipher.on('error', (err) => {
          console.error('Cipher error:', err);
          reject(err);
        });
    
        readStream.on('error', (err) => {
          console.error('Read stream error:', err);
          reject(err);
        });
      });
}
  


function decryptFile(inputStream, outputFile) {
    const algorithm = 'aes-256-cbc';
    const readStream = inputStream;
    const writeStream = fs.createWriteStream(outputFile);
  
    // Ensure the directory exists for the output file
    const outputDir = path.dirname(outputFile);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
  
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
  
    return new Promise((resolve, reject) => {
      readStream.pipe(decipher).pipe(writeStream);
  
      writeStream.on('finish', () => {
        //Decryption completed successfully
        resolve(outputFile);
      });
  
      writeStream.on('error', (err) => {
        console.error('Write stream error:', err);
        reject(err);
      });
  
      decipher.on('error', (err) => {
        console.error('Decipher error:', err);
        reject(err);
      });
    });
  }

module.exports = {encryptFile, decryptFile}