/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { get } from 'lodash';
import React from 'react';

import { Link, Stack, SvgIcon } from '@instana/components';
import { useObservable } from '@instana/hooks';
import { t } from '@instana/i18n-react';

//@ts-expect-error
import WithApplicationHealthIndicationBehaviour from 'in-components/health/WithHealthIndication/WithApplicationHealthIndicationBehaviour';
//@ts-expect-error doesn't contain type file
import CreateApplicationDialog from 'in-applications/creation/Dialog/CreateApplicationDialog';
//@ts-expect-error doesn't contain type file
import { getNewApplicationWaiterViewPath } from 'in-applications/creation/CreateApplication';
import { ApplicationProps, ColumnDefinitionItem } from 'in-plg/pages/WelcomePage/widgets/types/DashboardTypeDefiniton';
//@ts-expect-error
import SparkChart from 'in-components/tables/ServerTable/components/SparkChart';
import { createNewApplicationConfig, getApplicationConfig } from 'in-api/applicationConfigs';
import { getApplicationsWithDefaults } from 'in-applications/subscriptions/getApplications';
import { getSparkChartGranularity, getResolvedTimeConfig } from 'in-applications/metrics';
import { applicationCreationOpenDialogClick } from 'in-applications/creation/tracker';
//@ts-expect-error doesn't contain type file
import connectTo from 'in-hoc/connectTo';
import { number, meanLatencyFixed, percentage } from 'in-services/formatters/number';
import { useLinkToApplicationDashboard } from 'in-applications/navigation/paths';
import DatatableWrapper from 'in-plg/pages/WelcomePage/widgets/DatatableWrapper';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { applicationsList } from 'in-applications/navigation/paths';
import HealthDot from 'in-components/health/HealthDot/HealthDot';
import { successObservable } from 'in-services/util/result';
import { boundaryScopes } from 'in-applications/constants';
import { getTimeConfig } from 'in-stores/time/config';
import { timeConfig$ } from 'in-stores/time/config';
import Tooltip from 'in-components/Tooltip/Tooltip';

function getApplicationData(params: any) {
  return getApplicationsWithDefaults(params);
}

export default connectTo(() => ({
  timeConfig: timeConfig$
}))(function ApplicationWidget({
  config,
  timeConfig,
  applicationId,
  widgetLabel,
  dashboardTileProps
}: ApplicationProps) {
  const getHeaders = () => {
    return [
      {
        header: t('in-plg:welcomepage.component.applicationWidget.name'),
        key: 'name'
      },
      {
        header: t('in-plg:welcomepage.component.applicationWidget.calls'),
        key: 'calls'
      },
      {
        header: t('in-plg:welcomepage.component.applicationWidget.latency'),
        key: 'latency'
      },
      {
        header: t('in-plg:welcomepage.component.applicationWidget.erroneousCallRate'),
        key: 'erroneousCallRate'
      }
    ];
  };

  function getConfig([applicationId]: string) {
    return applicationId ? getApplicationConfig(applicationId) : successObservable(createNewApplicationConfig());
  }

  //@ts-expect-error
  const entityResult = useObservable(getConfig, [applicationId]);
  const getLinkToApplicationDashboard = useLinkToApplicationDashboard();
  const { createHrefToPath } = useNavigation();

  function addNewApplications() {
    let ele;
    ele = addActiveDialog(
      <CreateApplicationDialog
        timeConfig={getTimeConfig({ pathname: '/applications', query: {}, matrix: {} })}
        formData={entityResult?.data}
        onClose={close}
        getOnSavePath={(app: any) => getNewApplicationWaiterViewPath(app)}
        editMode
      />
    );
    applicationCreationOpenDialogClick({
      status: t('in-plg:welcomepage.component.applicationWidget.openCreationDialog')
    });
    return ele;
  }

  function BoundaryScopeColumn({ item }: any) {
    if (item.application.boundaryScope) {
      return (
        //@ts-expect-error
        <Tooltip content={boundaryScopes.info[item.application.boundaryScope].dashboard}>
          <SvgIcon
            //@ts-expect-error
            type={boundaryScopes.info[item.application.boundaryScope].icon}
          />
        </Tooltip>
      );
    }
    return null;
  }

  const columnDefinitions: ColumnDefinitionItem[] = [
    {
      key: 'name',
      getContent({ item }) {
        const maxSeverity = get(item, ['metrics', 'maxSeverity', 0, 1]);
        if (maxSeverity !== undefined) {
          return (
            <Stack direction="horizontal" align="center">
              <HealthDot severity={maxSeverity} iconSize={10} />
              <SvgIcon type="lib_application" color="var(--ids-color-option-neutral-700)" />
              <Link href={getLinkToApplicationDashboard({ applicationId: item.application.id })}>
                {item.application.label}
              </Link>
            </Stack>
          );
        }
        return (
          <Stack direction="horizontal" align="center">
            <WithApplicationHealthIndicationBehaviour
              applicationId={item.application.id}
              render={(healthInfo: any) =>
                healthInfo ? <HealthDot severity={healthInfo.maxSeverity} iconSize={10} /> : null
              }
            />
            <SvgIcon type="lib_application" color="var(--ids-color-option-neutral-700)" />
            <Link>{item.application.label}</Link>
          </Stack>
        );
      }
    },
    {
      key: 'calls',
      getContent({ item, result }) {
        return (
          <Stack direction="horizontal" align="center">
            <BoundaryScopeColumn item={item} />
            <SparkChart
              loading={result?.progress?.loading}
              rollup={getSparkChartGranularity(timeConfig)}
              timeConfig={getResolvedTimeConfig(timeConfig, result)}
              metrics={get(item, ['metrics', 'calls'])}
              metric={get(item, ['metrics', 'callsAgg'])}
              tooltipFormatter={number.compact}
              showNullValuesChartOnEmptyMetrics
            />
          </Stack>
        );
      }
    },
    {
      key: 'latency',
      getContent({ item, result, timeConfig }) {
        return (
          <SparkChart
            loading={result?.progress?.loading}
            rollup={getSparkChartGranularity(timeConfig)}
            timeConfig={getResolvedTimeConfig(timeConfig, result)}
            metrics={get(item, ['metrics', 'latency'])}
            metric={get(item, ['metrics', 'latencyAgg'])}
            tooltipFormatter={meanLatencyFixed.compact}
            showDashOnMissingOrNullMetric
            hideChartOnEmptyMetrics
          />
        );
      }
    },
    {
      key: 'erroneousCallRate',
      getContent({ item, result, timeConfig }) {
        return (
          <SparkChart
            loading={result?.progress?.loading}
            rollup={getSparkChartGranularity(timeConfig)}
            timeConfig={getResolvedTimeConfig(timeConfig, result)}
            metrics={get(item, ['metrics', 'errors'])}
            metric={get(item, ['metrics', 'errorsAgg'])}
            tooltipFormatter={percentage.detailed}
            showDashOnMissingOrNullMetric
            hideChartOnEmptyMetrics
            percentageMetric
          />
        );
      }
    }
  ];

  const generalProps = {
    ...config,
    timeConfig,
    columnDefinitions,
    headers: getHeaders()
  };

  return (
    <DatatableWrapper
      {...generalProps}
      getItems={getApplicationData}
      hasAddMore
      viewAll
      addMore={addNewApplications}
      addData={addNewApplications}
      href={createHrefToPath(applicationsList)}
      label={widgetLabel}
      dashboardTileProps={dashboardTileProps}
    />
  );
});
