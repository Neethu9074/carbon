/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { CarbonIconButton, SvgIcon } from '@instana/components';

import VerticalControlsPresenter from 'in-components/MapControls/VerticalControlsPresenter';

import local from './Controls.mless';

interface ControlsProps {
  updateK: (k: number) => void;
  k: number;
}

export default function Controls({ updateK, k }: ControlsProps) {
  function zoomIn() {
    updateK(k * 1.1);
  }

  function zoomOut() {
    updateK(k / 1.1);
  }

  function zoomReset() {
    updateK(1);
  }

  return (
    <VerticalControlsPresenter position="rightBottom">
      <div className={local.zoomControlsContainer}>
        <CarbonIconButton label="Zoom in" kind="ghost" onClick={zoomIn}>
          <SvgIcon type="lib_actions_zoom_in" size={'xs'} />
        </CarbonIconButton>
        <CarbonIconButton label="Zoom out" kind="ghost" onClick={zoomOut}>
          <SvgIcon type="lib_actions_zoom_out" size={'xs'} />
        </CarbonIconButton>
        <CarbonIconButton label="Zoom reset" kind="ghost" onClick={zoomReset}>
          <SvgIcon type="lib_actions_zoom_fit" size={'xs'} />
        </CarbonIconButton>
      </div>
    </VerticalControlsPresenter>
  );
}
