/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { siPrefix } from 'in-services/formatters/number';

export default [
  {
    metrics: ['isClusterSafe', 'nodeCount'],
    labels: ['Is Cluster Safe', 'Node Count'],
    min: 0,
    formatter: siPrefix
  }
];
