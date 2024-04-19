/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { get } from 'lodash';

import { useObservable } from '@instana/hooks';
import { just } from '@instana/observables';
import { TimeConfig } from '@instana/types';

import { andQuery, tagEquals } from 'in-kubernetes/Dashboards/commonComponents/LogsChartInteractionWrapper';
import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';
import { getSnapshot } from 'in-stores/snapshot';

const ENTITY_UID_PROPERTY_PATH = {
  pod: 'data.uid',
  cluster: 'data.clusterUuid',
  node: 'data.uid',
  namespace: 'data.uid',
  deployment: 'data.uid',
  statefulSet: 'data.uid',
  daemonSet: 'data.uid',
  service: 'data.uid',
  deploymentConfig: 'data.uid'
};

const ENTITY_UID_TAG = {
  pod: 'kubernetes.pod.uid',
  cluster: 'kubernetes.cluster.uuid',
  node: 'kubernetes.node.uid',
  namespace: 'kubernetes.namespace.uid',
  deployment: 'kubernetes.deployment.uid',
  statefulSet: 'kubernetes.statefulset.uid',
  daemonSet: 'kubernetes.daemonset.uid',
  service: 'kubernetes.service.uid',
  deploymentConfig: 'kubernetes.deploymentconfig.uid'
};

export function useGetK8sEntityUid(
  entityType: keyof typeof ENTITY_UID_PROPERTY_PATH,
  snapshotId: string,
  timeConfig: TimeConfig
): {
  entityUid?: string;
  tagFilterExpression?: FormModelElement[];
} {
  const snapshot = useObservable(snapshotId ? getSnapshot(snapshotId) : just(null), [snapshotId, timeConfig]);

  const entityUid = snapshot ? get(snapshot.toJS(), ENTITY_UID_PROPERTY_PATH[entityType]) : null;
  const tagFilterExpression = entityUid && andQuery(tagEquals(ENTITY_UID_TAG[entityType], entityUid));

  return { entityUid, tagFilterExpression };
}
