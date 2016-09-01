import React from 'react';

import Control from 'in-components/Controls/components/Control';
import {toggleTableViewVisibility} from 'in-components/tableView/stores/visibility';


export default function AutoLayout() {
  return (
    <Control onClick={toggleTableViewVisibility}
             iconSize={16}
             type='menu' />
  );
}
