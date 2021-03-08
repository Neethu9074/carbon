/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';

import { number, millis } from 'in-services/formatters/number';

export default [
  {
    metrics: [
      'secret.create.count',
      'secret.read.count',
      'secret.update.count',
      'secret.delete.count',

      'audit.logRequest.count',
      'audit.logRequest.failure.count',
      'audit.logResponse.count',
      'audit.logResponse.failure.count',

      'core.leadershipLost.duration',
      'core.leadershipSetupFailed.duration',

      'token.lookup.count',
      'token.create.count',

      'barrier.put.count',
      'barrier.get.count',
      'barrier.list.count',
      'barrier.delete.count',

      'database.initialize.error.count',
      'database.close.error.count',
      'database.createUser.error.count',
      'database.renewUser.error.count',
      'database.revokeUser.error.count'
    ],
    labels: [
      t('in-forge:plugins.vault.labelSecretsCreatedCount'),
      t('in-forge:plugins.vault.labelSecretsReadCount'),
      t('in-forge:plugins.vault.labelSecretsUpdateCount'),
      t('in-forge:plugins.vault.labelSecretsDeleteCount'),

      t('in-forge:plugins.vault.labelAuditLogRequestsCount'),
      t('in-forge:plugins.vault.labelAuditLogRequestsFailure'),
      t('in-forge:plugins.vault.labelAuditLogResponsesCount'),
      t('in-forge:plugins.vault.labelAuditLogResponsesFailure'),

      t('in-forge:plugins.vault.labelLeaderFailureLost'),
      t('in-forge:plugins.vault.labelLeaderFailureSetupFailed'),

      t('in-forge:plugins.vault.labelTokensLookupCount'),
      t('in-forge:plugins.vault.labelTokensCreatedCount'),

      t('in-forge:plugins.vault.labelBarrierOperationsPutCount'),
      t('in-forge:plugins.vault.labelBarrierOperationsGetCount'),
      t('in-forge:plugins.vault.labelBarrierOperationsListCount'),
      t('in-forge:plugins.vault.labelBarrierOperationsDeleteCount'),

      t('in-forge:plugins.vault.labelSecretEngineInitializationErrors'),
      t('in-forge:plugins.vault.labelSecretEngineCloseErrors'),
      t('in-forge:plugins.vault.labelSecretEngineCreateUserErrors'),
      t('in-forge:plugins.vault.labelSecretEngineRenewUserErrors'),
      t('in-forge:plugins.vault.labelSecretEngineRevokeUserErrors')
    ],
    min: 0,
    formatter: number
  },
  {
    metrics: [
      'secret.create.duration',
      'secret.read.duration',
      'secret.update.duration',
      'secret.delete.duration',

      'audit.logRequest.duration',

      'audit.logResponse.duration',

      'token.lookup.duration',
      'token.create.duration'
    ],
    labels: [
      t('in-forge:plugins.vault.labelSecretsCreadtedDuration'),
      t('in-forge:plugins.vault.labelSecretsReadDuration'),
      t('in-forge:plugins.vault.labelSecretsUpdateDuration'),
      t('in-forge:plugins.vault.labelSecretsDeleteDuration'),

      t('in-forge:plugins.vault.labelAuditLogRequestsDuration'),

      t('in-forge:plugins.vault.labelAuditLogResponsesDuration'),

      t('in-forge:plugins.vault.labelTokensLoopupDuration'),
      t('in-forge:plugins.vault.labelTokensCreatedDuration')
    ],
    min: 0,
    formatter: millis
  }
];
