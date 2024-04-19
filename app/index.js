const express = require('express')
const path = require('path');
const app = express()
// ! To check if the file exists, may remove it later
// AIzaSyCTw6-HUUp_YNPKMe4siWSC9GZoH_knmB4
const fs = require('fs');

const port = 5000


app.use(express.json());

// * /*`/api/pdfs`*/
/*POST: Upload a PDF document*/
app.post("/api/pdfs", (req, res) => {
        res.sendFile(path.join(__dirname, 'pdf.txt'));
});

/*Get all PDF documents for a user*/
app.get("/api/pdfs", (req, res) => {
        const filePath = path.join(__dirname, '/pdf.txt');
        fs.access(filePath, fs.constants.F_OK, (err) => {
            if (err) {
                res.status(404).send("File not found");
            } else {
                res.sendFile(filePath);
            }
        });
    });



// *  /*`/api/chats`*/
/*Get all chats for a user*/
app.get("/api/chats", (req, res) => {
        res.sendFile(path.join(__dirname, 'pdf.txt'));
});



// *  /*`/api/messages`*/
/*GET: Get all messages for a chat*/
app.get("/api/messages", (req, res) => {
        res.sendFile(path.join(__dirname, 'pdf.txt'));
});



// * 404 page
app.get('/*', (req, res) => {
        res.sendFile(path.join(__dirname, '404.html'))
})


app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });