/*eslint-env mocha,node*/

'use strict';

import {expect} from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';

describe('theme', () => {

  let addClassStub;
  let module;

  beforeEach(() => {
    addClassStub = sinon.stub();

    global.window = {};
    global.document = {
      documentElement: {
        classList: {
          add: addClassStub
        }
      }
    };
  });

  it('should use the default theme when no theme is globally defined', () => {
    doImport();
    expect(module.themeName).to.equal('night');
  });

  it('should use the globally defined theme', () => {
    setTheme('day');
    doImport();
    expect(module.themeName).to.equal('day');
  });

  it('should set the active theme on the document', () => {
    setTheme('day');
    doImport();
    module.setThemeOnHtmlDocument();
    expect(addClassStub.callCount).to.equal(1);
    expect(addClassStub.getCall(0).args[0]).to.equal('in-theme-day');
  });

  function setTheme(theme) {
    global.window.instana = {
      settings: {
        theme
      }
    };
  }

  function doImport() {
    module = proxyquire('./index', {});
  }
});
