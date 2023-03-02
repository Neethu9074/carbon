/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Link } from '@instana/components';

import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { DFQ_FILTER_SELECTED } from 'in-services/tracking/eventNames';
import { track } from 'in-services/tracking/tracking';

import './UserFilterLink.less';

const block = 'in-search-use-filter-link';

export default function UserFilterLink({ filter, onClick }) {
  const { location, createHref } = useNavigation();

  return (
    <Link
      href={createHref(applyFilter(filter.get('definition'), location))}
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

function applyFilter(filter, location) {
  location.query.q = filter;
  location.query.ss = '1';
  return location;
}
