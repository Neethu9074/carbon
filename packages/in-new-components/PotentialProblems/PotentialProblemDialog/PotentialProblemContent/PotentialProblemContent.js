import React from 'react';

import PotentialProblemChart from 'in-new-components/PotentialProblems/PotentialProblemDialog/PotentialProblemContent/PotentialProblemChart';
import {
  getIconByType,
  getType
} from 'in-new-components/PotentialProblems/PotentialProblemDialog/potentialProblemsDialogUtil';
import getConfigByDataSource, { groupByEndpointName, groupByServiceName } from 'in-analyze/AnalyzeView/dataSources';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { getLinkToAnalyze } from 'in-analyze/navigation/paths';
import { formatDateTime } from 'in-services/formatters/date';
import { close } from 'in-components/DialogPresenter/store';
import Button from 'in-new-components/Button/Button';
import SvgIcon from 'in-components/SvgIcon';

import locals from './PotentialProblemContent.mless';

export default function PotentialProblemContent({
  alert,
  alertConfigs,
  selectedItem,
  renderSmartAlertDialogComponent,
  applicationLabel,
  serviceLabel,
  endpointLabel,
  ...remainingProps
}) {
  const alertType = alertConfigs[selectedItem.key].rule.alertType;
  const alertConfig = alertConfigs[alertType] ?? alertConfigs[selectedItem.key];
  const type = getType({ applicationLabel, serviceLabel, endpointLabel });

  return (
    <div className={locals.container}>
      <div className={locals.contentHeader}>
        <div className={locals.headline}>{`Latency (${alertType}) significantly higher than expected`}</div>
        <div className={locals.entity}>
          <SvgIcon size="s" className={locals.icon} type={getIconByType(type)} />
          {getLabelText({
            applicationLabel,
            serviceLabel,
            endpointLabel
          })}
        </div>
        <div className={locals.duration}>
          <SvgIcon size="xs" className={locals.icon} type="lib_datetime_time" />
          <time dateTime={new Date(alert.start).toISOString()}>{formatDateTime(alert.start)}</time>
          <div className={locals.durationDevider}>—</div>
          <time dateTime={new Date(alert.end).toISOString()}>{formatDateTime(alert.end)}</time>
        </div>
        <div className={locals.description}>
          During the time period the Latency was up to 20% higher than expected, when compared to the historical data.
        </div>
      </div>
      <div className={locals.chartWrapper}>
        <PotentialProblemChart {...remainingProps} alertConfig={alertConfig} alert={alert} alertType={alertType} />
      </div>
      <div className={locals.controls}>
        <Button
          kind="primary"
          onClick={close}
          icon="lib_analyze"
          href$={getLinkToAnalyze({
            dataSource: 'calls',
            applicationName: applicationLabel,
            filters: remainingProps.tagFilters,
            boundaryScope: remainingProps.boundaryScope,
            groupByTag: getGrouping(alertType, remainingProps.tagFilters),
            focusedMetric: getFocusedMetric(alertType),
            timeConfig: {
              to: alert.start,
              // focusedMoment: now,
              // autoRefresh: false,
              windowSize: alert.end - alert.start
            }
          })}
        >
          Investigate
        </Button>
        <Button
          kind="secondaryDarker"
          // TODO: make dialog injectable
          onClick={() =>
            addActiveDialog(renderSmartAlertDialogComponent({ ...remainingProps, alertConfig, applicationLabel }))
          }
          icon="lib_alerts_create"
        >
          Add Smart Alert
        </Button>
        {/* <Button kind="secondaryDarker" onClick={() => {}} icon="lib_actions_download">
          Generate Report
        </Button> */}
      </div>
    </div>
  );
}

function getLabelText({ applicationLabel, serviceLabel, endpointLabel }) {
  const Icon = <SvgIcon size="xs" className={locals.icon} type="lib_arrow_expand_right" />;
  return (
    <>
      {applicationLabel}{' '}
      {serviceLabel ? (
        <>
          {Icon}
          {serviceLabel}
        </>
      ) : null}{' '}
      {endpointLabel ? (
        <>
          {Icon}
          {endpointLabel}
        </>
      ) : null}
    </>
  );
}

function getFocusedMetric(alertType) {
  if (alertType === 'slowness') {
    return 'latency_DISTRIBUTION';
  }
  if (alertType === 'errorRate') {
    return 'errors_MEAN';
  }
  // at the moment only 'latency_DISTRIBUTION' is available when no grouping is set. However, the analyze-view handles
  // this case properly and then shows the latency-distribution chart instead.
  return 'calls_SUM';
}

function getGrouping(alertType, filters) {
  const alertTypeWithDisabledGrouping = ['errorRate', 'slowness'];
  if (alertTypeWithDisabledGrouping.includes(alertType)) {
    return {}; // no grouping
  }

  if (alertType === 'throughput') {
    const needsGroupByEndpoint = filters.find(isEndpointOrServiceFilter);
    return needsGroupByEndpoint ? groupByEndpointName : groupByServiceName;
  }

  return getConfigByDataSource('calls').defaultGrouping;
}

const isEndpointOrServiceFilter = filter =>
  filter?.name &&
  (filter.name === 'endpoint.name' ||
    filter.name === 'service.name' ||
    filter.name === 'endpoint.id' ||
    filter.name === 'service.id');
