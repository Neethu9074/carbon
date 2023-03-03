/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { MapForm, Item } from 'formalistic';

export default function AlertPropertiesTitleRow(props: AlertPropertiesTitleRowProps);

interface AlertPropertiesTitleRowProps {
  form: MapForm;
  onChange: (path: string[], updater: (item: Item) => Item) => void;
  getTitlePlaceholder: (form: MapForm) => string;
  placeholders: string[];
  trackAlertingAdditionalPropsTitleChanged?: () => void;
}
