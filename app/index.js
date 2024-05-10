import express from 'express';
import multer from 'multer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { deleteFile, load_pdf } from '../tools/fileProcessing.js';
import { doc_chuncker } from '../tools/chuncker.js';
import { ECohereEmbeddings } from '../models/Emodels.js';
import { Hvectore, H_load_vectore } from '../tools/storage.js';
import { retriever, combine } from '../tools/retriver.js';
import { ask } from '../tools/ask.js';
import bodyParser from 'body-parser';
import { appendFileSync } from 'fs';

const port = 3000;
const app = express();

/*
This route sets up an Express.js server to serve static
files from a directory named "public" - app/public
*/
app.use(express.static(new URL('public', import.meta.url).pathname));
app.use(bodyParser.json());


/**
 * Handles a POST request to '/send-message' endpoint, expecting a message in the request body.
 * Sends the message for processing and responds with the result.
 * 
 * @param {Object} req - The request object containing the message to be sent.
 * @param {Object} res - The response object to send the result.
 * @returns {Promise<void>} - A promise indicating the completion of the handling process.
 */
app.post('/send-message', async (req, res) => {
  const message = req.body.message;
  try {
    const response = await ask(message);
    console.log(await response)
    res.json({ status: 'success', data: response}); // Send back a JSON response
  } catch (error) {
    let currentDate = new Date().toISOString();
    let error_message = `${currentDate} - an error accured when sending message: ${error}`;
    appendFileSync('error.log', error_message + '\n');
    res.status(500);
  }
});


/**
 * Asynchronously handles a PDF file, processing its contents:
 * 1. Loads the PDF document from the specified file path.
 * 2. Divides the document into chunks for further processing.
 * 3. Embeds the chunks using ECohereEmbeddings and saves the output into the "app/db" directory.
 * 4. Deletes the original PDF file.
 * 5. Loads the vector database from the saved directory.
 * 6. Initiates a retrieval process.
 * 7. Combines the processed chunks.
 * 
 * @param {string} filePath - The path to the PDF file to be handled.
 * @returns {Promise<void>} - A promise indicating the completion of the handling process.
 */
async function processPDF(filePath){
  const doc = await load_pdf(filePath);
    const chuncks = await doc_chuncker(doc);

    // embedding and save the output into "app/db"
    const vectorStore = await Hvectore(chuncks, ECohereEmbeddings);
    const currentDir = dirname(fileURLToPath(import.meta.url));
    const targetDir = join(
      dirname(dirname(currentDir)),
      'ChatPDF',
      'dbs',
      'db'
    );

    await vectorStore.save(targetDir);

    //delete the file
    await deleteFile(filePath);

    //Load the DB
    const load_vectore = await H_load_vectore(targetDir, ECohereEmbeddings);
    await retriever;
    combine(chuncks);
}
/* Multer disk storage configuration to
create uniqe file name and save it into './app/PDFfiles */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const destinationPath =
      dirname(fileURLToPath(import.meta.url)) + '/PDFfiles';
    cb(null, destinationPath);
  },
  filename: (req, file, cb) => {
    const uniqueFileName = uuidv4(); // Generate a unique file name
    const fileExtension = file.originalname.split('.').pop(); // Get the file extension
    const fileName = `${uniqueFileName}.${fileExtension}`; // Combine unique name and extension
    cb(null, fileName);
  }
});
const upload = multer({ storage: storage });

/**
 * Handles a POST request to '/chat' endpoint, which expects a single file upload.
 * Upon receiving the file, it processes the PDF content asynchronously.
 * 
 * @param {Object} req - The request object containing file information.
 * @param {Object} res - The response object to send the result.
 * @returns {Promise<void>} - A promise indicating the completion of the handling process.
 */
app.post('/chat', upload.single('file'), async (req, res) => {
  try {
    const fileName = req.file.filename;
    const filePath = `${req.file.destination}/${fileName}`;

    processPDF(filePath)
    

    res.send('ok');
  } catch (error) {
    const currentDate = new Date().toISOString();
    const errorMessage = `Error occurred while processing file: ${error}`;
    const logMessage = `${currentDate} - ${errorMessage}`;
    // Write the error message to a log file
    appendFileSync('error.log', logMessage + '\n');
    res.status(500).send('Internal server error');
  }
});


/*404 page route */
  app.get('*', (req, res) => {
    res.sendFile(new URL('public/404.html', import.meta.url).pathname)
  })

app.listen(port, () => {
  console.log(`Server is running on port ${port}
access it with the link http://localhost:3000/index.html`);
});


