/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { isEqual, uniq } from 'lodash';
import diff from 'deep-diff';

export const CHANGE_TYPES = {
  EDIT: 'E', // A field's value was changed
  DELETE: 'D', // A field was deleted
  INSERT: 'N', // A field was added
  LIST_UPDATE: 'A' // A list contained in a field was changed
};
const allChanges = Object.values(CHANGE_TYPES);

/**
 * This hooks allows to execute side-effects based on incoming changes to form values.
 * Side-effects can safely update the form before the update is committed to application state.
 * Changes to form touched state are ignored.
 * @param {MapForm|ListForm} form Formalistic form
 * @param {function(MapForm|ListForm)} setForm The function to commit form updates application state
 * @param {Object[]} effects Effects to execute on form updates
 * @param {string[]} [effects[].path] Optionally filters executions of the effect to changes in or below this path
 * @param {function(MapForm|ListForm): [(MapForm|ListForm)]} effects[].effects The list of effects to execute
 * @param {string[]} changesToTrack The types of changes to trigger effects for. See CHANGE_TYPES
 * @returns {function((MapForm|ListForm))} Wrapped form updated handler to use instead of setForm
 */
export default function useFormSideEffects({ form, setForm, effects = [], changesToTrack = allChanges }) {
  return updatedForm => {
    if (updatedForm === form) return;

    const effectsToExecute = uniq(
      findUpdatedPaths(form.toJS(), updatedForm.toJS(), changesToTrack).flatMap(p => findEffectsForPath(p, effects))
    );
    updatedForm = effectsToExecute.reduce((f, effect) => effect(f) || f, updatedForm);

    setForm(updatedForm);
  };
}

function findUpdatedPaths(previousData, updatedData, changesToTrack) {
  return (
    diff(previousData, updatedData)
      ?.filter(({ kind }) => changesToTrack.includes(kind))
      .map(({ path }) => path) ?? []
  );
}

function findEffectsForPath(path, effects) {
  return effects.filter(({ path: p = [] }) => isEqual(p, path.slice(0, p.length))).flatMap(({ effects }) => effects);
}
