/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { activityZeroDecimalPlaces, zeroDecimalPlaces } from 'in-services/formatters/number';

export default [
  {
    label: 'Committed Transactions',
    metric: 'totalCommittedTransactions',
    formatter: activityZeroDecimalPlaces
  },
  {
    label: 'Total Active Connections',
    metric: 'total_active_connections',
    formatter: zeroDecimalPlaces
  }
];
