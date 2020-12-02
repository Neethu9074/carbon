import React from 'react';

import TypeAndMetricConfiguratorPresenter from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/infrastructure/metrics/TypeAndMetricConfiguratorPresenter';
import getMetricTagCatalog from 'in-infrastructure/subscriptions/getMetricTagCatalog';
import { getTagCatalogOnce } from 'in-services/tags/tagCatalog';

export const typeAndMetricSeparator = '/';

export default function TypeAndMetricConfigurator(props) {
  const getTagCatalog = getTagCatalogOnce(getMetricTagCatalog);
  return <TypeAndMetricConfiguratorPresenter getTagCatalog={getTagCatalog} {...props} />;
}
