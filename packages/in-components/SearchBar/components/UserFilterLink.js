/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';
import classnames from 'classnames';

import { Link } from '@instana/components';

import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { DFQ_FILTER_SELECTED } from 'in-services/tracking/eventNames';
import { track } from 'in-services/tracking/tracking';

import './UserFilterLink.less';

const block = 'in-search-use-filter-link';
const pointer = 'in-search-filter-item';

export default function UserFilterLink({ filter, onClick, setFilter }) {
  const { location, createHref } = useNavigation();

  const hasSetFilterCallback = Boolean(setFilter);

  const onClickHandler = () => hasSetFilterCallback
    ? setFilter(filter.get('definition'))
    : onFilterSelected(filter, onClick);

  return (
    <Link
      href={hasSetFilterCallback ? null : createHref(applyFilter(filter.get('definition'), location))}
      onClick={onClickHandler}
      className={classnames({
        [block]: true,
        [pointer]: hasSetFilterCallback
      })}
    >
      {filter.get('name')}
    </Link>
  );
}

function onFilterSelected(filter, callback) {
  track(DFQ_FILTER_SELECTED, { name: filter.get('name'), query: filter.get('definition') });
  callback();
}

function applyFilter(filter, location) {
  location.query.q = filter;
  location.query.ss = '1';
  return location;
}
