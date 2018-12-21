import { withState, compose } from 'recompose';
import { get } from 'lodash';
import React from 'react';

import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import { getSparkChartGranularity, getResolvedTimeConfig } from 'in-applications/metrics';
import SparkChart from 'in-components/tables/ServerTable/components/SparkChart';
import getInfrastructure from 'in-subscription/application/getInfrastructure';
import { getDashboardLink } from 'in-stores/navigation/paths/dashboardPaths';
import { number, ms, percentage } from 'in-services/formatters/number';
import EntityLink from 'in-new-components/EntityLink/EntityLink';
import { formatDateTime } from 'in-services/formatters/date';
import ServerTable from 'in-components/tables/ServerTable';
import ButtonGroup from 'in-new-components/ButtonGroup';
import PluginIcon from 'in-components/PluginIcon';
import { plugins } from 'in-forge/constants';
import Card from 'in-new-components/Card';

import locals from './Infrastructure.mless';

export default compose(
  withState(
    'selectedType',
    'setType',
    ({ data: entity }) => (hasClusterTechnologiesOnly(entity) ? 'CLUSTER' : 'PROCESS')
  )
)(Infrastructure);

function Infrastructure({ data: entity, applicationId, serviceId, endpointId, timeConfig, selectedType, setType }) {
  const buttonPropsList = [];

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
    buttonPropsList.push({ text: 'Container', key: 'DOCKER', onClick: () => setType('DOCKER') });
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
        if (!item.physicalContext.process) {
          return (
            <div className={locals.cell}>
              <PluginIcon className={locals.simplePluginIcon} dimension={18} plugin={plugins.process} />
              {get(item, ['physicalContext', 'process', 'label']) || 'Unknown'}
            </div>
          );
        }
        return <InfrastructureEntityLink entity={item.physicalContext.process} plugin={plugins.process} />;
      }
    };
  } else if (type == 'DOCKER') {
    infraColumnDefinition = {
      id: 'container',
      label: 'Container',
      getContent(item) {
        if (!item.physicalContext.container) {
          return (
            <div className={locals.cell}>
              <PluginIcon className={locals.simplePluginIcon} dimension={18} plugin={plugins.docker} />
              {get(item, ['physicalContext', 'container', 'label']) || 'Unknown'}
            </div>
          );
        }
        return <InfrastructureEntityLink entity={item.physicalContext.container} plugin={plugins.docker} />;
      }
    };
  } else if (type == 'HOST') {
    infraColumnDefinition = {
      id: 'host',
      label: 'Host',
      getContent(item) {
        if (!item.physicalContext.host) {
          return (
            <div className={locals.cell}>
              <PluginIcon className={locals.simplePluginIcon} dimension={18} plugin={plugins.host} />
              {get(item, ['physicalContext', 'host', 'label']) || 'Unknown'}
            </div>
          );
        }
        return <InfrastructureEntityLink entity={item.physicalContext.host} plugin={plugins.host} />;
      }
    };
  } else if (type == 'CLUSTER') {
    infraColumnDefinition = {
      id: 'cluster',
      label: 'Cluster',
      getContent(item) {
        if (!item.physicalContext.cluster) {
          return (
            <div className={locals.cell}>
              <PluginIcon className={locals.simplePluginIcon} dimension={18} plugin={plugins.process} />
              {get(item, ['physicalContext', 'cluster', 'label']) || 'Unknown'}
            </div>
          );
        }
        return (
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
            tooltipFormatter={ms.compact}
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
      href$={getDashboardLink(entity.id, {
        pathname: '/physical/dashboard',
        to: entity.time,
        focusedMoment: null
      })}
    />
  );
}
