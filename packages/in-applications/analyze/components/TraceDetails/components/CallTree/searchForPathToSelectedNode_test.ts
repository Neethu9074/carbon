/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import searchForPathToSelectedNode from 'in-applications/analyze/components/TraceDetails/components/CallTree/searchForPathToSelectedNode';

describe('in-applications/analyze/components/TraceDetails/components/CallTree/searchForPathToSelectedNode', () => {
  const tree = {
    id: '1',
    children: [
      {
        id: '2',
        children: [
          {
            id: '7',
            children: []
          }
        ]
      },
      {
        id: '3',
        children: [
          {
            id: '4',
            children: []
          },
          {
            id: '5',
            children: []
          },
          {
            id: '6',
            children: []
          }
        ]
      }
    ]
  };

  type NodeSelector = Parameters<typeof searchForPathToSelectedNode>[1];

  it('Should return empty array if there is no RootNode', () => {
    // Given
    const nodeSelector: NodeSelector = node => node.id === '1';

    // When
    const actual = searchForPathToSelectedNode(undefined, nodeSelector);

    // Then
    expect(actual).toEqual([]);
  });

  it('Should return path to RootNode if nodeSelector matches the RootNode', () => {
    // Given
    const nodeSelector: NodeSelector = node => node.id === '1';

    // When
    const actual = searchForPathToSelectedNode(tree, nodeSelector);

    // Then
    expect(actual).toEqual(['1']);
  });

  it('Should return empty array if nodeSelector matches nothing', () => {
    // Given
    const nodeSelector: NodeSelector = node => node.id === '10';

    // When
    const actual = searchForPathToSelectedNode(tree, nodeSelector);

    // Then
    expect(actual).toEqual([]);
  });

  it.each`
    target | expected
    ${'3'} | ${['1', '3']}
    ${'5'} | ${['1', '3', '5']}
    ${'7'} | ${['1', '2', '7']}
  `('Should return path to LeafNode if nodeSelector matches the LeafNode', ({ target, expected }) => {
    // Given
    const nodeSelector: NodeSelector = node => node.id === target;

    // When
    const actual = searchForPathToSelectedNode(tree, nodeSelector);

    // Then
    expect(actual).toEqual(expected);
  });
});
