/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { get } from 'lodash';
import React from 'react';

import { IconButton, Link, Stack } from '@instana/components';
import { EntityHealthInfo, TimeConfig } from '@instana/types';
import { useObservable } from '@instana/hooks';
import { just } from '@instana/observables';
import { t } from '@instana/i18n-react';

import {
  ApplicationProps,
  ColumnDefinitionItem,
  GetApplicationsWithDefaultsProps
} from 'in-plg/pages/WelcomePage/widgets/types/DashboardTypeDefiniton';
//@ts-expect-error
import WithApplicationHealthIndicationBehaviour from 'in-components/health/WithHealthIndication/WithApplicationHealthIndicationBehaviour';
//@ts-expect-error doesn't contain type file
import CreateApplicationDialog from 'in-applications/creation/Dialog/CreateApplicationDialog';
//@ts-expect-error doesn't contain type file
import { getNewApplicationWaiterViewPath } from 'in-applications/creation/CreateApplication';
//@ts-expect-error doesn't contain type file
import { add, remove } from 'in-plg/pages/WelcomePage/widgets/starredItems';
import { application as applicationType } from 'in-plg/pages/WelcomePage/widgets/starredItems/types';
//@ts-expect-error
import SparkChart from 'in-components/tables/ServerTable/components/SparkChart';
import TypographyWithTooltip from 'in-plg/components/TypographyWithTooltip/TypographyWithTooltip';
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { createNewApplicationConfig, getApplicationConfig } from 'in-api/applicationConfigs';
import { getApplicationsWithDefaults } from 'in-applications/subscriptions/getApplications';
import { getSparkChartGranularity, getResolvedTimeConfig } from 'in-applications/metrics';
import getApplicationMetrics from 'in-applications/subscriptions/getApplicationMetrics';
import { joinExpressions } from 'in-components/QueryBuilder/transformation/formModel';
import { number, meanLatencyFixed, percentage } from 'in-services/formatters/number';
import { useApplicationTracker } from 'in-applications/hooks/useApplicationTracker';
import { useLinkToApplicationDashboard } from 'in-applications/navigation/paths';
import DatatableWrapper from 'in-plg/pages/WelcomePage/widgets/DatatableWrapper';
import { tagFilter } from 'in-components/QueryBuilder/transformation/tagFilter';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import { DESTINATION } from 'in-components/QueryBuilder/tagFilter/entities';
import getApplication from 'in-applications/subscriptions/getApplication';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { EQUALS } from 'in-components/QueryBuilder/tagFilter/operators';
import { applicationsList } from 'in-applications/navigation/paths';
import HealthIcon from 'in-components/health/HealthIcon/HealthIcon';
import { hasError, isLoading } from 'in-services/util/result';
import { successObservable } from 'in-services/util/result';
import { boundaryScopes } from 'in-applications/constants';
import { getTimeConfig } from 'in-stores/time/config';
import { role } from 'in-stores/user';

function getApplicationData(params: GetApplicationsWithDefaultsProps) {
  return getApplicationsWithDefaults(params);
}

function handleFavoriteClick(id: string, item: any, isFavourite: boolean) {
  if (!id && !item) return;
  if (isFavourite) {
    remove({ id: id, type: applicationType });
  } else {
    add({
      id: item?.application?.id,
      label: item?.application?.label,
      type: applicationType
    });
  }
}

export default function ApplicationWidget({
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
        header: t('in-plg:welcomepage.component.applicationWidget.scope'),
        key: 'scope'
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
      },
      {
        header: t('in-plg:welcomepage.component.applicationWidget.health'),
        key: 'health'
      },
      {
        key: 'favourite',
        header: ''
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
  const { trackApplicationCreationOpenDialogClicked } = useApplicationTracker();

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
    trackApplicationCreationOpenDialogClicked({
      status: t('in-plg:welcomepage.component.applicationWidget.openCreationDialog')
    });
    return ele;
  }

  function BoundaryScopeColumn({ item }: any) {
    if (item.application.boundaryScope) {
      const boundaryScope = item.application.boundaryScope;
      if (boundaryScope !== 'ALL' && boundaryScope !== 'INBOUND') return null;
      if (boundaryScope === 'ALL') return <TypographyWithTooltip content={boundaryScopes.info['ALL'].text} />;
      if (boundaryScope === 'INBOUND') return <TypographyWithTooltip content={boundaryScopes.info['INBOUND'].text} />;
    }
    return null;
  }

  function getItem(id: string, timeConfig: TimeConfig) {
    const granularity = getSparkChartGranularity(timeConfig);

    return getApplication({ id }).flatMap((applicationResult: any) => {
      if (isLoading(applicationResult) || hasError(applicationResult)) {
        return just(applicationResult);
      } else {
        const applicationTagFilter =
          applicationResult.data.boundaryScope === boundaryScopes.inbound
            ? tagFilter('boundary.application.id', EQUALS, id)
            : tagFilter('application.id', EQUALS, id, null, DESTINATION);

        return getApplicationMetrics({
          tagFilterExpression: toBackendQueryModel(
            joinExpressions({
              expressions: [applicationTagFilter]
            })
          ),
          timeConfig,
          includeInternal: false,
          includeSynthetic: false,
          timeShift: { offset: 0 },
          metrics: {
            services: {
              metric: 'services',
              aggregation: 'DISTINCT_COUNT'
            },
            calls: {
              metric: 'calls',
              aggregation: 'SUM',
              granularity
            },
            callsAgg: {
              metric: 'calls',
              aggregation: 'SUM'
            },
            latencyAgg: {
              metric: 'latency',
              aggregation: 'MEAN'
            },
            latency: {
              metric: 'latency',
              aggregation: 'MEAN',
              granularity
            },
            errorsAgg: {
              metric: 'errors',
              aggregation: 'MEAN'
            },
            errors: {
              metric: 'errors',
              aggregation: 'MEAN',
              granularity
            }
          }
        }).map(metricResult => {
          if (isLoading(metricResult) || hasError(metricResult)) {
            return metricResult;
          } else {
            return {
              application: {
                ...applicationResult.data
              },
              metrics: { ...metricResult.data },
              mainKpiValue: get(metricResult.data, ['callsAgg', 0, 1]),
              time: metricResult.time
            };
          }
        });
      }
    });
  }

  const columnDefinitions: ColumnDefinitionItem[] = [
    {
      key: 'name',
      getContent({ item }) {
        return (
          <Link href={getLinkToApplicationDashboard({ applicationId: item?.application?.id })}>
            {item?.application?.label ?? ''}
          </Link>
        );
      }
    },
    {
      key: 'scope',
      getContent({ item }) {
        return <BoundaryScopeColumn item={item} />;
      }
    },
    {
      key: 'calls',
      getContent({ item, timeConfig, result }) {
        return (
          <Stack direction="horizontal" align="center">
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
    },

    {
      key: 'health',
      getContent({ item }) {
        const maxSeverity = get(item, ['metrics', 'maxSeverity', 0, 1]);
        if (maxSeverity !== undefined) {
          return <HealthIcon severity={maxSeverity} iconSize="xs" />;
        }
        return (
          <WithApplicationHealthIndicationBehaviour
            applicationId={item?.application?.id}
            render={(healthInfo: EntityHealthInfo) =>
              healthInfo ? <HealthIcon severity={healthInfo.maxSeverity} iconSize="xs" /> : null
            }
          />
        );
      }
    },
    {
      key: 'favourite',
      getContent({ id, item, isDisabled = false, isFavourite = false }) {
        return (
          <IconButton
            aria-label={
              isFavourite
                ? t('in-plg:welcomepage.favouriteButton.ariaFilled')
                : item?.pinned
                ? t('in-plg:welcomepage.favouriteButton.ariaFilled')
                : t('in-plg:welcomepage.favouriteButton.aria')
            }
            type={
              isFavourite
                ? 'lib_actions_favorite_filled'
                : item?.pinned
                ? 'lib_actions_favorite_filled'
                : 'lib_actions_favorite'
            }
            onClick={() => handleFavoriteClick(id, item, isFavourite)}
            iconSize="xs"
            disabled={isDisabled}
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
      tableType="applicationWidget"
      pinnedItemTypes={[applicationType]}
      getItems={getApplicationData}
      getItem={getItem}
      hasAddPermission={role?.canConfigureApplications}
      hasAddMore={role?.canConfigureApplications}
      viewAll
      addMore={addNewApplications}
      addData={addNewApplications}
      href={createHrefToPath(applicationsList)}
      label={widgetLabel}
      dashboardTileProps={dashboardTileProps}
      searchPlaceholderLabel={t('in-plg:welcomepage.component.applicationWidget.searchPlaceholderLabel')}
      addButtonLabel={t('in-plg:welcomepage.component.applicationWidget.addButtonLabel')}
      viewAllLabel={t('in-plg:welcomepage.component.applicationWidget.viewAllLabel')}
    />
  );
}
