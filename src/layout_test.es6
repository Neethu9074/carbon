/*eslint-env mocha*/

'use strict';

import {expect} from 'chai';
import {buildColaGraphStructure} from './layout';

describe('layout', () => {
  let map;

  beforeEach(() => {
    map = {
      zones: [
        {
          id: 'eu-west',
          hosts: [
            {id: 'jira'},
            {id: 'confluence'},
            {id: 'test'},
            {id: 'demo'}
          ]
        }, {
          id: 'us-east',
          hosts: [
            {id: 'foobar'},
            {id: 'bla'}
          ]
        }
      ]
    };
  });

  it('should add the nodes and groups', () => {
    const structure = buildColaGraphStructure(map);
    expect(structure.graph.nodes.length).to.equal(6);
    expect(structure.graph.groups.length).to.equal(2);
  });

  it('should provide zone mapping information', () => {
    const structure = buildColaGraphStructure(map);
    expect(structure.zoneToGroupNumberMapping['eu-west']).to.equal(0);
    expect(structure.zoneToGroupNumberMapping['us-east']).to.equal(1);
  });

  it('should provide node mapping information', () => {
    const structure = buildColaGraphStructure(map);
    expect(structure.hostToNodeNumberMapping.jira).to.equal(0);
    expect(structure.hostToNodeNumberMapping.foobar).to.equal(4);
  });
});
