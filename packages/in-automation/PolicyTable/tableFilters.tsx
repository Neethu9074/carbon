/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { TypeConfigurationType } from '@instana/types';

import ComboBox from 'in-components/ComboBox/ComboBox';
import { POLICY_TYPE } from 'in-automation/constants';
import { t } from 'in-i18n';

const options = [
  { label: t('in-automation:policies.manual'), value: POLICY_TYPE.MANUAL },
  { label: t('in-automation:policies.automatic'), value: POLICY_TYPE.AUTOMATIC }
] as const;

interface PolicyTypeFilterProps {
  type: TypeConfigurationType | null;
  setType: (type: TypeConfigurationType | null) => void;
}

export function PolicyTypeFilter({ type, setType }: PolicyTypeFilterProps) {
  return (
    <ComboBox
      options={options}
      placeholder={t('in-automation:type')}
      value={type}
      onChange={newValue => {
        if (!newValue) {
          setType(null);
        } else {
          // @ts-expect-error
          setType(newValue.value);
        }
      }}
    />
  );
}
