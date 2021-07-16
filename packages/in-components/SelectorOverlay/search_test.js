/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* eslint-env jest */

import { expect } from 'chai';

import { search } from 'in-components/SelectorOverlay/search';

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
            keywords: 'foobar'
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

describe('in-components/SelectorOverlay/search', () => {
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
});
