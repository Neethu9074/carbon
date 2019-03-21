import React from 'react';

import Tooltip from 'in-components/Tooltip';
import SvgIcon from 'in-components/SvgIcon';

export default function PodMessage({ message }) {
  if (!message) {
    return '-';
  }

  return (
    <Tooltip content={message}>
      <SvgIcon type="lib_kubernetes_annotation" width={32} />
    </Tooltip>
  );
}
