/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { bytes } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:plugins.couchbaseNode.labelUsedMemory'),
    metric: 'node.mem_used',
    formatter: bytes.compact
  },
  {
    label: t('in-forge:plugins.couchbaseNode.labelUsedDisk'),
    metric: 'node.couch_docs_actual_disk_size',
    formatter: bytes.compact
  }
];
