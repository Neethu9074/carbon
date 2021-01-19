/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { number, bytes, millis } from 'in-services/formatters/number';

export default [
  {
    metrics: [
      'all_requests',
      'get_requests',
      'put_requests',
      'delete_requests',
      'head_requests',
      'post_requests',
      'list_requests'
    ],
    labels: [
      'All Requests',
      'Get Requests',
      'Put Requests',
      'Delete Requests',
      'Head Requests',
      'Post Requests',
      'List Requests'
    ],
    min: 0,
    formatter: number
  },
  {
    metrics: ['bytes_downloaded', 'bytes_uploaded'],
    labels: ['Downloaded', 'Uploaded'],
    min: 0,
    formatter: bytes
  },
  {
    metrics: ['4xx_errors', '5xx_errors'],
    labels: ['Client HTTP 4xx', 'Server HTTP 5xx'],
    min: 0,
    formatter: number
  },
  {
    metrics: ['first_byte_latency', 'total_request_latency'],
    labels: ['First Byte Latency', 'Total Request Latency'],
    min: 0,
    formatter: millis
  }
];
