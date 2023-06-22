/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { MapForm } from 'formalistic';

import { MaintenanceConfigV2 } from '@instana/types';

import { OnEntityChange, SetFormFunction } from 'in-settings/hooks/useEntityForm';

interface RMConfigContainer {
  form: MapForm;
  entity: MaintenanceConfigV2;
  onChange: OnEntityChange;
  onChangeApplyOn: Function;
  setForm: SetFormFunction;
  simpleMode: boolean;
  step: number;
  messages?: Array;
}

export default function RecurrentMaintenanceConfigContainer(props: RMConfigContainer): JSX.Element;
