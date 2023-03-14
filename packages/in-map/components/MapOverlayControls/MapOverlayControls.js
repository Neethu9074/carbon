/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import PhysicalContent from 'in-map/components/MapOverlayControls/components/physicalContent';
import Menu from 'in-map/components/MapOverlayControls/components/Menu';

import locals from 'in-map/components/MapOverlayControls/MapOverlayControls.mless';

export default function MapOverlayControls() {
  return (
    <div
      className={classNames({
        [locals.InMapOverlaycontrols]: true
      })}
    >
      <PhysicalContent />
      <Menu />
    </div>
  );
}
