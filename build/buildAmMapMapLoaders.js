/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* eslint-env node */
/* eslint-disable no-console */

const { get } = require('lodash');
const path = require('path');
const fs = require('fs');

console.log(generateLoaderFile(getMapTranslation()));

function generateLoaderFile(translation) {
  let imports = [];
  let exportDefinition = [];
  let countryCodeToGlobalMapping = [];

  Object.keys(translation)
    .sort()
    .forEach(countryCode => {
      const getterName = 'get' + countryCode[0].toUpperCase() + countryCode[1].toLowerCase();
      imports.push(
        `import ${getterName} from 'promise-loader?global,${getterName}AmMap!ammap3/ammap/maps/js/${translation[countryCode]}.js';`
      );
      countryCodeToGlobalMapping.push(`  '${countryCode.toLowerCase()}': '${translation[countryCode]}'`);
      exportDefinition.push(`  '${countryCode.toLowerCase()}': ${getterName}`);
    });

  return `
${imports.join('\n')}

export const loaders = {
${exportDefinition.join(',\n')}
};

export const globalMapping = {
${countryCodeToGlobalMapping.join(',\n')}
};
`.trim();
}

function getMapTranslation() {
  // the AmCharts maps expect a global register that global so that they register their info
  global.AmCharts = { maps: {} };

  const mapLocation = path.join(__dirname, '..', 'node_modules', 'ammap3', 'ammap', 'maps', 'js');
  fs.readdirSync(mapLocation)
    .filter(f => /^[a-z0-9]+Low\.js$/i.test(f))
    // only grab one of the usa maps
    .filter(f => f.indexOf('usa') !== 0 || f === 'usa2Low.js')
    // Tibet is seen as Chinese territory. Do not include this map, as it would otherwise
    // break the country identification (Tibet has chinese country codes).
    .filter(f => f.indexOf('tibet') === -1)
    .forEach(f => require(path.join(mapLocation, f)));

  const translation = Object.keys(global.AmCharts.maps).reduce((maps, mapName) => {
    const firstPathId = get(global.AmCharts.maps, [mapName, 'svg', 'g', 'path', 0, 'id']);

    if (firstPathId.indexOf('-') === -1) {
      // probably a world map, ignore
      return maps;
    }

    const countryCode = extractCountryCode(firstPathId);
    if (countryCode.length > 2) {
      // probably not a country map, ignore
      return maps;
    }

    maps[countryCode] = mapName;
    return maps;
  }, {});

  return translation;
}

function extractCountryCode(pathId) {
  return pathId.split('-', 2)[0];
}
