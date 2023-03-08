/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import PhysicalContent from 'in-map/components/MapOverlayControls/components/physicalContent';
import Menu from 'in-map/components/MapOverlayControls/components/Menu';
import { isUsageInfoPopupEnabled } from 'in-services/featureFlags';

import locals from 'in-map/components/MapOverlayControls/MapOverlayControls.mless';

export default function MapOverlayControls() {
  return (
    <div
      className={classNames({
        [locals.InMapOverlaycontrols]: true,
        [locals.InMapOverlaycontrolsWithBanner]: isUsageInfoPopupEnabled,
        [locals.InMapOverlaycontrolsNoBanner]: !isUsageInfoPopupEnabled
      })}
    >
      <PhysicalContent />
      <Menu />
    </div>
  );
}
