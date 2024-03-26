const express = require('express');
const items = require('../fakeDb');

const router = new express.Router();

router.get("/", (req, res) => {
    res.json({ items });
})

router.post("/", (req, res) => {
    const newItem = { name: req.body.name, price: req.body.price }
    items.push(newItem);
    return res.status(201).json({ added: newItem })
})  

router.get("/:name", (req, res) => {
    const foundItem = items.find((item) => item.name === req.params.name);

    res.json({ name: foundItem.name, price: foundItem.price });
})

router.patch("/:name", (req, res) => {
    const foundItem = items.find((item) => item.name === req.params.name);
    foundItem.name = req.body.name;
    foundItem.price = req.body.price;
    
    res.json({ updated: foundItem });
})

router.delete("/:name", (req, res) => {
    const foundItem = items.find((item) => item.name === req.params.name);
    items.splice(foundItem, 1);
    
    res.json({ message: "Deleted" });
})

module.exports = router;