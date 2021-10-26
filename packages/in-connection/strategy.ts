/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { trySet, tryGet } from 'in-services/localStorage';

export type ConnectionStrategy = 'auto' | 'alwaysWebsockets' | 'alwaysPolling';

const localStorageKey = 'in-connection-strategy';

export const activeStrategy = (tryGet(localStorageKey) as ConnectionStrategy) || 'auto';

export function setStrategy(strategy: ConnectionStrategy) {
  trySet(localStorageKey, strategy);
}
