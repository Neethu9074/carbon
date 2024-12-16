/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import agentMonitoringIssueDefinitions from 'in-forge/plugins/jvmRuntimePlatform/agentMonitoringIssueDefinitions';
import metricDefinitions from 'in-forge/plugins/jvmRuntimePlatform/metricDefinitions';
import { joinExpressions } from 'in-components/QueryBuilder/transformation/formModel';
import tableDefinition from 'in-forge/plugins/jvmRuntimePlatform/tableDefinition';
import kpiDefinitions from 'in-forge/plugins/jvmRuntimePlatform/kpiDefinitions';
import { supportsCodeView, getCodeView } from 'in-forge/codeView/java';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import 'in-forge/plugins/jvmRuntimePlatform/metrics';
import { plugins } from 'in-forge/constants';
import { t } from 'in-i18n';

registerSnapshotDefinition({
  plugin: plugins.jvmRuntimePlatform,

  kpiDefinitions,
  metricDefinitions,
  agentMonitoringIssueDefinitions,
  tableDefinition,
  getCodeView,
  supportsCodeView,
  technologyDescriptor: {
    label: t('in-forge:plugins.jvmRuntimePlatform.jvm')
  },
  relatedInstancesTagFilter: snapshot => {
    const jvmAppName = snapshot.getIn(['data', 'appInfo', 'title']);
    if (jvmAppName) {
      return [
        {
          name: 'jvm.app.name',
          value: jvmAppName,
          operator: 'EQUALS',
          type: 'TAG_FILTER'
        }
      ];
    }
    const processArgs = snapshot.getIn(['data', 'name'])?.split(' ') || [];
    return joinExpressions({
      expressions: processArgs.map(arg => ({
        name: 'process.args',
        value: arg,
        operator: 'EQUALS',
        type: 'TAG_FILTER'
      }))
    });
  }
});
