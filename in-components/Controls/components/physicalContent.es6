import React from 'react';

import TableView from 'in-components/Controls/components/TableView';
import Metrics from 'in-components/Controls/components/Metrics';
import Zoom from 'in-components/Controls/components/Zoom';
import Tags from 'in-components/Controls/components/Tags';


export default function getPhysicalContent() {
  const controls = [
    <Tags key='tags' />,
    <Metrics key='metrics' />,
    <TableView key='tableview' />,
    <Zoom key='zoom' />
  ];

  if (__DEV__) {

  }

  return controls;
}
