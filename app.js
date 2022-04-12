import express from 'express';
import serverRender from './src/serverRender.js';
import staticPage from './src/staticPage.js';

const app = express();

app.use('/src', express.static('./src'));

app.get('/', (req, res) => {
  res.send(serverRender(staticPage()));
});

app.listen(3000, () => {
  console.log('serve');
});
