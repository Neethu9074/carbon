import React from 'react';

import {query$, setQuery} from 'in-components/tableView/stores/search';
import connectTo from 'in-hoc/connectTo';

import './Search.less';

const block = 'in-table-view-search';

export default connectTo({
    query: query$
  }, function Search({query}) {
    return (
      <input type='search'
             value={query}
             onChange={e => setQuery(e.target.value)}
             className={block}
             placeholder='Search…'
             onClick={e => e.stopPropagation()}/>
    );
  }
);
