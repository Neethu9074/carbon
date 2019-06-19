import { bytes, number } from 'in-services/formatters/number';

export default [
  {
    metrics: ['connCount'],
    labels: ['Connections'],
    min: 0,
    category: ['Connections'],
    formatter: number
  },
  {
    metrics: ['diskRead', 'diskWrite'],
    labels: ['Disk Reads', 'Disk Writes'],
    min: 0,
    category: ['Disk Reads &amp; Writes'],
    formatter: number
  },
  {
    metrics: ['bytesReceived', 'bytesSent'],
    labels: ['Bytes Received', 'Bytes Sent'],
    category: ['Bytes Received &amp; Sent'],
    formatter: bytes
  },
  {
    metrics: ['threadDeadLocksAvoided', 'threadDeadLocksReported'],
    labels: ['Thread Dead Locks Avoided', 'Thread Dead Locks Reported'],
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
    category: ['Database Disk Reads &amp; Writes'],
    formatter: number
  },
  {
    metrics: ['databases.bytesReceived', 'databases.bytesSent'],
    labels: ['Database Bytes Received', 'Database Bytes Sent'],
    category: ['Database Bytes Received &amp; Sent'],
    formatter: bytes
  }
];
