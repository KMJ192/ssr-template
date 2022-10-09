import express from 'express';
import serverRender from './src/serverRender.js';
import staticPage from './src/staticPage.js';

const app = express();
const port = 3000;

app.use('/src', express.static('./src'));

app.get('/', (req, res) => {
  res.send(serverRender(staticPage()));
});

app.listen(port, () => {
  console.log(`listen in port ${port}`);
});
