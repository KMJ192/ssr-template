function serverRender(component) {
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Document</title>
      </head>
      <body>
        <main id="app">${component ? component : ''}</main>
        <script src="./src/index.js" type="module"></script>
      </body>
    </html>
  `;
}

export default serverRender;