/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { number } from 'in-services/formatters/number';

export default [
  {
    metrics: ['connectionCount'],
    labels: ['Connections'],
    min: 0,
    formatter: number
  },
  {
    metrics: ['messagesIn'],
    labels: ['Messages In'],
    min: 0,
    formatter: number
  },
  {
    metrics: ['messagesOut'],
    labels: ['Messages Out'],
    min: 0,
    formatter: number
  },
  {
    metrics: ['uncommittedMessages'],
    labels: ['Uncommitted Messages'],
    min: 0,
    formatter: number
  }
];
