/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Observable } from '@instana/observables';

import {
  InferenceResponse,
  SlotsRequest,
  SlotsResponse,
  CreateWidgetResponse,
  FinalConfig
} from 'in-aichat/CustomResponse/WidgetConfigResponse/types';
import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import http, { Response } from 'in-services/http';
import { seconds } from 'in-services/time/time';

export function inferSlots(input: string): Observable<Response<InferenceResponse>> {
  return http<InferenceResponse>({
    method: 'POST',
    url: '/api/custom-dashboard/infer',
    headers: getCsrfHeader(),
    responseType: 'json',
    data: { prompt: input },
    timeout: seconds.toMillis(60),
    maxRetries: 3
  });
}

export function promptSlots(data: SlotsRequest): Observable<SlotsResponse> {
  return http<SlotsResponse>({
    method: 'POST',
    url: '/api/custom-dashboard/slots',
    headers: getCsrfHeader(),
    responseType: 'json',
    data,
    timeout: seconds.toMillis(60),
    maxRetries: 3
  }).map(response => response.body);
}

export function promptGetWidgetJson(finalConfig: FinalConfig): Observable<CreateWidgetResponse> {
  return http<CreateWidgetResponse>({
    method: 'POST',
    url: '/api/custom-dashboard/create-widget',
    headers: getCsrfHeader(),
    responseType: 'json',
    data: { ...finalConfig },
    maxRetries: 3
  }).map(response => response.body);
}
