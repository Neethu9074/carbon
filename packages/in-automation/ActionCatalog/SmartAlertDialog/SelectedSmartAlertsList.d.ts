/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { MapForm } from 'formalistic';

import { SetFormFunction } from 'in-settings/hooks/useEntityForm';

export type SelectedSmartAlertsListProps = {
  form: MapForm<any>;
  setForm: SetFormFunction;
};

declare function SelectedSmartAlertsList({
  config,
  isLoading,
  actionHandlers = {}
}: SelectedSmartAlertsListProps): JSX.Element;

export default SelectedSmartAlertsList;
