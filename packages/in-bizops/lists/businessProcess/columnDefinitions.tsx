/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { get } from 'lodash';
import React from 'react';

import {
  CarbonToggletip,
  CarbonToggletipActions,
  CarbonToggletipButton,
  CarbonToggletipContent
} from '@instana/components/types/carbon';
import { BusinessProcessItem, TimeConfig } from '@instana/types';

// @ts-expect-error Could not find declaration type
import SeverityAwareEntityLink from 'in-components/tables/sharedComponents/SeverityAwareEntityLink';
// @ts-expect-error Module needs to be translated to TS
import SparkChart from 'in-components/tables/ServerTable/components/SparkChart';
import ApplicationEntityHealthIndicatorBehavior from 'in-applications/components/ApplicationEntityHealthIndicatorBehavior';
import { businessPerspectiveDashboard, businessProcessDashboard, summaryTab } from 'in-bizops/navigation/paths';
import HealthIndicatorPresenter from 'in-components/health/HealthIndicatorPresenter/HealthIndicatorPresenter';
import { ServerTablePresenterProps } from 'in-components/tables/ServerTable/ServerTablePresenter';
import { getMatrixParameter, setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { ColumnDefinition } from 'in-components/tables/ServerTable/types';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { getTimeConfigAlignedToResultTime } from 'in-stores/time/config';
import CopyToClipboardButton from 'in-components/CopyToClipboardButton';
import { bizopsProcessIdColumnEnabled } from 'in-services/featureFlags';
import { bizopsProcessesListSelect } from 'in-bizops/tracker';
import { getChartGranularity } from 'in-stores/metric/metric';
import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

import locals from './columnDefinitions.mless';

interface bpListProps extends ServerTablePresenterProps<BusinessProcessItem> {
  timeConfig: TimeConfig;
}

export interface TimeResult {
  time: number;
}

const BusinessProcessNameColumnContent = ({ item }: { item: BusinessProcessItem }) => {
  const { location, createHref } = useNavigation();

  const businessProcessId: string = item.businessProcess.definitionId;
  const businessProcessName: string =
    item.businessProcess.definitionName.length > 0 ? item.businessProcess.definitionName : businessProcessId;
  const serviceId: string = item.service?.id ?? '';

  const perspectiveId = getMatrixParameter(location, businessPerspectiveDashboard, 'perspectiveId');
  const perspectiveName = getMatrixParameter(location, businessPerspectiveDashboard, 'perspectiveName');

  location.pathname = `${businessProcessDashboard}${summaryTab}`;
  setOrDeleteMatrixKey(location, businessProcessDashboard, 'definitionName', businessProcessName);
  setOrDeleteMatrixKey(location, businessProcessDashboard, 'definitionId', businessProcessId);
  setOrDeleteMatrixKey(location, businessProcessDashboard, 'serviceId', serviceId);

  if (perspectiveName) {
    setOrDeleteMatrixKey(location, businessProcessDashboard, 'perspectiveId', perspectiveId);
    setOrDeleteMatrixKey(location, businessProcessDashboard, 'perspectiveName', perspectiveName);
  }

  const processTracking = {
    path: location.pathname,
    processId: businessProcessId,
    processName: businessProcessName
  };

  return (
    <div className={locals.processName} onClick={() => bizopsProcessesListSelect(processTracking)}>
      <SeverityAwareEntityLink severity={getSeverity(item)} label={businessProcessName} href={createHref(location)} />
    </div>
  );
};

function getSeverity(item: BusinessProcessItem) {
  return get(item, ['metrics', 'maxSeverity', 0, 1], 0);
}

let processColumnDefinitions: ColumnDefinition<BusinessProcessItem, bpListProps>[] = [
  {
    id: 'process_name',
    sortable: true,
    defaultOrderDirection: 'DESC',
    label: t('in-bizops:lists.nameLabel'),
    width: '8rem',
    getContent: (item: BusinessProcessItem) => <BusinessProcessNameColumnContent item={item} />
  },
  {
    id: 'started_processes',
    sortable: true,
    defaultOrderDirection: 'DESC',
    label: t('in-bizops:lists.startLabel'),
    getContent(item: BusinessProcessItem, { timeConfig, result }) {
      return (
        <SparkChart
          loading={false}
          rollup={getChartGranularity(timeConfig)}
          //@ts-expect-error
          timeConfig={getTimeConfigAlignedToResultTime(timeConfig, result)}
          aggregation="DISTINCT_COUNT"
          metrics={item.metrics.started_processes_array}
          metric={item.metrics.started_processes_total[0][1]}
          tooltipFormatter={number.compact}
        />
      );
    }
  },
  {
    id: 'activities_count',
    sortable: true,
    defaultOrderDirection: 'DESC',
    label: t('in-bizops:lists.activityLabel'),
    getContent(item: BusinessProcessItem) {
      return (
        <div>
          <h4 className={locals.label}>{item.metrics.activities_count[0][1]}</h4>
        </div>
      );
    }
  },
  {
    id: 'maxSeverity',
    sortable: true,
    defaultOrderDirection: 'DESC',
    label: t('in-bizops:lists.healthLabel'),
    getContent(item: BusinessProcessItem, { result, timeConfig }) {
      return (
        <ApplicationEntityHealthIndicatorBehavior
          serviceId={item.service?.id}
          openIssues={get(item, ['metrics', 'openIssues', 0, 1], 0)}
          maxSeverity={get(item, ['metrics', 'maxSeverity', 0, 1], 0)}
          IndicatorPresenter={HealthIndicatorPresenter}
          //@ts-expect-error type error
          timeConfig={getTimeConfigAlignedToResultTime(timeConfig, result)}
          inContentArea
        />
      );
    }
  }
];

if (bizopsProcessIdColumnEnabled) {
  const processId: ColumnDefinition<BusinessProcessItem, bpListProps> = {
    id: 'process_id',
    sortable: true,
    defaultOrderDirection: 'DESC',
    label: 'ID',
    width: '10rem',
    getContent(item: BusinessProcessItem) {
      return (
        <CarbonToggletip autoAlign>
          <CarbonToggletipButton>
            <div className={locals.ellipsis}>{item.businessProcess.definitionId}</div>
          </CarbonToggletipButton>
          <CarbonToggletipContent>
            {item.businessProcess.definitionId}
            <CarbonToggletipActions>
              <CopyToClipboardButton
                kind="primary"
                size="compact"
                getText={() => item.businessProcess.definitionId}
                successText={
                  t('in-bizops:lists.theId') +
                  " '" +
                  item.businessProcess.definitionId +
                  "' " +
                  t('in-bizops:lists.hasBeenCopied')
                }
              />
            </CarbonToggletipActions>
          </CarbonToggletipContent>
        </CarbonToggletip>
      );
    }
  };
  processColumnDefinitions.splice(1, 0, processId);
}

export { processColumnDefinitions };
