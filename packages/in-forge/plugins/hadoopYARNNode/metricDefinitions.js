/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { number, bytes } from 'in-services/formatters/number';

export default [
  {
    metrics: ['allocatedVCores', 'availableVCores'],
    labels: ['Allocated Virtual Cores', 'Available Virtual Cores'],
    min: 0,
    formatter: number
  },
  {
    metrics: ['allocatedMem', 'availableMem'],
    labels: ['Allocated Memory', 'Available Memory'],
    min: 0,
    formatter: number
  },
  {
    metrics: ['allocatedMem', 'availableMem'],
    labels: ['Allocated Memory', 'Available Memory'],
    min: 0,
    formatter: bytes
  }
];
