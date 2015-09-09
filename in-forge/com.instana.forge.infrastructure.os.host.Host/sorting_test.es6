/*eslint-env mocha*/
import Immutable from 'immutable';
import {expect} from 'chai';

import {sort} from 'in-sdk/sorting';

import * as constants from '../constants';
import './index';

describe('zones', () => {
  let snapshots;

  beforeEach(() => {
    snapshots = Immutable.fromJS([
      {hostId: 'B', pluginId: constants.plugins.os},
      {hostId: 'A', pluginId: constants.plugins.os},
      {hostId: 'C', pluginId: constants.plugins.os}
    ]);
  });

  it('should sort OS snapshots based on hostIds', () => {
    const result = sort(snapshots);
    expect(result.get(0).get('hostId')).to.equal('A');
    expect(result.get(1).get('hostId')).to.equal('B');
    expect(result.get(2).get('hostId')).to.equal('C');
  });
});
