import { fromPromise } from 'reactive-observables';
import React, { Fragment } from 'react';
import { compose } from 'recompose';

import {
  getClusterDashboard,
  getNamespaceDashboard,
  getNodeDashboard,
  getPodDashboard,
  getServiceDashboard
} from 'in-kubernetes/navigation/paths';
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import { getSnapshot, shouldStayInCurrentTimeModeForNavigationToSnapshot } from 'in-stores/snapshot';
import { getResolvedTimeConfig, getSparkChartGranularity } from 'in-applications/metrics';
import withEmptyTableState from 'in-components/tables/ServerTable/WithEmptyTableState';
import { meanLatencyFixed, number, percentage } from 'in-services/formatters/number';
import SparkChart from 'in-components/tables/ServerTable/components/SparkChart';
import getInfrastructure from 'in-applications/subscriptions/getInfrastructure';
import { getDashboardLink } from 'in-stores/navigation/paths/dashboardPaths';
import { getVsphereDatacenterDashboard } from 'in-vsphere/navigation/paths';
import { getApplicationDashboard } from 'in-cloudfoundry/navigation/paths';
import { getOptionalSnapshotDefinition } from 'in-sdk/snapshot/registry';
import { pcfEnabled, vsphereEnabled } from 'in-services/featureFlags';
import { getForgeComponent } from 'in-services/getForgeComponent';
import EntityLink from 'in-new-components/EntityLink/EntityLink';
import { getTimeConfigAtMoment } from 'in-stores/time/config';
import { formatDateTime } from 'in-services/formatters/date';
import ButtonGroup from 'in-new-components/ButtonGroup';
import Footer from 'in-new-components/Footer/Footer';
import useObservable from 'in-hooks/useObservable';
import PluginIcon from 'in-components/PluginIcon';
import withUrlState from 'in-hoc/withUrlState';
import { plugins } from 'in-forge/constants';
import Tooltip from 'in-components/Tooltip';
import SvgIcon from 'in-components/SvgIcon';
import connectTo from 'in-hoc/connectTo';
import Link from 'in-components/Link';

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

const InfrastructureEntityLink = connectTo(({ entity }) => ({
  // load a snapshot to possibly get a more specific entity (process vs. Spring Boot app)
  snapshot: entity && entity.id && entity.time && getSnapshot(entity.id, getTimeConfigAtMoment(entity.time))
}))(function InfrastructureEntityLink({ entity, snapshot, plugin }) {
  if (!entity.id) {
    return null;
  }
  return (
    <EntityLink
      plugin={plugin}
      snapshot={snapshot}
      label={entity.label || `Unknown at ${formatDateTime(entity.time)}`}
      href$={shouldStayInCurrentTimeModeForNavigationToSnapshot(entity.id).flatMap(stay =>
        stay
          ? getDashboardLink(entity.id, { pathname: '/physical/dashboard' })
          : getDashboardLink(entity.id, {
              pathname: '/physical/dashboard',
              to: entity.time,
              focusedMoment: entity.time,
              autoRefresh: false
            })
      )}
      subscriptComponent={<SubscriptComponentForSnapshot plugin={plugin} snapshot={snapshot} time={entity.time} />}
    />
  );
});

function WithKubernetesPhysicalContext({
  children,
  inIcon,
  onIcon,
  inEntity,
  ofEntity,
  getInEntityDashboard,
  getOfEntityDashboard
}) {
  if (inEntity || ofEntity) {
    return (
      <div className={locals.linkWithMetaEntities}>
        {children}
        <div className={locals.metaRow}>
          {inEntity && (
            <MetaEntityLink entity={inEntity} icon={inIcon} getDashboard={getInEntityDashboard}>
              in
            </MetaEntityLink>
          )}
          {ofEntity && (
            <MetaEntityLink entity={ofEntity} icon={onIcon} getDashboard={getOfEntityDashboard}>
              of
            </MetaEntityLink>
          )}
        </div>
      </div>
    );
  }
  return children;
}

function WithCloudfoundryPhysicalContext({ children, application, space, organization, cfInstanceIndex }) {
  return (
    <div className={locals.linkWithMetaEntities}>
      {children}
      <div className={locals.metaRow}>
        {application && (
          <MetaEntityLink
            entity={application}
            icon="lib_cloudfoundry_application"
            getDashboard={pcfEnabled && getApplicationDashboard}
          >
            instance {cfInstanceIndex} of
          </MetaEntityLink>
        )}
        {space && (
          <MetaEntityLink entity={space} icon="lib_cloudfoundry_space">
            in
          </MetaEntityLink>
        )}
        {organization && (
          <MetaEntityLink entity={organization} icon="lib_cloudfoundry_organization">
            of
          </MetaEntityLink>
        )}
      </div>
    </div>
  );
}

function WithVSpherePhysicalContext({ children, datacenter }) {
  return (
    <div className={locals.linkWithMetaEntities}>
      {children}
      <div className={locals.metaRow}>
        {datacenter && (
          <MetaEntityLink
            entity={datacenter}
            icon="lib_vsphere"
            getDashboard={vsphereEnabled && getVsphereDatacenterDashboard}
          >
            instance of
          </MetaEntityLink>
        )}
      </div>
    </div>
  );
}

export default compose(
  withUrlState({
    bind: [selectedTypeUrlParameter],
    reducerName: 'setType',
    reducer: (_, selectedType) => ({ selectedType }),
    replaceHistory: true
  })
)(Infrastructure);

function Infrastructure({
  data: entity,
  applicationId,
  serviceId,
  endpointId,
  timeConfig,
  selectedType,
  setType,
  boundaryScope: urlBoundaryScope,
  data: application
}) {
  if (!entity) {
    return null;
  }

  const boundaryScope = urlBoundaryScope || application.boundaryScope;
  const buttonPropsList = [];

  // in the application infra view, show all tabs, because we do not know the type of all entities
  if (entity.entityType == 'APPLICATION') {
    selectedType = selectedType || 'PROCESS';
    buttonPropsList.push({ text: 'Cluster', key: 'CLUSTER', onClick: () => setType('CLUSTER') });
    buttonPropsList.push({ text: 'Process', key: 'PROCESS', onClick: () => setType('PROCESS') });
    buttonPropsList.push({ text: 'Container', key: 'CONTAINER', onClick: () => setType('CONTAINER') });
    buttonPropsList.push({ text: 'Host', key: 'HOST', onClick: () => setType('HOST') });

    // TODO: using technologies to detect whether the underlying entity is a cluster is not reliable.
    // One service may have the 'kafkaCluster' technology assigned, not because it's a kafka cluster
    // but because it's a service that reads or writes from/to to a Kafka topic.
  } else if (hasSomeClusterTechnologies(entity)) {
    selectedType = selectedType || 'CLUSTER';
    buttonPropsList.push({ text: 'Cluster', key: 'CLUSTER', onClick: () => setType('CLUSTER') });

    if (!isDatabase(entity) && hasSomeNonClusterTechnologies(entity)) {
      buttonPropsList.push({ text: 'Process', key: 'PROCESS', onClick: () => setType('PROCESS') });
      buttonPropsList.push({ text: 'Container', key: 'CONTAINER', onClick: () => setType('CONTAINER') });
      buttonPropsList.push({ text: 'Host', key: 'HOST', onClick: () => setType('HOST') });
    }
  } else if (hasSomeNonClusterTechnologies(entity)) {
    selectedType = selectedType || 'PROCESS';
    buttonPropsList.push({ text: 'Process', key: 'PROCESS', onClick: () => setType('PROCESS') });
    buttonPropsList.push({ text: 'Container', key: 'CONTAINER', onClick: () => setType('CONTAINER') });
    buttonPropsList.push({ text: 'Host', key: 'HOST', onClick: () => setType('HOST') });
  } else {
    selectedType = selectedType || 'HOST';
    buttonPropsList.push({ text: 'Host', key: 'HOST', onClick: () => setType('HOST') });
  }

  const rightHeader = <ButtonGroup buttonPropsList={buttonPropsList} activeKey={selectedType} />;
  const Table = tablesByType[selectedType];

  return (
    <Fragment>
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
        cardTitle="Infrastructure"
      />
      <Footer />
    </Fragment>
  );
}

function isDatabase(entity) {
  // endpoints only have .type, not .types
  if (!entity.types) {
    return entity.type == 'DATABASE';
  }

  for (const type of entity.types) {
    if (type == 'DATABASE') {
      return true;
    }
  }
  return false;
}

function hasSomeClusterTechnologies(entity) {
  if (!entity || !entity.technologies) {
    return false;
  }

  return entity.technologies.some(function(technology) {
    return isClusterTechnology(technology);
  });
}

function hasSomeNonClusterTechnologies(entity) {
  if (!entity || !entity.technologies) {
    return true;
  }

  return entity.technologies.some(function(technology) {
    return !isClusterTechnology(technology);
  });
}

const clusterTechnologies = [
  'elasticsearchCluster',
  'cassandraCluster',
  'couchbaseCluster',
  'kubernetesService',
  'redisCluster'
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
      label: 'Process',
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
      label: 'Container',
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
            <WithKubernetesPhysicalContext
              inEntity={item.physicalContext.kubernetes.pod}
              ofEntity={item.physicalContext.kubernetes.namespace}
              inIcon="lib_kubernetes_pod"
              onIcon="lib_kubernetes_namespace"
              getInEntityDashboard={getPodDashboard}
              getOfEntityDashboard={getNamespaceDashboard}
            >
              {link}
            </WithKubernetesPhysicalContext>
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

        return link;
      }
    };
  } else if (type == 'HOST') {
    infraColumnDefinition = {
      id: 'host',
      label: 'Host',
      sortable: false,
      getContent(item) {
        const link = item.physicalContext.host ? (
          <InfrastructureEntityLink entity={item.physicalContext.host} plugin={plugins.host} />
        ) : (
          <UnmonitoredEntity />
        );

        if (item.physicalContext.kubernetes) {
          return (
            <WithKubernetesPhysicalContext
              inEntity={item.physicalContext.kubernetes.node}
              ofEntity={item.physicalContext.kubernetes.cluster}
              inIcon="lib_kubernetes_node"
              onIcon="lib_kubernetes_cluster"
              getInEntityDashboard={getNodeDashboard}
              getOfEntityDashboard={getClusterDashboard}
            >
              {link}
            </WithKubernetesPhysicalContext>
          );
        }

        return link;
      }
    };
  } else if (type == 'CLUSTER') {
    infraColumnDefinition = {
      id: 'cluster',
      label: 'Cluster',
      sortable: false,
      getContent(item) {
        if (!item.physicalContext.cluster) {
          return <UnmonitoredEntity plugin={plugins.process} />;
        }

        return 'kubernetesService' == item.physicalContext.cluster.plugin ? (
          <EntityLink
            icon="lib_kubernetes_service"
            label={item.physicalContext.cluster.label}
            href$={getServiceDashboard(item.physicalContext.cluster.id)}
          />
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
      label: 'Calls',
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
      label: 'Latency',
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
      label: 'Errors',
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

function MetaEntityLink({ icon, getDashboard, entity, children }) {
  return (
    <Fragment>
      {children}
      <SvgIcon className={locals.entitiyIcon} type={icon} />
      <Link className={locals.entityLink} href$={getDashboard ? getDashboard(entity.id) : null}>
        {entity.label}
      </Link>
    </Fragment>
  );
}

function UnmonitoredEntity() {
  return (
    <Tooltip content={'Unmonitored infrastructure due to information outside the purview of running agents'}>
      <div className={locals.cell}>
        <PluginIcon className={locals.simplePluginIcon} />
        Unmonitored
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
    fromPromise(getForgeComponent(`./${plugin}/InfrastructureTabSubscript/InfrastructureTabSubscript.js`))
  );
}
