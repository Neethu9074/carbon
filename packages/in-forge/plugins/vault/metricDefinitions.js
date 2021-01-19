/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
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
      'Secrets Created Count',
      'Secrets Read Count',
      'Secrets Update Count',
      'Secrets Delete Count',

      'Audit Log Requests Count',
      'Audit Log Requests Failure',
      'Audit Log Responses Count',
      'Audit Log Responses Failure',

      'Leader Failure Lost',
      'Leader Failure Setup Failed',

      'Tokens Lookup Count',
      'Tokens Created Count',

      'Barrier Operations Put Count',
      'Barrier Operations Get Count',
      'Barrier Operations List Count',
      'Barrier Operations Delete Count',

      'Secret Engine Initialization Errors',
      'Secret Engine Close Errors',
      'Secret Engine Create User Errors',
      'Secret Engine Renew User Errors',
      'Secret Engine Revoke User Errors'
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
      'Secrets Creadted Duration',
      'Secrets Read Duration',
      'Secrets Update Duration',
      'Secrets Delete Duration',

      'Audit Log Requests Duration',

      'Audit Log Responses Duration',

      'Tokens Loopup Duration',
      'Tokens Created Duration'
    ],
    min: 0,
    formatter: millis
  }
];
