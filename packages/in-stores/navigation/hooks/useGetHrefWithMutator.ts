/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { cloneLocation } from 'in-stores/navigation/routing/clone';
import { LocationMutator } from 'in-stores/navigation/navigation';

type GetHrefWithMutation = (locationMutator: LocationMutator) => string;

/**
 * Drop in replacement for getModifiedUrlStream, takes a location mutator function, provides a clean location and returns a href
 *
 * Multiple hrefs can be created from one hook, see example:
 *
 * Usage:
 *
 * const getHref = useGetHrefWithMutator();
 * ...
 * <Link href={getHref(location => { location.path = '/new path'; })}>
 * <Link href={getHref(location => { location.path = '/second path'; })}>
 */
export default function useGetHrefWithMutator(): GetHrefWithMutation {
  const { location, createHref } = useNavigation();

  return locationMutator => {
    const newLocation = cloneLocation(location);
    locationMutator(newLocation);

    return createHref(newLocation);
  };
}
