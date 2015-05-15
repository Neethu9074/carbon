/*eslint-env mocha, node*/

'use strict';

import {expect} from 'chai';
import Immutable from 'immutable';
import proxyquire from 'proxyquire';

const pluginId = 'os';

describe('snapshotIcon', () => {

  let getIcon;
  let addIconFinder;
  let snapshot;

  beforeEach(() => {
    // reimporting via proxyquire to avoid the finder cache
    const mod = proxyquire('./index', {});
    getIcon = mod.getIcon;
    addIconFinder = mod.addIconFinder;

    snapshot = Immutable.fromJS({
      pluginId,
      snapshot: {}
    });
  });

  it('should retrieve the icon via a finder', () => {
    const truck = 'truck';
    addIconFinder(pluginId, () => truck);
    expect(getIcon(snapshot)).to.equal(truck);
  });

  it('should support multiple finders', () => {
    const truck = 'truck';
    addIconFinder('ec2', () => 'amazon');
    addIconFinder(pluginId, () => truck);
    addIconFinder('docker', () => 'container');
    expect(getIcon(snapshot)).to.equal(truck);
  });

  it('should fall back to a default icon', () => {
    expect(getIcon(snapshot)).to.equal('server');
  });

  it('should support configurable default icons', () => {
    expect(getIcon(snapshot, 'wtf')).to.equal('wtf');
  });

});
