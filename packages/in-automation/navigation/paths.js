/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { getModifiedUrlStream } from 'in-stores/navigation/navigation';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { view } from 'in-automation/navigation/matrix';

export const automation = '/automation';

export function getLinkToAutomation() {
  return getModifiedUrlStream(params => {
    params.pathname = automation;

    setOrDeleteMatrixKey(params, automation, view, 'plans');
  });
}
