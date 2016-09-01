import React from 'react';

import TableView from 'in-components/Controls/components/TableView';
import Zoom from 'in-components/Controls/components/Zoom';


export default function getPhysicalContent() {
  return [
    <TableView key={'tableview'}/>,
    <Zoom key={'zoom'}/>
  ];
}
