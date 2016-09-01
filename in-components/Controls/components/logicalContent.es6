import React from 'react';

import AutoLayout from 'in-components/Controls/components/AutoLayout';
import Particles from 'in-components/Controls/components/Particles';
import Zoom from 'in-components/Controls/components/Zoom';


export default function getLogicalContent() {
  const controls = [
    <AutoLayout key='layout' />,
    <Particles key='particles' />,
    <Zoom key='zoom' />
  ];

  if (__DEV__) {

  }

  return controls;
}
