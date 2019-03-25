import { number, bytes, nanos } from 'in-services/formatters/number';

export default [
  {
    metrics: [
      'metrics.sql.exec.latency-p50',
      'metrics.sql.exec.latency-p75',
      'metrics.sql.exec.latency-p90',
      'metrics.sql.exec.latency-p99',
      'metrics.sql.exec.latency-max'
    ],
    labels: ['Latency 50th', 'Latency 75th', 'Latency 90th', 'Latency 99th', 'Latency Max'],
    min: 0,
    formatter: nanos
  },
  {
    metrics: [
      'metrics.sql.conns',
      'metrics.sql.write.count',
      'ranges.count',
      'ranges.underreplicated.total',
      'ranges.unavailable.total'
    ],
    labels: ['SQL Connections', 'SQL Write Count', 'Total Ranges', 'Underreplicated Ranges', 'Unavailable Ranges'],
    min: 0,
    formatter: number
  },
  {
    metrics: [
      'metrics.sql.select.count',
      'metrics.sql.update.count',
      'metrics.sql.insert.count',
      'metrics.sql.delete.count'
    ],
    labels: ['Selects', 'Updates', 'Inserts', 'Deletes'],
    min: 0,
    formatter: number
  },
  {
    metrics: [
      'metrics.sys.go.allocbytes',
      'metrics.sys.go.totalbytes',
      'metrics.sys.cgo.allocbytes',
      'metrics.sys.cgo.totalbytes'
    ],
    labels: ['Go memory allocated', 'Go memory total', 'CGo memory allocated', 'CGo memory total'],
    min: 0,
    formatter: bytes
  },
  {
    metrics: [
      'metrics.sys.host.disk.read.bytes',
      'metrics.sys.host.disk.write.bytes',
      'metrics.sys.host.net.recv.bytes',
      'metrics.sys.host.net.send.bytes'
    ],
    labels: ['Disk read', 'Disk write', 'Network receive', 'Network send'],
    min: 0,
    formatter: bytes
  },
  {
    metrics: [
      'metrics.sys.host.disk.iopsinprogress',
      'metrics.sys.host.disk.read.count',
      'metrics.sys.host.disk.write.count'
    ],
    labels: ['Disk Iops', 'Disk read count', 'Disk write count'],
    min: 0,
    formatter: number
  }
];
