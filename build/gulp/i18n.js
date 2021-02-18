/* eslint-env node */

const fs = require('fs/promises');
const path = require('path');

const paths = require('./paths');

const localeFileRegex = /^[a-z0-9]+-[a-z0-9]+\.json$/i;

exports.createI18nFiles = async function createI18nFiles() {
  const combined = await combineAllI18nFiles();
  await fs.mkdir(paths.i18nDir, {
    recursive: true
  });
  for (const locale of Object.keys(combined)) {
    await fs.writeFile(path.join(paths.i18nDir, `${locale}.json`), JSON.stringify(combined[locale]));
  }
};

async function combineAllI18nFiles() {
  const combined = {};
  const packageDirNames = await fs.readdir(paths.packageDir);
  for (const packageDirName of packageDirNames) {
    if (!packageDirName.startsWith('.')) {
      await addPackageContent(combined, packageDirName);
    }
  }
  return combined;
}

async function addPackageContent(combined, packageDirName) {
  const localizationDir = path.join(paths.packageDir, packageDirName, 'i18n');

  const namespace = await determineNamespaceName(localizationDir, packageDirName);

  let localeFileNames;
  try {
    localeFileNames = await fs.readdir(localizationDir);
  } catch (e) {
    // Not all packages have a need for i18n
    if (e.code !== 'ENOENT') {
      throw e;
    }
    return;
  }

  for (const localeFileName of localeFileNames) {
    if (localeFileRegex.test(localeFileName)) {
      await addLocaleFileContent(combined, namespace, path.join(localizationDir, localeFileName));
    }
  }
}

async function determineNamespaceName(localizationDir, packageDirName) {
  try {
    const fileContent = await fs.readFile(path.join(localizationDir, '.config.json'), { encoding: 'utf8' });
    const config = JSON.parse(fileContent);
    if (config.namespace) {
      return config.namespace;
    }
  } catch (e) {
    // Not all packages have a config file
    if (e.code !== 'ENOENT') {
      throw e;
    }
  }

  return packageDirName;
}

async function addLocaleFileContent(combined, namespace, localeFilePath) {
  const fileContent = await fs.readFile(localeFilePath, { encoding: 'utf8' });
  let localization;
  try {
    localization = JSON.parse(fileContent);
  } catch (e) {
    throw new Error(`Failed to parse '${localeFilePath}' content as JSON.`, e);
  }
  const localeName = path.basename(localeFilePath).replace(/\.json$/, '');
  combined[localeName] = combined[localeName] || {};
  combined[localeName][namespace] = localization;
}
