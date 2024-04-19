const express = require('express')
const path = require('path');
const app = express()


const port = 5000

//! pdf, chat and messages sample test list , Delete later
const pdfs = [
    { id: 1, name: 'example1.pdf' },
    { id: 2, name: 'example2.pdf' },
    { id: 3, name: 'example3.pdf' }
];

const chats = [
    { id: 1, name: 'chat1' },
    { id: 2, name: 'chat2' },
    { id: 3, name: 'chat3' }
];

const messages = [
    { id: 1, name: 'messages1' },
    { id: 2, name: 'messages2' },
    { id: 3, name: 'messages3' }
];



app.use(express.json());
// * start of `/api/pdfs`*/
/*POST: Upload a PDF document*/
// ? We may face some issues with this!
app.post("/api/pdfs", (req, res) => {
    
});

/*Get all PDF documents for a user*/
app.get("/api/pdfs", (req, res) => {
    
    if (!pdfs)
    {
        res.status(404).send("PDFS not found");
    } else
    {
        res.send(pdfs);
    }
    
});

/*DELETE: Delete a PDF document*/
app.delete("/api/pdfs/:id", (req, res) => {
    const id = req.params.id * 1;
    const pdfToDelete = pdfs.find(el => el.id === id);
    const index = pdfs.indexOf(pdfToDelete);
    pdfs.splice(index, 1);

    res.send(pdfs);
    // test with "curl -X DELETE http://localhost:5000/api/pdfs/2"
});

// *  Start of `/api/chats`

/*POST: Create a new chat*/
app.post("/api/chats", (req,res) => {
    const newId = chats.length + 1;
    const newChat = Object.assign({ id: newId }, req.body);
    chats.push(newChat);
    res.status(201).json({ message: "New chat has been created", chat: newChat });
    // test with "curl -X POST http://localhost:5000/api/chats -H "Content-Type: application/json" -d '{"name": "chat4"}' -vvv"

})
/*GET: Get all chats for a user*/
app.get("/api/chats", (req, res) => {
    
    if (!chats)
    {
        res.status(404).send("CHATS not found");
    } else
    {
        res.send(chats);
    }
    
});
/*DELETE: Delete a chat*/
app.delete("/api/chats/:id", (req, res) => {
    const id = req.params.id * 1;
    const chatToDelete = chats.find(el => el.id === id);
    const index = chats.indexOf(chatToDelete);
    pdfs.splice(index, 1);

    res.send(pdfs);
    // test with "curl -X DELETE http://localhost:5000/api/chats/2"
});



// *  Start of `/api/messages`*/
/*GET: Get all messages for a chat*/
app.get("/api/messages", (req, res) => {
    if (!messages)
    {
        res.status(404).send("Messages not found");
    } else
    {
        res.send(chats);
    }

});

/*POST: Send a message to a chat*/
app.post("/api/messages", (req,res) => {
    const newId = messages.length + 1;
    const newMessage = Object.assign({ id: newId }, req.body);
    messages.push(newMessage);
    res.status(201).json({ message: "New chat has been created", chat: newMessage });
    // test with "curl -X POST http://localhost:5000/api/messages -H "Content-Type: application/json" -d '{"name": "message4"}' -vvv"
});


// * Start of 404 page not found
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '404.html'))
})


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    });