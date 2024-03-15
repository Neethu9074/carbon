/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { get } from 'lodash';
import React from 'react';

import { Link, Stack, SvgIcon, Typography } from '@instana/components';
import { t } from '@instana/i18n-react';

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
//@ts-ignore doesn't contain type file
import { getCloudfoundryApplicationsWithDefaults } from 'in-cloudfoundry/subscriptions/getCloudfoundryApplications';
//@ts-ignore doesn't contain type file
import { getVSphereDatacentersWithDefaults } from 'in-vsphere/subscriptions/getVsphereDatacenters';
//@ts-ignore doesn't contain type file
import { getOpenstackRegionsWithDefaults } from 'in-openstack/subscriptions/getOpenstackRegions';
//@ts-ignore doesn't contain type file
import { getPowerVCRegionsWithDefaults } from 'in-powervc/subscriptions/getPowerVCRegions';
//@ts-ignore doesn't contain type file
import { useOpenstackRegionDashboard } from 'in-openstack/navigation/paths';
import { WidgetProps, ColumnDefinitionItem } from 'in-plg/pages/WelcomePage/widgets/types/DashboardTypeDefiniton';
//@ts-ignore doesn't contain type file
import mergeResults from 'in-cockpit/widgets/TopListWidget/mergeResults';
//@ts-ignore doesn't contain type file
import { getPhmcsWithDefaults } from 'in-phmc/subscriptions/getPhmcs';
//@ts-ignore doesn't contain type file
import { getZhmcsWithDefaults } from 'in-zhmc/subscriptions/getZhmcs';
//@ts-ignore doesn't contain type file
import { getAbapSystemDashboard } from 'in-sap/navigation/paths';
//@ts-ignore doesn't contain type file
import { useIbmpPhmcDashboard } from 'in-phmc/navigation/paths';
import { getKubernetesClustersWithDefaults } from 'in-kubernetes/subscriptions/getKubernetesClusters';
import { getAbapSystemListsWithDefaults } from 'in-sap/subscriptions/getAbapSystemLists';
import { useNavigateToApplicationDashboard } from 'in-cloudfoundry/navigation/paths';
//@ts-ignore doesn't contain type file
import connectTo from 'in-hoc/connectTo';
import { useNavigateToClusterDashboard } from 'in-kubernetes/navigation/paths';
import { usePowervcRegionDashboard } from 'in-powervc/navigation/paths';
import { useVspehereEntityLink } from 'in-vsphere/navigation/paths';
import HealthDot from 'in-components/health/HealthDot/HealthDot';
import { useIbmzZhmcDashboard } from 'in-zhmc/navigation/paths';
import { compareIgnoreCase } from 'in-services/util/string';
import { timeConfig$ } from 'in-stores/time/config';
import DatatableWrapper from './DatatableWrapper';

export default connectTo(() => ({
  timeConfig: timeConfig$
}))(function PlatformWidget({ config, timeConfig, widgetLabel, dashboardTileProps }: WidgetProps) {
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
        header: t('in-plg:welcomepage.component.platformWidget.nodes'),
        key: 'nodes'
      },
      {
        header: t('in-plg:welcomepage.component.platformWidget.namespaces'),
        key: 'namespaces'
      },
      {
        header: t('in-plg:welcomepage.component.platformWidget.pods'),
        key: 'pods'
      }
    ];
  };

  function getIcon(item: any) {
    if (item.isKubernetes) {
      const clusterDistribution = get(item, ['cluster', 'clusterDistribution'], 'kubernetes');
      return `lib_${clusterDistribution}`;
    }
    if (item.isOpenstack) {
      return 'lib_openstack';
    }
    if (item.isPcf) {
      return 'lib_cloudfoundry_application';
    }
    if (item.isPhmc) {
      return 'lib_phmc_console';
    }
    if (item.isPowervc) {
      return 'lib_powervc';
    }
    if (item.isZhmc) {
      return 'lib_zhmcConsole';
    }
    if (item.isSap) {
      return 'lib_sap';
    }
    return 'lib_vsphere_datacenter';
  }

  const getClusterDashboardLink = useNavigateToClusterDashboard();
  const getApplicationDashboardLink = useNavigateToApplicationDashboard();
  const getOpenstackRegionDashboard = useOpenstackRegionDashboard();
  const getIbmzZhmcDashboard = useIbmzZhmcDashboard();
  const getVsphereDatacenterDashboard = useVspehereEntityLink('datacenter');
  const getPowervcRegionDashboard = usePowervcRegionDashboard();
  const getIbmpPhmcDashboard = useIbmpPhmcDashboard();

  function getId(item: any) {
    return item.isKubernetes ? item.cluster.id : item.id;
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

  const columnDefinitions: ColumnDefinitionItem[] = [
    {
      key: 'name',
      getContent({ item }) {
        return (
          <Stack direction="horizontal" align="center">
            <HealthDot severity={get(item, ['entityHealthInfo', 'maxSeverity', 0, 1], 0)} iconSize={10} />
            <SvgIcon type={getIcon(item)} color="var(--ids-color-option-neutral-700)" />
            <Link href={getLink(item)}>{getLabel(item)}</Link>
          </Stack>
        );
      }
    },
    {
      key: 'nodes',
      getContent({ item }) {
        return <Typography variant="body-regular">{item.nodes}</Typography>;
      }
    },
    {
      key: 'namespaces',
      getContent({ item }) {
        return <Typography variant="body-regular">{item.namespaces}</Typography>;
      }
    },
    {
      key: 'pods',
      getContent({ item }) {
        return <Typography variant="body-regular">{item.workloads?.pods}</Typography>;
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
      getItems={getMergedData}
      label={widgetLabel}
      dashboardTileProps={dashboardTileProps}
    />
  );
});
