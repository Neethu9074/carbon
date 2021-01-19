/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { number } from 'in-services/formatters/number';

export default [
  {
    metric: 'docs_proc',
    label: 'Documents Processed',
    category: ['Documents'],
    min: 0,
    formatter: number
  },

  {
    metric: 'docs_resub',
    label: 'Documents Resubmitted',
    category: ['Documents'],
    min: 0,
    formatter: number
  },
  {
    metric: 'docs_rec',
    label: 'Documents Received',
    category: ['Documents'],
    min: 0,
    formatter: number
  },
  {
    metric: 'docs_sub',
    label: 'Documents Suspended',
    category: ['Documents'],
    min: 0,
    formatter: number
  },
  {
    metric: 'rec_locs',
    label: 'Active Receive Locations',
    category: ['Locations'],
    min: 0,
    formatter: number
  },

  {
    metric: 'send_locs',
    label: 'Active Send Locations',
    category: ['Locations'],
    min: 0,
    formatter: number
  },
  {
    metric: 'rec_threads',
    label: 'Active Receive Threads',
    category: ['Threads'],
    min: 0,
    formatter: number
  },
  {
    metric: 'send_threads',
    label: 'Active Send Threads',
    category: ['Threads'],
    min: 0,
    formatter: number
  },
  {
    metric: 'delay',
    label: 'Message Delivery Delay',
    category: ['Throttling & Delay'],
    min: 0,
    formatter: number
  }
];
