/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';
import { t } from 'in-i18n';

registerSnapshotDefinition({
  plugin: plugins.redisEnterpriseShard,
  kpiDefinitions: [],
  metricDefinitions: [],
  technologyDescriptor: {
    label: t('in-forge:plugins.redisEnterpriseShard.redisEnterpriseShard')
  },
  getIconType: () => 'redis'
});
