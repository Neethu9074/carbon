/* eslint-disable no-unused-expressions */
/* eslint-env mocha, node */
import {expect} from 'chai';

import Layouter from './Layouter';

describe('3D map', () => {
  let layouter;
  let map;
  let sortedGroups;

  function addGroup(id) {
    map.groups.push({
      id,
      _cachedLabel: id,
      children: [],
      getComponent: () => {
        return {
          setPosition: (x, y, z) => {
            sortedGroups[id] = {x, y, z};
          }
        };
      },
      setScale: () => {}
    });
    sortedGroups = {};
  }

  beforeEach(() => {
    layouter = new Layouter();
    map = {
      groups: []
    };
    addGroup('group_1');
    addGroup('unmonitored-hosts-zone');
    addGroup('group_2');
  });

  describe('physical layouter', () => {

    it('should sort doerte style', () => {
      layouter.applyLayout(map);
      expect(sortedGroups['unmonitored-hosts-zone'].x).to.be.above(sortedGroups.group_1.x);
      expect(sortedGroups['unmonitored-hosts-zone'].x).to.be.above(sortedGroups.group_2.x);
    });

  });

});
