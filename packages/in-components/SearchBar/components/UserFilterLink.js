import React from 'react';

import { DFQ_FILTER_SELECTED } from 'in-services/tracking/eventNames';
import { getModifiedUrlStream } from 'in-stores/navigation/navigation';
import { track } from 'in-services/tracking/tracking';
import Link from 'in-components/Link';

import './UserFilterLink.less';

const block = 'in-search-use-filter-link';

export default function UserFilterLink({ filter, onClick }) {
  return (
    <Link
      href$={getCurrentViewWithFilter(filter.get('definition'))}
      onClick={onFilterSelected(filter, onClick)}
      className={block}
    >
      {filter.get('name')}
    </Link>
  );
}

function onFilterSelected(filter, callback) {
  return () => {
    track(DFQ_FILTER_SELECTED, { name: filter.get('name'), query: filter.get('definition') });
    callback();
  };
}

function getCurrentViewWithFilter(filter) {
  return getModifiedUrlStream(params => {
    params.query.q = filter;
    params.query.ss = '1';
  });
}
