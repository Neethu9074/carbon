/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { diff, Diff } from 'deep-diff';
import { Item } from 'formalistic';
import { uniq } from 'lodash';

type ChangeType = 'E' | 'D' | 'N' | 'A';
type ChangeTypeLong = 'EDIT' | 'DELETE' | 'INSERT' | 'LIST_UPDATE';

export const CHANGE_TYPES: Record<ChangeTypeLong, ChangeType> = {
  EDIT: 'E', // A field's value was changed
  DELETE: 'D', // A field was deleted
  INSERT: 'N', // A field was added
  LIST_UPDATE: 'A' // A list contained in a field was changed
};

export type EffectFunction<ItemType extends Item = Item> = (form: ItemType) => ItemType;

type EffectPathSegment = string | RegExp;

export interface Effect<ItemType extends Item = Item> {
  path: EffectPathSegment[];
  effects: EffectFunction<ItemType>[];
}

interface UseFormSideEffectsRequest<ItemType extends Item = Item> {
  form: ItemType;
  setForm: (field: ItemType) => void;
  effects: Effect<ItemType>[];
  changesToTrack?: ChangeType[];
}

type UseFormSideEffectsResponse<ItemType extends Item = Item> = (form: ItemType) => void;

const allChanges: ChangeType[] = Object.values(CHANGE_TYPES);

/**
 * This hooks allows to execute side-effects based on incoming changes to form values.
 * Side-effects can safely update the form before the update is committed to application state.
 * Changes to form touched state are ignored.
 */
export default function useFormSideEffects<ItemType extends Item = Item>({
  form,
  setForm,
  effects = [],
  changesToTrack = allChanges
}: UseFormSideEffectsRequest<ItemType>): UseFormSideEffectsResponse<ItemType> {
  return (updatedForm: ItemType) => {
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

function findEffectsForPath<T extends Item>(path: string[], effects: Effect<T>[]): EffectFunction<T>[] {
  return effects
    .filter(({ path: p = [] }) => {
      const effectivePath = path.slice(0, p.length);
      let isMatch = true;
      for (const [index, segment] of p.entries()) {
        const pathSegmentToMatch = effectivePath[index];
        if (segment instanceof RegExp) {
          isMatch = segment.test(pathSegmentToMatch);
        } else {
          isMatch = segment === pathSegmentToMatch;
        }
        if (!isMatch) {
          break;
        }
      }
      return isMatch;
    })
    .flatMap(({ effects }) => effects);
}
