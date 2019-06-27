import React, { Fragment } from 'react';
import { compose } from 'recompose';

import {
  getPodDashboard,
  getNamespaceDashboard,
  getClusterDashboard,
  getNodeDashboard
} from 'in-kubernetes/navigation/paths';
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import { shouldStayInCurrentTimeModeForNavigationToSnapshot, getSnapshot } from 'in-stores/snapshot';
import { getSparkChartGranularity, getResolvedTimeConfig } from 'in-applications/metrics';
import { number, meanLatencyFixed, percentage } from 'in-services/formatters/number';
import SparkChart from 'in-components/tables/ServerTable/components/SparkChart';
import getInfrastructure from 'in-subscription/application/getInfrastructure';
import { getDashboardLink } from 'in-stores/navigation/paths/dashboardPaths';
import { getServiceDashboard } from 'in-kubernetes/navigation/paths';
import withUrlDependingState from 'in-hoc/withUrlDependingState';
import EntityLink from 'in-new-components/EntityLink/EntityLink';
import { kubernetesEnabled } from 'in-services/featureFlags';
import { formatDateTime } from 'in-services/formatters/date';
import ButtonGroup from 'in-new-components/ButtonGroup';
import PluginIcon from 'in-components/PluginIcon';
import { plugins } from 'in-forge/constants';
import Tooltip from 'in-components/Tooltip';
import SvgIcon from 'in-components/SvgIcon';
import connectTo from 'in-hoc/connectTo';
import Link from 'in-components/Link';

import locals from './Infrastructure.mless';

const tablesByType = {
  CLUSTER: getTable('CLUSTER'),
  PROCESS: getTable('PROCESS'),
  CONTAINER: getTable('CONTAINER'),
  HOST: getTable('HOST')
};

function getTable(type) {
  return createServerTableWithUrlState({
    paginationResettingUrlParameters: [
      {
        path: '/infrastructure',
        name: `selectedType`
      }
    ],
    columnDefinitions: getColumnDefinitions(type),
    defaultOrderBy: 'callsAgg',
    defaultOrderDirection: 'DESC',
    defaultPageSize: 10,
    pathSegment: '/infrastructure',
    matrixPrefix: ''
  });
}

const InfrastructureEntityLink = connectTo(({ entity }) => ({
  snapshot: entity && entity.id && getSnapshot(entity.id)
}))(function InfrastructureEntityLink({
  entity,
  snapshot,
  plugin,
  inEntity,
  onEntity,
  inIcon,
  onIcon,
  getInEntityDashboard,
  getOnEntityDashboard
}) {
  if (!entity.id) {
    return null;
  }
  const link = (
    <EntityLink
      plugin={plugin}
      snapshot={snapshot}
      label={entity.label || `Unknown at ${formatDateTime(entity.time)}`}
      href$={shouldStayInCurrentTimeModeForNavigationToSnapshot(entity.id).flatMap(
        stay =>
          stay
            ? getDashboardLink(entity.id, { pathname: '/physical/dashboard' })
            : getDashboardLink(entity.id, {
                pathname: '/physical/dashboard',
                to: entity.time,
                focusedMoment: entity.time,
                autoRefresh: false
              })
      )}
    />
  );
  if ((inEntity || onEntity) && kubernetesEnabled) {
    return (
      <div className={locals.linkWithMetaEntities}>
        {link}
        <div className={locals.metaRow}>
          {inEntity && (
            <MetaEntityLink entity={inEntity} icon={inIcon} getDashboard={getInEntityDashboard}>
              in
            </MetaEntityLink>
          )}
          {onEntity && (
            <MetaEntityLink entity={onEntity} icon={onIcon} getDashboard={getOnEntityDashboard}>
              of
            </MetaEntityLink>
          )}
        </div>
      </div>
    );
  }
  return link;
});

export default compose(
  withUrlDependingState({
    getPathSegment: () => '/infrastructure',
    getMatrixPrefix: () => '',
    boundKeys: ['selectedType'],
    getInitialState: () => ({
      selectedType: null
    }),
    reducerName: 'setType',
    reducer: (_, selectedType) => ({ selectedType }),
    replaceHistory: true
  })
)(Infrastructure);

function Infrastructure({ data: entity, applicationId, serviceId, endpointId, timeConfig, selectedType, setType }) {
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

  const Table = tablesByType[selectedType];

  return (
    <Table
      get={getTableData}
      type={selectedType}
      applicationId={applicationId}
      serviceId={serviceId}
      endpointId={endpointId}
      timeConfig={timeConfig}
      size="compact"
      isSearchable={false}
      rightHeader={<ButtonGroup buttonPropsList={buttonPropsList} activeKey={selectedType} />}
    />
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

const clusterTechnologies = ['elasticsearchCluster', 'cassandraCluster', 'couchbaseCluster', 'kubernetesService'];

function isClusterTechnology(technology) {
  return clusterTechnologies.includes(technology);
}

function getTableData({
  query,
  page,
  pageSize,
  orderBy,
  orderDirection,
  applicationId,
  serviceId,
  endpointId,
  timeConfig,
  type
}) {
  return getInfrastructure({
    category: type === 'CONTAINER' ? 'DOCKER' : type,
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
      timeConfig
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
        const kubernetesPhysicalContext = item.kubernetesPhysicalContext || {};
        return item.physicalContext.container ? (
          <InfrastructureEntityLink
            entity={item.physicalContext.container}
            plugin={plugins.docker}
            inEntity={kubernetesPhysicalContext.pod}
            onEntity={kubernetesPhysicalContext.namespace}
            inIcon="lib_kubernetes_pod"
            onIcon="lib_kubernetes_namespace"
            getInEntityDashboard={getPodDashboard}
            getOnEntityDashboard={getNamespaceDashboard}
          />
        ) : (
          <UnmonitoredEntity />
        );
      }
    };
  } else if (type == 'HOST') {
    infraColumnDefinition = {
      id: 'host',
      label: 'Host',
      sortable: false,
      getContent(item) {
        const kubernetesPhysicalContext = item.kubernetesPhysicalContext || {};
        return item.physicalContext.host ? (
          <InfrastructureEntityLink
            entity={item.physicalContext.host}
            plugin={plugins.host}
            inEntity={kubernetesPhysicalContext.node}
            onEntity={kubernetesPhysicalContext.cluster}
            inIcon="lib_kubernetes_node"
            onIcon="lib_kubernetes_cluster"
            getInEntityDashboard={getNodeDashboard}
            getOnEntityDashboard={getClusterDashboard}
          />
        ) : (
          <UnmonitoredEntity />
        );
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
      <SvgIcon className={locals.entitiyIcon} type={icon} width={18} height={18} />
      <Link className={locals.entityLink} href$={getDashboard(entity.id)}>
        {entity.label}
      </Link>
    </Fragment>
  );
}

function UnmonitoredEntity() {
  return (
    <Tooltip content={'Unmonitored infrastructure due to information outside the purview of running agents'}>
      <div className={locals.cell}>
        <PluginIcon className={locals.simplePluginIcon} dimension={18} />
        Unmonitored
      </div>
    </Tooltip>
  );
}
