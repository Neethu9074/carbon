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

type K8sEntityType =
  | 'kubernetes.pod'
  | 'kubernetes.cluster'
  | 'kubernetes.node'
  | 'kubernetes.namespace'
  | 'kubernetes.deployment'
  | 'kubernetes.statefulSet'
  | 'kubernetes.daemonSet'
  | 'kubernetes.service'
  | 'kubernetes.persistentVolume'
  | 'openshift.deploymentConfig';

export function useGetK8sEntityUid(
  entityType: K8sEntityType,
  snapshotId: string,
  timeConfig: TimeConfig
): {
  entityUid?: string;
  tagFilterExpression?: FormModelElement[];
} {
  const snapshot = useObservable(snapshotId ? getSnapshot(snapshotId) : just(null), [snapshotId, timeConfig]);

  const entityPropertyPath = entityType === 'kubernetes.cluster' ? 'data.clusterUuid' : 'data.uid';
  const entityUIDTag =
    entityType === 'kubernetes.cluster' ? `${entityType.toLowerCase()}.uuid` : `${entityType.toLowerCase()}.uid`;
  const entityUid = snapshot ? get(snapshot.toJS(), entityPropertyPath) : null;
  const tagFilterExpression = entityUid && andQuery(tagEquals(entityUIDTag, entityUid));

  return { entityUid, tagFilterExpression };
}
