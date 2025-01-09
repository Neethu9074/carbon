/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useState, useEffect, useRef, ReactNode } from 'react';
import { select as d3Select } from 'd3-selection';
import { zoom as d3Zoom } from 'd3-zoom';

import locals from './ZoomableSVG.mless';

interface ZoomableSVGProps {
  defs: ReactNode;
  children: ReactNode;
  width: string;
  height: string;
}

export function ZoomableSVG({ defs, children, width, height }: ZoomableSVGProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [k, setK] = useState(1);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  useEffect(() => {
    const zoom = d3Zoom<SVGSVGElement, unknown>().on('zoom', event => {
      const { x, y, k } = event.transform;
      setK(k);
      setX(x);
      setY(y);
    });
    if (svgRef.current) d3Select<SVGSVGElement, unknown>(svgRef.current).call(zoom);
    return () => {
      d3Zoom<SVGSVGElement, unknown>().on('zoom', null);
    };
  }, []);
  return (
    <svg ref={svgRef} width={width} height={height} className={locals.svg}>
      {defs}
      <g transform={`translate(${x},${y})scale(${k})`}>{children}</g>
    </svg>
  );
}
