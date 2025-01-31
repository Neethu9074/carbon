/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useEffect, useState } from 'react';
import { List } from 'immutable';

import { CarbonTabPanel, Link, IconButton, TableTabs, TableTab } from '@instana/components';
import { EntityHealthInfo, TimeConfig } from '@instana/types';
import { combineLatest, just } from '@instana/observables';
import { t } from '@instana/i18n-react';

//@ts-expect-error doesn't contain type file
import WithInfrastructureHealthIndicationBehaviour from 'in-components/health/WithHealthIndication/WithInfrastructureHealthIndicationBehaviour';
import {
  InfraProps,
  StarredItemWithIdsType,
  SyntheticInfraColumn,
  ToggleType
} from 'in-plg/pages/WelcomePage/widgets/types/DashboardTypeDefiniton';
//@ts-expect-error doesn't contain type file
import { entityTypeToFullyQualifiedPlugin } from 'in-infrastructure/tableView/stores/snapshotIds';
//@ts-expect-error doesn't contain type file
import HistoricMetricSparkChart from 'in-components/SparkChart/HistoricMetricSparkChart';
import { host as hostType, container as containerType, process as processType } from 'in-cockpit/starredItems/types';
import DatatableWrapper, { getFlattenedIds } from 'in-plg/pages/WelcomePage/widgets/DatatableWrapper';
//@ts-expect-error doesn't contain type file
import { add, remove } from 'in-cockpit/starredItems';
import TypographyWithTooltip from 'in-plg/components/TypographyWithTooltip/TypographyWithTooltip';
//@ts-expect-error doesn't contain type file
import { getMetric } from 'in-stores/metric';
//@ts-expect-error doesn't contain type file
import search from 'in-subscription/search';
//@ts-expect-error doesn't contain type file
import { getLabel } from 'in-sdk/snapshot';
//@ts-expect-error doesn't contain type file
import connectTo from 'in-hoc/connectTo';
//@ts-expect-error doesn't contain type file
import { getZone } from 'in-stores/zone';
import { useGetDashboardLink } from 'in-stores/navigation/paths/dashboardPaths';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { physicalTablePath } from 'in-stores/navigation/paths/mainPaths';
import HealthIcon from 'in-components/health/HealthIcon/HealthIcon';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import getHostSnapshotId from 'in-subscription/getHostSnapshotId';
import { formatDateTime } from 'in-services/formatters/date';
import { percentage } from 'in-services/formatters/number';
import { pendingResult } from 'in-services/fixedObjects';
import { SnapshotMap } from 'in-components/EntityLink';
import { getIconTypeCallback } from 'in-sdk/iconType';
import Tooltip from 'in-components/Tooltip/Tooltip';
import { getSnapshot } from 'in-stores/snapshot';

function handleFavoriteClick(id: string, item: any, isFavourite: boolean, type: string) {
  if (!id && !item) return;
  if (isFavourite) {
    remove({ id: id || item?.snapshot?.get('id'), type });
  } else {
    add({
      id: item.snapshotId || item?.snapshot?.get('id'),
      label: getLabel(item?.snapshot),
      type: type
    });
  }
}

function Toggles({
  toggles,
  selectedType,
  setSelectedType
}: {
  toggles: ToggleType[];
  selectedType: string;
  setSelectedType: React.Dispatch<React.SetStateAction<string>>;
}) {
  return (
    <TableTabs
      selectedIndex={toggles.filter(toggle => toggle.value === selectedType).map(toggle => toggle.index)[0]}
      panels={toggles?.length > 0 && toggles.map(({ index }) => <CarbonTabPanel key={index} />)}
    >
      {toggles?.length > 0 &&
        toggles.map(toggle => (
          <TableTab
            key={toggle.index}
            isDisabled={false}
            label={toggle.label}
            onClick={() => setSelectedType(toggle.value)}
          />
        ))}
    </TableTabs>
  );
}

export default function InfrastructureWidget({ config, timeConfig, widgetLabel, dashboardTileProps }: InfraProps) {
  const [selectedType, setSelectedType] = useState(localStorage.getItem('selectedInfraType') ?? 'host');
  const { location, createHref } = useNavigation();
  const getDashboardLink = useGetDashboardLink();
  const maxItemsInTable = 5;
  const fullListViewLocation = { ...location, pathname: physicalTablePath };

  const toggles = [
    { value: 'host', label: 'Hosts', index: 0 },
    { value: 'docker', label: 'Containers', index: 1 },
    { value: 'process', label: 'Processes', index: 2 }
  ];

  useEffect(() => {
    localStorage.setItem('selectedInfraType', selectedType);
  }, [selectedType]);

  setOrDeleteMatrixKey(fullListViewLocation, physicalTablePath, 'plugin', selectedType);

  /**
   * The function generates label which can be used as a placeholder text.
   * @returns The label for the placeholder.
   */
  const getPlaceholderLabel = (): string | null => {
    if (selectedType === 'host') {
      return t('in-plg:welcomepage.component.infrastructureWidget.hostSearchPlaceholderLabel');
    }
    if (selectedType === 'docker') {
      return t('in-plg:welcomepage.component.infrastructureWidget.containersSearchPlaceholderLabel');
    }
    return t('in-plg:welcomepage.component.infrastructureWidget.processesSearchPlaceholderLabel');
  };

  /**
   * The function generates label which can be used as a placeholder text.
   * @returns The label for the placeholder.
   */
  const getViewAllLabel = (): string | null => {
    if (selectedType === 'host') {
      return t('in-plg:welcomepage.component.infrastructureWidget.hostViewAllLabel');
    }
    if (selectedType === 'docker') {
      return t('in-plg:welcomepage.component.infrastructureWidget.containersViewAllLabel');
    }
    return t('in-plg:welcomepage.component.infrastructureWidget.processesViewAllLabel');
  };

  dashboardTileProps = {
    ...dashboardTileProps,
    toggles: <Toggles toggles={toggles} selectedType={selectedType} setSelectedType={setSelectedType} />
  };

  const getHeaders = () => {
    if (selectedType === 'host') {
      return [
        {
          header: t('in-plg:welcomepage.component.infrastructureWidget.name'),
          key: 'name'
        },
        {
          header: t('in-plg:welcomepage.component.infrastructureWidget.zones'),
          key: 'zones'
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
        },
        {
          key: 'favourite',
          header: ''
        }
      ];
    }
    if (selectedType === 'docker') {
      return [
        {
          header: t('in-plg:welcomepage.component.infrastructureWidget.name'),
          key: 'name'
        },
        {
          header: t('in-plg:welcomepage.component.infrastructureWidget.hosts'),
          key: 'hosts'
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
        },
        {
          key: 'favourite',
          header: ''
        }
      ];
    }
    return [
      {
        header: t('in-plg:welcomepage.component.infrastructureWidget.name'),
        key: 'name'
      },
      {
        header: t('in-plg:welcomepage.component.infrastructureWidget.hosts'),
        key: 'hosts'
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
      },
      {
        key: 'favourite',
        header: ''
      }
    ];
  };

  interface getItemsType {
    query: string;
    infraType: string;
    timeConfig: TimeConfig;
    pinnedItemIdsByType: StarredItemWithIdsType;
  }

  function getItems({ query, infraType, timeConfig, pinnedItemIdsByType }: getItemsType) {
    const pinnedIds = getFlattenedIds(pinnedItemIdsByType, getPinnedItemType() as (keyof StarredItemWithIdsType)[]);
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
            snapshotIdsWithMetrics.map((snapshotIdWithMetric: any, i: number) => {
              //return only minimal data when item count exceeds the max item in table
              if (i >= maxItemsInTable && pinnedIds?.indexOf(snapshotIdWithMetric.snapshotId) === -1) {
                return just(snapshotIdWithMetric);
              }

              return getSnapshot(snapshotIdWithMetric?.snapshotId).map(snapshot => ({
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
    ({ snapshotId, metric, aggregation }: { snapshotId: string; metric: string; aggregation: string }) => ({
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
            <Tooltip content={getLabel(item.snapshot)} align="auto" caret={false} delay={300}>
              <Link
                href={getDashboardLink(item.snapshotId || item?.snapshot?.get('id'), {
                  pathname: '/physical/dashboard'
                })}
              >
                {getLabel(item.snapshot)}
              </Link>
            </Tooltip>
          );
        }
      },
      {
        key: 'zones',
        getContent({ item }) {
          return <GetZonesAndHosts getSnapshotId={() => getZone(item.snapshot.get('id'))} />;
        }
      },
      {
        key: 'technologies',
        getContent({ item }) {
          return <TypographyWithTooltip content={item.snapshot.get('data').get('os.name')} />;
        }
      },
      {
        key: 'os',
        getContent({ item }) {
          return (
            <TypographyWithTooltip
              content={`${item.snapshot.get('data').get('os.name')} ${item.snapshot.get('data').get('os.version')}`}
            />
          );
        }
      },
      {
        key: 'cpuNum',
        getContent({ item }) {
          return <TypographyWithTooltip content={item.snapshot.getIn(['data', 'cpu.count'])} />;
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
              onClick={() => handleFavoriteClick(id, item, isFavourite, hostType)}
              iconSize="xs"
              disabled={isDisabled}
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
            <Tooltip content={getLabel(item.snapshot)} align="auto" caret={false} delay={300}>
              <Link
                href={getDashboardLink(item.snapshotId || item?.snapshot?.get('id'), {
                  pathname: '/physical/dashboard'
                })}
              >
                {getLabel(item.snapshot)}
              </Link>
            </Tooltip>
          );
        }
      },
      {
        key: 'hosts',
        getContent({ item }) {
          return <GetZonesAndHosts getSnapshotId={() => getHostSnapshotId(item.snapshot)} />;
        }
      },
      {
        key: 'technologies',
        getContent({ item }) {
          return <TypographyWithTooltip content={getTechnologyType(item.snapshot)} />;
        }
      },
      {
        key: 'created',
        getContent({ item }) {
          return <TypographyWithTooltip content={formatDateTime(item.snapshot.get('data').get('Created')) as string} />;
        }
      },
      {
        key: 'started',
        getContent({ item }) {
          return (
            <TypographyWithTooltip
              content={formatDateTime(item.snapshot.getIn(['data', 'Started'], undefined)) as string}
            />
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
              onClick={() => handleFavoriteClick(id, item, isFavourite, containerType)}
              iconSize="xs"
              disabled={isDisabled}
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
            <Tooltip content={getLabel(item.snapshot)} align="auto" caret={false} delay={300}>
              <Link
                href={getDashboardLink(item.snapshotId || item?.snapshot?.get('id'), {
                  pathname: '/physical/dashboard'
                })}
              >
                {getLabel(item.snapshot)}
              </Link>
            </Tooltip>
          );
        }
      },
      {
        key: 'hosts',
        getContent({ item }) {
          return <GetZonesAndHosts getSnapshotId={() => getHostSnapshotId(item.snapshot)} />;
        }
      },
      {
        key: 'technologies',
        getContent({ item }) {
          return <TypographyWithTooltip content={getTechnologyType(item.snapshot)} />;
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
              onClick={() => handleFavoriteClick(id, item, isFavourite, processType)}
              iconSize="xs"
              disabled={isDisabled}
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

  function getItem(id: string, timeConfig: TimeConfig, selectedType: string) {
    return getSnapshot(id, timeConfig).flatMap(snapshot =>
      getMetricForType(snapshot.get('id'), selectedType).map((mainKpiValue: string) => ({ snapshot, mainKpiValue }))
    );
  }

  const generalProps = {
    ...config,
    timeConfig,
    getItem: (id: string, timeConfig: TimeConfig) => getItem(id, timeConfig, selectedType),
    columnDefinitions: columnDefinitions[selectedType],
    headers: getHeaders()
  };

  const getPinnedItemType = () => {
    if (selectedType === 'host') {
      return [hostType];
    }
    if (selectedType === 'docker') {
      return [containerType];
    }
    return [processType];
  };

  const pinnedTypes = getPinnedItemType();

  const GetZonesAndHosts = connectTo(
    ({ getSnapshotId }: any) => ({
      snapshot: getSnapshotId().flatMap(getSnapshot)
    }),

    function GetZonesAndHosts({ snapshot }: any) {
      return <TypographyWithTooltip content={getLabel(snapshot)} />;
    }
  );

  return (
    <DatatableWrapper
      tableType="infrastructureWidget"
      {...generalProps}
      infraType={selectedType}
      getItems={getItems}
      viewAll
      href={createHref(fullListViewLocation)}
      label={`${widgetLabel}.${selectedType}`}
      dashboardTileProps={dashboardTileProps}
      pinnedItemTypes={pinnedTypes}
      searchPlaceholderLabel={getPlaceholderLabel()}
      viewAllLabel={getViewAllLabel()}
    />
  );
}
