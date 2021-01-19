/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { number, bytes, millis, percentage } from 'in-services/formatters/number';

export default [
  {
    metrics: ['availableReplicas', 'desiredReplicas'],
    labels: ['Available', 'Desired'],
    min: 0,
    formatter: number
  },
  {
    metric: 'availableToDesiredReplicaRatio',
    label: 'Available to Desired Percentage',
    min: 0,
    formatter: percentage
  },
  {
    metrics: ['phase.Pending.count', 'conditions.PodScheduled.False', 'conditions.Ready.False'],
    labels: ['Pending', 'Unscheduled', 'Unready'],
    min: 0,
    formatter: number
  },
  {
    metrics: ['duration'],
    labels: ['Pending phase duration'],
    min: 0,
    formatter: millis
  },
  {
    metrics: ['pods.count'],
    labels: ['Pods'],
    min: 0,
    formatter: number
  },
  {
    metrics: ['pods.required_mem', 'pods.limit_mem'],
    labels: ['Memory Requests', 'Memory Limits'],
    min: 0,
    formatter: bytes
  },
  {
    metrics: ['pods.required_cpu', 'pods.limit_cpu'],
    labels: ['CPU Requests', 'CPU Limits'],
    min: 0,
    formatter: number
  }
];
