/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import ConfigureAlertChannel, {
  ConfigureAlertChannelProps
} from 'in-alerting/smart-alerts/components/dialog/ConfigureAlertChannel';
import { MainDialogControl } from 'in-alerting/smart-alerts/components/dialog/AlertConfigDialogPresenter';
import { useSloAlertFormContext } from 'in-alerting/smart-alerts/slo/hooks/useSloAlertFormContext';

interface AlertChannelsSectionProps
  extends Pick<MainDialogControl, 'setSliderState' | 'setCustomSlideInHeaderConfig'> {}

export default function AlertChannelsSection({
  setSliderState,
  setCustomSlideInHeaderConfig
}: AlertChannelsSectionProps) {
  const { form, onChange } = useSloAlertFormContext();

  return (
    <ConfigureAlertChannel
      form={form}
      onChange={onChange as ConfigureAlertChannelProps['onChange']}
      setSliderState={setSliderState}
      setCustomSlideInHeaderConfig={setCustomSlideInHeaderConfig}
      numberOfAlertChannelListRows={7}
    />
  );
}
