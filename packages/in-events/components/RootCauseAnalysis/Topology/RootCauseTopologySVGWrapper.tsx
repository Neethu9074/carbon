/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

// eslint-disable-next-line no-restricted-imports
import { IconButton, OverflowMenu, OverflowMenuItem, Stack } from '@carbon/react';
// eslint-disable-next-line no-restricted-imports
import { ProductiveCard } from '@carbon/ibm-products';
import React, { useState, useEffect, useRef, ReactNode } from 'react';
import { DataClass, ZoomIn, ZoomOut } from '@carbon/icons-react';
import { ZoomBehavior, zoom as d3Zoom } from 'd3-zoom';
import { select as d3Select } from 'd3-selection';

import locals from 'in-events/components/RootCauseAnalysis/Topology/RootCauseMap.mless';

interface RootCauseTopologySVGWrapperProps {
  defs: ReactNode;
  children: ReactNode;
  width: string;
  height: string;
  algorithm: string;
  setAlgorithm: React.Dispatch<React.SetStateAction<string>>;
  containerId?: string;
}

export function RootCauseTopologySVGWrapper({
  defs,
  children,
  width,
  height,
  setAlgorithm,
  containerId = `rootCauseTopologyContainer-${Math.random().toString(36).substr(2, 9)}`
}: RootCauseTopologySVGWrapperProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const zoomRef = useRef<ZoomBehavior<SVGSVGElement, unknown> | null>(null);
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
    if (svgRef.current) {
      d3Select<SVGSVGElement, unknown>(svgRef.current).call(zoom);
      zoomRef.current = zoom;
    }
    return () => {
      d3Zoom<SVGSVGElement, unknown>().on('zoom', null);
    };
  }, []);

  const handleZoomIn = () => {
    setK(k + 0.15);
  };

  const handleZoomOut = () => {
    setK(k - 0.15);
  };

  return (
    <ProductiveCard
      title={
        <Stack className={locals.titleStack} orientation="horizontal" gap={5}>
          <h6 className="c4p--card__title">Topology</h6>
          <Stack orientation="horizontal" gap={3}>
            <OverflowMenu align="bottom" size="sm" renderIcon={DataClass}>
              <OverflowMenuItem itemText="Layered" onClick={() => setAlgorithm('layered')} />
              <OverflowMenuItem itemText="Tree" onClick={() => setAlgorithm('mrtree')} />
              <OverflowMenuItem itemText="Force" onClick={() => setAlgorithm('force')} />
            </OverflowMenu>
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
      <div id={containerId}>
        <svg
          ref={svgRef}
          width={width}
          height={height}
          style={{ display: 'block', transition: 'transform 1s ease-in-out' }}
        >
          {defs}
          <g transform={`translate(${x},${y})scale(${k})`}>{children}</g>
        </svg>
      </div>
    </ProductiveCard>
  );
}
