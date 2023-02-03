/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import { Ul } from '@instana/components';

import ApiResponseListItem from 'in-internal/thisUnit/WsApiTester/ApiResponseListItem';
import NoDataAvailable from 'in-components/Errors/NoDataAvailable';

interface Props {
  responses: ApiTestResponse[];
  initialTimestamp?: number;
}

export interface ApiTestResponse {
  timestamp: number;
  payload: any;
}

export default function ApiResponseList({ responses, initialTimestamp = 0 }: Props) {
  if (!responses.length) {
    return <NoDataAvailable />;
  }

  return (
    <Ul>
      {responses.map((response, i) => (
        <ApiResponseListItem key={`response-${i}`} response={response} initialTimestamp={initialTimestamp} />
      ))}
    </Ul>
  );
}
