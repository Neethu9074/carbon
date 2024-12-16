/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { get } from 'lodash';
import React from 'react';

import getKubernetesIconAndLabel from 'in-kubernetes/Dashboards/commonComponents/KubernetesIndicator/utils';
import { KubernetesLabel, KubernetesNamespace, Progress, ResultPrecisionDetails } from 'in-types';
// @ts-expect-error
import EntityWithTypeAndIcon from 'in-components/EntityWithTypeAndIcon';

interface Props {
  result: {
    data: KubernetesNamespace;
    time: number;
    adjustedWindowSize: number;
    resultPrecisionDetails: ResultPrecisionDetails;
    errors: Error[];
    progress: Progress;
    backendTraceId: string;
  };
}

export default function KubernetesIndicator({ result }: Props) {
  const entryBaseName = 'app.kubernetes.io';

  const clusterDistribution = get(result, ['data', 'clusterDistribution'], 'kubernetes');
  const labels = get(result, ['data', 'labels']);

  const managedBy = labels.find(({ key }: KubernetesLabel) => key === `${entryBaseName}/managed-by`)?.value;
  const version = labels.find(({ key }: KubernetesLabel) => key === `${entryBaseName}/version`)?.value;

  const { iconType, entityLabel } = getKubernetesIconAndLabel({
    managedBy,
    version,
    clusterDistribution
  });

  const hasIconTypeAndLabel = iconType && entityLabel;

  if (!hasIconTypeAndLabel) {
    return null;
  }

  return <EntityWithTypeAndIcon iconType={iconType} label={entityLabel} />;
}
