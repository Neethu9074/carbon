/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { zeroDecimalPlaces, twoDecimalPlaces, bytesTwoDecimalPlaces, percentage } from 'in-services/formatters/number';

export default [
  {
    metrics: ['allocatedPods', 'cap_pods'],
    labels: ['Allocated Pods', 'Pods Capacity'],
    min: 0,
    formatter: zeroDecimalPlaces
  },
  {
    metrics: ['required_mem', 'limit_mem', 'cap_mem'],
    labels: ['Memory Requests', 'Memory Limits', 'Memory Capacity'],
    min: 0,
    formatter: bytesTwoDecimalPlaces
  },
  {
    metrics: ['required_cpu', 'limit_cpu', 'cap_cpu'],
    labels: ['CPU Requests', 'CPU Limits', 'CPU Capacity'],
    min: 0,
    formatter: twoDecimalPlaces
  },
  {
    metric: 'alloc_pods_percentage',
    label: 'Pods Allocation',
    min: 0,
    formatter: percentage.detailed
  },
  {
    metric: 'required_cpu_percentage',
    label: 'CPU Requests Allocation',
    min: 0,
    formatter: percentage.detailed
  },
  {
    metric: 'limit_cpu_percentage',
    label: 'CPU Limits Allocation',
    min: 0,
    formatter: percentage.detailed
  },
  {
    metric: 'required_mem_percentage',
    label: 'Memory Requests Allocation',
    min: 0,
    formatter: percentage.detailed
  },
  {
    metric: 'limit_mem_percentage',
    label: 'Memory Limits Allocation',
    min: 0,
    formatter: percentage.detailed
  }
];
