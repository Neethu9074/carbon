/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { bytes, number, millis, zeroDecimalPlaces } from 'in-services/formatters/number';

export default [
  {
    metrics: ['generalstats._total.user_connections'],
    labels: ['User Connections'],
    min: 0,
    category: ['Connections &amp; Users'],
    formatter: number
  },
  {
    metrics: [
      'waitstats.PAGEIOLATCH_EX.wait_time_ms',
      'waitstats.PAGEIOLATCH_SH.wait_time_ms',
      'waitstats.ASYNC_NETWORK_IO.wait_time_ms',
      'waitstats.CXPACKET.wait_time_ms',
      'waitstats.WRITELOG.wait_time_ms'
    ],
    labels: ['Page IO-Latch EX', 'Page IO-Latch SH', 'Async Network IO', 'CX-Packet', 'Writelog'],
    min: 0,
    category: ['Wait Times'],
    formatter: millis
  },
  {
    metrics: ['iostats._total.num_of_bytes_read', 'iostats._total.num_of_bytes_written'],
    labels: ['Reads', 'Writes'],
    category: ['Virtual File Reads &amp; Writes'],
    formatter: bytes
  },
  {
    metrics: ['perfcounters.databases._total.write_transactions_sec'],
    labels: ['Write Transactions'],
    category: ['Transactions'],
    formatter: number
  },
  {
    metrics: [
      'perfcounters.sql_errors.user_errors.errors_sec',
      'perfcounters.sql_errors.db_offline_errors.errors_sec',
      'perfcounters.sql_errors.kill_connection_errors.errors_sec'
    ],
    labels: ['User Errors', 'DB Offline Errors', 'Kill Connection Errors'],
    min: 0,
    category: ['Errors'],
    formatter: number
  },
  {
    metrics: ['perfcounters.locks._total.lock_requests_sec'],
    labels: ['Lock Requests'],
    category: ['Locks'],
    formatter: zeroDecimalPlaces
  },
  {
    metrics: ['perfcounters.locks._total.number_of_deadlocks_sec'],
    labels: ['Number of Deadlocks'],
    category: ['Locks'],
    formatter: zeroDecimalPlaces
  }
];
