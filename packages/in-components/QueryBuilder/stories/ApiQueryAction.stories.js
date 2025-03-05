/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import PermanentlyVisibleOverlay from 'in-components/overlays/OverlayPresenter/stories/PermanentlyVisibleOverlay';
import ApiQueryOverlay from 'in-components/QueryBuilder/workspace/ApiQueryAction/ApiQueryOverlay';

export default {
  component: ApiQueryOverlay
};

export const Basic = {
  render: () => (
    <PermanentlyVisibleOverlay>
      <ApiQueryOverlay
        backendQueryModel={{
          type: 'TAG_FILTER',
          name: 'application.name',
          operator: 'CONTAINS',
          entity: 'DESTINATION',
          value: 'e'
        }}
        backendQueryModelWithFacets={{
          type: 'TAG_FILTER',
          name: 'application.name',
          operator: 'CONTAINS',
          entity: 'DESTINATION',
          value: 'e'
        }}
      />
    </PermanentlyVisibleOverlay>
  ),

  name: 'Basic'
};

export const WithCurl = {
  render: () => (
    <PermanentlyVisibleOverlay>
      <ApiQueryOverlay
        backendQueryModel={{
          type: 'TAG_FILTER',
          name: 'application.name',
          operator: 'CONTAINS',
          entity: 'DESTINATION',
          value: 'e'
        }}
        backendQueryModelWithFacets={{
          type: 'TAG_FILTER',
          name: 'application.name',
          operator: 'CONTAINS',
          entity: 'DESTINATION',
          value: 'e'
        }}
        docsLink="https://instana.github.io/openapi/#operation/getEntityGroups"
      />
    </PermanentlyVisibleOverlay>
  ),

  name: 'WithCurl'
};

export const WithGroupingAndCurl = {
  render: () => (
    <PermanentlyVisibleOverlay>
      <ApiQueryOverlay
        backendQueryModel={{
          type: 'TAG_FILTER',
          name: 'application.name',
          operator: 'CONTAINS',
          entity: 'DESTINATION',
          value: 'e'
        }}
        backendQueryModelWithFacets={{
          type: 'TAG_FILTER',
          name: 'application.name',
          operator: 'CONTAINS',
          entity: 'DESTINATION',
          value: 'e'
        }}
        groupBy={[
          {
            groupbyTag: 'trace.endpoint.name',
            tagType: 'STRING'
          }
        ]}
        docsLink="https://instana.github.io/openapi/#operation/getEntityGroups"
      />
    </PermanentlyVisibleOverlay>
  ),

  name: 'WithGroupingAndCurl'
};

export const WithHiddenCallsAndGroupingAndCurl = {
  render: () => (
    <PermanentlyVisibleOverlay>
      <ApiQueryOverlay
        backendQueryModel={{
          type: 'TAG_FILTER',
          name: 'application.name',
          operator: 'CONTAINS',
          entity: 'DESTINATION',
          value: 'e'
        }}
        backendQueryModelWithFacets={{
          type: 'TAG_FILTER',
          name: 'application.name',
          operator: 'CONTAINS',
          entity: 'DESTINATION',
          value: 'eFacets'
        }}
        groupBy={[
          {
            groupbyTag: 'trace.endpoint.name',
            tagType: 'STRING'
          }
        ]}
        hiddenCalls={{
          includeSynthetics: 'false',
          includeInternal: 'true'
        }}
        docsLink="https://instana.github.io/openapi/#operation/getEntityGroups"
      />
    </PermanentlyVisibleOverlay>
  ),

  name: 'WithHiddenCallsAndGroupingAndCurl'
};

export const InfrastructureExample = {
  render: () => (
    <PermanentlyVisibleOverlay>
      <ApiQueryOverlay
        backendQueryModel={{
          type: 'EXPRESSION',
          logicalOperator: 'AND',
          elements: []
        }}
        groupBy={['docker.containerName']}
        docsLink="https://instana.github.io/openapi/#operation/getEntityGroups"
        endpointUrl="https://test-instana.pink.instana.rocks/api/infrastructure-monitoring/analyze/entity-groups"
        metrics={[
          {
            metric: 'cpu.total_usage',
            aggregation: 'P25',
            label: 'CPU Total Usage'
          },
          {
            metric: 'memory.usage',
            aggregation: 'MEAN',
            label: 'Memory Usage'
          }
        ]}
        order={{
          by: 'docker.containerName',
          direction: 'ASC'
        }}
        type={'docker'}
      />
    </PermanentlyVisibleOverlay>
  ),

  name: 'InfrastructureExample'
};
