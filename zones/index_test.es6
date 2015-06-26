/*eslint-env mocha*/
'use strict';

import Immutable from 'immutable';
import {expect} from 'chai';

import './index';
import {getZone} from 'instana-ui-sdk/zones';
import * as constants from '../constants';

describe('zones', () => {
  let snapshot;

  beforeEach(() => {
    snapshot = Immutable.fromJS({
      pluginId: constants.plugins.os,
      data: {
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
      'data',
      constants.rels.describes,
      'localhost',
      'availability-zone'
    ], 'eu-central');
    expect(getZone(snapshot)).to.equal('eu-central');
  });
});
