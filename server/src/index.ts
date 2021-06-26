import express from 'express';

const app = express();
const port = 4000;

app.get('/login', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`App listening at port ${port}`);
});
