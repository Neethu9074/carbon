/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Observable } from '@instana/observables';
import { useObservable } from '@instana/hooks';

import createObservable from 'in-services/http/observableHttpResult';
import { AgentSnapshotResponse } from 'in-plg/api/AgentSnapshot';
import http from 'in-services/http';

export function getAgentSnapshots(query: string): Observable<AgentSnapshotResponse> {
  return http<AgentSnapshotResponse>({
    method: 'GET',
    maxRetries: 3,
    url: `/api/host-agent?query=${query}`
  }).map(response => response.body);
}

type LambdaLayerVersionData = {
  arn: string;
};

export function useLambdaLayerVersionObservable(
  lambdaLayerVersionApiBaseUrl: string,
  layerName: string,
  fallbackVersion: string,
  awsRegion: string
): string {
  const observable = createObservable<LambdaLayerVersionData>(
    http({
      url: `${lambdaLayerVersionApiBaseUrl}/${layerName}`,
      method: 'GET',
      queryParams: { region: awsRegion },
      maxRetries: 3
    })
  );

  return (
    useObservable(
      observable.map(({ data }) => data?.arn),
      [awsRegion]
    ) ?? `arn:aws:lambda:${awsRegion}:410797082306:layer:${layerName}:${fallbackVersion}`
  );
}
