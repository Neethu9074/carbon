/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { CarbonIconButton, SvgIcon } from '@instana/components';

import VerticalControlsPresenter from 'in-components/MapControls/VerticalControlsPresenter';
import { t } from 'in-i18n';

import local from './Controls.mless';

interface ControlsProps {
  updateK: (k: number) => void;
  resetView: () => void;
  k: number;
}

export default function Controls({ updateK, resetView, k }: ControlsProps) {
  function zoomIn() {
    updateK(k * 1.1);
  }

  function zoomOut() {
    updateK(k / 1.1);
  }

  function zoomReset() {
    resetView();
  }

  return (
    <VerticalControlsPresenter position="rightBottom">
      <div className={local.zoomControlsContainer}>
        <CarbonIconButton label={t('in-bizops:dashboards.flowMap.zoomIn')} kind="ghost" onClick={zoomIn}>
          <SvgIcon type="lib_actions_zoom_in" size={'xs'} />
        </CarbonIconButton>
        <CarbonIconButton label={t('in-bizops:dashboards.flowMap.zoomOut')} kind="ghost" onClick={zoomOut}>
          <SvgIcon type="lib_actions_zoom_out" size={'xs'} />
        </CarbonIconButton>
        <CarbonIconButton label={t('in-bizops:dashboards.flowMap.zoomReset')} kind="ghost" onClick={zoomReset}>
          <SvgIcon type="lib_actions_zoom_fit" size={'xs'} />
        </CarbonIconButton>
      </div>
    </VerticalControlsPresenter>
  );
}
