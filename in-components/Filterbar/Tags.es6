import React from 'react';

import TagsFilter from 'in-components/Filterbar/TagsFilter';
import TagListAll from 'in-components/TagListAll';


export default function SidebarTagListing() {
  return (
    <div>
      <TagsFilter />
      <TagListAll/>
    </div>
  );
}
