/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { t } from 'in-i18n';

export const allTypes = 'all';
export const allInfrastructureType = {
  plugin: allTypes,
  name: t('in-infrastructure:explore.allInfrastructure'),
  icon: 'lib_infrastructure'
};
export const pluginTag = 'type';
export const defaultAllInfraGroup = {
  groupbyTag: pluginTag,
  // auto-remove if switching away from all infrastructure
  ar: true
};
export const defaultType = allTypes;
export const defaultOrder = {
  by: 'label',
  direction: 'ASC'
};
