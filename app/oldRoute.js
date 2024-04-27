// * start of `/api/pdfs`*/
/*POST: Upload a PDF document*/
app.post('/stats', upload.single('uploaded_file'), function (req, res) {
    
        console.log(req.file, req.body)
        /*
        * Open http://127.0.0.1:3000/index.html and test it
        U should find a pdf File in /app/uploadsPDF/
        */
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
        // test with "curl -X DELETE http://localhost:3000/api/pdfs/2"
    });
    
    // *  Start of `/api/chats`
    
    /*POST: Create a new chat*/
    app.post("/api/chats", (req,res) => {
        const newId = chats.length + 1;
        const newChat = Object.assign({ id: newId }, req.body);
        chats.push(newChat);
        res.status(201).json({ message: "New chat has been created", chat: newChat });
        // test with "curl -X POST http://localhost:3000/api/chats -H "Content-Type: application/json" -d '{"name": "chat4"}' -vvv"
    
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
        // test with "curl -X DELETE http://localhost:3000/api/chats/2"
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
        // test with "curl -X POST http://localhost:3000/api/messages -H "Content-Type: application/json" -d '{"name": "message4"}' -vvv"
    });
    
    
    // * Start of 404 page not found
    app.get('/*', (req, res) => {
        res.sendFile(path.join(__dirname, '../front/404.html'))
    })
    
