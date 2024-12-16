/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { debounce, get } from 'lodash';
import React from 'react';

import { IconButton, Link } from '@instana/components';
import { combineLatest } from '@instana/observables';
import { TimeConfig } from '@instana/types';
import { t } from '@instana/i18n-react';

import {
  kubernetesCluster as kubernetesClusterType,
  pcfApplication as pcfApplicationType,
  vsphereDatacenter as vsphereDatacenterType,
  openstackRegion as openstackRegionType,
  phmcServer as phmcServerType,
  powervc as powervcServerType,
  sap as sapType,
  zhmcServer as zhmcServerType
} from 'in-cockpit/starredItems/types';
import {
  hasKubernetesAccess,
  hasOpenStackAccess,
  hasPCFAccess,
  hasPHMCAccess,
  hasPowerVcAccess,
  hasVSphereAccess,
  hasZHMCAccess,
  hasSAPAccess
} from 'in-stores/permission';
//@ts-expect-error doesn't contain type file
import { getCloudfoundryApplicationsWithDefaults } from 'in-cloudfoundry/subscriptions/getCloudfoundryApplications';
//@ts-expect-error no declaration file present
import getKubernetesClusterItemCounters from 'in-kubernetes/subscriptions/getKubernetesClusterItemCounters';
//@ts-expect-error doesn't contain type file
import { getVSphereDatacentersWithDefaults } from 'in-vsphere/subscriptions/getVsphereDatacenters';
//@ts-expect-error doesn't contain type file
import { getOpenstackRegionsWithDefaults } from 'in-openstack/subscriptions/getOpenstackRegions';
//@ts-expect-error doesn't contain type file
import { getPowerVCRegionsWithDefaults } from 'in-powervc/subscriptions/getPowerVCRegions';
//@ts-expect-error doesn't contain type file
import HistoricMetricSparkChart from 'in-components/SparkChart/HistoricMetricSparkChart';
//@ts-expect-error doesn't contain type file
import InstanceMetric from 'in-cloudfoundry/commonComponents/InstanceMetric';
//@ts-expect-error doesn't contain type file
import { useOpenstackRegionDashboard } from 'in-openstack/navigation/paths';
//@ts-expect-error doesn't contain type file
import { useNavigateToAbapSystemDashboard } from 'in-sap/navigation/paths';
//@ts-expect-error doesn't contain type file
import mergeResults from 'in-cockpit/widgets/TopListWidget/mergeResults';
//@ts-expect-error doesn't contain type file
import { getPhmcsWithDefaults } from 'in-phmc/subscriptions/getPhmcs';
//@ts-expect-error doesn't contain type file
import { getZhmcsWithDefaults } from 'in-zhmc/subscriptions/getZhmcs';
import { WidgetProps, ColumnDefinitionItem } from 'in-plg/pages/WelcomePage/widgets/types/DashboardTypeDefiniton';
//@ts-expect-error doesn't contain type file
import { useIbmpPhmcDashboard } from 'in-phmc/navigation/paths';
import getAbapSystem, { getAbapSystemListsWithDefaults } from 'in-sap/subscriptions/getAbapSystemLists';
import { getKubernetesClustersWithDefaults } from 'in-kubernetes/subscriptions/getKubernetesClusters';
//@ts-expect-error doesn't contain type file
import { add, remove } from 'in-cockpit/starredItems';
//@ts-expect-error no declaration file present
import getZhmc from 'in-zhmc/subscriptions/getZhmc';
import getCloudfoundryApplication from 'in-cloudfoundry/subscriptions/getCloudfoundryApplication';
import TypographyWithTooltip from 'in-plg/components/TypographyWithTooltip/TypographyWithTooltip';
//@ts-expect-error doesn't contain type file
import { getMetric } from 'in-stores/metric';
//@ts-expect-error doesn't contain type file
import connectTo from 'in-hoc/connectTo';
import { useNavigateToApplicationDashboard } from 'in-cloudfoundry/navigation/paths';
import getKubernetesCluster from 'in-kubernetes/subscriptions/getKubernetesCluster';
import { bytesZeroDecimalPlaces, percentage } from 'in-services/formatters/number';
import DatatableWrapper from 'in-plg/pages/WelcomePage/widgets/DatatableWrapper';
import getVsphereDatacenter from 'in-vsphere/subscriptions/getVsphereDatacenter';
import { useNavigateToClusterDashboard } from 'in-kubernetes/navigation/paths';
import getOpenstackRegion from 'in-openstack/subscriptions/getOpenstackRegion';
import getPowerVCRegion from 'in-powervc/subscriptions/getPowerVCRegion';
import { usePowervcRegionDashboard } from 'in-powervc/navigation/paths';
import { useVspehereEntityLink } from 'in-vsphere/navigation/paths';
import HealthIcon from 'in-components/health/HealthIcon/HealthIcon';
import { useIbmzZhmcDashboard } from 'in-zhmc/navigation/paths';
import { hasError, isLoading } from 'in-services/util/result';
import { compareIgnoreCase } from 'in-services/util/string';
import getPhmc from 'in-phmc/subscriptions/getPhmc';
import Tooltip from 'in-components/Tooltip/Tooltip';
import { success } from 'in-services/util/result';

function handleFavoriteClick(id: string, item: any, isFavourite: boolean, type: string) {
  if (!id && !item) return;
  if (isFavourite) {
    remove({ id: id, type: type ? type : getTypeByItem(item) });
  } else {
    add({
      id: getId(item),
      label: getLabel(item),
      type: type ? type : getTypeByItem(item)
    });
  }
}

function getLabel(item: any) {
  return item.isKubernetes ? item.cluster.label : item.label;
}

function getId(item: any) {
  return item.isKubernetes ? item.cluster.id : item.id;
}

function getTypeByItem(item: any) {
  if (item.isKubernetes) {
    return kubernetesClusterType;
  }
  if (item.isOpenstack) {
    return openstackRegionType;
  }
  if (item.isPcf) {
    return pcfApplicationType;
  }
  if (item.isPhmc) {
    return phmcServerType;
  }
  if (item.isPowervc) {
    return powervcServerType;
  }
  if (item.isZhmc) {
    return zhmcServerType;
  }
  if (item.isSap) {
    return sapType;
  }
  return vsphereDatacenterType;
}

export default function PlatformWidget({ config, timeConfig, widgetLabel, dashboardTileProps }: WidgetProps) {
  const debouncedHandleFavoriteClick = debounce(handleFavoriteClick, 300);
  function getLabel(item: any) {
    return item.isKubernetes ? item.cluster.label : item.label;
  }

  function getMergedData(params: any) {
    return mergeResults(
      [
        hasKubernetesAccess && getKubernetesClustersWithDefaults(params),
        hasKubernetesAccess && 'isKubernetes',
        hasPCFAccess && getCloudfoundryApplicationsWithDefaults(params),
        hasPCFAccess && 'isPcf',
        hasVSphereAccess && getVSphereDatacentersWithDefaults(params),
        hasVSphereAccess && 'isVsphere',
        hasOpenStackAccess && getOpenstackRegionsWithDefaults(params),
        hasOpenStackAccess && 'isOpenstack',
        hasPHMCAccess && getPhmcsWithDefaults(params),
        hasPHMCAccess && 'isPhmc',
        hasPowerVcAccess && getPowerVCRegionsWithDefaults(params),
        hasPowerVcAccess && 'isPowervc',
        hasZHMCAccess && getZhmcsWithDefaults(params),
        hasZHMCAccess && 'isZhmc',
        hasSAPAccess && getAbapSystemListsWithDefaults(params),
        hasSAPAccess && 'isSap'
      ].filter(Boolean)
    )((a: any, b: any) => compareIgnoreCase(getLabel(a), getLabel(b)));
  }

  const getHeaders = () => {
    return [
      {
        header: t('in-plg:welcomepage.component.platformWidget.name'),
        key: 'name'
      },
      {
        header: '',
        key: 'platform'
      },
      {
        header: '',
        key: 'esxiHost'
      },
      {
        header: '',
        key: 'systemsNodesVms'
      },
      {
        header: '',
        key: 'instancesPartitionsNamespacesCpuUsage'
      },
      {
        header: '',
        key: 'memoryLimitAdaptersViosPodsMemoryUsage'
      },
      {
        header: t('in-plg:welcomepage.component.platformWidget.health'),
        key: 'health'
      },
      {
        header: '',
        key: 'favourite'
      }
    ];
  };

  function getTechnology(item: any) {
    if (item.isKubernetes) {
      const clusterDistribution = get(item, ['cluster', 'clusterDistribution'], 'kubernetes');
      if (clusterDistribution === 'openshift' || clusterDistribution === 'openshift_inverted') {
        return t('in-plg:welcomepage.component.platformWidget.openshift');
      }
      if (clusterDistribution === 'gke') {
        return t('in-plg:welcomepage.component.platformWidget.gke');
      }
      if (clusterDistribution === 'eks') {
        return t('in-plg:welcomepage.component.platformWidget.eks');
      }
      return clusterDistribution;
    }
    if (item.isOpenstack) {
      return t('in-plg:welcomepage.component.platformWidget.openstack');
    }
    if (item.isPcf) {
      return t('in-plg:welcomepage.component.platformWidget.cloudFoundry');
    }
    if (item.isPhmc) {
      return t('in-plg:welcomepage.component.platformWidget.ibmp');
    }
    if (item.isPowervc) {
      return t('in-plg:welcomepage.component.platformWidget.powervcRegion');
    }
    if (item.isZhmc) {
      return t('in-plg:welcomepage.component.platformWidget.ibmz');
    }
    if (item.isSap) {
      return t('in-plg:welcomepage.component.platformWidget.sap');
    }
    return t('in-plg:welcomepage.component.platformWidget.vsphere');
  }

  const getClusterDashboardLink = useNavigateToClusterDashboard();
  const getApplicationDashboardLink = useNavigateToApplicationDashboard();
  const getOpenstackRegionDashboard = useOpenstackRegionDashboard();
  const getIbmzZhmcDashboard = useIbmzZhmcDashboard();
  const getVsphereDatacenterDashboard = useVspehereEntityLink('datacenter');
  const getPowervcRegionDashboard = usePowervcRegionDashboard();
  const getIbmpPhmcDashboard = useIbmpPhmcDashboard();
  const getAbapSystemDashboard = useNavigateToAbapSystemDashboard();

  function getId(item: any) {
    return item.isKubernetes ? item.cluster.id : item.id;
  }

  function getKubernetesClusterById(id: string, timeConfig: TimeConfig) {
    return combineLatest([
      getKubernetesCluster({ id, timeConfig }),
      getKubernetesClusterItemCounters({ clusterId: id, timeConfig })
      //@ts-expect-error type cannot be identified
    ]).map(([kubernetesClusterResult, itemCounterResult]: [any, any]) => {
      if (isLoading(kubernetesClusterResult) || hasError(kubernetesClusterResult)) {
        return kubernetesClusterResult;
      }
      if (isLoading(itemCounterResult) || hasError(itemCounterResult)) {
        return itemCounterResult;
      }
      return success({ cluster: kubernetesClusterResult.data, ...itemCounterResult.data, isKubernetes: true });
    });
  }
  function mapOpenstackResult(result: any) {
    return result.data ? success({ ...result.data, isOpenstack: true }) : result;
  }

  function mapPcfResult(result: any) {
    return result.data ? success({ ...result.data, isPcf: true }) : result;
  }

  function mapPhmcResult(result: any) {
    return result.data ? success({ ...result.data, isPhmc: true }) : result;
  }

  function mapPowervcResult(result: any) {
    return result.data ? success({ ...result.data, isPowervc: true }) : result;
  }

  function mapZhmcResult(result: any) {
    return result.data ? success({ ...result.data, isZhmc: true }) : result;
  }

  function mapSapResult(result: any) {
    return result.data ? success({ ...result.data, isSap: true }) : result;
  }

  function mapVsphereResult(result: any) {
    return result.data ? success({ ...result.data, isVsphere: true }) : result;
  }

  function getItem(id: string, timeConfig: TimeConfig, type: string) {
    if (type === kubernetesClusterType) {
      return getKubernetesClusterById(id, timeConfig);
    }
    if (type === openstackRegionType) {
      return getOpenstackRegion({ filter: { regionId: id, timeConfig } }).map(mapOpenstackResult);
    }
    if (type === pcfApplicationType) {
      return getCloudfoundryApplication({ filter: { applicationId: id, timeConfig } }).map(mapPcfResult);
    }
    if (type === phmcServerType) {
      return getPhmc({ filter: { applicationId: id, timeConfig } }).map(mapPhmcResult);
    }
    if (type === powervcServerType) {
      return getPowerVCRegion({ filter: { regionId: id, timeConfig } }).map(mapPowervcResult);
    }
    if (type === zhmcServerType) {
      return getZhmc({ filter: { applicationId: id, timeConfig } }).map(mapZhmcResult);
    }
    if (type === sapType) {
      return getAbapSystem({ filter: { applicationId: id, timeConfig } }).map(mapSapResult);
    }
    return getVsphereDatacenter({ datacenterId: id, timeConfig }).map(mapVsphereResult);
  }

  function getLink(item: any) {
    return (
      item.isKubernetes
        ? getClusterDashboardLink
        : item.isPcf
        ? getApplicationDashboardLink
        : item.isZhmc
        ? getIbmzZhmcDashboard
        : item.isPhmc
        ? getIbmpPhmcDashboard
        : item.isPowervc
        ? getPowervcRegionDashboard
        : item.isOpenstack
        ? getOpenstackRegionDashboard
        : item.isSap
        ? getAbapSystemDashboard
        : getVsphereDatacenterDashboard
    )(getId(item));
  }

  const pinnedTypes = [
    hasKubernetesAccess && kubernetesClusterType,
    hasPCFAccess && pcfApplicationType,
    hasVSphereAccess && vsphereDatacenterType,
    hasOpenStackAccess && openstackRegionType,
    hasPHMCAccess && phmcServerType,
    hasPowerVcAccess && powervcServerType,
    hasZHMCAccess && zhmcServerType,
    hasSAPAccess && sapType
  ].filter(Boolean);

  const columnDefinitions: ColumnDefinitionItem[] = [
    {
      key: 'name',
      getContent({ item }) {
        return (
          <Tooltip content={getLabel(item)} align="auto" caret={false} delay={300}>
            <Link href={getLink(item)}>{getLabel(item)}</Link>
          </Tooltip>
        );
      }
    },
    {
      key: 'platform',
      getContent({ item }) {
        return <TypographyWithTooltip content={getTechnology(item)} />;
      }
    },
    {
      key: 'esxiHost',
      getContent({ item }) {
        if (item.isPcf || item.isKubernetes || item.isPhmc || item.isZhmc || item.isOpenstack || item.isSap) {
          return null;
        }
        return (
          <TypographyWithTooltip
            content={`${item.hosts} ${t('in-plg:welcomepage.component.platformWidget.esXiHosts')}`}
          />
        );
      }
    },
    {
      key: 'systemsNodesVms',
      getContent({ item }) {
        if (item.isPcf) {
          return null;
        } else if (item.isPhmc || item.isZhmc) {
          return (
            <TypographyWithTooltip
              content={`${item.systems} ${t('in-plg:welcomepage.component.platformWidget.systems')}`}
            />
          );
        } else if (item.isOpenstack || item.isSap || item.isPowervc) {
          return null;
        }
        return item.isKubernetes ? (
          <TypographyWithTooltip content={`${item.nodes} ${t('in-plg:welcomepage.component.platformWidget.nodes')}`} />
        ) : (
          <TypographyWithTooltip content={`${item.vms} ${t('in-plg:welcomepage.component.platformWidget.vMs')}`} />
        );
      }
    },
    {
      key: 'instancesPartitionsNamespacesCpuUsage',
      getContent({ item }) {
        if (item.isPcf) {
          return (
            <TypographyWithTooltip
              content={`${(<InstanceMetric applicationId={item.id} />)} ${t(
                'in-plg:welcomepage.component.platformWidget.instances'
              )}`}
            />
          );
        } else if (item.isPhmc || item.isZhmc) {
          return (
            <TypographyWithTooltip
              content={`${item.partitions} ${t('in-plg:welcomepage.component.platformWidget.partitions')}`}
            />
          );
        } else if (item.isOpenstack || item.isSap) {
          return null;
        }
        return item.isKubernetes ? (
          <TypographyWithTooltip
            content={`${item.namespaces} ${t('in-plg:welcomepage.component.platformWidget.namespaces')}`}
          />
        ) : (
          <SparkChartWithMetricValue
            snapshotId={item.id}
            formatter={percentage.compact}
            metric="cpu.usage.percent.maximum.*"
            label={t('in-plg:welcomepage.component.platformWidget.cpuUsage')}
            aggregation="mean"
          />
        );
      }
    },
    {
      key: 'memoryLimitAdaptersViosPodsMemoryUsage',
      getContent({ item }) {
        if (item.isPcf) {
          return (
            <TypographyWithTooltip
              content={`${bytesZeroDecimalPlaces(item.memoryLimit)} ${t(
                'in-plg:welcomepage.component.platformWidget.memoryLimit'
              )}`}
            />
          );
        } else if (item.isZhmc) {
          return (
            <TypographyWithTooltip
              content={`${item.adapters} ${t('in-plg:welcomepage.component.platformWidget.adapters')}`}
            />
          );
        } else if (item.isPhmc) {
          return (
            <TypographyWithTooltip content={`${item.vios} ${t('in-plg:welcomepage.component.platformWidget.vios')}`} />
          );
        }
        return item.isKubernetes ? (
          <TypographyWithTooltip
            content={`${item.workloads.pods} ${t('in-plg:welcomepage.component.platformWidget.pods')}`}
          />
        ) : (
          <SparkChartWithMetricValue
            snapshotId={item.id}
            formatter={percentage.compact}
            metric="mem.usage.average.percent"
            label={t('in-plg:welcomepage.component.platformWidget.memoryUsage')}
            aggregation="mean"
          />
        );
      }
    },
    {
      key: 'health',
      getContent({ item }) {
        return <HealthIcon severity={get(item, ['entityHealthInfo', 'maxSeverity', 0, 1], 0)} iconSize="xs" />;
      }
    },
    {
      key: 'favourite',
      getContent({ id, item, isDisabled = false, isFavourite = false, type }) {
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
            onClick={() => debouncedHandleFavoriteClick(id, item, isFavourite, type)}
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
      tableType="platformsWidget"
      pinnedItemTypes={pinnedTypes}
      getItems={getMergedData}
      getItem={getItem}
      label={widgetLabel}
      dashboardTileProps={dashboardTileProps}
      viewAll={false}
      searchPlaceholderLabel={t('in-plg:welcomepage.component.platformWidget.searchPlaceholderLabel')}
      viewAllLabel={t('in-plg:welcomepage.component.platformWidget.viewAllLabel')}
    />
  );
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
