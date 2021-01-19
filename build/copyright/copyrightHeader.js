/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* eslint-env node */
/* eslint-disable no-console */

const thisYear = new Date(Date.now()).getFullYear();
const copyrightHeader = `/*\n * (c) Copyright IBM Corp. ${thisYear}\n * (c) Copyright Instana Inc. ${thisYear}\n */\n`;

const copyrightHeaderRegex = /\/\*\n \* \(c\) Copyright IBM Corp. [0-9]{4}\n \* \(c\) Copyright Instana Inc.( [0-9]{4})?\n \*\//;

module.exports = {
  copyrightHeader,
  containsCopyrightHeader: fileContent => fileContent && fileContent.match(copyrightHeaderRegex) != null
};
