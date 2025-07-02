/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { jwtDecode } from 'jwt-decode';

type SolisTokenKeys = {
  instances: Instances[];
};
type Instances = {
  product_id: string;
};

export function getCookieValue(tokenName: string) {
  const regex = new RegExp('(^| )' + tokenName + '=([^;]+)');
  const match = regex.exec(document.cookie);
  return match ? decodeURIComponent(match[2]) : null;
}

export function getSolisToken() {
  return getCookieValue('ibm-solis-session');
}

export function isConcertEnabledFromToken(): boolean {
  const solisSessionToken = getSolisToken();
  if (solisSessionToken != null) {
    const decodedJwt: SolisTokenKeys = jwtDecode(solisSessionToken);
    return (
      Array.isArray(decodedJwt?.instances) && decodedJwt.instances.some(instance => instance.product_id === 'concert')
    );
  }
  return false;
}

export function isTurboEnabled() {
  const solisSessionToken = getSolisToken();
  if (solisSessionToken != null) {
    const decodedJwt: SolisTokenKeys = jwtDecode(solisSessionToken);
    return (
      Array.isArray(decodedJwt?.instances) &&
      decodedJwt.instances.some(instance => instance.product_id === 'turbonomic')
    );
  }
  return false;
}
