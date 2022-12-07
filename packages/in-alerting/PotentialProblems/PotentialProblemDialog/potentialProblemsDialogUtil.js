/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

export function getType({ applicationLabel, serviceLabel, endpointLabel }) {
  if (endpointLabel) return 'endpoint';
  if (serviceLabel) return 'service';
  if (applicationLabel) return 'application';
}
