/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { number } from 'in-services/formatters/number';

export default [
  {
    metrics: ['messagesSent', 'messagesAvailable'],
    labels: ['Sent/Received', 'Available'],
    min: 0,
    category: ['Messages'],
    formatter: number
  },
  {
    metrics: ['sequenceNumberCurrent', 'sequenceNumberLast'],
    labels: ['Current', 'Last'],
    min: 0,
    category: ['Sequence Number'],
    formatter: number
  },
  {
    metrics: ['buffersSent', 'buffersReceived'],
    labels: ['Sent', 'Received'],
    min: 0,
    category: ['Buffers'],
    formatter: number
  }
];
