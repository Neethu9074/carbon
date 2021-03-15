/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { omitBy } from 'lodash';

export function NoopComponent() {
  return null;
}

export function getProps(wrapper, { componentType = NoopComponent, omitFunctions = true } = {}) {
  const props = wrapper.find(componentType).props();
  return omitFunctions ? omitBy(props, v => typeof v === 'function') : props;
}
