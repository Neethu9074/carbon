/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Iterable, Map } from 'immutable';
import React, { Fragment } from 'react';

import { containsIgnoreCase, compareIgnoreCase } from 'in-services/util/string';
import SearchInput from 'in-components/SearchInput/SearchInput';

import locals from './KeyValueDialogPresenter.mless';

export default function KeyValueDialogPresenter({ header, items, query, sort = true, onQueryChange }) {
  return (
    <Fragment>
      <div className={locals.header}>
        {header}
        <div>
          <SearchInput onChange={onQueryChange} query={query} />
        </div>
      </div>
      <div className={locals.body}>{createHtmlContent(items, query, sort)}</div>
    </Fragment>
  );
}

function createHtmlContent(data, query, sort) {
  if (Map.isMap(data)) {
    return createKeyValueHtmlContent(data, query, sort);
  } else if (Iterable.isIterable(data)) {
    return createSeqHtmlContent(data, query, sort);
  }

  return null;
}

function createKeyValueHtmlContent(items, query, sort) {
  items = items
    .toArray()
    .filter(item => containsIgnoreCase(String(item.key), query) || containsIgnoreCase(String(item.value), query));

  if (sort) {
    items = items.sort((a, b) => compareIgnoreCase(a.key, b.key));
  }

  return (
    <dl>
      {items.map(item => (
        <div className={locals.keyValueItem} key={item.key}>
          <dt className={locals.key}>{item.key}</dt>
          <dd className={locals.value}>{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

function createSeqHtmlContent(items, query, sort) {
  items = items.toArray().filter(item => item.value != null && containsIgnoreCase(String(item.value), query));

  if (sort) {
    items = items.sort((a, b) => compareIgnoreCase(a.value, b.value));
  }

  return (
    <ul className={locals.list}>
      {items.map(item => (
        <li className={locals.listItem} key={item.key}>
          {item.value}
        </li>
      ))}
    </ul>
  );
}
