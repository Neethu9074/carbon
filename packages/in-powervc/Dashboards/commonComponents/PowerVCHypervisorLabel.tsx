/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { PowerVcItem } from 'in-powervc/Dashboards/commonComponents/PowerVCLabel';
import { usePowervcHypervisorDashboard } from 'in-powervc/navigation/paths';
import EntityLink from 'in-components/EntityLink';

const PowerVCHypervisorLabel = ({ item }: { item: PowerVcItem }) => {
  const regionId = item.regionId;
  const getPowervcHypervisorDashboard = usePowervcHypervisorDashboard(regionId);

  return <EntityLink label={item.label} href={getPowervcHypervisorDashboard(item.id)} />;
};

export default PowerVCHypervisorLabel;
