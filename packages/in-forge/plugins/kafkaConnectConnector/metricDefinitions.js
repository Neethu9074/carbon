/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { number } from 'in-services/formatters/number';

export default [
  {
    metric: 'connectorDestroyedTaskCount',
    label: 'Destroyed Tasks',
    formatter: number
  },
  {
    metric: 'connectorFailedTaskCount',
    label: 'Failed Tasks',
    formatter: number
  },
  {
    metric: 'connectorPausedTaskCount',
    label: 'Paused Tasks',
    formatter: number
  },
  {
    metric: 'connectorRunningTaskCount',
    label: 'Running Tasks',
    formatter: number
  },
  {
    metric: 'connectorTotalTaskCount',
    label: 'Total Tasks',
    formatter: number
  },
  {
    metric: 'connectorUnassignedTaskCount',
    label: 'Unassigned Tasks',
    formatter: number
  }
];
