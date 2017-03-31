/* eslint-env mocha,node */
import { expect } from 'chai';

import { setIn, settingsStore } from './settings.es6';

describe('settings', () => {
  let settings;

  beforeEach(() => {
    global.localStorage = {
      setItem() {},
      getItem() {
        return null;
      }
    };
    settingsStore.subscribe(data => settings = data);
  });

  it('can load defaults if storage is empty', () => {
    const value = settings.getIn(['map', 'scrollSpeed']);
    expect(value).to.not.equal(void 0);
    expect(settings.getIn(['dataSource'])).to.equal('defaults');
  });

  it('can set a value', () => {
    setIn(['map', 'scrollSpeed'], 10);
  });

  it('can get a value', () => {
    setIn(['map', 'scrollSpeed'], 10);

    const value = settings.getIn(['map', 'scrollSpeed']);
    expect(value).to.equal(10);
  });
});
