/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { MapForm, Item } from 'formalistic';

import { Placeholder } from 'in-alerting/smart-alerts/synthetics/dialog/advanced/titlePlaceholders';

export default function AlertPropertiesTitleRow(props: AlertPropertiesTitleRowProps);

interface AlertPropertiesTitleRowProps {
  form: MapForm<any>;
  onChange: (path: string[], updater: (item: Item) => Item) => void;
  getTitlePlaceholder: (form: MapForm<any>) => string;
  placeholders: ReadonlyArray<Readonly<Placeholder>>;
  trackAlertingAdditionalPropsTitleChanged?: () => void;
}
