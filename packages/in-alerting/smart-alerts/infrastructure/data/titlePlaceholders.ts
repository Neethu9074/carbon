/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { replacePlaceholdersWithMarkup } from 'in-alerting/smart-alerts/components/dialog/advanced/placeholderUtil';
import { severityPlaceholder } from 'in-alerting/smart-alerts/utils/commonPlaceholderConstants';

export function getAllowedPlaceholders({ groupBy }: { groupBy: string[] }) {
  const groupByPlaceholders = groupBy?.map((groupbyTag: string) => ({
    name: groupbyTag,
    template: '${' + groupbyTag + '}'
  }));
  return [...groupByPlaceholders, severityPlaceholder];
}

export function replaceTitlePlaceholdersWithMarkup(alertConfig: { groupBy: string[]; name: string }) {
  return replacePlaceholdersWithMarkup(getAllowedPlaceholders(alertConfig), alertConfig.name);
}
