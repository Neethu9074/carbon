import React from 'react';

import Control from 'in-components/Controls/components/Control';


export default function Tags() {
  return (
    <Control createMenuContent={createMenuContent}
             iconSize={16}
             type='tag' />
  );
}

function createMenuContent() {
  return (
    <span>
      Menu Content
    </span>
  );
}
