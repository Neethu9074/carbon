import React from 'react';

import TableView from 'in-components/Controls/components/TableView';
import Metrics from 'in-components/Controls/components/Metrics';
import Icons from 'in-components/Controls/components/Icons';
import Zoom from 'in-components/Controls/components/Zoom';
import Tags from 'in-components/Controls/components/Tags';


export default function getPhysicalContent() {
  const controls = [
    <Zoom key='zoom' />,
    <TableView key='tableview' />,
    <Metrics key='metrics' />,
    <Tags key='tags' />
  ];

  if (__DEV__) {
    controls.push(
      <Icons key='icons' />
    );
  }

  return controls.reverse();
}
