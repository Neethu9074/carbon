/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { AlertConfigType } from 'in-alerting/smart-alerts/components/list/AlertsBaseList';

// comparison is done in case-insensitive
export default function getResultsToDisplay<AlertConfig extends AlertConfigType>(
  configs: AlertConfig[],
  query: string,
  extraSearchAttributes: ((config: AlertConfig) => string)[]
) {
  const getConfigName = (config: AlertConfig) => config.name;
  const getDescription = (config: AlertConfig) => config.description;

  const searchAttributes = [getConfigName, getDescription, ...extraSearchAttributes];
  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    return configs;
  }

  const lowerCaseQuery = trimmedQuery.toLowerCase();
  const filterFunction = (query: string, attribute: string) => attribute?.includes(query) ?? false;

  return configs.filter(Boolean).filter(config => {
    return searchAttributes
      .map(searchAttribute => {
        const attribute = searchAttribute(config)?.toLowerCase();
        return filterFunction(lowerCaseQuery, attribute);
      })
      .some(Boolean);
  });
}
