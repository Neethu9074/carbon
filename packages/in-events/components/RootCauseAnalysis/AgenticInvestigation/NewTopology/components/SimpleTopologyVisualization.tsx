/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

// eslint-disable-next-line no-restricted-imports
import { ProductiveCard } from '@carbon/ibm-products';
// eslint-disable-next-line no-restricted-imports
import { IconButton, Stack } from '@carbon/react';
import { zoom as d3Zoom, ZoomBehavior, zoomIdentity } from 'd3-zoom';
import React, { useEffect, useMemo, useState, useRef } from 'react';
import { ZoomIn, ZoomOut } from '@carbon/icons-react';
import { select as d3Select } from 'd3-selection';
import ELK from 'elkjs/lib/elk.bundled';

import { LoadingSkeleton } from '@instana/components';

import {
  SimpleTopologyVisualizationProps,
  TopologyNode,
  TransformState
} from 'in-events/components/RootCauseAnalysis/AgenticInvestigation/NewTopology/types';
import NewTopologyNode from 'in-events/components/RootCauseAnalysis/AgenticInvestigation/NewTopology/components/NewTopologyNode';
import TopologyEdge from 'in-events/components/RootCauseAnalysis/AgenticInvestigation/NewTopology/components/TopologyEdge';

import locals from 'in-events/components/RootCauseAnalysis/Topology/RootCauseMap.mless';

/**
 * A component for visualizing topology data with nodes and edges
 */
const SimpleTopologyVisualization: React.FC<SimpleTopologyVisualizationProps> = ({
  nodes,
  edges,
  width = '100%',
  height = '500px'
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const zoomRef = useRef<ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  const [positions, setPositions] = useState<TopologyNode | null>(null);
  const [transform, setTransform] = useState<TransformState>({ x: 0, y: 0, k: 1 });

  // Initialize ELK
  const elk = useMemo(() => new ELK(), []);

  // Convert our nodes to ELK nodes
  const elkNodes = useMemo(() => {
    return nodes.map(node => ({
      id: node.id,
      width: 60,
      height: 60,
      originalNode: node
    }));
  }, [nodes]);

  // Convert our edges to ELK edges
  const elkEdges = useMemo(() => {
    return edges.map(edge => ({
      id: `${edge.source}-${edge.target}`,
      sources: [edge.source],
      targets: [edge.target]
    }));
  }, [edges]);

  // Create the graph for ELK layout
  const graph = useMemo(
    () => ({
      id: 'root',
      layoutOptions: {
        'elk.algorithm': 'layered',
        'elk.padding': '[left=50, top=50, right=50, bottom=50]',
        'spacing.nodeNode': '80',
        'spacing.nodeNodeBetweenLayers': '100'
      },
      children: elkNodes,
      edges: elkEdges
    }),
    [elkNodes, elkEdges]
  );

  // Set up zoom behavior
  useEffect(() => {
    if (!svgRef.current) return;

    // Configure zoom behavior - only allow panning with click and drag
    const zoom = d3Zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4]) // Set min/max zoom levels
      .filter(event => {
        // Only allow mousedown/mousemove events (for panning)
        // Disable wheel and dblclick events
        return !event.ctrlKey && !event.button && event.type !== 'wheel' && event.type !== 'dblclick';
      })
      .on('zoom', event => {
        setTransform({
          x: event.transform.x,
          y: event.transform.y,
          k: event.transform.k
        });
      });

    // Apply zoom behavior to the SVG element
    const svg = d3Select<SVGSVGElement, unknown>(svgRef.current);
    svg.call(zoom);

    // Initialize with a slight zoom to ensure the behavior is active
    zoom.transform(svg, zoomIdentity);

    zoomRef.current = zoom;

    return () => {
      // Proper cleanup using the same zoom instance
      if (zoomRef.current) {
        svg.on('.zoom', null);
      }
    };
  }, [positions]); // Re-initialize when positions change

  // Calculate layout with ELK
  useEffect(() => {
    let isMounted = true;

    elk.layout(graph).then(layoutedGraph => {
      if (isMounted) {
        setPositions(layoutedGraph as TopologyNode);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [elk, graph]);

  const handleZoomIn = () => {
    if (svgRef.current && zoomRef.current) {
      const svg = d3Select(svgRef.current);
      zoomRef.current.scaleBy(svg.transition().duration(300), 1.2);
    }
  };

  const handleZoomOut = () => {
    if (svgRef.current && zoomRef.current) {
      const svg = d3Select(svgRef.current);
      zoomRef.current.scaleBy(svg.transition().duration(300), 0.8);
    }
  };

  if (!positions || !positions.children) {
    return <LoadingSkeleton />;
  }

  return (
    <ProductiveCard
      title={
        <Stack className={locals.titleStack} orientation="horizontal" gap={5}>
          <h6 className="c4p--card__title">Topology</h6>
          <Stack orientation="horizontal" gap={3}>
            <IconButton kind="ghost" align="bottom" size="sm" onClick={handleZoomIn} label="Zoom in">
              <ZoomIn />
            </IconButton>
            <IconButton kind="ghost" size="sm" align="bottom" label="Zoom out" onClick={handleZoomOut}>
              <ZoomOut />
            </IconButton>
          </Stack>
        </Stack>
      }
      className={locals.cardWithBorder}
    >
      <div style={{ width, height, overflow: 'hidden' }}>
        <svg ref={svgRef} width={width} height={height} style={{ display: 'block' }}>
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#999" />
            </marker>
          </defs>
          <g transform={`translate(${transform.x},${transform.y})scale(${transform.k})`}>
            {positions.edges?.map(edge => (
              <TopologyEdge key={edge.id} id={edge.id || ''} sections={edge.sections || []} />
            ))}
            {positions.children.map(node => (
              <NewTopologyNode key={node.id} node={node as TopologyNode} />
            ))}
          </g>
        </svg>
      </div>
    </ProductiveCard>
  );
};

export default SimpleTopologyVisualization;
