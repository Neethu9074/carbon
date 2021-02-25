/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';

export function getPluginName(plugin, count) {
  return t('in-forge:pluginName', { count, context: plugin });
}
