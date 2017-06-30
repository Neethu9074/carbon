import React from 'react';

import { getCurrentViewWithFilter } from 'in-stores/navigation/search';
import connectTo from 'in-hoc/connectTo';

import './UserFilterLink.less';

const block = 'in-search-use-filter-link';

export default connectTo(
  props => {
    return {
      link: getCurrentViewWithFilter(props.filter.get('definition'))
    };
  },
  function UserFilterLink({ link, filter, onClick }) {
    return (
      <a href={link} onClick={onClick} className={block}>
        {filter.get('name')}
      </a>
    );
  }
);
