import React from 'react';

import Control from 'in-components/Controls/components/Control';
import {goToPhysicalTableView} from 'in-stores/navigation/view';


export default function AutoLayout() {
  return (
    <Control onClick={goToPhysicalTableView}
             tooltipText='Switch between 3D and table view'
             iconSize={16}
             type='menu' />
  );
}
