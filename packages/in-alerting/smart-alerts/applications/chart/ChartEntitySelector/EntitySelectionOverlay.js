/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import ThreeLevelsSelectorOverlay from 'in-alerting/smart-alerts/applications/chart/ChartEntitySelector/ThreeLevelsSelectorOverlay';
import useDisabledBodyScroll from 'in-hooks/useDisabledBodyScroll';

export function EntitySelectionOverlay({
  setEndpointId,
  setEndpointName,
  setServiceId,
  setServiceName,
  setApplicationId,
  isSelectServiceLevel,
  isSelectApLevel,
  ...props
}) {
  useDisabledBodyScroll();

  return (
    <ThreeLevelsSelectorOverlay
      {...props}
      onChange={node => {
        if (node.type === 'ENDPOINT') {
          setEndpointId(node.id);
          setEndpointName(node.label);
          setServiceId(node.serviceId);
          setServiceName(node.serviceName);
          setApplicationId(node.appId);
          props.close();
        }
        if (node.type === 'SERVICE' && isSelectServiceLevel) {
          setServiceId(node.id);
          setServiceName(node.label);
          setApplicationId(node.appId);
          props.close();
        }
        if (node.type === 'APPLICATION' && isSelectApLevel) {
          // only change AP when in AP-only mode
          setApplicationId(node.id);
          props.close();
        }
      }}
    />
  );
}
