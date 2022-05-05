/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { forwardRef } from 'react';

import LayoutingLoadingScreen from 'in-applications/ApplicationMap/components/LayoutingLoadingScreen';
import ConnectionTooltip from 'in-applications/ApplicationMap/components/Tooltips/ConnectionTooltip';
import SearchBar from 'in-applications/ApplicationMap/components/SearchBar';
import Controls from 'in-applications/ApplicationMap/components/Controls';
import Nodes from 'in-applications/ApplicationMap/components/Nodes';

import locals from './MapOverlay.mless';

function MapOverlay(props, ref) {
  const { applicationId, serviceLocatorUid, onChangeUrlProperties, result, value, setValue } = props;

  return props.serviceLocatorUid ? (
    <div ref={ref} className={locals.overlay}>
      <Nodes applicationId={applicationId} serviceLocatorUid={serviceLocatorUid} />
      <LayoutingLoadingScreen serviceLocatorUid={serviceLocatorUid} />
      <Controls serviceLocatorUid={serviceLocatorUid} result={result} onChangeUrlProperties={onChangeUrlProperties} />
      <SearchBar serviceLocatorUid={serviceLocatorUid} value={value} setValue={setValue} />
      <ConnectionTooltip serviceLocatorUid={serviceLocatorUid} />
    </div>
  ) : (
    // We have to render this div to make sure the eventListeners for resize observe can attach.
    <div ref={ref} />
  );
}

export default forwardRef(MapOverlay);
