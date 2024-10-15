/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { fromPromise, just } from '@instana/observables';
import { Link, SvgIcon } from '@instana/components';
import { ButtonGroup } from '@instana/components';
import { useObservable } from '@instana/hooks';

import {
  useClusterDashboard,
  useNamespaceDashboard,
  useNodeDashboard,
  usePodDashboard,
  useServiceDashboard
} from 'in-kubernetes/navigation/paths';
import {
  openstackEnabled,
  pcfEnabled,
  phmcEnabled,
  powervcEnabled,
  sapEnabled,
  vsphereEnabled,
  zhmcEnabled
} from 'in-services/featureFlags';
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import { getSnapshot, shouldStayInCurrentTimeModeForNavigationToSnapshot } from 'in-stores/snapshot';
import { getResolvedTimeConfig, getSparkChartGranularity } from 'in-applications/metrics';
import withEmptyTableState from 'in-components/tables/ServerTable/WithEmptyTableState';
import { meanLatencyFixed, number, percentage } from 'in-services/formatters/number';
import { useNavigateToApplicationDashboard } from 'in-cloudfoundry/navigation/paths';
import SparkChart from 'in-components/tables/ServerTable/components/SparkChart';
import getInfrastructure from 'in-applications/subscriptions/getInfrastructure';
import { useGetDashboardLink } from 'in-stores/navigation/paths/dashboardPaths';
import { useOpenstackRegionDashboard } from 'in-openstack/navigation/paths';
import { getOptionalSnapshotDefinition } from 'in-sdk/snapshot/registry';
import { usePowervcRegionDashboard } from 'in-powervc/navigation/paths';
import { useVspehereEntityLink } from 'in-vsphere/navigation/paths';
import { useAbapSystemDashboard } from 'in-sap/navigation/paths';
import { useIbmzZhmcDashboard } from 'in-zhmc/navigation/paths';
import { useIbmpPhmcDashboard } from 'in-phmc/navigation/paths';
import { getTimeConfigAtMoment } from 'in-stores/time/config';
import { getForgeComponent } from 'in-sdk/getForgeComponent';
import EntityLink from 'in-components/EntityLink/EntityLink';
import { formatDateTime } from 'in-services/formatters/date';
import PluginIcon from 'in-components/PluginIcon';
import Footer from 'in-components/Footer/Footer';
import useUrlState from 'in-hooks/useUrlState';
import { plugins } from 'in-forge/constants';
import Tooltip from 'in-components/Tooltip';
import { t, Trans } from 'in-i18n';

import locals from './Infrastructure.mless';

const selectedTypeUrlParameter = {
  path: '/infrastructure',
  name: 'selectedType',
  initialState: null
};

const tablesByType = {
  CLUSTER: getTable('CLUSTER'),
  PROCESS: getTable('PROCESS'),
  CONTAINER: getTable('CONTAINER'),
  HOST: getTable('HOST')
};

function getTable(type) {
  const columnDefinitions = getColumnDefinitions(type);
  return createServerTableWithUrlState({
    Renderer: withEmptyTableState({
      columnDefinitions
    }),
    paginationResettingUrlParameters: [selectedTypeUrlParameter],
    columnDefinitions,
    defaultOrderBy: 'callsAgg',
    defaultOrderDirection: 'DESC',
    defaultPageSize: 10,
    pathSegment: '/infrastructure',
    matrixPrefix: '',
    isSearchable: false
  });
}

function InfrastructureEntityLink({ entity, plugin }) {
  const getDashboardLink = useGetDashboardLink();
  const snapshot = useObservable(
    () => (entity?.id && entity?.time ? getSnapshot(entity.id, getTimeConfigAtMoment(entity.time)) : just(null)),
    [entity]
  );
  if (!entity.id) {
    return null;
  }
  return (
    <EntityLink
      plugin={plugin}
      snapshot={snapshot}
      label={entity.label || t('in-applications:dashboards.unknownTime', { entityTime: formatDateTime(entity.time) })}
      href$={shouldStayInCurrentTimeModeForNavigationToSnapshot(entity.id).flatMap(stay =>
        just(
          stay
            ? getDashboardLink(entity.id, { pathname: '/physical/dashboard' })
            : getDashboardLink(entity.id, {
                pathname: '/physical/dashboard',
                to: entity.time,
                focusedMoment: entity.time,
                autoRefresh: false
              })
        )
      )}
      subscriptComponent={<SubscriptComponentForSnapshot plugin={plugin} snapshot={snapshot} time={entity.time} />}
    />
  );
}

function WithKubernetesPhysicalContext({
  children,
  inIcon,
  onIcon,
  inEntity,
  ofEntity,
  hrefInEntityDashboard,
  hrefOfEntityDashboard
}) {
  if (inEntity || ofEntity) {
    return (
      <div className={locals.linkWithMetaEntities}>
        {children}
        <div className={locals.metaRow}>
          {inEntity && (
            <Trans
              i18nKey="in-applications:dashboards.infrastructure.inEntity"
              values={{ entityLabel: inEntity.label }}
              components={{
                icon: <SvgIcon className={locals.entitiyIcon} type={inIcon} />,
                entityLink: <Link className={locals.entityLink} href={hrefInEntityDashboard} />
              }}
            />
          )}
          {ofEntity && (
            <Trans
              i18nKey="in-applications:dashboards.infrastructure.ofEntity"
              values={{ entityLabel: ofEntity.label }}
              components={{
                icon: <SvgIcon className={locals.entitiyIcon} type={onIcon} />,
                entityLink: <Link className={locals.entityLink} href={hrefOfEntityDashboard} />
              }}
            />
          )}
        </div>
      </div>
    );
  }
  return children;
}

function WithCloudfoundryPhysicalContext({ children, application, space, organization, cfInstanceIndex }) {
  const getApplicationDashboardLink = useNavigateToApplicationDashboard();

  return (
    <div className={locals.linkWithMetaEntities}>
      {children}
      <div className={locals.metaRow}>
        {application && (
          <Trans
            i18nKey="in-applications:dashboards.infrastructure.instanceIndexOfEntity"
            values={{ cfInstanceIndex: cfInstanceIndex, entityLabel: application.label }}
            components={{
              icon: <SvgIcon className={locals.entitiyIcon} type="lib_cloudfoundry_application" />,
              entityLink: (
                <Link
                  className={locals.entityLink}
                  href={pcfEnabled ? getApplicationDashboardLink(application.id) : null}
                />
              )
            }}
          />
        )}
        {space && (
          <Trans
            i18nKey="in-applications:dashboards.infrastructure.inEntity"
            values={{ entityLabel: space.label }}
            components={{
              icon: <SvgIcon className={locals.entitiyIcon} type="lib_cloudfoundry_space" />,
              entityLink: <Link className={locals.entityLink} href={null} />
            }}
          />
        )}
        {organization && (
          <Trans
            i18nKey="in-applications:dashboards.infrastructure.ofEntity"
            values={{ entityLabel: organization.label }}
            components={{
              icon: <SvgIcon className={locals.entitiyIcon} type="lib_cloudfoundry_organization" />,
              entityLink: <Link className={locals.entityLink} href={null} />
            }}
          />
        )}
      </div>
    </div>
  );
}

function WithVSpherePhysicalContext({ children, datacenter }) {
  const getVsphereDatacenterDashboard = useVspehereEntityLink('datacenter');

  return (
    <div className={locals.linkWithMetaEntities}>
      {children}
      <div className={locals.metaRow}>
        {datacenter && (
          <Trans
            i18nKey="in-applications:dashboards.infrastructure.instanceOfEntity"
            values={{ entityLabel: datacenter.label }}
            components={{
              icon: <SvgIcon className={locals.entitiyIcon} type="lib_vsphere" />,
              entityLink: (
                <Link
                  className={locals.entityLink}
                  href={vsphereEnabled ? getVsphereDatacenterDashboard(datacenter.id) : null}
                />
              )
            }}
          />
        )}
      </div>
    </div>
  );
}

function WithPowerVcPhysicalContext({ children, region }) {
  const getPowerVcRegionDashboard = usePowervcRegionDashboard('region');

  return (
    <div className={locals.linkWithMetaEntities}>
      {children}
      <div className={locals.metaRow}>
        {region && (
          <Trans
            i18nKey="in-applications:dashboards.infrastructure.instanceOfEntity"
            values={{ entityLabel: region.label }}
            components={{
              icon: <SvgIcon className={locals.entitiyIcon} type="lib_powervc" />,
              entityLink: (
                <Link
                  className={locals.entityLink}
                  href$={powervcEnabled ? getPowerVcRegionDashboard(region.id) : null}
                />
              )
            }}
          />
        )}
      </div>
    </div>
  );
}
function WithOpenstackPhysicalContext({ children, region }) {
  const getOpenstackRegionDashboard = useOpenstackRegionDashboard();

  return (
    <div className={locals.linkWithMetaEntities}>
      {children}
      <div className={locals.metaRow}>
        {region && (
          <Trans
            i18nKey="in-applications:dashboards.infrastructure.instanceOfEntity"
            values={{ entityLabel: region.label }}
            components={{
              icon: <SvgIcon className={locals.entitiyIcon} type="lib_openstack" />,
              entityLink: (
                <Link
                  className={locals.entityLink}
                  href={openstackEnabled ? getOpenstackRegionDashboard(region.id) : null}
                />
              )
            }}
          />
        )}
      </div>
    </div>
  );
}

function WithPhmcPhysicalContext({ children, phmc }) {
  const getIbmpPhmcDashboard = useIbmpPhmcDashboard();

  return (
    <div className={locals.linkWithMetaEntities}>
      {children}
      <div className={locals.metaRow}>
        {phmc && (
          <Trans
            i18nKey="in-applications:dashboards.infrastructure.instanceOfEntity"
            values={{ entityLabel: phmc.label }}
            components={{
              icon: <SvgIcon className={locals.entitiyIcon} type="lib_phmc_console" />,
              entityLink: (
                <Link className={locals.entityLink} href={phmcEnabled ? getIbmpPhmcDashboard(phmc.id) : null} />
              )
            }}
          />
        )}
      </div>
    </div>
  );
}

function WithSapPhysicalContext({ children, sap }) {
  const getAbapSystemDashboard = useAbapSystemDashboard;
  return (
    <div className={locals.linkWithMetaEntities}>
      {children}
      <div className={locals.metaRow}>
        {sap && (
          <Trans
            i18nKey="in-applications:dashboards.infrastructure.instanceOfEntity"
            values={{ entityLabel: sap.label }}
            components={{
              icon: <SvgIcon className={locals.entitiyIcon} type="lib_sap" />,
              entityLink: (
                <Link className={locals.entityLink} href={sapEnabled ? getAbapSystemDashboard(sap.id) : null} />
              )
            }}
          />
        )}
      </div>
    </div>
  );
}

function WithZhmcPhysicalContext({ children, zhmc }) {
  const getIbmzZhmcDashboard = useIbmzZhmcDashboard();

  return (
    <div className={locals.linkWithMetaEntities}>
      {children}
      <div className={locals.metaRow}>
        {zhmc && (
          <Trans
            i18nKey="in-applications:dashboards.infrastructure.instanceOfEntity"
            values={{ entityLabel: zhmc.label }}
            components={{
              icon: <SvgIcon className={locals.entitiyIcon} type="lib_zhmcConsole" />,
              entityLink: (
                <Link className={locals.entityLink} href={zhmcEnabled ? getIbmzZhmcDashboard(zhmc.id) : null} />
              )
            }}
          />
        )}
      </div>
    </div>
  );
}

const urlStateDefinition = {
  bind: [selectedTypeUrlParameter],
  reducer: (_, selectedType) => ({ selectedType })
};

export default function Infrastructure({
  data: entity,
  applicationId,
  serviceId,
  endpointId,
  timeConfig,
  boundaryScope: urlBoundaryScope,
  data: application
}) {
  let [{ selectedType }, setType] = useUrlState(urlStateDefinition);

  if (!entity) {
    return null;
  }

  const boundaryScope = urlBoundaryScope || application.boundaryScope;
  const buttonPropsList = [];

  // in the application infra view, show all tabs, because we do not know the type of all entities
  if (entity.entityType == 'APPLICATION') {
    selectedType = selectedType || 'PROCESS';
    buttonPropsList.push({
      text: t('in-applications:buttonCluster'),
      key: 'CLUSTER',
      onClick: () => setType('CLUSTER')
    });
    buttonPropsList.push({
      text: t('in-applications:buttonProcess'),
      key: 'PROCESS',
      onClick: () => setType('PROCESS')
    });
    buttonPropsList.push({
      text: t('in-applications:buttonContainer'),
      key: 'CONTAINER',
      onClick: () => setType('CONTAINER')
    });
    buttonPropsList.push({
      text: t('in-applications:buttonHost'),
      key: 'HOST',
      onClick: () => setType('HOST')
    });

    // TODO: using technologies to detect whether the underlying entity is a cluster is not reliable.
    // One service may have the 'kafkaCluster' technology assigned, not because it's a kafka cluster
    // but because it's a service that reads or writes from/to to a Kafka topic.
  } else if (hasSomeClusterTechnologies(entity)) {
    selectedType = selectedType || 'CLUSTER';
    buttonPropsList.push({
      text: t('in-applications:buttonCluster'),
      key: 'CLUSTER',
      onClick: () => setType('CLUSTER')
    });

    if (hasSomeNonClusterTechnologies(entity)) {
      buttonPropsList.push({
        text: t('in-applications:buttonProcess'),
        key: 'PROCESS',
        onClick: () => setType('PROCESS')
      });
      buttonPropsList.push({
        text: t('in-applications:buttonContainer'),
        key: 'CONTAINER',
        onClick: () => setType('CONTAINER')
      });
      buttonPropsList.push({
        text: t('in-applications:buttonHost'),
        key: 'HOST',
        onClick: () => setType('HOST')
      });
    } else {
      // Show host information as fallback, e.g. for kubernetesService we usually should have host information.
      // In worst case we show the host tab with "Unmonitored" host, like we do in many cases.
      buttonPropsList.push({
        text: t('in-applications:buttonHost'),
        key: 'HOST',
        onClick: () => setType('HOST')
      });
    }
  } else if (hasSomeNonClusterTechnologies(entity)) {
    selectedType = selectedType || 'PROCESS';
    buttonPropsList.push({
      text: t('in-applications:buttonProcess'),
      key: 'PROCESS',
      onClick: () => setType('PROCESS')
    });
    buttonPropsList.push({
      text: t('in-applications:buttonContainer'),
      key: 'CONTAINER',
      onClick: () => setType('CONTAINER')
    });
    buttonPropsList.push({
      text: t('in-applications:buttonHost'),
      key: 'HOST',
      onClick: () => setType('HOST')
    });
  } else {
    selectedType = selectedType || 'HOST';
    buttonPropsList.push({
      text: t('in-applications:buttonHost'),
      key: 'HOST',
      onClick: () => setType('HOST')
    });
  }

  const rightHeader = (
    <ButtonGroup id="button-group-app-infra-type" buttonPropsList={buttonPropsList} activeKey={selectedType} />
  );
  const Table = tablesByType[selectedType];

  return (
    <>
      <Table
        get={getTableData}
        type={selectedType}
        applicationId={applicationId}
        serviceId={serviceId}
        endpointId={endpointId}
        timeConfig={timeConfig}
        boundaryScope={boundaryScope}
        size="compact"
        isSearchable={false}
        rightHeader={rightHeader}
        cardTitle={t('in-applications:labelInfrastructure')}
      />
      <Footer />
    </>
  );
}

function hasSomeClusterTechnologies(entity) {
  if (!entity || !entity.technologies) {
    return false;
  }

  return entity.technologies.some(function (technology) {
    return isClusterTechnology(technology);
  });
}

function hasSomeNonClusterTechnologies(entity) {
  if (!entity || !entity.technologies) {
    return true;
  }

  return entity.technologies.some(function (technology) {
    return !isClusterTechnology(technology);
  });
}

// see com.instana.sdk.call.TechnologyConstants in the backend
const clusterTechnologies = [
  'awsMskCluster',
  'cassandraCluster',
  'consulCluster',
  'couchbaseCluster',
  'elasticsearchCluster',
  'hazelcastCluster',
  'ibmDataPowerCluster',
  'kafkaCluster',
  'kafkaConnectCluster',
  'kubernetesService',
  'redisCluster',
  'rocketMqCluster'
];

function isClusterTechnology(technology) {
  return clusterTechnologies.indexOf(technology) >= 0;
}

function getTableData({
  query = '',
  page = 1,
  pageSize = 10,
  orderBy = 'callsAgg',
  orderDirection = 'DESC',
  applicationId,
  serviceId,
  endpointId,
  timeConfig,
  boundaryScope,
  type
}) {
  return getInfrastructure({
    category: type,
    pagination: {
      page,
      pageSize
    },
    order: {
      by: orderBy,
      direction: orderDirection
    },
    metrics: {
      callsAgg: {
        metric: 'calls',
        aggregation: 'SUM'
      },
      calls: {
        metric: 'calls',
        aggregation: 'SUM',
        granularity: getSparkChartGranularity(timeConfig)
      },
      latencyAgg: {
        metric: 'latency',
        aggregation: 'MEAN'
      },
      latency: {
        metric: 'latency',
        aggregation: 'MEAN',
        granularity: getSparkChartGranularity(timeConfig)
      },
      errorsAgg: {
        metric: 'errors',
        aggregation: 'MEAN'
      },
      errors: {
        metric: 'errors',
        aggregation: 'MEAN',
        granularity: getSparkChartGranularity(timeConfig)
      }
    },
    filter: {
      label: query,
      application: applicationId,
      service: serviceId,
      endpoint: endpointId,
      timeConfig,
      applicationBoundaryScope: boundaryScope
    }
  });
}

function getColumnDefinitions(type) {
  let infraColumnDefinition;
  if (type == 'PROCESS') {
    infraColumnDefinition = {
      id: 'process',
      label: t('in-applications:buttonProcess'),
      sortable: false,
      getContent(item) {
        return item.physicalContext.process ? (
          <InfrastructureEntityLink
            entity={item.physicalContext.process}
            plugin={item.physicalContext.process.plugin}
          />
        ) : (
          <UnmonitoredEntity />
        );
      }
    };
  } else if (type == 'CONTAINER') {
    infraColumnDefinition = {
      id: 'container',
      label: t('in-applications:buttonContainer'),
      sortable: false,
      getContent(item) {
        const link = item.physicalContext.container ? (
          <InfrastructureEntityLink
            entity={item.physicalContext.container}
            plugin={item.physicalContext.container.plugin}
          />
        ) : (
          <UnmonitoredEntity />
        );

        if (
          item.physicalContext.kubernetes &&
          (item.physicalContext.kubernetes.pod || item.physicalContext.kubernetes.namespace)
        ) {
          return (
            <KubernetesPhysicalContextContainer
              inEntity={item.physicalContext.kubernetes.pod}
              ofEntity={item.physicalContext.kubernetes.namespace}
              link={link}
            />
          );
        }

        if (item.physicalContext.cloudfoundry) {
          return (
            <WithCloudfoundryPhysicalContext {...item.physicalContext.cloudfoundry}>
              {link}
            </WithCloudfoundryPhysicalContext>
          );
        }

        if (item.physicalContext.vsphere) {
          return <WithVSpherePhysicalContext {...item.physicalContext.vsphere}>{link}</WithVSpherePhysicalContext>;
        }
        if (item.physicalContext.openstack) {
          return (
            <WithOpenstackPhysicalContext {...item.physicalContext.openstack}>{link}</WithOpenstackPhysicalContext>
          );
        }
        if (item.physicalContext.powervc) {
          return <WithPowerVcPhysicalContext {...item.physicalContext.powervc}>{link}</WithPowerVcPhysicalContext>;
        }
        if (item.physicalContext.phmc) {
          return <WithPhmcPhysicalContext {...item.physicalContext.phmc}>{link}</WithPhmcPhysicalContext>;
        }
        if (item.physicalContext.sap) {
          return <WithSapPhysicalContext {...item.physicalContext.sap}>{link}</WithSapPhysicalContext>;
        }
        if (item.physicalContext.zhmc) {
          return <WithZhmcPhysicalContext {...item.physicalContext.zhmc}>{link}</WithZhmcPhysicalContext>;
        }

        return link;
      }
    };
  } else if (type == 'HOST') {
    infraColumnDefinition = {
      id: 'host',
      label: t('in-applications:buttonHost'),
      sortable: false,
      getContent(item) {
        const link = item.physicalContext.host ? (
          <InfrastructureEntityLink entity={item.physicalContext.host} plugin={plugins.host} />
        ) : (
          <UnmonitoredEntity />
        );

        if (item.physicalContext.kubernetes) {
          return (
            <KubernetesPhysicalContextNode
              inEntity={item.physicalContext.kubernetes.node}
              ofEntity={item.physicalContext.kubernetes.cluster}
              link={link}
            />
          );
        }

        return link;
      }
    };
  } else if (type == 'CLUSTER') {
    infraColumnDefinition = {
      id: 'cluster',
      label: t('in-applications:buttonCluster'),
      sortable: false,
      getContent(item) {
        if (!item.physicalContext.cluster) {
          return <UnmonitoredEntity plugin={plugins.process} />;
        }

        return 'kubernetesService' == item.physicalContext.cluster.plugin ? (
          <KubernetesServiceLink {...item} />
        ) : (
          <InfrastructureEntityLink
            entity={item.physicalContext.cluster}
            plugin={item.physicalContext.cluster.plugin}
          />
        );
      }
    };
  }
  return [
    infraColumnDefinition,
    {
      id: 'callsAgg',
      label: t('in-applications:labelCalls'),
      getContent(item, { result, timeConfig }) {
        return (
          <SparkChart
            loading={result?.progress?.loading}
            rollup={getSparkChartGranularity(timeConfig)}
            timeConfig={getResolvedTimeConfig(timeConfig, result)}
            metrics={item.metrics.calls}
            metric={item.metrics.callsAgg}
            tooltipFormatter={number.compact}
          />
        );
      }
    },
    {
      id: 'latencyAgg',
      label: t('in-applications:labelLatency'),
      getContent(item, { result, timeConfig }) {
        return (
          <SparkChart
            loading={result?.progress?.loading}
            rollup={getSparkChartGranularity(timeConfig)}
            timeConfig={getResolvedTimeConfig(timeConfig, result)}
            metrics={item.metrics.latency}
            metric={item.metrics.latencyAgg}
            tooltipFormatter={meanLatencyFixed.compact}
          />
        );
      }
    },
    {
      id: 'errorsAgg',
      label: t('in-applications:labelErrors'),
      getContent(item, { result, timeConfig }) {
        return (
          <SparkChart
            loading={result?.progress?.loading}
            rollup={getSparkChartGranularity(timeConfig)}
            timeConfig={getResolvedTimeConfig(timeConfig, result)}
            metrics={item.metrics.errors}
            metric={item.metrics.errorsAgg}
            tooltipFormatter={percentage.detailed}
          />
        );
      }
    }
  ];
}

function UnmonitoredEntity() {
  return (
    <Tooltip content={t('in-applications:dashboards.infrastructure.tooltipUnmonitored')}>
      <div className={locals.cell}>
        <PluginIcon className={locals.simplePluginIcon} />
        {t('in-applications:labelUnmonitored')}
      </div>
    </Tooltip>
  );
}

function SubscriptComponentForSnapshot({ plugin, snapshot, time }) {
  const Subscript = useObservable(getTabSubscript, [plugin]);
  if (Subscript) {
    return <Subscript snapshot={snapshot} time={time} />;
  }
  return null;
}

function getTabSubscript([plugin]) {
  const snapshotDefinition = getOptionalSnapshotDefinition(plugin);
  return (
    snapshotDefinition?.supportsInfrastructureTabSubscript &&
    fromPromise(getForgeComponent(`./${plugin}/InfrastructureTabSubscript/InfrastructureTabSubscript`))
  );
}

function KubernetesServiceLink(item) {
  const href = useServiceDashboard(item.physicalContext.cluster.id);
  return <EntityLink icon="lib_kubernetes_service" label={item.physicalContext.cluster.label} href={href} />;
}

function KubernetesPhysicalContextNode({ inEntity, ofEntity, link }) {
  const hrefInEntityDashboard = useNodeDashboard(inEntity?.id) ?? null;
  const hrefOfEntityDashboard = useClusterDashboard(ofEntity?.id) ?? null;

  return (
    <WithKubernetesPhysicalContext
      inEntity={inEntity}
      ofEntity={ofEntity}
      inIcon="lib_kubernetes_node"
      onIcon="lib_kubernetes_cluster"
      hrefInEntityDashboard={hrefInEntityDashboard}
      hrefOfEntityDashboard={hrefOfEntityDashboard}
    >
      {link}
    </WithKubernetesPhysicalContext>
  );
}

function KubernetesPhysicalContextContainer({ inEntity, ofEntity, link }) {
  const hrefInEntityDashboard = usePodDashboard(inEntity?.id) ?? null;
  const hrefOfEntityDashboard = useNamespaceDashboard(ofEntity?.id) ?? null;

  return (
    <WithKubernetesPhysicalContext
      inEntity={inEntity}
      ofEntity={ofEntity}
      inIcon="lib_kubernetes_pod"
      onIcon="lib_kubernetes_namespace"
      hrefInEntityDashboard={hrefInEntityDashboard}
      hrefOfEntityDashboard={hrefOfEntityDashboard}
    >
      {link}
    </WithKubernetesPhysicalContext>
  );
}
