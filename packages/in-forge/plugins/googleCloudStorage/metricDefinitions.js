/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { number, bytes } from 'in-services/formatters/number';

export default [
  {
    metrics: [
      'api.request_count',
      'storage.object_count',
      'api.request_count2.ReadObject',
      'api.request_count2.WriteObject'
    ],
    labels: ['Request count', 'Objects count'],
    min: 0,
    formatter: number
  },
  {
    metrics: ['storage.total_bytes', 'network.sent_bytes_count', 'network.received_bytes_count'],
    labels: ['Objects size', 'Sent bytes', 'Received bytes'],
    min: 0,
    formatter: bytes.detailed
  }
];
