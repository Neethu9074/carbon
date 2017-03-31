import React from 'react';

import { getCurrentViewWithFilter } from 'in-stores/navigation/search';
import connectTo from 'in-hoc/connectTo';

import './UseFilterLink.less';

const block = 'in-search-use-filter-link';

export default connectTo(
  props => {
    return {
      link: getCurrentViewWithFilter(props.filter.get('definition'))
    };
  },
  function UseFilterLink({ link, filter }) {
    return (
      <a href={link} className={block}>
        {filter.get('name')}
      </a>
    );
  }
);
