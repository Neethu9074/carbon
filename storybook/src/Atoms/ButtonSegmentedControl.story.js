import React from 'react';

import ButtonSegmentedControl from 'in-new-components/ButtonSegmentedControl';

export default {
  title: 'Atoms|ButtonSegmentedControl',
  component: ButtonSegmentedControl
};

export function ButtonSegmentedControlStory() {
  return (
    <>
      <ButtonSegmentedControl buttonPropsList={[{ text: 'Button 1', key: '1' }]} activeKey="1" />
      <br />
      <ButtonSegmentedControl
        buttonPropsList={[{ text: 'Button 1', key: '1' }, { text: 'Button 2', key: '2' }]}
        activeKey="2"
      />
      <br />
      <ButtonSegmentedControl
        buttonPropsList={[
          { text: 'Button 1', key: '1' },
          { text: 'Button 2', key: '2' },
          { text: 'Button 3', key: '3' },
          { text: 'Button 4', key: '4' }
        ]}
        activeKey="2"
      />
    </>
  );
}
