import React, { Fragment } from 'react';

import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import BadgeKeyValue from 'in-new-components/BadgeKeyValue';
import Badge from 'in-new-components/Badge';

import locals from './FilterButtonRow.mless';

export default function FilterButtonRow({ filter }) {
  const filerKeyBlackList = ['timeframe'];

  // support for grouping/groups will be added with https://www.pivotaltracker.com/story/show/155891847
  // until then, we won't show any grouping information
  const groups = [];

  const filters = Object.keys(filter)
    .map(filterKey => ({
      key: filterKey,
      value: filter[filterKey]
    }))
    .filter(pair => pair.value)
    .filter(pair => filerKeyBlackList.indexOf(pair.key) < 0);

  return (
    <div className={locals.fullWidthHorizontalRule}>
      <MaxWidthFullscreenContainer className={locals.row}>
        <strong className={locals.label}>Filters</strong>
        {filters.map(filter => (
          <BadgeKeyValue key={filter.key} label={filter.key} value={filter.value} className={locals.badge} />
        ))}
        {groups.length > 0 && (
          <Fragment>
            <strong className={locals.label}>Groups</strong>
            {groups.map(group => (
              <Badge key={group} className={locals.badge} color="#0C1415">
                {group}
              </Badge>
            ))}
          </Fragment>
        )}
      </MaxWidthFullscreenContainer>
    </div>
  );
}
