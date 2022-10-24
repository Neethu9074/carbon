/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

export interface StateManagementProps {
  Sidebar: React.ReactNode;
  Chart: React.ReactNode;
  groupedPaginationRef: {
    current?: Record<string, number>;
  };
  groupLabel: string;
  selectedId: string;
}
