/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { bytesTwoDecimalPlaces, zeroDecimalPlaces } from 'in-services/formatters/number';

export default [
  {
    label: 'All Brokers Messages In',
    metric: 'broker.messagesIn',
    formatter: zeroDecimalPlaces
  },
  {
    label: 'Rejected Traffic',
    metric: 'broker.bytesRejected',
    formatter: bytesTwoDecimalPlaces
  }
];
