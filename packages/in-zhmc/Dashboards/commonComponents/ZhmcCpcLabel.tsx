/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import { ZhmcItem } from 'in-zhmc/Dashboards/commonComponents/ZhmcLabel';
import { useIbmzCpcDashboard } from 'in-zhmc/navigation/paths';
import EntityLink from 'in-components/EntityLink';

const ZhmcCpcLabel = ({ item }: { item: ZhmcItem }) => {
  const consoleId = item.consoleId;
  const getIbmzCpcDashboard = useIbmzCpcDashboard(consoleId);

  return <EntityLink label={item.label} href$={getIbmzCpcDashboard(item.id)} />;
};

export default ZhmcCpcLabel;
