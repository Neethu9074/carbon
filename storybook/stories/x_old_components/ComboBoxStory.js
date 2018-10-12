import { storiesOf } from '@storybook/react';
import React from 'react';

import ComboBox from 'in-components/ComboBox';
import Root from '../_helpers/Root';

storiesOf('old_components/ComboBox', module)
  .add('empty', () => <StatefulComboBox options={[]} />)
  .add('with entries', () => (
    <StatefulComboBox
      options={[{ value: '1', label: 'Hello' }, { value: '2', label: 'World' }, { value: '3', label: '!' }]}
    />
  ));

class StatefulComboBox extends React.Component {
  static displayName = 'Statefull ComboBox';

  state = {
    value: null
  };

  render() {
    return (
      <Root>
        <ComboBox
          value={this.state.value}
          options={this.props.options}
          onChange={e => this.setState({ value: e.value })}
        />
      </Root>
    );
  }
}
