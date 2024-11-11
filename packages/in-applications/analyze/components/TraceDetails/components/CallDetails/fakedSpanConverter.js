/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { fromJS } from 'immutable';

export default function convert(span, call) {
  if (!span) {
    return null;
  }

  const type = span.name;
  const data = {
    ...span.data,
    process: span.data.process
      ? {
          ...span.data.process,
          serviceId: span.data.process.definitionId ? call?.destination?.service?.id : undefined
        }
      : undefined,
    databaseIntegrations: span.databaseIntegrations
  };
  const fakedSpan = {
    name: type,
    data: data
  };

  return fromJS(fakedSpan);
}
