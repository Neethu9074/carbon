import React from 'react';

import getMetricTagCatalog from 'in-infrastructure/subscriptions/getMetricTagCatalog';
import { createGroupingConfigurator } from 'in-new-components/GroupingConfigurator';
import { successObservableFactory } from 'in-services/util/result';

const suggestions = [];
export const typeAndMetricSeparator = '/';

const {
  GroupingConfigurator,
  isGroupingConfigurationValid: isGroupingConfigurationValidInternal
} = createGroupingConfigurator({
  getTagCatalog: getMetricTagCatalog,

  getSuggestions: successObservableFactory({ suggestions, totalHits: 0 })
});

export default function TypeAndMetricConfigurator(props) {
  const { type, metric } = props;
  return (
    <GroupingConfigurator
      value={{
        groupbyTag: type && metric ? type + typeAndMetricSeparator + metric : ''
      }}
      {...props}
    />
  );
}

export const isGroupingConfigurationValid = isGroupingConfigurationValidInternal;
