/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { bytes, number, millis, megaBytes } from 'in-services/formatters/number';

// See https://github.com/tibbe/ekg-core/blob/master/System/Metrics.hs for an explanation of the individual metrics.
export default [
  // Counters:
  {
    metrics: ['rts.gc.bytes_allocated_delta'],
    labels: ['Allocated Bytes per Second'],
    min: 0,
    category: ['GC'],
    formatter: bytes
  },
  {
    metrics: ['rts.gc.num_gcs_delta'],
    labels: ['#GCs per Second'],
    min: 0,
    category: ['GC'],
    formatter: number
  },
  {
    metrics: ['rts.gc.num_bytes_usage_samples_delta', 'rts.gc.cumulative_bytes_used_delta'],
    labels: ['Byte Usage Samples per Second', 'Sum All Byte Usage Sample per Second'],
    min: 0,
    category: ['GC'],
    formatter: number
  },
  {
    metrics: ['rts.gc.bytes_copied_delta'],
    labels: ['#Bytes Copied per Second'],
    min: 0,
    category: ['GC'],
    formatter: bytes
  },
  {
    metrics: ['rts.gc.mutator_cpu_ms_delta', 'rts.gc.mutator_wall_ms_delta'],
    labels: ['Mutator Threads CPU Time per Second', 'Mutator Threads Wall Clock Time per Second'],
    min: 0,
    category: ['GC'],
    formatter: millis
  },
  {
    metrics: ['rts.gc.gc_cpu_ms_delta', 'rts.gc.gc_wall_ms_delta'],
    labels: ['GC CPU Time per Second', 'GC Wall Clock Time per Second'],
    min: 0,
    category: ['GC'],
    formatter: millis
  },
  {
    metrics: ['rts.gc.cpu_ms_delta', 'rts.gc.wall_ms_delta'],
    labels: ['Total CPU Time per Second', 'Total Wall Clock Time per Second'],
    min: 0,
    category: ['CPU'],
    formatter: millis
  },

  // Gauges:
  {
    metrics: ['rts.gc.max_bytes_used'],
    labels: ['Max #Live Bytes'],
    min: 0,
    category: ['GC'],
    formatter: number
  },
  {
    metrics: ['rts.gc.current_bytes_used'],
    labels: ['Current #Live Bytes'],
    min: 0,
    category: ['GC'],
    formatter: number
  },
  {
    metrics: ['rts.gc.current_bytes_slop'],
    labels: ['Current #Bytes Lost to Slop'],
    min: 0,
    category: ['GC'],
    formatter: bytes
  },
  {
    metrics: ['rts.gc.max_bytes_slop'],
    labels: ['Max #Bytes Lost to Slop'],
    min: 0,
    category: ['GC'],
    formatter: bytes
  },
  {
    metrics: ['rts.gc.peak_megabytes_allocated'],
    labels: ['Max MB Allocated'],
    min: 0,
    category: ['GC'],
    formatter: megaBytes
  },
  {
    metrics: ['rts.gc.par_tot_bytes_copied'],
    labels: ['Copied Bytes /wo Mutable Lists'],
    min: 0,
    category: ['GC'],
    formatter: bytes
  },
  {
    metrics: ['rts.gc.par_max_bytes_copied'],
    labels: ['Max Copied Bytes /wo Mutable Lists'],
    min: 0,
    category: ['GC'],
    formatter: bytes
  }
];

export const gaugeMetricNames = [
  'rts.gc.current_bytes_used',
  'rts.gc.max_bytes_used',
  'rts.gc.current_bytes_slop',
  'rts.gc.max_bytes_slop',
  'rts.gc.peak_megabytes_allocated',
  'rts.gc.par_tot_bytes_copied',
  'rts.gc.par_max_bytes_copied'
];
