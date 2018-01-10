import { number } from 'in-services/formatters/number';

export default [
  {
    metrics: ['mem.gcCount', 'mem.heapSizeGen0', 'mem.heapSizeGen1', 'mem.heapSizeGen2', 'mem.heapSizeGen3'],
    labels: ['GC Count', 'Generation 0', 'Generation 1', 'Generation 2', 'Generation 3'],
    min: 0,
    category: ['GC'],
    formatter: number
  } /*,
  {
    metrics: ['threads.lck_cql', 'threads.lck_crs'],
    labels: ['Queue-Length', 'Contention-Rate'],
    min: 0,
    formatter: number
  },
  {
    metrics: ['mem.gen1HeapBytes', 'mem.gen2HeapBytes', 'mem.loHeapBytes'],
    labels: ['Generation 1', 'Generation 2', 'Large Objects'],
    min: 0,
    formatter: bytes
  }*/
];
