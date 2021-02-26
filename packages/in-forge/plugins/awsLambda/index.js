/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';

import metricDefinitions from 'in-forge/plugins/awsLambda/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/awsLambda/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

// The legacy AWS Lambda plug-in, replaced by awsLambdaVersion. This plug-in was removed in release 166. We need to keep
// it until the last entity with plugin ID com.instana.forge.hardware.virtual.aws.lambda.AwsLambda has been removed due
// to data retention (that is, it can be deleted approximately November 2020).
//
// !!But: Currently, this (through technologyDescriptor) serves as our way to tell the UI to provide an "AWS Lambda"
// technology filter option. So actually we cannot completely remove it but need to keep at least the
// technologyDescriptor part (or fix the somewhat broken interaction between backend and ui-client with regard to the
// technology tag).
registerSnapshotDefinition({
  plugin: plugins.awsLambda,
  kpiDefinitions,
  metricDefinitions,
  technologyDescriptor: {
    label: t('in-forge:pluginName_awsLambda')
  },

  getLabel(snapshot) {
    return snapshot.getIn(['data', 'name'], '');
  }
});
