const fs = require('fs');
const express = require('express');
let words;

fs.readFile('./allWords.txt', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading the file:', err);
    return;
  }

  words = data.split('\n');
});

const app = express();

function randomFromArray(array = [], amount) {
  if (!amount) amount = 1;
  else if (typeof amount !== 'number') amount = Number(amount);

  amount = Math.floor(amount);

  if (amount < 1) amount = 1;

  if (amount > 1) {
    return array.sort(() => 0.5 - Math.random()).slice(0, amount);
  }

  return array[Math.floor(Math.random() * array.length)];
}

app.get('/', (req, res) => {
  res.send('Hello Word!');
});

app.get('/random', (req, res) => {
  const startsWith = req.query.startsWith;
  const endsWith = req.query.endsWith;
  const amount = req.query.amount;

  if (Number(amount) > 500) {
    res.status(400).send({ error: 'Maximum amount of words allowed is 500.' });
    return;
  }

  if (!startsWith && !endsWith) {
    res.status(200).send({ word: randomFromArray(words, amount) });
  } else {
    let filtered = words;

    if (startsWith)
      filtered = filtered.filter((w) => w.toLowerCase().startsWith(startsWith));
    if (endsWith)
      filtered = filtered.filter((w) => w.toLowerCase().endsWith(endsWith));

    if (filtered.length === 0) {
      res
        .status(404)
        .send({ error: 'No words found that match the specified criteria.' });
    } else {
      res.status(200).send({ word: randomFromArray(filtered, amount) });
    }
  }
});

app.listen(3000, () => {
  console.log(`App listening on port 3000!`);
});
