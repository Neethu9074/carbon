import { number, bytes } from 'in-services/formatters/number';

export default [
  {
    metrics: ['cpu.load'],
    labels: ['Load'],
    min: 0,
    category: ['CPU'],
    formatter: number
  },
  {
    metrics: ['memory.used'],
    labels: ['Used'],
    min: 0,
    getMax(snapshot) {
      return snapshot.getIn(['data', 'memory.total']);
    },
    category: ['Memory'],
    formatter: bytes
  },
  {
    metrics: ['memory.nativeUsed'],
    labels: ['Native Used'],
    min: 0,
    getMax(snapshot) {
      return snapshot.getIn(['data', 'memory.nativeTotal']);
    },
    category: ['Memory'],
    formatter: bytes
  },
  {
    metrics: ['net.rx', 'net.tx'],
    labels: ['Received', 'Sent'],
    min: 0,
    category: ['Network'],
    formatter: bytes
  },
  {
    metrics: ['sensors.time', 'discovery.time', 'sensors.count', 'discovery.count'],
    labels: ['Sensor time', 'Discovery time', 'Sensor Count', 'Discovery Count'],
    min: 0,
    category: ['Sensors'],
    formatter: number
  }
];
