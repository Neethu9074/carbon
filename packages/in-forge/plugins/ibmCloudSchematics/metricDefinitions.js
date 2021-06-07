/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['actions_apply_count'],
    labels: [t('in-forge:plugins.ibmCloudSchematics.actionsApplyCount')],
    min: 0,
    formatter: number.compact
  },
  {
    metrics: ['actions_apply_failure'],
    labels: [t('in-forge:plugins.ibmCloudSchematics.actionsApplyFailure')],
    min: 0,
    formatter: number.compact
  },
  {
    metrics: ['actions_apply_success'],
    labels: [t('in-forge:plugins.ibmCloudSchematics.actionsApplySuccess')],
    min: 0,
    formatter: number.compact
  },
  {
    metrics: ['actions_destroy_count'],
    labels: [t('in-forge:plugins.ibmCloudSchematics.actionsDestroyCount')],
    min: 0,
    formatter: number.compact
  },
  {
    metrics: ['actions_destroy_failure'],
    labels: [t('in-forge:plugins.ibmCloudSchematics.actionsDestroyFailure')],
    min: 0,
    formatter: number.compact
  },
  {
    metrics: ['actions_destroy_success'],
    labels: [t('in-forge:plugins.ibmCloudSchematics.actionsDestroySuccess')],
    min: 0,
    formatter: number.compact
  },
  {
    metrics: ['actions_plan_count'],
    labels: [t('in-forge:plugins.ibmCloudSchematics.actionsPlanCount')],
    min: 0,
    formatter: number.compact
  },
  {
    metrics: ['actions_plan_failure'],
    labels: [t('in-forge:plugins.ibmCloudSchematics.actionsPlanFailure')],
    min: 0,
    formatter: number.compact
  },
  {
    metrics: ['actions_plan_success'],
    labels: [t('in-forge:plugins.ibmCloudSchematics.actionsPlanSuccess')],
    min: 0,
    formatter: number.compact
  },
  {
    metrics: ['vulnerabilities'],
    labels: [t('in-forge:plugins.ibmCloudSchematics.vulnerabilities')],
    min: 0,
    formatter: number.compact
  },
  {
    metrics: ['workspaces_active'],
    labels: [t('in-forge:plugins.ibmCloudSchematics.workspacesActive')],
    min: 0,
    formatter: number.compact
  },
  {
    metrics: ['workspaces_count'],
    labels: [t('in-forge:plugins.ibmCloudSchematics.workspacesCount')],
    min: 0,
    formatter: number.compact
  },
  {
    metrics: ['workspaces_deleted'],
    labels: [t('in-forge:plugins.ibmCloudSchematics.workspacesDeleted')],
    min: 0,
    formatter: number.compact
  },
  {
    metrics: ['workspaces_draft'],
    labels: [t('in-forge:plugins.ibmCloudSchematics.workspacesDraft')],
    min: 0,
    formatter: number.compact
  },
  {
    metrics: ['workspaces_inactive'],
    labels: [t('in-forge:plugins.ibmCloudSchematics.workspacesInactive')],
    min: 0,
    formatter: number.compact
  }
];
