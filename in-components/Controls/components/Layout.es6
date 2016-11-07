import React from 'react';

import Control from 'in-components/Controls/components/Control';
import {clearAll} from 'in-map/stores/logical/layouterStore';


export default function Layout({iconType, onClick}) {
  return (
    <Control onClick={() => {
               onClick();
               clearAll();
             }}
             tooltipText='Rearrange services'
             type={iconType} />
  );
}
