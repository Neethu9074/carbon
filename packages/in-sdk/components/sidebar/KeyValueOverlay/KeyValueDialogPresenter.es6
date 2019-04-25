import { Iterable, Map } from 'immutable';
import React, { Fragment } from 'react';

import { containsIgnoreCase, compareIgnoreCase } from 'in-services/util/string';
import SearchInput from 'in-new-components/SearchInput/SearchInput';

import locals from './KeyValueDialogPresenter.mless';

export default function KeyValueDialogPresenter({ header, items, query, onQueryChange }) {
  return (
    <Fragment>
      <div className={locals.header}>
        {header}
        <div>
          <SearchInput onChange={onQueryChange} query={query} />
        </div>
      </div>
      <div className={locals.body}>{createHtmlContent(items, query)}</div>
    </Fragment>
  );
}

function createHtmlContent(data, query) {
  if (Map.isMap(data)) {
    return createKeyValueHtmlContent(data, query);
  } else if (Iterable.isIterable(data)) {
    return createSeqHtmlContent(data, query);
  }

  return null;
}

function createKeyValueHtmlContent(items, query) {
  return (
    <dl>
      {items
        .toArray()
        .filter(item => containsIgnoreCase(String(item.key), query) || containsIgnoreCase(String(item.value), query))
        .sort((a, b) => compareIgnoreCase(a.key, b.key))
        .map(item => (
          <div className={locals.keyValueItem} key={item.key}>
            <dt className={locals.key}>{item.key}</dt>
            <dd className={locals.value}>{item.value}</dd>
          </div>
        ))}
    </dl>
  );
}

function createSeqHtmlContent(items, query) {
  return (
    <ul className={locals.list}>
      {items
        .toArray()
        .filter(item => item.value != null && containsIgnoreCase(String(item.value), query))
        .sort((a, b) => compareIgnoreCase(a.value, b.value))
        .map(item => (
          <li className={locals.listItem} key={item.key}>
            {item.value}
          </li>
        ))}
    </ul>
  );
}
