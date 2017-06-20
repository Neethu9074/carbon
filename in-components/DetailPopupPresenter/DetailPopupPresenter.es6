import { Iterable, Map } from 'immutable';
import React from 'react';

import { content$, contentFilter$ } from 'in-components/DetailPopupPresenter/stores/DetailPopupPresenterContentStore';
import Header from 'in-components/DetailPopupPresenter/components/Header';
import { isDashboardOpen$ } from 'in-stores/navigation';
import connectTo from 'in-hoc/connectTo';

import './DetailPopupPresenter.less';

const block = 'in-detail-popup';

export default connectTo(
  {
    content: content$,
    contentFilter: contentFilter$,
    isDashboardOpen: isDashboardOpen$
  },
  function DetailPopupPresenter({ content, contentFilter, isDashboardOpen }) {
    if (!content) {
      return null;
    }

    let classes = block;
    if (isDashboardOpen) {
      classes = `${classes} ${block}--open-dashboard`;
    }

    return (
      <div className={classes}>
        <Header title={content.title} />
        {createHtmlContent(content.data, contentFilter)}
      </div>
    );
  }
);

function createHtmlContent(data, contentFilter) {
  if (Map.isMap(data)) {
    return createKeyValueHtmlContent(data, contentFilter);
  } else if (Iterable.isIterable(data)) {
    return createSeqHtmlContent(data, contentFilter);
  }

  return null;
}

function createKeyValueHtmlContent(data, contentFilter) {
  const children = data
    .filter(getMapFilterPredicate(contentFilter))
    .sortBy((v, k) => k)
    .map((v, k) =>
      <div key={k} className={block + '__item'}>
        <dt className={block + '__title'}>
          {k}
        </dt>
        <dd className={block + '__text'}>
          {v}
        </dd>
      </div>
    )
    .valueSeq()
    .toArray();

  return (
    <dl className={`${block}__kv-list`}>
      {children}
    </dl>
  );
}

function getMapFilterPredicate(filter) {
  if (!filter) {
    return e => e;
  }

  filter = filter.toLowerCase().trim();

  if (filter.length === 0) {
    return () => true;
  }

  return (v, k) => {
    return k.toLowerCase().indexOf(filter) !== -1 || String(v).toLowerCase().indexOf(filter) !== -1;
  };
}

function createSeqHtmlContent(data, contentFilter) {
  const children = data.toArray().filter(getSeqFilterPredicate(contentFilter)).sort().map((v, i) =>
    <li key={i} className={`${block}__list-item`}>
      {v}
    </li>
  );

  return (
    <ul className={`${block}__list`}>
      {children}
    </ul>
  );
}

function getSeqFilterPredicate(filter) {
  if (!filter) {
    return e => e;
  }

  filter = filter.toLowerCase().trim();

  if (filter.length === 0) {
    return () => true;
  }

  return v => String(v).toLowerCase().indexOf(filter) !== -1;
}
