/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import metricDefinitions from 'in-forge/plugins/httpd/metricDefinitions';
import { supportsCodeView, getCodeView } from 'in-forge/codeView/php';
import kpiDefinitions from 'in-forge/plugins/httpd/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';
import { t } from 'in-i18n';

registerSnapshotDefinition({
  plugin: plugins.httpd,

  kpiDefinitions,
  metricDefinitions,
  supportsCodeView,
  getCodeView,
  technologyDescriptor: {
    label: t('in-forge:plugins.httpd.httpd')
  }
});
