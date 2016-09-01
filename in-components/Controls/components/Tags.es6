import React from 'react';

import Control from 'in-components/Controls/components/Control';
import TagListAll from 'in-components/TagListAll';
import TagFilter from 'in-components/TagFilter';


export default function Tags() {
  return (
    <Control createMenuContent={createMenuContent}
             iconSize={16}
             type='tag' />
  );
}

function createMenuContent() {
  return (
    <div>
      <TagFilter />
      <TagListAll />
    </div>
  );
}
