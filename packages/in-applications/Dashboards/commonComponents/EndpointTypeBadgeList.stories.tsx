/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import EndpointTypeBadgeList from 'in-applications/Dashboards/commonComponents/EndpointTypeBadgeList';
import { colorTranslation } from 'in-applications/endpointTypes';

export default {
  component: EndpointTypeBadgeList
};

export const All = () => {
  const endpointTypes = Object.keys(colorTranslation);
  return <EndpointTypeBadgeList type={endpointTypes[0]} types={endpointTypes} />;
};
