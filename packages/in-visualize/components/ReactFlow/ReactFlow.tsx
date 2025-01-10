/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import ReactFlow, { Background, useEdgesState, useNodesState, useReactFlow, Position, Node } from 'reactflow';
import React, { useEffect } from 'react';
import 'reactflow/dist/style.css';

import PipelineNode from 'in-visualize/components/ReactFlow/Nodes/PipelineNode';

const initialNodes: Node[] = [
  {
    id: 'TracesParent',
    sourcePosition: Position.Right,
    position: { x: 75, y: 20 },
    data: { label: 'Traces' },
    type: 'pipelineNode'
  },
  {
    id: 'MetricsParent',
    sourcePosition: Position.Right,
    position: { x: 75, y: 220 },
    data: { label: 'Metrics' },
    type: 'pipelineNode'
  },
  {
    id: 'LogsParent',
    sourcePosition: Position.Right,
    position: { x: 75, y: 420 },
    data: { label: 'Logs' },
    type: 'pipelineNode'
  },

  {
    id: '1',
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    position: { x: 25, y: 30 },
    data: { label: 'Receiver' },
    parentId: 'TracesParent'
  },
  {
    id: '2',
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    position: { x: 225, y: 30 },
    data: { label: 'Processors' },
    parentId: 'TracesParent'
  },
  {
    id: '3',
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    position: { x: 425, y: 30 },
    data: { label: 'Exporters' },
    parentId: 'TracesParent'
  },

  {
    id: '4',
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    position: { x: 25, y: 30 },
    data: { label: 'Receiver' },
    parentId: 'MetricsParent'
  },
  {
    id: '5',
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    position: { x: 225, y: 30 },
    data: { label: 'Processors' },
    parentId: 'MetricsParent'
  },
  {
    id: '6',
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    position: { x: 425, y: 30 },
    data: { label: 'Exporters' },
    parentId: 'MetricsParent'
  },

  {
    id: '7',
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    position: { x: 25, y: 30 },
    data: { label: 'Receiver' },
    parentId: 'LogsParent'
  },
  {
    id: '8',
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    position: { x: 225, y: 30 },
    data: { label: 'Processors' },
    parentId: 'LogsParent'
  },
  {
    id: '9',
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    position: { x: 425, y: 30 },
    data: { label: 'Exporters' },
    parentId: 'LogsParent'
  }
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e2-3', source: '2', target: '3' },
  { id: 'e4-5', source: '4', target: '5' },
  { id: 'e5-6', source: '5', target: '6' },
  { id: 'e7-8', source: '7', target: '8' },
  { id: 'e8-9', source: '8', target: '9' }
];

const nodeTypes = {
  // processorsNode: ProcessorsNode,
  // receiversNode: ReceiversNode,
  // exportersNode: ExportersNode,
  pipelineNode: PipelineNode
};

export default function Flow() {
  // const { nodes: layoutedNodes, edges: layoutedEdges } = useLayout(initialNodes ?? [], initialEdges);
  const [nodes, setNodes] = useNodesState(initialNodes);
  const [edges, setEdges] = useEdgesState(initialEdges);

  const reactFlowInstance = useReactFlow();

  useEffect(() => {
    reactFlowInstance.fitView();
  }, [reactFlowInstance]);

  useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [reactFlowInstance, setNodes, setEdges]);

  return (
    <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes}>
      <Background />
    </ReactFlow>
  );
}
