/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { MapForm } from 'formalistic';

import { OnEntityChange, SetFormFunction } from 'in-settings/hooks/useEntityForm';

interface RMConfigContainer {
  form: MapForm;
  onChange: OnEntityChange;
  onChangeApplyOn: Function;
  setForm: SetFormFunction;
  simpleMode: boolean;
  step: number;
  messages?: Array;
}

export default function RecurrentMaintenanceConfigContainer(props: RMConfigContainer): JSX.Element;
