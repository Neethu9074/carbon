/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { siPrefix } from 'in-services/formatters/number';

export default [
  {
    label: 'Nodes',
    metric: 'nodeCount',
    formatter: siPrefix.compact
  }
];
