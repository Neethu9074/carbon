/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { capitalize } from 'in-services/formatters/string';
import { LogItem, LogTag } from 'in-types';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';

type LinkGetter = (tag: LogTag, log: LogItem) => string | null;

export function useGetKubernetesLink(): LinkGetter {
  const { location, createHref } = useNavigation();

  return (tag, log) => {
    const entity = tag.name?.split('.')[1];
    const entityId = log.tags.find(tag => tag.name === `id.kubernetes${capitalize(entity ?? '')}`)?.stringValue;

    if (!entity || !entityId) return null;

    location.pathname = `/kubernetes/${entity};${entity}Id=${entityId}/summary`;

    return createHref(location);
  }
}
