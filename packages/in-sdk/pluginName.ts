/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { t } from 'in-i18n';

export function getPluginName(plugin?: string, count: number = 1) {
  return plugin && t('in-forge:pluginName', { count, context: plugin });
}
