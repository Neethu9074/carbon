import React from 'react';

import TableView from 'in-components/Controls/components/TableView';
import Zoom from 'in-components/Controls/components/Zoom';
import Tags from 'in-components/Controls/components/Tags';


export default function getPhysicalContent() {
  return [
    <Tags key='tags' />,
    <TableView key='tableview' />,
    <Zoom key='zoom' />
  ];
}
