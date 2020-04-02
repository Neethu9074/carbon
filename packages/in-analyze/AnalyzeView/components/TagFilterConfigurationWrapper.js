import React from 'react';

import { evaluateClassNames } from 'in-services/util/classnames';

import locals from './TagFilterConfigurationWrapper.mless';

export default function TagFilterConfigurationWrapper({ quickFilterBar, tagFilterList, disabled }) {
  return (
    <div
      className={evaluateClassNames({
        [locals.wrapper]: true,
        [locals.disabled]: disabled
      })}
    >
      <div className={locals.bar}>{quickFilterBar}</div>
      <div className={locals.list}>{tagFilterList}</div>
    </div>
  );
}
