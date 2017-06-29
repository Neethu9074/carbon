import React from 'react';

import { searchMatches$ } from 'in-stores/search/searchMatches';
import connectTo from 'in-hoc/connectTo';

import './MapNoContentMessage.less';

const block = 'map-no-content-message';

export default connectTo(
  {
    searchMatches: searchMatches$
  },
  function MapNoContentMessage({ searchMatches }) {
    const isContentAvailable = !searchMatches || (searchMatches && searchMatches.size > 0) ? true : false;
    if (isContentAvailable) {
      return null;
    }

    return (
      <div className={block}>
        No data
      </div>
    );
  }
);
