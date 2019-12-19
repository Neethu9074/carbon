import { bytes, siPrefix } from 'in-services/formatters/number';

export default [
  {
    label: 'Node ID Allocation',
    metric: 'primitiveCount.nodeIds',
    formatter: siPrefix.compact
  },
  {
    label: 'Bytes Read',
    metric: 'pageCache.bytesRead',
    formatter: bytes.compact
  }
];
