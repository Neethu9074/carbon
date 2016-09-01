import React from 'react';

import AutoLayout from 'in-components/Controls/components/AutoLayout';
import Particles from 'in-components/Controls/components/Particles';
import Icons from 'in-components/Controls/components/Icons';
import Zoom from 'in-components/Controls/components/Zoom';


export default function getLogicalContent() {
  const controls = [
    <Zoom key='zoom' />,
    <Particles key='particles' />,
    <AutoLayout key='layout' />
  ];

  if (__DEV__) {
    controls.push(
      <Icons key='icons' />
    );
  }

  return controls.reverse();
}
