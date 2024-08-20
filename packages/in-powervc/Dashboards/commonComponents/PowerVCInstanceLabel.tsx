/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { PowerVcItem } from 'in-powervc/Dashboards/commonComponents/PowerVCLabel';
import { usePowervcInstanceDashboard } from 'in-powervc/navigation/paths';
import EntityLink from 'in-components/EntityLink';

const PowerVCInstanceLabel = ({ item }: { item: PowerVcItem }) => {
  const regionId = item.regionId;
  const getPowervcInstanceDashboard = usePowervcInstanceDashboard(regionId);

  return <EntityLink label={item.label} href={getPowervcInstanceDashboard(item.id)} />;
};

export default PowerVCInstanceLabel;
