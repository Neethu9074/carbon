/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import metricDefinitions from 'in-forge/plugins/tomcatApplicationContainer/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/tomcatApplicationContainer/kpiDefinitions';
import { supportsCodeView, getCodeView } from 'in-forge/codeView/java';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.tomcatApplicationContainer,
  pluginName: {
    singular: 'Tomcat',
    plural: 'Tomcats'
  },
  kpiDefinitions,
  metricDefinitions,
  getCodeView,
  supportsCodeView,
  technologyDescriptor: {
    label: 'Tomcat'
  }
});
