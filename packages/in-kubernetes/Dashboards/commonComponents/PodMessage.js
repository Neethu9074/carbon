/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { valueMissingPlaceholder } from 'in-new-components/valueMissingPlaceholder';
import Tooltip from 'in-components/Tooltip';
import SvgIcon from 'in-components/SvgIcon';

export default function PodMessage({ message }) {
  if (!message) {
    return valueMissingPlaceholder;
  }

  return (
    <Tooltip content={message}>
      <SvgIcon type="lib_kubernetes_annotation" size="l" />
    </Tooltip>
  );
}
