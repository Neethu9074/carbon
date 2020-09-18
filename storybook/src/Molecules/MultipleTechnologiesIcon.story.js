import React from 'react';

import MultipleTechnologiesIcon from 'in-new-components/MultipleTechnologiesIcon';

export default {
  title: 'Molecules/MultipleTechnologiesIcon',
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
