import { compose } from 'recompose';
import React from 'react';

import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import { getSparkChartGranularity, getResolvedTimeConfig } from 'in-applications/metrics';
import { shouldStayInCurrentTimeModeForNavigationToSnapshot } from 'in-stores/snapshot';
import SparkChart from 'in-components/tables/ServerTable/components/SparkChart';
import getInfrastructure from 'in-subscription/application/getInfrastructure';
import { getDashboardLink } from 'in-stores/navigation/paths/dashboardPaths';
import { number, meanLatencyFixed, percentage } from 'in-services/formatters/number';
import withUrlDependingState from 'in-hoc/withUrlDependingState';
import EntityLink from 'in-new-components/EntityLink/EntityLink';
import { formatDateTime } from 'in-services/formatters/date';
import ServerTable from 'in-components/tables/ServerTable';
import ButtonGroup from 'in-new-components/ButtonGroup';
import PluginIcon from 'in-components/PluginIcon';
import { plugins } from 'in-forge/constants';
import Tooltip from 'in-components/Tooltip';
import Card from 'in-new-components/Card';

import locals from './Infrastructure.mless';

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

  if (selectedType == null) {
    selectedType = hasClusterTechnologiesOnly(entity) ? 'CLUSTER' : 'PROCESS';
  }

  /*
  TODO: using technologies to detect whether the underlying entity is a cluster is not reliable.

  One service may have the 'kafkaCluster' technology assigned, not because it's a kafka cluster
  but because it's a service that reads or writes from/to to a Kafka topic.

  And application don't have technologies anyway.
  */
  if (hasSomeClusterTechnologies(entity)) {
    buttonPropsList.push({ text: 'Cluster', key: 'CLUSTER', onClick: () => setType('CLUSTER') });
  }

  if (hasSomeNonClusterTechnologies(entity)) {
    buttonPropsList.push({ text: 'Process', key: 'PROCESS', onClick: () => setType('PROCESS') });
    buttonPropsList.push({ text: 'Container', key: 'CONTAINER', onClick: () => setType('CONTAINER') });
    buttonPropsList.push({ text: 'Host', key: 'HOST', onClick: () => setType('HOST') });
  }

  return (
    <MaxWidthFullscreenContainer>
      <Card
        title="Infrastructure"
        header={<ButtonGroup buttonPropsList={buttonPropsList} activeKey={selectedType} />}
        withoutPadding
      >
        <ServerTable
          get={getTableData}
          type={selectedType}
          defaultPageSize={10}
          columnDefinitions={getColumnDefinitions(selectedType)}
          applicationId={applicationId}
          serviceId={serviceId}
          endpointId={endpointId}
          timeConfig={timeConfig}
          paginationResettingProps={{ applicationId, serviceId, endpointId, timeConfig }}
          defaultOrderBy="callsAgg"
          defaultOrderDirection="DESC"
          size="compact"
          isSearchable={false}
        />
      </Card>
    </MaxWidthFullscreenContainer>
  );
}

function hasSomeClusterTechnologies(entity) {
  if (!entity.technologies) {
    return false;
  }

  return entity.technologies.some(function(technology) {
    return isClusterTechnology(technology);
  });
}

function hasSomeNonClusterTechnologies(entity) {
  if (!entity.technologies) {
    return true;
  }

  return entity.technologies.some(function(technology) {
    return !isClusterTechnology(technology);
  });
}

function hasClusterTechnologiesOnly(entity) {
  if (!entity.technologies) {
    return false;
  }
  for (const technology of entity.technologies) {
    if (!isClusterTechnology(technology)) {
      return false;
    }
  }
  return true;
}

const clusterTechnologies = ['elasticsearchCluster', 'cassandraCluster', 'couchbaseCluster'];

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

const getColumnDefinitions = type => {
  let infraColumnDefinition;
  if (type == 'PROCESS') {
    infraColumnDefinition = {
      id: 'process',
      label: 'Process',
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
      getContent(item) {
        return item.physicalContext.container ? (
          <InfrastructureEntityLink entity={item.physicalContext.container} plugin={plugins.docker} />
        ) : (
          <UnmonitoredEntity />
        );
      }
    };
  } else if (type == 'HOST') {
    infraColumnDefinition = {
      id: 'host',
      label: 'Host',
      getContent(item) {
        return item.physicalContext.host ? (
          <InfrastructureEntityLink entity={item.physicalContext.host} plugin={plugins.host} />
        ) : (
          <UnmonitoredEntity />
        );
      }
    };
  } else if (type == 'CLUSTER') {
    infraColumnDefinition = {
      id: 'cluster',
      label: 'Cluster',
      getContent(item) {
        return item.physicalContext.cluster ? (
          <InfrastructureEntityLink
            entity={item.physicalContext.cluster}
            plugin={item.physicalContext.cluster.plugin}
          />
        ) : (
          <UnmonitoredEntity plugin={plugins.process} />
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
};

function InfrastructureEntityLink({ entity, plugin }) {
  if (!entity.id) {
    return null;
  }
  return (
    <EntityLink
      plugin={plugin}
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
}

function UnmonitoredEntity() {
  return (
    <Tooltip content={'Unmonitored infrastructure due to information outside of our running agent'}>
      <div className={locals.cell}>
        <PluginIcon className={locals.simplePluginIcon} dimension={18} />
        Unmonitored
      </div>
    </Tooltip>
  );
}
