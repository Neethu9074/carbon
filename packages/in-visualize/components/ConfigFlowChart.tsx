/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import ELK, { ElkExtendedEdge, ElkNode } from 'elkjs/lib/elk.bundled';
import React, { useState, useEffect } from 'react';
import { path as d3Path } from 'd3-path';
import YAML from 'yaml';

import { Edge } from '@instana/carbon-charts';
import '@instana/carbon-charts/lib/index.css';

import { ZoomableSVG } from 'in-infrastructure/GraphExplorer/ZoomableSVG';
import ProcessorNode from 'in-visualize/components/Nodes/ProcessorNode';
import ReceiverNode from 'in-visualize/components/Nodes/ReceiverNode';
import ExporterNode from 'in-visualize/components/Nodes/ExporterNode';
import PipelineNode from 'in-visualize/components/Nodes/PipelineNode';

export interface PipeNode extends ElkNode {
  id: string;
  height: number;
  width: number;
  nodeType?: string;
  name?: string;
  children?: PipeNode[];
}

export interface PipeEdge extends ElkExtendedEdge {
  id: string;
  sources: string[];
  targets: string[];
}

function Link({ link }: { link: ElkExtendedEdge }) {
  const sections = link.sections![0];
  const path = d3Path();

  path.moveTo(sections.startPoint.x, sections.startPoint.y);

  if (sections.bendPoints) {
    sections.bendPoints.forEach((b: { x: number; y: number }) => {
      path.lineTo(b.x, b.y);
    });
  }

  path.lineTo(sections.endPoint.x, sections.endPoint.y);
  return <Edge path={path.toString()} markerEnd="arrow" variant="dash-sm" />;
}

function parseNodeData(editorValue: any) {
  // TODO: useMemo the editor value
  if (editorValue.config == '') {
    return [];
  }

  const editorValueYaml: OTelConfig = YAML.parse(editorValue.config);
  const pipelines: Pipelines = editorValueYaml.service.pipelines;
  const nodeData: PipeNode[] = [];
  const size = 48;

  Object.entries(pipelines).forEach(([pipelineName, pipeline]) => {
    const pipelineChildren: PipeNode[] = [];
    Object.entries(pipeline).forEach(([type, elements]) => {
      for (const item of elements) {
        pipelineChildren.push({
          id: `${pipelineName}-${type}-${item}`,
          height: size,
          width: size,
          nodeType: type,
          name: item
        });
      }
    });

    const pipelineEdges = calcEdges(pipelineChildren);

    const pipelineNodeData = {
      id: `${pipelineName}`,
      height: size,
      width: size,
      layoutOptions: {
        'elk.padding': '[left=25, top=25, right=25, bottom=25]',
        'spacing.nodeNodeBetweenLayers': '50'
      },
      nodeType: 'pipeline',
      name: pipelineName,
      children: pipelineChildren,
      edges: pipelineEdges
    };
    nodeData.push(pipelineNodeData);
  });
  return nodeData;
}

function calcEdges(pipelineData: PipeNode[]) {
  const edges: PipeEdge[] = [];

  function addEdge(sourceNode: PipeNode, targetNode: PipeNode) {
    edges.push({
      id: `edge-${sourceNode.id}-${targetNode.id}`,
      sources: [sourceNode.id],
      targets: [targetNode.id]
    });
  }

  function calcExporterEdges(exportersNodes: PipeNode[], lastProcessorNode: PipeNode) {
    //connect last processor to each exporter
    //if no exporters, return, calcReceivers will create edges to expoters
    if (!lastProcessorNode) {
      return;
    }

    exportersNodes.forEach(targetNode => {
      addEdge(lastProcessorNode, targetNode);
    });
  }

  function calcProcessorEdges(processorsNodes: PipeNode[]) {
    for (let i = 0; i < processorsNodes.length; i++) {
      const sourceNode = processorsNodes[i];
      const targetNode = processorsNodes[i + 1];
      if (!sourceNode || !targetNode) {
        continue;
      }
      addEdge(sourceNode, targetNode);
    }
  }

  function calcReceiverEdges(receiversNodes: PipeNode[], firstProcessorsNode: PipeNode, exportersNodes: PipeNode[]) {
    //if no processors, create edges from receivers to expoters
    if (!firstProcessorsNode) {
      receiversNodes.forEach(sourceNode => {
        exportersNodes.forEach(targetNode => {
          addEdge(sourceNode, targetNode);
        });
      });
    } else {
      receiversNodes.forEach(sourceNode => {
        addEdge(sourceNode, firstProcessorsNode);
      });
    }
  }

  const receiversNodes = pipelineData.filter(node => node.nodeType == 'receivers');
  const processorsNodes = pipelineData.filter(node => node.nodeType == 'processors');
  const exportersNodes = pipelineData.filter(node => node.nodeType == 'exporters');
  const firstProcessorsNode = processorsNodes[0];
  const lastProcessorsNode = processorsNodes[processorsNodes.length - 1];

  calcExporterEdges(exportersNodes, lastProcessorsNode);
  calcProcessorEdges(processorsNodes);
  calcReceiverEdges(receiversNodes, firstProcessorsNode, exportersNodes);

  return edges;
}

export default function ConfigFlowChart(config: string) {
  const nodeData = parseNodeData(config);
  const edgeData = calcEdges(nodeData);
  const [positions, setPositions] = useState<PipeNode>();

  useEffect(() => {
    const graph = {
      id: 'root',
      layoutOptions: {
        'elk.algorithm': 'layered',
        hierarchyHandling: 'INCLUDE_CHILDREN',
        'elk.padding': '[left=50, top=50, right=50, bottom=50]',
        'spacing.nodeNode': '100',
        'spacing.nodeNodeBetweenLayers': '100'
      },
      children: nodeData,
      edges: edgeData
    };
    new ELK().layout(graph).then((g: ElkNode) => setPositions(g as PipeNode));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config]);

  if (!positions) return null;

  const buildNodes = () => {
    const children = positions.children;
    return children?.map(pipeline => {
      return (
        <>
          <PipelineNode
            key={pipeline.id}
            x={pipeline.x}
            y={pipeline.y}
            height={pipeline.height!}
            width={pipeline.width!}
            name={pipeline.name!}
          />
          {pipeline.children?.map(node => {
            //children node position is calculated relative to the parent, so need to add parent position to determine the final position
            switch (node.nodeType) {
              case 'receivers':
                return (
                  <ReceiverNode key={node.id} x={pipeline.x! + node.x!} y={pipeline.y! + node.y!} name={node.name} />
                );
              case 'processors':
                return (
                  <ProcessorNode key={node.id} x={pipeline.x! + node.x!} y={pipeline.y! + node.y!} name={node.name} />
                );
              case 'exporters':
                return (
                  <ExporterNode key={node.id} x={pipeline.x! + node.x!} y={pipeline.y! + node.y!} name={node.name} />
                );
              default:
                return;
            }
          })}
        </>
      );
    });
  };

  const buildLinks = () => {
    const children = positions.children;
    //children node position is calculated relative to the parent, so need to add parent position to determine the final position
    return children?.map(pipeline => {
      return pipeline.edges?.map(edge => {
        const edgeSections = edge.sections![0];
        edgeSections.startPoint.x += pipeline.x!;
        edgeSections.startPoint.y += pipeline.y!;
        edgeSections.endPoint.x += pipeline.x!;
        edgeSections.endPoint.y += pipeline.y!;

        if (edgeSections.bendPoints) {
          edgeSections.bendPoints.forEach(bend => {
            bend.x += pipeline.x!;
            bend.y += pipeline.y!;
          });
        }
        return <Link key={edge.id} link={edge} />;
      });
    });
  };

  const nodeElements = buildNodes();
  const linkElements = buildLinks();

  const defs = (
    <defs>
      <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5">
        <path d="M 0 0 L 10 5 L 0 10 z" />
      </marker>
    </defs>
  );

  return (
    <ZoomableSVG width="100%" height="1000" defs={defs}>
      {nodeElements}
      {linkElements}
    </ZoomableSVG>
  );
}
