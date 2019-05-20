/* eslint-disable instana-import-order/instana-import-order */
/* eslint-env mocha, node */

// load all the plugins
import 'in-forge/plugins/index';

import { expect } from 'chai';
import path from 'path';
import fs from 'fs';

import { plugins, fullyQualifiedPlugins } from 'in-forge/constants';
import { getChartWiggleRoom } from 'in-sdk/snapshot';

const dirNames = fs.readdirSync(__dirname).filter(file => fs.statSync(path.join(__dirname, file)).isDirectory());

describe('in-forge/plugins', () => {
  it('must define as many plugins in the constants as there are directories in in-forge/plugins', () => {
    expect(Object.keys(plugins).length).to.equal(dirNames.length);
  });

  it('must define as many short plugin IDs as long plugin IDs', () => {
    expect(Object.keys(plugins).length).to.equal(Object.keys(fullyQualifiedPlugins).length);
  });

  Object.keys(plugins).forEach(shortName => {
    const plugin = plugins[shortName];

    describe(`plugin: ${plugin}`, () => {
      it('must define a fully qualified plugin name', () => {
        expect(fullyQualifiedPlugins.hasOwnProperty(plugin)).to.equal(true);
      });

      it('must be registered in the snapshot SDK', () => {
        expect(getChartWiggleRoom(plugin)).to.be.a('number');
      });
    });
  });
});
