/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { MapForm } from 'formalistic';

import { OnEntityChange, SetFormFunction } from 'in-settings/hooks/useEntityForm';

interface MaintenanceScopeProps {
  form: MapForm;
  onChange: OnEntityChange;
  onChangeApplyOn: Function;
  setForm: SetFormFunction;
}

export default function MaintenanceScopeStep(props: MaintenanceScopeProps): JSX.Element;
