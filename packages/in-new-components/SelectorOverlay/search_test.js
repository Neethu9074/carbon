/* eslint-env mocha */

import { expect } from 'chai';

import { search } from 'in-new-components/SelectorOverlay/search';

const nodes = [
  {
    label: 'Root Level Leaf',
    description: 'Funky root leaf',
    icon: 'plugin:host'
  },
  {
    label: 'Root Level Node',
    description: 'Some description',
    icon: 'plugin:neo4j',
    children: [
      {
        label: 'First Level Leaf',
        description: 'Some description',
        icon: 'plugin:docker'
      },
      {
        label: 'First Level Node',
        description: 'Some description',
        icon: 'plugin:mule',
        children: [
          {
            label: 'Second Level Leaf',
            searchable: 'foobar'
          },
          {
            label: 'Second Level Node',
            description: 'Some description',
            icon: 'plugin:mule',
            children: [
              {
                label: 'Third Level Leaf',
                description: 'Some description'
              }
            ]
          }
        ]
      }
    ]
  }
];

describe('in-new-components/SelectorOverlay/search', () => {
  it('should return the whole tree if the query is empty', () => {
    expect(search(nodes, '')).to.deep.equal(nodes);
  });

  it('should filter by label', () => {
    expect(search(nodes, 'third')).to.deep.equal([
      {
        label: 'Third Level Leaf',
        description: 'Some description'
      }
    ]);
  });

  it('should filter by description', () => {
    expect(search(nodes, 'FunKy')).to.deep.equal([
      {
        label: 'Root Level Leaf',
        description: 'Funky root leaf',
        icon: 'plugin:host'
      }
    ]);
  });

  it('should filter by searchable', () => {
    expect(search(nodes, 'foobar')).to.deep.equal([
      {
        label: 'Second Level Leaf',
        searchable: 'foobar'
      }
    ]);
  });
});
