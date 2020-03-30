import React from 'react';

import locals from './TagFilterConfiguration.mless';

export default function TagFilterConfiguration({quickFilterBar, tagFilterList}) {
  return (
    <div className={locals.wrapper}>
      <div className={locals.bar}>
        {quickFilterBar}
      </div>
      <div className={locals.list}>
        {tagFilterList}
      </div>
    </div>
  );
}
