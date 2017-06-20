import React from 'react';

import Control from 'in-components/MapOverlayControls/components/Control';
import { filteredTags$ } from 'in-stores/search/keywords/tags';
import TagList from 'in-components/Tags/TagList';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  {
    filteredTags: filteredTags$
  },
  function Tags({ filteredTags }) {
    return (
      <Control
        createMenuContent={createMenuContent}
        isActive={filteredTags.size > 0}
        tooltipText="Show tags"
        type="tag"
      />
    );
  }
);

function createMenuContent() {
  return <TagList />;
}
