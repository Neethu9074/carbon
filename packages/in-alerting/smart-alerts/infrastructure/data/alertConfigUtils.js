/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { isEmpty } from 'lodash';

import { moveOthersChildrenOnTop } from 'in-alerting/smart-alerts/infrastructure/data/moveOthersChildrenOnTop';
import { enrichTagCatalog } from 'in-services/tags/tagCatalog';
import { emptyObject } from 'in-services/fixedObjects';

export function getMetricPathAndLabel(options, metricName, entityType) {
  for (let i = 0; i < options.length; i++) {
    const option = options[i];
    if (option.parentType === entityType && option.metric === metricName) {
      return {
        path: option.parentLabels,
        label: option.label
      };
    } else {
      const metricPathAndLabelForChild = getMetricPathAndLabel(option.children, metricName, entityType);

      if (!isEmpty(metricPathAndLabelForChild)) {
        return metricPathAndLabelForChild;
      }
    }
  }
  return emptyObject;
}

export const groupbyTag = groupBy => {
  return groupBy.map(tag => {
    if (typeof tag === 'string') {
      return { groupbyTag: tag, tagType: 'STRING' };
    }
    return tag;
  });
};

export function getGroupByTagCatalog(tagCatalog) {
  const tagCatalogWithoutOthers = moveOthersChildrenOnTop(tagCatalog);
  const groupByTagCatalog = enrichTagCatalog({
    tagTree: tagCatalogWithoutOthers.tagTree,
    tags: tagCatalogWithoutOthers.tags
  });
  return groupByTagCatalog;
}
