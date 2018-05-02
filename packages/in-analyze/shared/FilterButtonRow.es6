import React, { Fragment } from 'react';
import { get } from 'lodash';

import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import getApplication from 'in-subscription/application/getApplication';
import BadgeKeyValue from 'in-new-components/BadgeKeyValue';
import Badge from 'in-new-components/Badge';
import connectTo from 'in-hoc/connectTo';

import locals from './FilterButtonRow.mless';

const filerKeyBlackList = ['timeframe'];

const filterKeyTranslation = {
  application: 'Application',
  service: 'Service',
  endpoint: 'Endpoint',
  traceGroupName: 'trace.name'
};

export default connectTo(
  props => {
    const observables = {};
    if (props.filter.application) {
      observables.applicationLabel = getApplication({
        id: props.filter.application
      }).map(result => get(result, ['data', 'label'], null));
    }
    return observables;
  },
  function FilterButtonRow({ filter, applicationLabel }) {
    // support for grouping/groups will be added with https://www.pivotaltracker.com/story/show/155891847
    // until then, we won't show any grouping information
    const groups = [];

    const filterValueTranslation = {
      application: applicationLabel
    };

    const filters = Object.keys(filter)
      .filter(key => filerKeyBlackList.indexOf(key) < 0)
      .map(filterKey => ({
        key: filterKeyTranslation[filterKey] || filterKey,
        value: filterValueTranslation[filterKey] || filter[filterKey]
      }))
      .filter(pair => pair.value);

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
);
