/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import { useIbmzZhmcDashboard } from 'in-zhmc/navigation/paths';
import EntityLink from 'in-components/EntityLink';

export type ZhmcItem = {
  consoleId: string;
  label: string;
  id: string;
};

const ZhmcLabel = ({ item }: { item: ZhmcItem }) => {
  const getIbmzZmhcDashboard = useIbmzZhmcDashboard();

  return <EntityLink label={item.label} href={getIbmzZmhcDashboard(item.id)} />;
};

export default ZhmcLabel;
