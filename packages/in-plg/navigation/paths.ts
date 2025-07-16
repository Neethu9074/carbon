/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';

export const welcomePage = '/home';

export function useCockpitLink() {
  const { location, createHref } = useNavigation();

  location.pathname = welcomePage;

  return createHref(location);
}

export const datasourceTypes = {
  instana_agent: 'instanaagent',
  otel_collector: 'otelcollector'
} as const;
export type SelectedDatasource = (typeof datasourceTypes)[keyof typeof datasourceTypes];
const allowedDatasourceValues = Object.values(datasourceTypes).join('|');
export const datasourceCatalogPath = `/datasources/:selecteddatasource(${allowedDatasourceValues})/installation`;
export const datasourceItemPath = `/datasources/:selecteddatasource(${allowedDatasourceValues})/installation/:selectedservice`;
export const datasourcePagePath = `/datasources/:selecteddatasource(${allowedDatasourceValues})`;
export const datasourceInstanaAgentPath = `/datasources/${datasourceTypes.instana_agent}`;
export const datasourceOtelCollectorPath = `/datasources/${datasourceTypes.otel_collector}`;
export const datasourceInstanaAgentCatalog = `/datasources/${datasourceTypes.instana_agent}/installation`;
export const datasourceOtemCollectorCatalog = `/datasources/${datasourceTypes.otel_collector}/installation`;
