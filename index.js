const express = require('express');

var app = express();
const port = process.env.PORT || 3000;

app.get('/orders', (req, res) => {
    res.send('Hello');
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
})