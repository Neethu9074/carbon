/* eslint-disable instana-import-order/instana-import-order */
/* eslint-env mocha, node */

// load all the plugins
import 'in-forge/tracing/index';

import { expect } from 'chai';
import path from 'path';
import fs from 'fs';

import { registry } from 'in-sdk/tracing/registry';

const dirNames = fs
  .readdirSync(__dirname)
  .filter(file => fs.statSync(path.join(__dirname, file)).isDirectory())
  .filter(file => {
    try {
      return fs.statSync(path.join(__dirname, file, 'index.es6')).isFile();
    } catch (e) {
      return false;
    }
  });

describe('in-forge/tracing', () => {
  dirNames.forEach(dirName => {
    describe(`trace plugin ${dirName}`, () => {
      it('must use the same name for directory and trace type name', () => {
        expect(registry[dirName]).to.be.an(
          'object',
          `Directory for trace plugin ${dirName} exists, but no such type is registered. ` +
            `Please ensure that the directory name matches the type name.`
        );
      });

      it('must be able to resolve the span detail view', () => {
        const detailViewPath = path.join(__dirname, dirName, registry[dirName].detailView + '.es6');
        expect(fs.statSync(detailViewPath).isFile()).to.equal(true);
      });
    });
  });
});
