import React from 'react';

import Control from 'in-components/Controls/components/Control';
import {clearAll} from 'in-map/stores/logical/layouterStore';


export default function AutoLayout() {
  return (
    <Control onClick={clearAll}
             tooltipText='Rearrange services.'
             iconSize={24}
             type='autoLayout' />
  );
}
