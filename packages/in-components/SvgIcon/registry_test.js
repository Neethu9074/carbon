/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

/* eslint-env mocha, node */

const { difference } = require('lodash');

const { expect } = require('chai');

describe('in-components/SvgIcon/registry', () => {
  it('must define the same keys in registry.js and registry.json files', () => {
    testDifference('in-components/SvgIcon/registry.json', 'in-components/SvgIcon/registry.js');
    testDifference('in-components/SvgIcon/registry.js', 'in-components/SvgIcon/registry.json');
  });
});

function testDifference(aName, bName) {
  const a = require(aName);
  const b = require(bName);
  const missing = difference(Object.keys(b), Object.keys(a));
  let message = `The following icons are missing in ${aName}, but are defined in ${bName}\n`;

  for (const key of missing) {
    message += ` - ${key}\n`;
  }

  expect(missing.length).to.equal(0, message);
}
