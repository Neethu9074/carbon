/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';

export const welcomePage = '/home';

export function useCockpitLink() {
  const { location, createHref } = useNavigation();

  location.pathname = welcomePage;

  return createHref(location);
}
