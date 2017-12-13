import React from 'react';

import { getModifiedUrlStream } from 'in-stores/navigation/navigation';
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

function getCurrentViewWithFilter(filter) {
  return getModifiedUrlStream(params => {
    params.query.q = filter;
    params.query.ss = '1';
  });
}
