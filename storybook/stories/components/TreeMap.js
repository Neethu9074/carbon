import { storiesOf } from '@storybook/react';
import React from 'react';

import ResultAwareTreeMap from 'in-new-components/TreeMap/ResultAwareTreeMap';

import Root from '../_helpers/Root';

storiesOf('Components/TreeMap', module)
  .add('Loading', () => <LoadingTreeMap />)
  .add('Error', () => <ErrorTreeMap />)
  .add('Tree Map', () => <SimpleTreeMap />);

function LoadingTreeMap() {
  return (
    <Root>
      <ResultAwareTreeMap result={{ progress: { loading: true } }} />
    </Root>
  );
}

function ErrorTreeMap() {
  return (
    <Root>
      <ResultAwareTreeMap result={{ progress: { loading: false }, errors: [{ message: 'something went wrong' }] }} />
    </Root>
  );
}

function SimpleTreeMap() {
  return (
    <Root>
      <ResultAwareTreeMap
        result={{
          progress: { loading: false },
          errors: [],
          data: {
            root: {
              id: 'root',
              children: [
                {
                  id: 'group 1',
                  children: [
                    {
                      id: 'child 1',
                      value: 1
                    },
                    {
                      id: 'child 2',
                      value: 2
                    }
                  ]
                },
                {
                  id: 'group 2',
                  children: [
                    {
                      id: 'child 3',
                      value: 3
                    },
                    {
                      id: 'child 4',
                      value: 4
                    }
                  ]
                }
              ]
            }
          }
        }}
        treeMapRendererProps={{
          mapData: d => d.treeMapData.root
        }}
      />
    </Root>
  );
}
