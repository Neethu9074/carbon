/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { number, seconds, micros } from 'in-services/formatters/number';

export default [
  {
    metrics: ['maxQueueDepth', 'queueDepth'],
    labels: ['Max Queue Depth', 'Current Queue Depth'],
    min: 0,
    category: ['Depth'],
    formatter: number
  },
  {
    metrics: ['messagesIn', 'messagesOut', 'uncommittedMessages'],
    labels: ['Messages In', 'Messages Out', 'Uncommitted Messages'],
    min: 0,
    category: ['Messages'],
    formatter: number
  },
  {
    metrics: ['oldestMessage'],
    labels: ['Oldest Message'],
    min: 0,
    category: ['Message Time'],
    formatter: seconds
  },
  {
    metrics: ['onQueueMessageTime'],
    labels: ['On Queue Message Time'],
    min: 0,
    category: ['Message Time'],
    formatter: micros
  },
  {
    metrics: ['lastResetTime'],
    labels: ['Last Reset Time'],
    min: 0,
    category: ['Reset'],
    formatter: seconds
  },
  {
    metrics: ['openInputCount', 'openOutputCount'],
    labels: ['Open Input Count', 'Open Output Count'],
    min: 0,
    category: ['Calls'],
    formatter: number
  }
];
