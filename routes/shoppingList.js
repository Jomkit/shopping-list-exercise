const express = require('express');
const fs = require('fs');
// const items = require('../fakeDb');

const router = new express.Router();
const path = "fakeDb.json";
// let contents;

function read(){
    return fs.readFileSync(path, "utf8");
    // fs.readFile(path, "utf8", (err, data) => {
    //     if(err) {
    //         console.log("ERROR:", err.message);
    //         process.exit(1);
    //     }
    //     const contents = data;
    //     console.log("Data:", contents);
    //     return contents;
    // })
}

function write(content){
    fs.writeFile(path, content, "utf8", (err, data) => {
        if (err){
            console.log("ERROR:", err.message);
            process.exit(1);
        }
    })
}

router.get("/", (req, res) => {
    console.log("Checking shopping list...");
    const contents = JSON.parse(read());
    
    return res.json(contents);
})

router.post("/", (req, res) => {
    const newItem = { name: req.body.name, price: req.body.price }
    let items = read();
    if(items==undefined) {
        items = [];
    } else{
        items = JSON.parse(items);
    }
    items.push(newItem);
    write(JSON.stringify(items));
    return res.status(201).json({ added: newItem })
})  

router.get("/:name", (req, res) => {
    let items = JSON.parse(read());
    const foundItem = items.find((item) => item.name === req.params.name);

    res.json({ name: foundItem.name, price: foundItem.price });
})

router.patch("/:name", (req, res) => {
    let items = JSON.parse(read());
    const foundItem = items.find((item) => item.name === req.params.name);
    foundItem.name = req.body.name;
    foundItem.price = req.body.price;

    write(JSON.stringify(items));
    
    res.json({ updated: foundItem });
})

router.delete("/:name", (req, res) => {
    let items = JSON.parse(read());
    const foundItem = items.find((item) => item.name === req.params.name);
    items.splice(foundItem, 1);

    write(JSON.stringify(items));
    
    res.json({ message: "Deleted" });
})

module.exports = router;