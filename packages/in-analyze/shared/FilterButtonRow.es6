import { get } from 'lodash';
import React from 'react';

import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import getApplication from 'in-subscription/application/getApplication';
import getServiceLabel from 'in-subscription/application/getServiceLabel';
import BadgeKeyValue from 'in-new-components/BadgeKeyValue';
import connectTo from 'in-hoc/connectTo';

import locals from './FilterButtonRow.mless';

const filerKeyBlackList = ['timeConfig'];

const filterKeyTranslation = {
  application: 'Application',
  service: 'Service',
  endpoint: 'Endpoint',
  traceGroupName: 'trace.name'
};

export default connectTo(
  ({ filter }) => {
    const observables = {};
    if (filter.application) {
      observables.applicationLabel = getApplication({
        id: filter.application
      }).map(result => get(result, ['data', 'label'], null));
    }
    if (filter.service) {
      observables.serviceLabel = getServiceLabel({
        id: filter.service
      }).map(result => get(result, ['data', 'label'], null));
    }
    return observables;
  },
  function FilterButtonRow({ filter, applicationLabel, serviceLabel }) {
    const filterValueTranslation = {
      application: applicationLabel,
      service: serviceLabel
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
          <div className={locals.filterList}>
            {filters.map((filter, i) => {
              const badge = <BadgeKeyValue key={filter.key} label={filter.key} value={filter.value} />;
              const isLastItem = i === filters.length - 1;
              if (!isLastItem) {
                return (
                  <div className={locals.badgeWrapper}>
                    {badge}
                    <div className={locals.hairLine} />
                  </div>
                );
              }
              return badge;
            })}
          </div>
        </MaxWidthFullscreenContainer>
      </div>
    );
  }
);
