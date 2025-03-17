/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { ElkExtendedEdge } from 'elkjs/lib/elk-api';
import { path as d3Path } from 'd3-path';
import { get } from 'lodash';
import React from 'react';

import { Edge } from '@instana/carbon-charts';

interface TopologyLineProps {
  link: ElkExtendedEdge;
}

const LabelText = ({ text, x, y }: { text: string; x: number; y: number }) => {
  return (
    <text x={x} y={y}>
      {text}
    </text>
  );
};

const TopologyLine = ({ link }: TopologyLineProps) => {
  const path = d3Path();
  if (!link.sections) return null;

  const dashed = get(link, 'dashed', false);

  const sections = link.sections[0];

  path.moveTo(sections.startPoint.x, sections.startPoint.y);

  if (sections.bendPoints) {
    sections.bendPoints.forEach(b => {
      path.lineTo(b.x, b.y);
    });
  }

  path.lineTo(sections.endPoint.x, sections.endPoint.y);

  const label = link.labels?.[0];
  const labelText = label?.text;
  const labelX = label?.x;
  const labelY = label?.y;

  const hasLabel = labelText && labelX && labelY;

  return (
    <>
      <Edge path={path.toString()} markerEnd={!dashed ? 'arrow' : undefined} variant={dashed ? 'dash-md' : ''} />
      {hasLabel && <LabelText text={labelText} x={labelX} y={labelY} />}
    </>
  );
};

export default TopologyLine;
