/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { bytes, number } from 'in-services/formatters/number';

export default [
  {
    metrics: ['stats.connCount'],
    labels: ['Connections'],
    min: 0,
    category: ['Connections'],
    formatter: number
  },
  {
    metrics: ['stats.diskRead', 'stats.diskWrite'],
    labels: ['Disk Reads', 'Disk Writes'],
    min: 0,
    category: ['Disk Reads &amp; Writes'],
    formatter: number
  },
  {
    metrics: ['stats.bytesReceived', 'stats.bytesSent'],
    labels: ['Bytes Received', 'Bytes Sent'],
    min: 0,
    category: ['Bytes Received &amp; Sent'],
    formatter: bytes
  },
  {
    metrics: ['stats.threadDeadlocksAvoided', 'stats.threadDeadlocksReported'],
    labels: ['Thread Dead Locks Avoided', 'Thread Dead Locks Reported'],
    min: 0,
    category: ['Thread Dead Locks Avoided &amp; Reported'],
    formatter: number
  },
  {
    metrics: ['databases.connCount'],
    labels: ['Database Connections'],
    min: 0,
    category: ['Connections'],
    formatter: number
  },
  {
    metrics: ['databases.diskRead', 'databases.diskWrite'],
    labels: ['Database Disk Reads', 'Database Disk Writes'],
    min: 0,
    category: ['Database Disk Reads &amp; Writes'],
    formatter: number
  },
  {
    metrics: ['databases.bytesReceived', 'databases.bytesSent'],
    labels: ['Database Bytes Received', 'Database Bytes Sent'],
    min: 0,
    category: ['Database Bytes Received &amp; Sent'],
    formatter: bytes
  }
];
