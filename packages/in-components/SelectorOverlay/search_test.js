/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { search } from 'in-components/SelectorOverlay/search';

const nodes = [
  {
    label: 'Root Level Leaf',
    description: 'Funky root leaf',
    keywords: 'root leaf',
    icon: 'plugin:host'
  },
  {
    label: 'Root Level Node',
    description: 'Some description',
    keywords: 'root node',
    icon: 'plugin:neo4j',
    children: [
      {
        label: 'First Level Leaf',
        description: 'Some description',
        keywords: 'first child level leaf',
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
                keywords: 'third child level leaf',
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
    expect(search(nodes, '')).toStrictEqual(nodes);
  });

  it('should only search on leafs', () => {
    // GIVEN
    const filterQuery = 'root node';

    // WHEN
    const result = search(nodes, filterQuery);

    // THEN
    expect(result).toStrictEqual([]);
  });

  it('should filter by label', () => {
    expect(search(nodes, 'third')).toStrictEqual([
      {
        label: 'Third Level Leaf',
        keywords: 'third child level leaf',
        description: 'Some description'
      }
    ]);
  });

  it('should fuzzy filter by label', () => {
    // GIVEN
    const filterQuery = 'thirLEL lea';

    // WHEN
    const result = search(nodes, filterQuery);

    // THEN
    expect(result).toStrictEqual([
      {
        label: 'Third Level Leaf',
        keywords: 'third child level leaf',
        description: 'Some description'
      }
    ]);
  });

  it('should filter by keyword', () => {
    // GIVEN
    const filterQuery = 'first child level';

    // WHEN
    const result = search(nodes, filterQuery);

    // THEN
    expect(result).toStrictEqual([
      {
        label: 'First Level Leaf',
        description: 'Some description',
        keywords: 'first child level leaf',
        icon: 'plugin:docker'
      }
    ]);
  });

  it('should fuzzy filter by keyword', () => {
    // GIVEN
    const filterQuery = 'Chldle lea';

    // WHEN
    const result = search(nodes, filterQuery);

    // THEN
    expect(result).toStrictEqual([
      {
        label: 'First Level Leaf',
        description: 'Some description',
        keywords: 'first child level leaf',
        icon: 'plugin:docker'
      },
      {
        label: 'Third Level Leaf',
        keywords: 'third child level leaf',
        description: 'Some description'
      }
    ]);
  });

  it('should filter by description', () => {
    expect(search(nodes, 'FunKy')).toStrictEqual([
      {
        label: 'Root Level Leaf',
        description: 'Funky root leaf',
        icon: 'plugin:host',
        keywords: 'root leaf'
      }
    ]);
  });

  it('should fuzzy filter by description', () => {
    // GIVEN
    const filterQuery = 'so dscION';

    // WHEN
    const result = search(nodes, filterQuery);

    // THEN
    expect(result).toStrictEqual([
      {
        description: 'Some description',
        icon: 'plugin:docker',
        keywords: 'first child level leaf',
        label: 'First Level Leaf'
      },
      {
        description: 'Some description',
        keywords: 'third child level leaf',
        label: 'Third Level Leaf'
      }
    ]);
  });
});
