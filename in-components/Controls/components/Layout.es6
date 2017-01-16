import React from 'react';

import {currentLayoutingStrategy$ as currentPhysicalLayoutingStrategy$} from 'in-map/stores/physical/layouterStore';
import {currentLayoutingStrategy$ as currentLogicalLayoutingStrategy$} from 'in-map/stores/logical/layouterStore';
import Control from 'in-components/Controls/components/Control';
import {clearAll} from 'in-map/stores/logical/layouterStore';
import connectTo from 'in-hoc/connectTo';


export default connectTo({
  currentPhysicalLayoutingStrategy: currentPhysicalLayoutingStrategy$,
  currentLogicalLayoutingStrategy: currentLogicalLayoutingStrategy$
},
function Layout({iconType, setLayoutingStrategy, layoutingStrategy, tooltipText, currentLogicalLayoutingStrategy, currentPhysicalLayoutingStrategy}) {
  return (
    <Control onClick={() => {
               setLayoutingStrategy(layoutingStrategy);
               clearAll();
             }}
             tooltipText={tooltipText}
             type={iconType}
             isActive={layoutingStrategy === currentLogicalLayoutingStrategy || layoutingStrategy === currentPhysicalLayoutingStrategy} />
  );
});
