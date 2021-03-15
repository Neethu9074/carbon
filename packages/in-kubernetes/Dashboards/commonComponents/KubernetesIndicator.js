/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { get } from 'lodash';
import React from 'react';

import EntityWithTypeAndIcon from 'in-new-components/EntityWithTypeAndIcon';
import { capitalize } from 'in-services/formatters/string';

export default function KubernetesIndicator({ result }) {
  const clusterDistribution = get(result, ['data', 'clusterDistribution'], 'kubernetes');
  return <EntityWithTypeAndIcon iconType={`lib_${clusterDistribution}`} label={capitalize(clusterDistribution)} />;
}
