/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import metricDefinitions from 'in-forge/plugins/phpFpmRuntimePlatform/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/phpFpmRuntimePlatform/kpiDefinitions';
import { supportsCodeView, getCodeView } from 'in-forge/codeView/php';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';
import { t } from 'in-i18n';

registerSnapshotDefinition({
  plugin: plugins.phpFpmRuntimePlatform,

  kpiDefinitions,
  metricDefinitions,
  supportsCodeView,
  getCodeView,
  technologyDescriptor: {
    label: t('in-forge:plugins.phpFpmRuntimePlatform.phpFpm')
  }
});
