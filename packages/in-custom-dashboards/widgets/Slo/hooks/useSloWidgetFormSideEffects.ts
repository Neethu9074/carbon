/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import useFormSideEffects, { CHANGE_TYPES, Effect } from 'in-hooks/useFormSideEffects';
import { SloWidgetForm } from 'in-custom-dashboards/widgets/Slo/form';

const effects: Effect<SloWidgetForm>[] = [];

export type SloWidgetFormSideEffectsReturnType = (form: SloWidgetForm) => void;

export default function useSloWidgetFormSideEffects(
  form: SloWidgetForm,
  setForm: (form: SloWidgetForm) => void
): SloWidgetFormSideEffectsReturnType {
  return useFormSideEffects({
    form,
    setForm,
    effects,
    changesToTrack: [CHANGE_TYPES.EDIT, CHANGE_TYPES.LIST_UPDATE, CHANGE_TYPES.INSERT]
  });
}
