/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { path as d3Path } from 'd3-path';
import React, { FC } from 'react';

interface EdgeSection {
  startPoint: { x: number; y: number };
  endPoint: { x: number; y: number };
  bendPoints?: { x: number; y: number }[];
}

interface TopologyEdgeProps {
  id: string;
  sections: EdgeSection[];
}

/**
 * Component for rendering a single edge in the topology visualization
 */
const TopologyEdge: FC<TopologyEdgeProps> = ({ id, sections }) => {
  if (!sections || sections.length === 0) return null;

  const section = sections[0];
  const path = d3Path();

  path.moveTo(section.startPoint.x, section.startPoint.y);

  if (section.bendPoints) {
    section.bendPoints.forEach(point => {
      path.lineTo(point.x, point.y);
    });
  }

  path.lineTo(section.endPoint.x, section.endPoint.y);

  return <path key={id} d={path.toString()} fill="none" stroke="#999" strokeWidth={1.5} markerEnd="url(#arrow)" />;
};

export default TopologyEdge;
