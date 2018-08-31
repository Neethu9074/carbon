import { storiesOf } from '@storybook/react';
import React from 'react';

import MultiSelectDropdown from 'in-new-components/MultiSelectDropdown/MultiSelectDropdown';

import Root from '../../_helpers/Root';

storiesOf('designLibrary/Components/Multi-Select Dropdown', module)
  .add('Default', () => <Default />)
  .add('Custom label renderer', () => <CustomRenderer />);

const options = [
  {
    value: 'HTTP',
    label: 'HTTP'
  },
  {
    value: 'database',
    label: 'Database'
  }
];

function Default() {
  return (
    <Root>
      <MultiSelectDropdown placeholder="Type" options={options} values={['database']} apply={() => {}} />
    </Root>
  );
}

function CustomRenderer() {
  const labelRenderer = label => {
    return (
      <div>
        <div style={{ display: 'inline-block', background: 'blue', width: '0.75rem', height: '0.75rem' }} />
        <span style={{ marginLeft: '0.5rem' }}>{label}</span>
      </div>
    );
  };

  return (
    <Root>
      <MultiSelectDropdown placeholder="Type" options={options} labelRenderer={labelRenderer} apply={() => {}} />
    </Root>
  );
}
