/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { number, bytes, millis, percentage } from 'in-services/formatters/number';

export default [
  {
    metric: 'get_records_records',
    label: 'Get Records records',
    category: ['Records'],
    formatter: number
  },
  {
    metric: 'get_records_success',
    label: 'Get Records success',
    category: ['Records'],
    formatter: number
  },
  {
    metric: 'put_records_records',
    label: 'Put Records records',
    category: ['Records'],
    min: 0,
    formatter: number
  },
  {
    metric: 'put_record_bytes',
    label: 'Put Record bytes',
    category: ['Records'],
    min: 0,
    formatter: bytes
  },
  {
    metric: 'put_record_latency',
    label: 'Put Record latency',
    category: ['Records'],
    min: 0,
    formatter: millis
  },
  {
    metric: 'put_record_success',
    label: 'Put Record success',
    category: ['Records'],
    min: 0,
    formatter: percentage
  },
  {
    metric: 'put_records_success',
    label: 'Put Records success',
    category: ['Records'],
    min: 0,
    formatter: number
  },
  {
    metric: 'get_records_age_ms',
    label: 'Get Records age',
    category: ['Records'],
    min: 0,
    formatter: millis
  },
  {
    metric: 'get_records_latency',
    label: 'Get Records Latency',
    category: ['Records'],
    min: 0,
    formatter: millis
  },
  {
    metric: 'get_records_bytes',
    label: 'Get Records traffic',
    category: ['Network'],
    min: 0,
    formatter: bytes
  },
  {
    metric: 'incoming_records',
    label: 'Incoming records',
    category: ['Records'],
    min: 0,
    formatter: number
  },
  {
    metric: 'incoming_bytes',
    label: 'Incoming traffic',
    category: ['Network'],
    min: 0,
    formatter: bytes
  },
  {
    metric: 'put_records_latency',
    label: 'Put Records Latency',
    category: ['Records'],
    min: 0,
    formatter: millis
  },
  {
    metric: 'put_records_bytes',
    label: 'Put Records traffic',
    category: ['Records'],
    min: 0,
    formatter: bytes
  },
  {
    metric: 'read_provisioned_throughput_exceeded',
    label: 'Read Provisioned Throughput Exceeded',
    category: ['Records'],
    min: 0,
    formatter: number
  },
  {
    metric: 'write_provisioned_throughput_exceeded',
    label: 'Write Provisioned Throughput Exceeded',
    category: ['Records'],
    min: 0,
    formatter: number
  }
];
