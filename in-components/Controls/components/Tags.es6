import React from 'react';

import Control from 'in-components/Controls/components/Control';
import {filteredTags$} from 'in-stores/search/tags';
import TagListAll from 'in-components/TagListAll';
import TagFilter from 'in-components/TagFilter';
import connectTo from 'in-hoc/connectTo';


export default connectTo({
  filteredTags: filteredTags$
},
function Tags({filteredTags}) {
  return (
    <Control createMenuContent={createMenuContent}
             isActive={filteredTags.size > 0}
             tooltipText='Show tags'
             iconSize={16}
             type='tag' />
  );
});

function createMenuContent() {
  return (
    <div>
      <TagListAll />
      <TagFilter />
    </div>
  );
}
