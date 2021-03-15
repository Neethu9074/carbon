/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { bytes, siPrefix } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:plugins.neo4j.nodeIdAllocation'),
    metric: 'primitiveCount.nodeIds',
    formatter: siPrefix.compact
  },
  {
    label: t('in-forge:plugins.neo4j.bytesRead'),
    metric: 'pageCache.bytesRead',
    formatter: bytes.compact
  }
];
