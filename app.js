const express = require('express');
const sqlite3 = require('sqlite3').verbose(); // Ajoutez '.verbose()' pour obtenir des informations détaillées
const app = express();
const port = 3000;

// Créez une base de données SQLite en mémoire (remplacez 'mydatabase.db' par ':memory:')
const db = new sqlite3.Database(':memory:'); 

// Créez la table 'items' si elle n'existe pas
db.serialize(() => {
  db.run('CREATE TABLE IF NOT EXISTS items (id INTEGER PRIMARY KEY, name TEXT)');
});

app.use(express.json());

app.get('/items', (req, res) => {
  db.all('SELECT * FROM items', (err, rows) => {
    if (err) {
      res.status(500).json({ esrror: err.message });
      return;
    }
    res.json({ items: rows });
  });
});

app.post('/items', (req, res) => {
  const { name } = req.body;
  db.run('INSERT INTO items (name) VALUES (?)', [name], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID });
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
