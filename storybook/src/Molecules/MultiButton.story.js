import React from 'react';

import MultiButton from 'in-new-components/MultiButton';
import Button from 'in-new-components/Button';

export default {
  title: 'Molecules|MultiButton',
  component: MultiButton
};
const buttons = [
  <Button kind="secondary">Test</Button>,
  <Button kind="secondary">Tes2t</Button>,
  <Button kind="secondary">Test3</Button>,
  <Button kind="secondary">Test4</Button>
];
export const standard = () => <MultiButton label="MultiButton" buttons={buttons} />;
