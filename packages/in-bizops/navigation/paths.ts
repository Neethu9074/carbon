/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { useLinkToAnalyze as useLinkToApplicationAnalyze } from 'in-applications/navigation/paths';
import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';
import { tagFilter } from 'in-components/QueryBuilder/transformation/tagFilter';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { EQUALS } from 'in-components/QueryBuilder/tagFilter/operators';
import { getRootPathPredicate } from 'in-stores/navigation/paths';
import { bizopsFeatureEnabled } from 'in-services/featureFlags';

export const summaryTab = '/summary';
export const activitiesTab = '/activities';
export const alertsTab = '/alerts';

export const businessProcessPath = '/businessProcesses';
export const activitiesPath = '/bizopsActivities';
export const smartAlertsPath = '/bizopsSmartAlerts';
export const businessActivityPath = '/businessActivity';
export const businessProcessDashboard = '/businessProcess';
export const businessActivityDashboard = `${businessProcessDashboard}${businessActivityPath}`;
export const businessProcessAlertListPath = `${businessProcessDashboard}${alertsTab}`;
export const businessProcessSummaryPath = `${businessProcessDashboard}${summaryTab}`;
export const businessProcessActivityListPath = `${businessProcessDashboard}${activitiesTab}`;
export const businessActivitySummaryPath = `${businessActivityDashboard}${summaryTab}`;
export const analyzePath = `${businessProcessPath}/analyze`;

export const isBizOpsView = getRootPathPredicate(
  businessProcessPath,
  activitiesPath,
  smartAlertsPath,
  businessProcessSummaryPath,
  businessProcessActivityListPath,
  businessActivitySummaryPath
);

// Used to specify the right view in ViewSwitcher (Analytics icon instead of the BizOps icon in focus)
export const isAnalyzeView = getRootPathPredicate(analyzePath);

export function useLinkToAnalyze(businessProcessName: string, businessActivityName: string) {
  const { createHref, location } = useNavigation();
  location.pathname = analyzePath;
  const getLinkToApplicationAnalyze = useLinkToApplicationAnalyze();

  if (bizopsFeatureEnabled) {
    return createHref(location);
  } else {
    return getLinkToApplicationAnalyze({
      formModel: formModelBuilder(businessProcessName, businessActivityName),
      groupBy: {
        groupbyTag: 'call.bpm.root.process.instance.id'
      },
      hiddenCalls: {
        includeInternal: true,
        includeSynthetic: false
      },
      fastQueryModeEnabled: true
    });
  }
}

function formModelBuilder(businessProcessName: string, businessActivityName: string) {
  let formModel: FormModelElement[] = [tagFilter('call.bpm.process.definition.name', EQUALS, businessProcessName)];

  // conditional filters
  if (businessActivityName) {
    formModel.push(
      { type: 'CONJUNCTION', logicalOperator: 'AND' },
      tagFilter('call.bpm.activity.name', EQUALS, businessActivityName)
    );
  }

  // call types
  formModel.push(
    { type: 'CONJUNCTION', logicalOperator: 'AND' },
    { type: 'OPEN_BRACKET' },
    tagFilter('call.type', EQUALS, 'BATCH'),
    { type: 'CONJUNCTION', logicalOperator: 'OR' },
    tagFilter('call.type', EQUALS, 'INTERNAL'),
    { type: 'CLOSE_BRACKET' }
  );

  return formModel;
}
