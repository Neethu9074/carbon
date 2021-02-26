/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';

import { bytes } from 'in-services/formatters/number';

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
