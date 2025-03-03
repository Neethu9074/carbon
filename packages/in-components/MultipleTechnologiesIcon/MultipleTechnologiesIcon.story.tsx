/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

// @ts-expect-error import MultipleTechnologiesIcon from 'in-components/MultipleTechnologiesIcon';
import MultipleTechnologiesIcon from 'in-components/MultipleTechnologiesIcon';

export default {
  component: MultipleTechnologiesIcon
};

export function Default() {
  return <MultipleTechnologiesIcon technologies={['jvmRuntimePlatform']} />;
}

export function Multiple() {
  return (
    <MultipleTechnologiesIcon technologies={['jvmRuntimePlatform', 'elasticsearchCluster', 'kubernetesService']} />
  );
}
