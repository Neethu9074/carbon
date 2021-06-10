/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { SvgIcon } from '@instana/components';

import { valueMissingPlaceholder } from 'in-components/valueMissingPlaceholder';
import Tooltip from 'in-components/Tooltip';

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
