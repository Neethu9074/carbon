/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import getUnifiedTagCatalog from 'in-custom-dashboards/subscriptions/getUnifiedTagCatalog';
import { getTagCatalogOnce } from 'in-services/tags/tagCatalog';
import { GetUnifiedCatalogQuery, TimeConfig } from 'in-types';

export default function (query: GetUnifiedCatalogQuery) {
  return getTagCatalogOnce(
    getUnifiedTagCatalog,
    true
  )({
    ...query,
    // Creating a copy of TimeConfig and setting the window size to 1 minute.
    timeConfig: {
      ...query.timeConfig,
      windowSize: 60_000
    } as TimeConfig
  });
}
