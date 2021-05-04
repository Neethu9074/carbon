/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { fromJS } from 'immutable';

export default function convert(call) {
  if (!call) {
    return null;
  }

  const type = call.name;
  const fakedSpan = {
    name: type,
    data: call.data
  };

  return fromJS(fakedSpan);
}
