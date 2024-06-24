/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useState } from 'react';
import { List } from 'immutable';

import { Link, Typography } from '@instana/components';
import { combineLatest } from '@instana/observables';
import { EntityHealthInfo } from '@instana/types';
import { t } from '@instana/i18n-react';

//@ts-expect-error doesn't contain type file
import WithInfrastructureHealthIndicationBehaviour from 'in-components/health/WithHealthIndication/WithInfrastructureHealthIndicationBehaviour';
//@ts-expect-error doesn't contain type file
import { entityTypeToFullyQualifiedPlugin } from 'in-infrastructure/tableView/stores/snapshotIds';
//@ts-expect-error doesn't contain type file
import HistoricMetricSparkChart from 'in-components/SparkChart/HistoricMetricSparkChart';
import { InfraProps, SyntheticInfraColumn } from 'in-plg/pages/WelcomePage/widgets/types/DashboardTypeDefiniton';
//@ts-expect-error doesn't contain type file
import { getMetric } from 'in-stores/metric';
//@ts-expect-error doesn't contain type file
import search from 'in-subscription/search';
//@ts-expect-error doesn't contain type file
import { getLabel } from 'in-sdk/snapshot';
//@ts-expect-error doesn't contain type file
import connectTo from 'in-hoc/connectTo';
import DatatableWrapper from 'in-plg/pages/WelcomePage/widgets/DatatableWrapper';
import { useGetDashboardLink } from 'in-stores/navigation/paths/dashboardPaths';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { physicalTablePath } from 'in-stores/navigation/paths/mainPaths';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import HealthIcon from 'in-plg/components/HealthIcon/HealthIcon';
import { formatDateTime } from 'in-services/formatters/date';
import { percentage } from 'in-services/formatters/number';
import { pendingResult } from 'in-services/fixedObjects';
import { SnapshotMap } from 'in-components/EntityLink';
import { getIconTypeCallback } from 'in-sdk/iconType';
import { timeConfig$ } from 'in-stores/time/config';
import { getSnapshot } from 'in-stores/snapshot';

export default connectTo(() => ({
  timeConfig: timeConfig$
}))(function InfrastructureWidget({ config, timeConfig, widgetLabel, dashboardTileProps }: InfraProps) {
  const [infraType, setInfraType] = useState(0);
  const { location, createHref } = useNavigation();
  const getDashboardLink = useGetDashboardLink();
  const fullListViewLocation = { ...location, pathname: physicalTablePath };

  const infrastructureToogleArray: string[] = [];

  const infrastructureArray = [
    { value: 'host', label: 'Hosts' },
    { value: 'docker', label: 'Containers' },
    { value: 'process', label: 'Processes' }
  ];
  infrastructureArray.map(ele => {
    infrastructureToogleArray.push(ele.label);
  });

  const infraTypeValue = infrastructureArray[infraType]?.value;

  setOrDeleteMatrixKey(fullListViewLocation, physicalTablePath, 'plugin', infraTypeValue);

  function setToogle(index: number) {
    setInfraType(index);
  }

  dashboardTileProps = {
    ...dashboardTileProps,
    toggles: infrastructureToogleArray,
    toggleCallback: index => setToogle(index)
  };

  const getHeaders = () => {
    if (infraTypeValue === 'host') {
      return [
        {
          header: t('in-plg:welcomepage.component.infrastructureWidget.name'),
          key: 'name'
        },
        {
          header: t('in-plg:welcomepage.component.infrastructureWidget.technologies'),
          key: 'technologies'
        },
        {
          header: t('in-plg:welcomepage.component.infrastructureWidget.os'),
          key: 'os'
        },
        {
          header: t('in-plg:welcomepage.component.infrastructureWidget.cpuNum'),
          key: 'cpuNum'
        },
        {
          header: t('in-plg:welcomepage.component.infrastructureWidget.cpuUsage'),
          key: 'cpuUsage'
        },
        {
          header: t('in-plg:welcomepage.component.infrastructureWidget.health'),
          key: 'health'
        }
      ];
    }
    if (infraTypeValue === 'docker') {
      return [
        {
          header: t('in-plg:welcomepage.component.infrastructureWidget.name'),
          key: 'name'
        },
        {
          header: t('in-plg:welcomepage.component.infrastructureWidget.technologies'),
          key: 'technologies'
        },
        {
          header: t('in-plg:welcomepage.component.infrastructureWidget.created'),
          key: 'created'
        },
        {
          header: t('in-plg:welcomepage.component.infrastructureWidget.started'),
          key: 'started'
        },
        {
          header: t('in-plg:welcomepage.component.infrastructureWidget.cpuUsage'),
          key: 'cpuUsage'
        },
        {
          header: t('in-plg:welcomepage.component.infrastructureWidget.health'),
          key: 'health'
        }
      ];
    }
    return [
      {
        header: t('in-plg:welcomepage.component.infrastructureWidget.name'),
        key: 'name'
      },
      {
        header: t('in-plg:welcomepage.component.infrastructureWidget.technologies'),
        key: 'technologies'
      },
      {
        header: t('in-plg:welcomepage.component.infrastructureWidget.cpuUsage'),
        key: 'cpuUsage'
      },
      {
        header: t('in-plg:welcomepage.component.infrastructureWidget.health'),
        key: 'health'
      }
    ];
  };

  function getItems({ query, infraType, timeConfig }: any) {
    return search({
      query,
      timeConfig,
      view: 'TABLE',
      restrictResultEntityType: entityTypeToFullyQualifiedPlugin[infraType]
    }).flatMap((snapshotIds: List<string>) =>
      combineLatest(
        snapshotIds
          .toArray()
          .map((snapshotId: string) =>
            getMetricForType(snapshotId, infraType).map((metric: number) => ({ snapshotId, metric }))
          ),
        false
      )
        //@ts-expect-error no type available for snapshotIdsWithMetrics
        .map(snapshotIdsWithMetrics => snapshotIdsWithMetrics.filter(Boolean).sort((s1, s2) => s2.metric - s1.metric))
        .throttle(1000)
        .flatMap(snapshotIdsWithMetrics =>
          combineLatest(
            snapshotIdsWithMetrics.map(snapshotIdWithMetric => {
              //@ts-expect-error
              return getSnapshot(snapshotIdWithMetric?.snapshotId).map(snapshot => ({
                //@ts-expect-error
                ...snapshotIdWithMetric,
                snapshot
              }));
            })
          )
        )
        .throttle(500)
        .map(snapshotIdsWithMetrics => {
          return {
            errors: [],
            progress: {
              loading: false
            },
            data: {
              items: snapshotIdsWithMetrics.filter(s => s.snapshot),
              totalHits: snapshotIds.size
            }
          };
        })
        .startWith(pendingResult)
    );
  }

  function getMetricForType(snapshotId: string, type: string) {
    return getMetric({
      snapshotId,
      metric: type === 'host' ? 'cpu.used' : type === 'docker' ? 'cpu.total_usage' : 'cpu.user',
      timeWindowAggregation: 'mean',
      forceTimeWindowAggregation: true
    });
  }

  const SparkChartWithMetricValue = connectTo(
    ({ snapshotId, metric, aggregation }: any) => ({
      horizontalMetricValue: getMetric({
        snapshotId,
        metric,
        timeWindowAggregation: aggregation,
        forceTimeWindowAggregation: true
      })
    }),
    function SparkChartWithMetricValue(props: any) {
      return <HistoricMetricSparkChart {...props} width={72} />;
    }
  );

  const columnDefinitions: SyntheticInfraColumn = {
    host: [
      {
        key: 'name',
        getContent({ item }) {
          return (
            <Link
              href={getDashboardLink(item.snapshotId || item?.snapshot?.get('id'), {
                pathname: '/physical/dashboard'
              })}
            >
              {getLabel(item.snapshot)}
            </Link>
          );
        }
      },
      {
        key: 'technologies',
        getContent({ item }) {
          return <Typography variant="body-regular">{item.snapshot.get('data').get('os.name')}</Typography>;
        }
      },
      {
        key: 'os',
        getContent({ item }) {
          return (
            <Typography variant="body-regular">{`${item.snapshot.get('data').get('os.name')} ${item.snapshot
              .get('data')
              .get('os.version')}`}</Typography>
          );
        }
      },
      {
        key: 'cpuNum',
        getContent({ item }) {
          return <Typography variant="body-regular">{item.snapshot.getIn(['data', 'cpu.count'])}</Typography>;
        }
      },
      {
        key: 'cpuUsage',
        getContent({ item }) {
          return (
            <SparkChartWithMetricValue
              snapshotId={item.snapshot.get('id')}
              formatter={percentage}
              metric="cpu.used"
              aggregation={t('in-plg:welcomepage.component.infrastructureWidget.mean')}
            />
          );
        }
      },
      {
        key: 'health',
        getContent({ item }) {
          return (
            <WithInfrastructureHealthIndicationBehaviour
              snapshotId={item.snapshot.get('id')}
              render={(healthInfo: EntityHealthInfo) => (
                <HealthIcon severity={healthInfo && healthInfo.maxSeverity} iconSize="xs" />
              )}
            />
          );
        }
      }
    ],
    docker: [
      {
        key: 'name',
        getContent({ item }) {
          return (
            <Link
              href={getDashboardLink(item.snapshotId || item?.snapshot?.get('id'), {
                pathname: '/physical/dashboard'
              })}
            >
              {getLabel(item.snapshot)}
            </Link>
          );
        }
      },
      {
        key: 'technologies',
        getContent({ item }) {
          return <Typography variant="body-regular">{getTechnologyType(item.snapshot)}</Typography>;
        }
      },
      {
        key: 'created',
        getContent({ item }) {
          return (
            <Typography variant="body-regular">{formatDateTime(item.snapshot.get('data').get('Created'))}</Typography>
          );
        }
      },
      {
        key: 'started',
        getContent({ item }) {
          return (
            <Typography variant="body-regular">
              {formatDateTime(item.snapshot.getIn(['data', 'Started'], undefined))}
            </Typography>
          );
        }
      },
      {
        key: 'cpuUsage',
        getContent({ item }) {
          return (
            <SparkChartWithMetricValue
              snapshotId={item.snapshot.get('id')}
              formatter={percentage}
              metric="cpu.total_usage"
              aggregation={t('in-plg:welcomepage.component.infrastructureWidget.mean')}
            />
          );
        }
      },
      {
        key: 'health',
        getContent({ item }) {
          return (
            <WithInfrastructureHealthIndicationBehaviour
              snapshotId={item.snapshot.get('id')}
              render={(healthInfo: EntityHealthInfo) => (
                <HealthIcon severity={healthInfo && healthInfo.maxSeverity} iconSize="xs" />
              )}
            />
          );
        }
      }
    ],
    process: [
      {
        key: 'name',
        getContent({ item }) {
          return (
            <Link
              href={getDashboardLink(item.snapshotId || item?.snapshot?.get('id'), {
                pathname: '/physical/dashboard'
              })}
            >
              {getLabel(item.snapshot)}
            </Link>
          );
        }
      },
      {
        key: 'technologies',
        getContent({ item }) {
          return <Typography variant="body-regular">{getTechnologyType(item.snapshot)}</Typography>;
        }
      },
      {
        key: 'cpuUsage',
        getContent({ item }) {
          return (
            <SparkChartWithMetricValue
              snapshotId={item.snapshot.get('id')}
              formatter={percentage}
              metric="cpu.user"
              aggregation={t('in-plg:welcomepage.component.infrastructureWidget.mean')}
            />
          );
        }
      },
      {
        key: 'health',
        getContent({ item }) {
          return (
            <WithInfrastructureHealthIndicationBehaviour
              snapshotId={item.snapshot.get('id')}
              render={(healthInfo: EntityHealthInfo) => (
                <HealthIcon severity={healthInfo && healthInfo.maxSeverity} iconSize="xs" />
              )}
            />
          );
        }
      }
    ]
  };

  type SnapshotOrPlugin = SnapshotMap | string;
  function getTechnologyType(snapshotOrPlugin: SnapshotOrPlugin): string {
    let plugin = typeof snapshotOrPlugin === 'object' ? (snapshotOrPlugin.get('plugin') as string) : snapshotOrPlugin;
    const callback = getIconTypeCallback(plugin);
    if (callback) {
      if (typeof snapshotOrPlugin === 'object') {
        plugin = callback(snapshotOrPlugin);
      } else {
        plugin = callback(plugin);
      }
    }
    return plugin;
  }

  const generalProps = {
    ...config,
    timeConfig,
    columnDefinitions: columnDefinitions[infraTypeValue],
    headers: getHeaders()
  };

  return (
    <DatatableWrapper
      {...generalProps}
      infraType={infraTypeValue}
      getItems={getItems}
      viewAll
      href={createHref(fullListViewLocation)}
      label={widgetLabel}
      dashboardTileProps={dashboardTileProps}
    />
  );
});
