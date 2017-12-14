import { storiesOf } from '@storybook/react';
import React from 'react';

import ComboBox from 'in-components/ComboBox';

storiesOf('components/ComboBox', module)
  .add('empty', () => <StatefullComboBox options={[]} />)
  .add('with entries', () => (
    <StatefullComboBox
      options={[{ value: '1', label: 'Hello' }, { value: '2', label: 'World' }, { value: '3', label: '!' }]}
    />
  ));

class StatefullComboBox extends React.Component {
  static displayName = 'Statefull ComboBox';

  state = {
    value: null
  };

  render() {
    return (
      <div style={{ width: 250, padding: 8 }}>
        <ComboBox
          value={this.state.value}
          options={this.props.options}
          onChange={e => this.setState({ value: e.value })}
        />
      </div>
    );
  }
}
