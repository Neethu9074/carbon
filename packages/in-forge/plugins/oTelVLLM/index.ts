/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { Map } from 'immutable';

// @ts-expect-error Module needs to be translated to TS
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import metricDefinitions from './metricDefinitions';
import kpiDefinitions from './kpiDefinitions';
import { plugins } from 'in-forge/constants';
import { t } from 'in-i18n';

registerSnapshotDefinition({
  plugin: plugins.oTelVLLM,
  kpiDefinitions,
  metricDefinitions,
  getContext({ snapshot }: { snapshot: SnapshotData }) {
    return Map({
      Environment: snapshot.getIn(['data', 'env'])
    });
  },
  getIconType: () => 'ai',
  technologyDescriptor: {
    label: t('in-forge:plugins.oTelVLLM.vllm')
  }
});
