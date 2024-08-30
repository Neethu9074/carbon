/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React, { ReactNode } from 'react';

import { AvailableBeaconTypes } from 'in-custom-dashboards/widgets/SloLegacy/sli/sliTypes';
import SelectInSection from 'in-components/form/Select/SelectInSection';
import { Props as SelectProps } from 'in-components/form/Select';
import { t } from 'in-i18n';

interface BeaconSelectInSectionProps extends Omit<SelectProps, 'onChange' | 'children'> {
  children?: ReactNode;
  onChange: (value: string) => void;
  beaconOptions: readonly AvailableBeaconTypes[];
}

export default function BeaconSelectInSection({
  value,
  onChange,
  beaconOptions,
  disabled,
  hasError,
  children
}: BeaconSelectInSectionProps) {
  return (
    <SelectInSection
      label={t('in-custom-dashboards:widgets.slo.sliFormPresenter.beaconScopeLabel')}
      disabled={disabled}
      value={value}
      onChange={({ target: { value } }) => onChange(value)}
      hasError={hasError}
      additionalContent={children}
    >
      {beaconOptions.map(beaconType => (
        <option key={beaconType} value={beaconType}>
          {t('in-custom-dashboards:widgets.slo.sliFormPresenter.beaconLabel', { context: beaconType })}
        </option>
      ))}
    </SelectInSection>
  );
}
