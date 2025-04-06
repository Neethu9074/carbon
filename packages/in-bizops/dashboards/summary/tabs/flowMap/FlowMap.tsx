/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { ElkExtendedEdge } from 'elkjs/lib/elk.bundled';
import React, { useEffect, useState } from 'react';

import { BusinessActivityItem, Result } from '@instana/types';
import { Observable } from '@instana/observables';
import { useObservable } from '@instana/hooks';

import FlowMapPresenter, { BizOpsElkNode } from 'in-bizops/dashboards/summary/tabs/flowMap/FlowMapPresenter';
import getBusinessFlowMap, { BusinessFlowMap } from 'in-bizops/subscriptions/getBusinessFlowMap';
import getBusinessActivities from 'in-bizops/subscriptions/getBusinessActivities';
import { NOT_APPLICABLE } from 'in-components/QueryBuilder/tagFilter/entities';
import { useLocation } from 'in-stores/navigation/LocationStateProvider';
import { businessProcessDashboard } from 'in-bizops/navigation/paths';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import { bizopsFlowMapLoadMore } from 'in-bizops/tracker';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { t } from 'in-i18n';

export default function BusinessProcessFlowMap() {
  // add title, tabs, etc as required here
  return <FlowMapWrapper />;
}

export interface BizOpsMapData {
  nodes: BizOpsElkNode[];
  edges: ElkExtendedEdge[];
}

export function FlowMapWrapper() {
  // graph-specific state management & top level layout
  const timeConfig = useTimeConfig();
  const location = useLocation();
  // Observable resulting from paginated node
  const [paginateMapObservable, setPaginateMapObservable] = useState<Observable<Result<BusinessFlowMap>>>();
  // nodes and edges to pass into FlowMapPresenter
  const [mapData, setMapData] = useState<BizOpsMapData>();

  const businessProcessName: string =
    getMatrixParameter(location, businessProcessDashboard, 'definitionName') ??
    t('in-bizops:dashboards.summary.pageTitle');
  const businessProcessId: string = getMatrixParameter(location, businessProcessDashboard, 'definitionId') ?? '';

  function addPaginateData(nodeId: string) {
    setPaginateMapObservable(getPaginateObservable(nodeId));
  }

  function getPaginateObservable(nodeId: string) {
    // paginated subscription, run when the user clicks on a paginated node
    const mapDataObservable = getBusinessFlowMap({
      processDefinitionId: businessProcessId,
      nodePagination: {
        originNodeId: nodeId,
        maxNodes: 50
      },
      timeConfig
    });

    bizopsFlowMapLoadMore({
      processName: businessProcessName,
      processId: businessProcessId,
      activityId: nodeId,
      path: location.pathname
    });

    return mapDataObservable;
  }

  interface BizOpsBuildElkGraphProps {
    rawMapData: BusinessFlowMap | undefined;
    newPaginateData: BusinessFlowMap | undefined;
    metricData: BusinessActivityItem[] | undefined;
  }

  function buildElkGraphContent({ rawMapData, newPaginateData, metricData }: BizOpsBuildElkGraphProps) {
    let nodes: BizOpsElkNode[] = [];
    let edges: ElkExtendedEdge[] = [];

    // add paginated data to existing state if it exists
    if (newPaginateData?.graph) {
      [nodes, edges] = createRawNodesEdges(newPaginateData);

      if (mapData) {
        // if there is existing data, combine the edges and nodes
        // avoiding duplicates and updating existing nodes
        [nodes, edges] = combinePaginatedNodesEdges(nodes, edges, mapData);
      }
      // if no paginated data exists, we are on the initial load
      // just create the raw nodes and edges from the map data available
    } else {
      if (rawMapData?.graph) {
        [nodes, edges] = createRawNodesEdges(rawMapData);
      }
    }
    // add the metric data to the completed set of nodes
    if (metricData) nodes = addNodeMetricData(nodes, metricData);
    return { nodes, edges };
  }

  // basic subscription, used at pageload
  const businessFlowMapData = useObservable(
    getBusinessFlowMap({
      processDefinitionId: businessProcessId,
      nodePagination: {
        originNodeId: undefined,
        maxNodes: 50
      },
      timeConfig
    }),
    [timeConfig, businessProcessId]
  );

  // paginated subscription, used when user clicks on a '+' button
  const newPaginateData = useObservable(paginateMapObservable, [paginateMapObservable]);

  // metrics subscription
  const metricData = useObservable(
    getBusinessActivities({
      pagination: {
        page: 1,
        pageSize: 50
      },
      order: {
        by: 'bpm_activity_name',
        direction: 'ASC'
      },
      dataType: 'ACTIVITY',
      metrics: {
        count: {
          aggregation: 'DISTINCT_COUNT',
          metric: 'activities_count',
          granularity: 0
        },
        erroneous_call_count: {
          metric: 'erroneous_call_count',
          aggregation: 'SUM',
          granularity: 0
        },
        latency: {
          metric: 'call_latency',
          aggregation: 'MEAN',
          granularity: 0
        }
      },
      timeConfig,
      tagFilterExpression: {
        logicalOperator: 'AND',
        type: 'EXPRESSION',
        elements: [
          {
            entity: NOT_APPLICABLE,
            name: 'bpm_process_definition_id',
            operator: 'EQUALS',
            value: businessProcessId,
            type: 'TAG_FILTER'
          }
        ]
      }
    }),
    [timeConfig, businessProcessId]
  );

  useEffect(() => {
    setMapData(
      buildElkGraphContent({
        rawMapData: businessFlowMapData?.data,
        newPaginateData: newPaginateData?.data,
        metricData: metricData?.data?.items
      })
    );
    // need to avoid adding buildElkGraphContent to the deps array, as it will cause re-renders
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessFlowMapData, newPaginateData, metricData]);

  return <FlowMapPresenter mapData={mapData} addPaginateData={addPaginateData} timeConfig={timeConfig} />;
}

function createRawNodesEdges(rawMapData: BusinessFlowMap): [BizOpsElkNode[], ElkExtendedEdge[]] {
  let nodes: BizOpsElkNode[];
  let edges: ElkExtendedEdge[];
  const width = 250;
  const height = 100;

  edges = rawMapData.graph.edges.map(edge => {
    return {
      id: edge.id,
      sources: [edge.source],
      targets: [edge.target]
    };
  });

  nodes = rawMapData.graph.nodes.map(node => {
    return {
      id: node.id,
      name: node.id,
      endpointIds: [],
      remainingTargetCount: node.remainingTargetCount,
      metrics: {
        count: [],
        openIssues: [],
        latency: []
      },
      width,
      height
    };
  });

  return [nodes, edges];
}

function addNodeMetricData(nodes: BizOpsElkNode[], metricData: BusinessActivityItem[]): BizOpsElkNode[] {
  return nodes.map(node => {
    // find the corresponding metric item
    const foundIndex = metricData.findIndex(activity => activity.businessActivity?.activityId === node.id);
    if (foundIndex !== -1) {
      let newNode = { ...node };
      newNode.metrics = metricData[foundIndex].metrics;
      newNode.name = metricData[foundIndex].businessActivity?.activityName as string;
      newNode.endpointIds = metricData[foundIndex].businessActivity?.endpointIds ?? [];
      return newNode;
    } else return node;
  });
}

// TODO:  This is under investigation with backend at the moment - uncomment console logs to view data as pagination occurs
function combinePaginatedNodesEdges(
  rawNodes: BizOpsElkNode[],
  rawEdges: ElkExtendedEdge[],
  mapData: BizOpsMapData
): [BizOpsElkNode[], ElkExtendedEdge[]] {
  let nodes: BizOpsElkNode[];
  let edges: ElkExtendedEdge[];

  // combine mapData and the new subscription response
  let newEdges: ElkExtendedEdge[] = [];
  rawEdges.forEach(edge => {
    const findRetVal = mapData.edges.findIndex(dataEdge => dataEdge.id === edge.id);

    if (findRetVal === -1) {
      // if the current edge does not exist in the mapData, add it
      newEdges.push(edge);
    }
  });
  edges = [...mapData.edges, ...newEdges];
  let newNodes: BizOpsElkNode[] = [];
  let editNodes: BizOpsElkNode[] = [];
  rawNodes.forEach(node => {
    const findRetVal = mapData.nodes.findIndex(dataNode => dataNode.id === node.id);

    if (findRetVal === -1) {
      // if the current node does not exist in the mapData, add it
      newNodes.push(node);
    } else {
      editNodes.push(node);
    }
  });
  nodes = [...mapData.nodes, ...newNodes];
  // edit the required nodes that already exist in mapData
  nodes = nodes.map(node => {
    const foundIndex = editNodes.findIndex(editNode => editNode.id === node.id);
    if (foundIndex !== -1) {
      return editNodes[foundIndex];
    } else return node;
  });
  return [nodes, edges];
}
