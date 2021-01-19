/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
/* eslint-env node */

const crypto = require('crypto');
const path = require('path');
const fs = require('fs');

const { isDevModeBuild } = require('./opts');

const componentPathPrefix = path.join(__dirname, '..', '..', 'packages');
const minimumHashLength = 1;
const hashClassPrefix = '🖖🏾';

// Maps the readable identifier to the full hash and the used short hash.
// Example:
// in-button_primary => {
//   fullHash,
//   shortenedHash
// }
const identToHashMapping = {};

// Which short hash variants are currently in use.
const usedShortHashes = {};

exports.localIdentName = getLocalIdentName();
exports.getLocalIdent = getGetLocalIdent();
exports.webpackPlugin = {
  apply(compiler) {
    compiler.plugin('done', onBuildFinish);
  }
};

function getLocalIdentName() {
  if (isDevModeBuild) {
    return '[path]__[local]';
  }
  return '[sha1:hash:base64]';
}

function getGetLocalIdent() {
  return function() {
    const ident = getLocalIdentInternal.apply(this, arguments);
    if (isDevModeBuild) {
      return ident;
    }
    return hashClassPrefix + getHash(ident);
  };
}

function getLocalIdentInternal(context, localIdentName, localName) {
  const file = (context.resourcePath || context.context)
    .substring(componentPathPrefix.length)
    .replace(/\/|\\|\./g, '_')
    .replace(/^_/, '')
    .replace(/_$/, '');
  return `${file}___${localName}`;
}

function getHash(ident) {
  if (identToHashMapping[ident]) {
    return identToHashMapping[ident].shortHash;
  }

  const fullHash = crypto
    .createHash('sha1')
    .update(ident)
    .digest('base64')

    // make it safe to use these hashes in almost all places
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  const hashes = {
    fullHash,
    shortHash: getShortHash(fullHash)
  };
  identToHashMapping[ident] = hashes;
  return hashes.shortHash;
}

function getShortHash(fullHash) {
  for (let i = minimumHashLength - 1; i < fullHash.length; i++) {
    const shortHash = fullHash.substring(0, i + 1);
    if (!usedShortHashes[shortHash]) {
      usedShortHashes[shortHash] = fullHash;
      return shortHash;
    }
  }
  return fullHash;
}

function onBuildFinish() {
  if (isDevModeBuild) {
    return;
  }

  fs.writeFileSync(
    path.join(__dirname, '..', '..', 'target', 'assets', 'bundle', 'cssIdentifiers.json'),
    getCssIdentifiesFileContent(),
    { encoding: 'utf8' }
  );
}

function getCssIdentifiesFileContent() {
  const content = {};
  Object.keys(identToHashMapping).forEach(
    ident => (content[ident] = hashClassPrefix + identToHashMapping[ident].shortHash)
  );
  return JSON.stringify(content);
}
