/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { useMemo } from 'react';

import { TagCatalog } from '@instana/types';

//@ts-expect-error
import { getGroupByTagCatalog } from 'in-alerting/smart-alerts/infrastructure/data/alertConfigUtils';

export function useGroupByCatalog(tagCatalog: TagCatalog) {
  const groupByTagCatalog = useMemo(() => {
    if (!tagCatalog) {
      return;
    }
    const groupByTagCatalog = tagCatalog ? getGroupByTagCatalog(tagCatalog) : {};

    return groupByTagCatalog;
  }, [tagCatalog]);

  return groupByTagCatalog;
}
