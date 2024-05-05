import express from 'express';
import multer from 'multer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { load_pdf } from '../tools/fileProcessing.js';
import { doc_chuncker } from '../tools/chuncker.js';
import { ECohereEmbeddings } from '../models/Emodels.js';
import { Hvectore, H_load_vectore } from '../tools/storage.js';
import { retrevire, combine } from '../tools/retriver.js';
import { ask } from '../tools/ask.js';
import bodyParser from 'body-parser';

const port = 3000;
const app = express();

/*
This route sets up an Express.js server to serve static
files from a directory named "public" - app/public
*/
app.use(express.static(new URL('public', import.meta.url).pathname));
app.use(bodyParser.json());

app.post('/send-message', async (req, res) => {
  const message = req.body.message;
  try {
    const response = await ask(message);
    console.log(response.content)
    res.json({ status: 'success', data: response.content }); // Send back a JSON response
  } catch (error) {
    res.status(500);
  }
});

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

app.post('/chat', upload.single('file'), async (req, res) => {
  try {
    
    const fileName = req.file.filename;
    const filePath = `${req.file.destination}/${fileName}`;

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
    await retrevire;

    combine(chuncks);
    res.send('ok');
  } catch (error) {
    console.error('Error occurred while processing file:', error);
    res.status(500).send('Internal server error');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}
access it with the link http://localhost:3000/index.html`);
});
