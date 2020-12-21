import React from 'react';

import classNames from 'classnames';

import locals from './TagFilterConfigurationWrapper.mless';

export default function TagFilterConfigurationWrapper({ quickFilterBar, tagFilterList, isEmpty = false, disabled }) {
  return (
    <div
      className={classNames({
        [locals.wrapper]: true,
        [locals.disabled]: disabled
      })}
    >
      <div className={locals.bar}>{quickFilterBar}</div>
      <div className={locals.list}>
        {!isEmpty && tagFilterList}
        {isEmpty && <div className={locals.empty}>No filters defined.</div>}
      </div>
    </div>
  );
}
