import React from 'react';

import FullHeightWrapper from 'in-applications/Dashboards/commonComponents/FullHeightWrapper';
import ResultAwareTreeMap from 'in-new-components/TreeMap/ResultAwareTreeMap';

export default {
  title: 'Organisms|TreeMap',
  parameters: {
    // ignoring this story because it renders differently everytime
    chromatic: { disable: true }
  },
  component: ResultAwareTreeMap
};

export function LoadingTreeMap() {
  return <ResultAwareTreeMap result={{ progress: { loading: true } }} />;
}

export function ErrorTreeMap() {
  return (
    <ResultAwareTreeMap result={{ progress: { loading: false }, errors: [{ message: 'something went wrong' }] }} />
  );
}

export function SimpleTreeMap() {
  return (
    <>
      <h2>Simple</h2>
      <ResultAwareTreeMap
        result={{
          progress: { loading: false },
          errors: [],
          data: getSampleDataSimple()
        }}
        treeMapRendererProps={{
          mapData: d => d.treeMapData.root
        }}
      />

      <h2>Simple with 0 vlaues</h2>
      <ResultAwareTreeMap
        result={{
          progress: { loading: false },
          errors: [],
          data: getSampleDataSimple(true)
        }}
        treeMapRendererProps={{
          mapData: d => d.treeMapData.root
        }}
      />
    </>
  );
}

export function ComplexTreeMap() {
  return (
    <FullHeightWrapper
      render={customHeight => (
        <ResultAwareTreeMap
          result={{
            progress: { loading: false },
            errors: [],
            data: getSampleDataComplex()
          }}
          treeMapRendererProps={{
            mapData: d => d.treeMapData.root,
            customHeight
          }}
        />
      )}
    />
  );
}

function getSampleDataSimple(withNullValues = false) {
  return {
    root: {
      id: 'root',
      children: [
        {
          id: 'group 1',
          label: 'Group 1',
          children: [
            {
              id: 'child 1',
              label: 'Child 1',
              valueLabel: '1',
              value: 1
            },
            {
              id: 'child 2',
              label: 'child 2',
              valueLabel: !withNullValues ? '2' : '0',
              value: !withNullValues ? 2 : 0.1
            }
          ]
        },
        {
          id: 'group 2',
          label: 'Group 2',
          children: [
            {
              id: 'child 3',
              label: 'Child 3',
              valueLabel: '3',
              value: 3
            },
            {
              id: 'child 4',
              label: 'Child 4',
              valueLabel: !withNullValues ? '4' : '0',
              value: !withNullValues ? 4 : 0.1
            }
          ]
        }
      ]
    }
  };
}

function getSampleDataComplex() {
  const root = {
    id: 'root',
    children: calculateGroups(20).map(group => {
      group.children = calculateNodes(20);
      return group;
    })
  };

  return { root };
}

function calculateNodes(numNodes) {
  const nodes = [];
  for (let i = 0; i < numNodes; i++) {
    const value = Math.max(0.1, ((Math.random() * 10) | 0) / 10);
    nodes[i] = {
      id: i,
      label: `Child ${i + 1}`,
      valueLabel: value,
      value
    };
  }
  return nodes;
}

function calculateGroups(nuMGroups) {
  const nodes = [];
  for (let i = 0; i < nuMGroups; i++) {
    nodes[i] = {
      id: i,
      label: `Group ${i + 1}`
    };
  }
  return nodes;
}
