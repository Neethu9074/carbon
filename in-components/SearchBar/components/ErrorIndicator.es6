import React from 'react';

import {error$} from 'in-stores/search/parsedQuery';
import connectTo from 'in-hoc/connectTo';

import './ErrorIndicator.less';

const block = 'in-search-error-indicator';

export default connectTo({
    error: error$
  }, function ErrorIndicator({error}) {
    if (!error) {
      return null;
    }
    return (
      <div className={block}>
        <span className={block + '__icon'}>!</span>
        {error}
      </div>
    );
  }
);
