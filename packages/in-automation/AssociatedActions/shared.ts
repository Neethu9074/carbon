/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { useState } from 'react';

import { useObservable } from '@instana/hooks';

import {
  getCustomEventActions,
  getBuiltinEventActions,
  getBuiltInEventSpecificationMutable,
  getCustomEventSpecificationMutable
} from 'in-api/eventSpecifications';
import { EventSpecification } from 'in-automation/api';
import { Action, Event } from 'in-types';

export function useDualReload(externalReload?: number, setExternalReload?: (n: number) => void): [number, () => void] {
  // internalReload exists to track the reload status within a component, which is necessrary
  // if the extrernalReload prop isn't passed in. The component's data will be re-fetched
  // whenever either of the reload states are modified.
  const [internalReload, setInternalReload] = useState(0);
  const reload = internalReload + (externalReload ?? 0);
  const triggerReload = () => {
    setInternalReload(Math.random());
    if (setExternalReload) {
      setExternalReload(Math.random());
    }
  };
  return [reload, triggerReload];
}

export const getIsCustomEvent = (event: Event) => (event?.metadata?.custom_issue as boolean) ?? false;
export const getEventSpecificationId = (event: Event) => event?.metadata?.eventSpecificationId as string;

export function getEventObservables(isCustomEvent: boolean) {
  return {
    getEventSpecification: isCustomEvent ? getCustomEventSpecificationMutable : getBuiltInEventSpecificationMutable,
    getActionsForEventSpecification: isCustomEvent ? getCustomEventActions : getBuiltinEventActions
  };
}

export function useAssociatedActionsData(eventSpecificationId: string, isCustomEvent: boolean, reload: number) {
  const { getEventSpecification, getActionsForEventSpecification } = getEventObservables(isCustomEvent);

  const actions =
    useObservable<Action[] | { code: string; message: string }, [string, number]>(
      () => getActionsForEventSpecification(eventSpecificationId),
      [eventSpecificationId, reload]
    ) ?? null; // fallback to null instead of an empty array so we can recognize the loading state

  const eventSpecification = useObservable<EventSpecification, [string]>(
    () => getEventSpecification(eventSpecificationId),
    [eventSpecificationId]
  );
  return { actions, eventSpecification };
}
