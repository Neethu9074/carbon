/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { millis, number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:plugins.mongoDbReplicaSet.returnedDocuments'),
    metric: 'documents.returned',
    formatter: number.compact
  },
  {
    label: t('in-forge:plugins.mongoDbReplicaSet.replicationLag'),
    metric: 'repl.replication_lag',
    formatter: millis.compact
  }
];
