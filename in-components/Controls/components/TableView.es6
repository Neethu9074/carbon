import React from 'react';

import Control from 'in-components/Controls/components/Control';
import {goToTableView} from 'in-stores/navigation/view';


export default function AutoLayout() {
  return (
    <Control onClick={goToTableView}
             tooltipText='Switch between 3D and table view'
             type='menu' />
  );
}
