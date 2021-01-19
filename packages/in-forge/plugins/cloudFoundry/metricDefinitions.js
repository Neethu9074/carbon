/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { siPrefix } from 'in-services/formatters/number';

export default [
  {
    metric: 'nodeCount',
    label: 'Nodes',
    min: 0,
    formatter: siPrefix
  }
];
