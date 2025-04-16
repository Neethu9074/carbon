/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { select as d3Select } from 'd3-selection';
import { zoom as d3Zoom } from 'd3-zoom';

import Controls from 'in-bizops/dashboards/summary/tabs/flowMap/Controls';

import local from './Canvas.mless';

interface CanvasProps {
  defs: ReactNode;
  children: ReactNode;
  width: string;
  height: string;
}

export function Canvas({ defs, children, width, height }: CanvasProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [k, setK] = useState(1);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);

  function updateK(k: number) {
    if (svgRef.current) {
      d3Zoom<SVGSVGElement, unknown>().scaleTo(d3Select<SVGSVGElement, unknown>(svgRef.current), k, [x, y]);
      setK(k);
    }
  }

  function resetView() {
    if (svgRef.current) {
      d3Zoom<SVGSVGElement, unknown>().scaleTo(d3Select<SVGSVGElement, unknown>(svgRef.current), 1, [x, y]);
      d3Zoom<SVGSVGElement, unknown>().translateTo(d3Select<SVGSVGElement, unknown>(svgRef.current), 0, 0, [0, 0]);
      setK(1);
      setX(0);
      setY(0);
    }
  }

  function handleZoom(e: any) {
    const { x, y, k } = e.transform;
    setK(k);
    setX(x);
    setY(y);
  }

  useEffect(() => {
    const zoom = d3Zoom<SVGSVGElement, unknown>().on('zoom', handleZoom);
    if (svgRef.current) d3Select<SVGSVGElement, unknown>(svgRef.current).call(zoom);
    return () => {
      d3Zoom<SVGSVGElement, unknown>().on('zoom', null);
    };
  }, []);

  return (
    <div className={local.canvas}>
      <svg ref={svgRef} width={width} height={height} className={local.svg}>
        {defs}
        <g transform={`translate(${x},${y})scale(${k})`}>{children}</g>
      </svg>
      <Controls updateK={updateK} resetView={resetView} k={k} />
    </div>
  );
}
