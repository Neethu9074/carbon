/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useState, useEffect, useRef, ReactNode } from 'react';
import { ZoomBehavior, zoom as d3Zoom, zoomIdentity } from 'd3-zoom';
import { select as d3Select } from 'd3-selection';

import { CarbonIconButton, CarbonTile, MoreMenu, MoreMenuButton, Stack, SvgIcon } from '@instana/components';

import { Nullish } from 'in-types';
import { t } from 'in-i18n';

interface RootCauseTopologySVGWrapperProps {
  defs: ReactNode;
  children: ReactNode;
  width: string;
  height: string;
  algorithm: string;
  setAlgorithm: React.Dispatch<React.SetStateAction<string>>;
  centerAround?:
    | {
        x: number;
        y: number;
      }
    | Nullish;
}

export function RootCauseTopologySVGWrapper({
  defs,
  children,
  width,
  height,
  algorithm,
  setAlgorithm,
  centerAround
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

  useEffect(() => {
    if (centerAround && centerAround.x && centerAround.y) {
      const widthNum = parseInt(width);
      const heightNum = parseInt(height);
      if (widthNum && heightNum) {
        const translateX = widthNum / 2 - centerAround.x;
        const translateY = heightNum / 2 - centerAround.y;

        const newTransform = zoomIdentity.translate(translateX, translateY).scale(k);
        //@ts-expect-error
        if (zoomRef.current?.transform) d3Select(svgRef.current).call(zoomRef.current?.transform, newTransform);
        setX(translateX);
        setY(translateY);
      }
    } else {
      // reset if unset or when not set at all.
      setX(0);
      setY(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [centerAround, height, width]);

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
            <MoreMenu
              direction="bottom"
              aria-label="tree kind"
              icon="lib_context_guide_downstream"
              kind="subtle"
              size="compact"
            >
              <MoreMenuButton disabled={algorithm === 'layered'} onClick={() => setAlgorithm('layered')}>
                {'Layered'}
              </MoreMenuButton>
              <MoreMenuButton disabled={algorithm === 'mrtree'} onClick={() => setAlgorithm('mrtree')}>
                {'Tree'}
              </MoreMenuButton>
              <MoreMenuButton disabled={algorithm === 'force'} onClick={() => setAlgorithm('force')}>
                {'force'}
              </MoreMenuButton>
            </MoreMenu>
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
      <svg
        ref={svgRef}
        width={width}
        height={height}
        style={{ display: 'block', transition: 'transform 1s ease-in-out' }}
      >
        {defs}
        <g transform={`translate(${x},${y})scale(${k})`}>{children}</g>
      </svg>
    </Stack>
  );
}
