import express from 'express';
import multer from 'multer';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { load_pdf } from '../tools/fileProcessing.js';


const port = 3000;
const app = express();

/*
This route sets up an Express.js server to serve static
files from a directory named "public" located in the same
directory as the script.
*/
app.use(express.static(new URL('public', import.meta.url).pathname));





/* Multer disk storage configuration to
create uniqe file name and save it into './app/PDFfiles */
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const destinationPath = dirname(fileURLToPath(import.meta.url)) + '/PDFfiles';
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

app.post('/upload', upload.single('file'), async (req, res) => {
    try {
        
        const fileName = req.file.filename;
        const filePath = `${req.file.destination}/${fileName}`;

        const docs = await load_pdf(filePath);
    } catch (error) {
        console.error('Error occurred while processing file:', error);
        res.status(500).send('Internal server error');
    }
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});