import { number, seconds } from 'in-services/formatters/number';

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
    metrics: ['oldestMessage', 'onQueueMessageTime'],
    labels: ['Oldest Message', 'On Queue Message Time'],
    min: 0,
    category: ['Message Time'],
    formatter: number
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
