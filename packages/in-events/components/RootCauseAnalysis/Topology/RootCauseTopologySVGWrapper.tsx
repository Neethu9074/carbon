/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useState, useEffect, useRef, ReactNode } from 'react';
import { ZoomBehavior, zoom as d3Zoom } from 'd3-zoom';
import { select as d3Select } from 'd3-selection';

import {
  CarbonIconButton,
  CarbonOverflowMenu,
  CarbonOverflowMenuItem,
  CarbonTile,
  Stack,
  SvgIcon
} from '@instana/components';

import { t } from 'in-i18n';

import locals from 'in-events/components/RootCauseAnalysis/Topology/RootCauseMap.mless';

interface RootCauseTopologySVGWrapperProps {
  defs: ReactNode;
  children: ReactNode;
  width: string;
  height: string;
  algorithm: string;
  setAlgorithm: React.Dispatch<React.SetStateAction<string>>;
}

export function RootCauseTopologySVGWrapper({
  defs,
  children,
  width,
  height,
  algorithm,
  setAlgorithm
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
    <Stack>
      <CarbonTile>
        <Stack direction="horizontal" distribution="spaceBetween">
          <Stack direction="horizontal">
            <CarbonOverflowMenu
              aria-label="tree-kind"
              align="bottom"
              renderIcon={() => <SvgIcon size="s" type="lib_context_guide_downstream" />}
            >
              <CarbonOverflowMenuItem
                itemText={
                  <div className={locals.menuItemText}>
                    Layered
                    {algorithm === 'layered' && <SvgIcon type="lib_check" size="xs" />}
                  </div>
                }
                onClick={() => setAlgorithm('layered')}
              />
              <CarbonOverflowMenuItem
                itemText={
                  <div className={locals.menuItemText}>
                    Tree
                    {algorithm === 'mrtree' && <SvgIcon type="lib_check" size="xs" />}
                  </div>
                }
                onClick={() => setAlgorithm('mrtree')}
              />
              <CarbonOverflowMenuItem
                itemText={
                  <div className={locals.menuItemText}>
                    Force
                    {algorithm === 'force' && <SvgIcon type="lib_check" size="xs" />}
                  </div>
                }
                onClick={() => setAlgorithm('force')}
              />
            </CarbonOverflowMenu>
          </Stack>
          <Stack direction="horizontal">
            <CarbonIconButton
              label={t('in-applications:applicationMap.tooltipZoomOut')}
              onClick={() => handleZoomOut()}
              align="bottom"
              kind="ghost"
              size="sm"
            >
              <SvgIcon type="lib_actions_zoom_out" color="black" size="s" />
            </CarbonIconButton>
            <CarbonIconButton
              label={t('in-applications:applicationMap.tooltipZoomIn')}
              onClick={() => handleZoomIn()}
              align="bottom"
              kind="ghost"
              size="sm"
            >
              <SvgIcon type="lib_actions_zoom_in" color="black" size="s" />
            </CarbonIconButton>
          </Stack>
        </Stack>
      </CarbonTile>
      <div id="rootCauseTopologyContainer">
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
    </Stack>
  );
}
