/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import { TagFilterEntity } from 'in-types';

export const availableCorrelationTags: CorrelationTag[] = [
  {
    label: 'HTTP "Host" header',
    correlationTag: 'call.http.host',
    correlationTagEntity: 'NOT_APPLICABLE'
  },
  {
    label: 'Hostname',
    correlationTag: 'host.name',
    correlationTagEntity: 'DESTINATION'
  },
  {
    label: 'Infrastructure Reference',
    correlationTag: 'call.meta_tags',
    correlationTagEntity: 'NOT_APPLICABLE',
    correlationTagSecondLevelKey: 'destination_infra_reference'
  }
];

export interface CorrelationTag {
  label: string;
  correlationTag: string;
  correlationTagEntity: TagFilterEntity;
  correlationTagSecondLevelKey?: string;
}
