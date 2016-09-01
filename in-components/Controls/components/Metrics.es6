import React from 'react';

import Control from 'in-components/Controls/components/Control';


export default function Metrics() {
  return (
    <Control createMenuContent={createMenuContent}
             tooltipText='Show Metrics.'
             iconSize={16}
             type='metrics' />
  );
}

function createMenuContent() {
  return (
    <div>
      Metrics
    </div>
  );
}
