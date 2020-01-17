import React from 'react';

import Toggle from 'in-components/form/Toggle';

export default {
  title: 'Atoms|FormControl/Toggle',
  component: Toggle
};

export const On = () => <Toggle checked onChange={() => {}} />;
export const Off = () => <Toggle checked={false} onChange={() => {}} />;
export const OnDisbaled = () => <Toggle checked disabled onChange={() => {}} />;
export const OfDiabled = () => <Toggle checked={false} disabled onChange={() => {}} />;
