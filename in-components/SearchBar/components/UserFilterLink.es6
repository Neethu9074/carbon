import React from 'react';

import { getCurrentViewWithFilter } from 'in-stores/navigation/search';
import Link from 'in-components/Link';

import './UserFilterLink.less';

const block = 'in-search-use-filter-link';

export default function UserFilterLink({ filter, onClick }) {
  return (
    <Link href$={getCurrentViewWithFilter(filter.get('definition'))} onClick={onClick} className={block}>
      {filter.get('name')}
    </Link>
  );
}
