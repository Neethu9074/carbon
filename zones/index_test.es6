/*eslint-env mocha*/
'use strict';

import Immutable from 'immutable';
import {expect} from 'chai';

import './index';
import {getZone} from 'instana-ui-sdk/zones';

describe('zones', () => {
  const osPlugin = 'com.instana.forge.infrastructure.os.OS';
  let snapshot;

  beforeEach(() => {
    snapshot = Immutable.fromJS({
      pluginId: osPlugin,
      snapshot: {
        'cpu.count': 1,
        'memory.total': 1000
      }
    });
  });

  it('should return undefined due to missing EC2 information', () => {
    expect(getZone(snapshot)).to.equal('undefined');
  });

  it('should return EC2 availability zone information', () => {
    snapshot = snapshot.setIn([
      'snapshot',
      'com.instana.forge.infrastructure.virtualization.EC2',
      'snapshot',
      'availability-zone'
    ], 'eu-central');
    expect(getZone(snapshot)).to.equal('eu-central');
  });
});
