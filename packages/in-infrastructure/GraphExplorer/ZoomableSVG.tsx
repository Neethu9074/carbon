/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useState, useEffect, useRef, ReactNode } from 'react';
import { zoom as d3Zoom, zoomIdentity } from 'd3-zoom';
import { select as d3Select } from 'd3-selection';

import locals from './ZoomableSVG.mless';

interface ZoomableSVGProps {
  defs: ReactNode;
  children: ReactNode;
  width: string;
  height: string;
  defaultScale?: string;
  defaultX?: string;
  defaultY?: string;
}

export function ZoomableSVG({
  defs,
  children,
  width,
  height,
  defaultScale = '1',
  defaultX = '0',
  defaultY = '0'
}: ZoomableSVGProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [k, setK] = useState(defaultScale);
  const [x, setX] = useState(defaultX);
  const [y, setY] = useState(defaultY);
  useEffect(() => {
    const zoom = d3Zoom<SVGSVGElement, unknown>().on('zoom', event => {
      const { x, y, k } = event.transform;
      setK(k);
      setX(x);
      setY(y);
    });

    if (svgRef.current) {
      const svg = d3Select<SVGSVGElement, unknown>(svgRef.current);
      // Initialize with the default transform values
      const initialTransform = zoomIdentity
        .translate(parseFloat(defaultX), parseFloat(defaultY))
        .scale(parseFloat(defaultScale));

      svg.call(zoom).call(zoom.transform, initialTransform);
    }
    return () => {
      d3Zoom<SVGSVGElement, unknown>().on('zoom', null);
    };
  }, [defaultScale, defaultX, defaultY]);

  return (
    <svg ref={svgRef} width={width} height={height} className={locals.svg}>
      {defs}
      <g transform={`translate(${x},${y})scale(${k})`}>{children}</g>
    </svg>
  );
}
