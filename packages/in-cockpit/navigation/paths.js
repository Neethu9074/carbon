/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';

export const cockpit = '/home';

export function useCockpitLink() {
  const { location, createHref } = useNavigation();

  location.pathname = cockpit;

  return createHref(location);
}
