/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { MapForm, Item } from 'formalistic';

import { SliderState } from 'in-alerting/smart-alerts/components/dialog/AlertConfigDialogPresenter';

export default function ConfigureAlertChannel(props: ConfigureAlertChannelProps);

export interface ConfigureAlertChannelProps {
  form: MapForm<any>;
  onChange: (path: MapPath<any>, updater: (item: Item) => Item) => void;
  setSliderState?: (state: SliderState) => void;
  setCustomSlideInHeaderConfig?: (state: { title: string | null; onClose: (() => void) | null }) => void;
  numberOfAlertChannelListRows?: number;
  isTearSheet?: boolean;
  updateForm?: (form: MapForm<any>) => void;
  simpleMode?: boolean;
  alertChannelPerSeverityEnabled?: boolean;
}
