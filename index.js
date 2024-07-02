const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const port = 2053;

app.get('/se/*', async (req, res) => {
    const path = req.params[0];
    const isURL = /^https?:\/\/.+/.test(path);

    if (isURL) {
        try {
            const response = await axios.get(path);
            res.send(response.data);
        } catch (error) {
            res.status(500).send('Error fetching the URL');
        }
    } else {
        const googleSearchURL = `https://www.google.com/search?q=${encodeURIComponent(path)}`;
        try {
            const response = await axios.get(googleSearchURL);
            const $ = cheerio.load(response.data);
            const links = [];

            $('a').each((i, elem) => {
                links.push($(elem).attr('href'));
            });

            res.send(links);
        } catch (error) {
            res.status(500).send('Error searching on Google');
        }
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
