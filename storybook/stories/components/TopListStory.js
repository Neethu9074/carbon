import {storiesOf} from '@storybook/react';
import React from 'react';

import TopList from 'in-components/TopList';
import Root from '../_helpers/Root';

storiesOf('components/TopList', module)
  .add('TopList', () => <TopListComponent options={[]}/>);

class TopListComponent extends React.Component {
  static displayName = 'TopList';

  state = {
    value: null
  };

  render() {
    return (
      <Root>
        <TopList
          dummyData={[
            {
              label: 'shop',
              unit: 'ms',
              value: 812,
              maxValue: 812,
              traces: ['6.2s', '5.0s', '4.7', '4.3s', '2.1s']
            },
            {
              label: 'cart',
              unit: 'ms',
              value: 756,
              maxValue: 812,
              traces: ['6.2s', '5.0s', '4.7', '4.3s', '2.1s']
            },
            {
              label: 'products',
              unit: 'ms',
              value: 682,
              maxValue: 812,
              traces: ['6.2s', '5.0s', '4.7', '4.3s', '2.1s']
            },
            {
              label: 'authentication',
              unit: 'ms',
              value: 413,
              maxValue: 812,
              traces: ['6.2s', '5.0s', '4.7', '4.3s', '2.1s']
            }
          ]}
          header="Services"
        />
      </Root>
    );
  }
}
