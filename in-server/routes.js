import express from 'express';
import Handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';

// import {getChecksumForFile} from './checksum';

const router = express.Router();
export default router;


const rawTemplate = fs.readFileSync(
  path.join(__dirname, 'templates', 'index.hbs'),
  {encoding: 'utf8'}
);
const compiledTemplate = Handlebars.compile(rawTemplate);

const assetDir = path.join(__dirname, 'assets');
const bundleDir = path.join(assetDir, 'bundle');

// const indexJsChecksum = getChecksumForFile(path.join(bundleDir, 'index.js'));
// const themes = fs.readdirSync(bundleDir)
//   .reduce((themeHashes, fileName) => {
//     const match = fileName.match(/^theme-(\w+)\.css$/);
//     if (match) {
//       themeHashes[match[1]] = {
//         fileName,
//         checksum: getChecksumForFile(path.join(bundleDir, fileName))
//       };
//     }
//     return themeHashes;
//   }, {});

// console.log(themes);

// assets directory will be populated with generated JavaScript during the build process.
router.use(express.static(assetDir));


router.get('/', (req, res) => {
  // TODO determine active theme based on cookie and set active theme in response
  res.send(compiledTemplate({
    // indexJsChecksum,
    // themes
  }));
});


// support both requests with and without checksum
router.get('/bundle/index.js', sendIndexJs);
router.get('/bundle/index-*.js', sendIndexJs);

function sendIndexJs(req, res) {
  res.sendFile(
    path.join(bundleDir, 'index.js'),
    err => {
      if (err) {
        res.sendStatus(404);
      }
    }
  );
}


router.get('/bundle/theme-*.css', (req, res) => {
  const url = req.originalUrl;
  const match = url.match(/theme-(\w+)(-.*)?\.css$/);
  if (!match) {
    res.sendStatus(404);
    return;
  }

  const themeName = match[1];
  res.sendFile(
    path.join(bundleDir, 'theme-' + themeName + '.css'),
    err => {
      if (err) {
        res.sendStatus(404);
      }
    }
  );
});
