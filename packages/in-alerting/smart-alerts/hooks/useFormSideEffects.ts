/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { isEqual, uniq } from 'lodash';
import { diff, Diff } from 'deep-diff';
import { Item } from 'formalistic';

type ChangeType = 'E' | 'D' | 'N' | 'A';
type ChangeTypeLong = 'EDIT' | 'DELETE' | 'INSERT' | 'LIST_UPDATE';

export const CHANGE_TYPES: Record<ChangeTypeLong, ChangeType> = {
  EDIT: 'E', // A field's value was changed
  DELETE: 'D', // A field was deleted
  INSERT: 'N', // A field was added
  LIST_UPDATE: 'A' // A list contained in a field was changed
};
interface Effect {
  path: string[];
  effects: ((form: Item) => Item)[];
}
interface UseFormSideEffectsRequest {
  form: Item;
  setForm: (field: Item) => void;
  effects: Effect[];
  changesToTrack: ChangeType[];
}

type UseFormSideEffectsResponse = (form: Item) => void;

const allChanges: ChangeType[] = Object.values(CHANGE_TYPES);

/**
 * This hooks allows to execute side-effects based on incoming changes to form values.
 * Side-effects can safely update the form before the update is committed to application state.
 * Changes to form touched state are ignored.
 */

export default function useFormSideEffects({
  form,
  setForm,
  effects = [],
  changesToTrack = allChanges
}: UseFormSideEffectsRequest): UseFormSideEffectsResponse {
  return (updatedForm: Item) => {
    if (updatedForm === form) return;

    const effectsToExecute = uniq(
      findUpdatedPaths(form.toJS(), updatedForm.toJS(), changesToTrack).flatMap(p => findEffectsForPath(p, effects))
    );
    updatedForm = effectsToExecute.reduce((f, effect) => effect(f) || f, updatedForm);

    setForm(updatedForm);
  };
}

function findUpdatedPaths(previousData: any, updatedData: any, changesToTrack: ChangeType[]): string[][] {
  const updatedPaths: Diff<any, any>[] =
    diff(previousData, updatedData)?.filter(({ kind }) => changesToTrack.includes(kind)) ?? [];
  return updatedPaths.filter(({ path }) => path != null).map(({ path }) => path as string[]) ?? [];
}

function findEffectsForPath(path: string[], effects: Effect[]) {
  return effects.filter(({ path: p = [] }) => isEqual(p, path.slice(0, p.length))).flatMap(({ effects }) => effects);
}
