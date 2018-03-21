import React, { Fragment } from 'react';

import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import Badge from 'in-new-components/Badge';

import locals from './FilterButtonRow.mless';

export default function FilterButtonRow({ filter }) {
  const badgeColor = '#47626a';
  const filerKeyBlackList = ['timeframe'];

  // support for grouping/groups will be added with https://www.pivotaltracker.com/story/show/155891847
  // until then, we won't show any grouping information
  const groups = [];

  const filters = Object.keys(filter)
    .map(filterKey => ({
      key: filterKey,
      value: filter[filterKey]
    }))
    .filter(pair => filerKeyBlackList.indexOf(pair.key) < 0);

  return (
    <div className={locals.fullWidthHorizontalRule}>
      <MaxWidthFullscreenContainer className={locals.row}>
        <strong className={locals.label}>Filters</strong>
        {filters.map(filter => (
          <Badge key={filter.key} className={locals.badge} color={badgeColor}>
            {`${filter.key}: ${filter.value}`}
          </Badge>
        ))}
        {groups.length > 0 && (
          <Fragment>
            <strong className={locals.label}>Groups</strong>
            {groups.map(group => (
              <Badge key={group} className={locals.badge} color={badgeColor}>
                {group}
              </Badge>
            ))}
          </Fragment>
        )}
      </MaxWidthFullscreenContainer>
    </div>
  );
}
