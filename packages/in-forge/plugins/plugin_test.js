/* eslint-disable instana-import-order/instana-import-order */
/* eslint-env mocha, node */

// load all the plugins
import 'in-forge/plugins/index';

import { expect } from 'chai';
import path from 'path';
import fs from 'fs';

import { getOptionalSnapshotDefinition } from 'in-sdk/snapshot/registry';
import { plugins, fullyQualifiedPlugins } from 'in-forge/constants';
import { getKpiDefinitions } from 'in-sdk/metrics/kpis';
import { getChartWiggleRoom } from 'in-sdk/snapshot';

const dirNames = fs.readdirSync(__dirname).filter(file => fs.statSync(path.join(__dirname, file)).isDirectory());

describe('in-forge/plugins', () => {
  it('must define as many short plugin IDs as long plugin IDs', () => {
    expect(Object.keys(plugins).length).to.equal(Object.keys(fullyQualifiedPlugins).length);
  });

  it('must define the same keys for short plugin IDs as long plugin IDs', () => {
    expect(plugins).to.have.deep.keys(fullyQualifiedPlugins);
  });

  dirNames.forEach(dirName => {
    describe(`plugin directory ${dirName}`, () => {
      it('must be registered as a plugin', () => {
        expect(getOptionalSnapshotDefinition(dirName)).not.to.equal(undefined);
      });
    });
  });

  Object.keys(plugins).forEach(shortName => {
    const plugin = plugins[shortName];

    describe(`plugin: ${plugin}`, () => {
      it('must have a directory which contains its definition', () => {
        expect(dirNames).to.include(plugin);
      });

      it('must define a fully qualified plugin name', () => {
        expect(fullyQualifiedPlugins.hasOwnProperty(plugin)).to.equal(true);
      });

      it('must be registered in the snapshot SDK', () => {
        expect(getChartWiggleRoom(plugin)).to.be.a('number');
      });

      it('must only define functions as formatters for KPIs', () => {
        getKpiDefinitions(plugin).forEach(kpi => {
          if (kpi.formatter != null) {
            expect(kpi.formatter).to.be.a('function');
          }
        });
      });
    });
  });
});
