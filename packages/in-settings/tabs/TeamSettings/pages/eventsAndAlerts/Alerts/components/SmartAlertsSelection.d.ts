/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { MapForm } from 'formalistic';

interface Props {
  form: MapForm<any>;
  setForm: (form: MapForm<any>) => void;
  isAutomation?: boolean;
}

export default function SmartAlertsSelection({ form, setForm, isAutomation }: Props): JSX.Element;
