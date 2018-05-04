import { get } from 'lodash';
import React from 'react';

import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import getApplication from 'in-subscription/application/getApplication';
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
        </MaxWidthFullscreenContainer>
      </div>
    );
  }
);
