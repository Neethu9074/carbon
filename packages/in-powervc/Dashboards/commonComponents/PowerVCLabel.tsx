/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { usePowervcRegionDashboard } from 'in-powervc/navigation/paths';
import EntityLink from 'in-components/EntityLink';

export type PowerVcItem = {
  regionId: string;
  label: string;
  id: string;
};

const PowerVCLabel = ({ item }: { item: PowerVcItem }) => {
  const getPowervcRegionDashboard = usePowervcRegionDashboard();

  return <EntityLink label={item.label} href={getPowervcRegionDashboard(item.id)} />;
};

export default PowerVCLabel;
