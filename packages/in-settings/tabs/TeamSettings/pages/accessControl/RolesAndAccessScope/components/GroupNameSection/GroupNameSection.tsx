/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import { Typography } from '@instana/components';

import Input from 'in-components/form/Input/Input';
import Label from 'in-components/form/Label/Label';
import { t } from 'in-i18n';

import locals from './GroupNameSection.mless';

interface GroupNameSectionProps {
  value?: string;
  setValue: (value: string) => void;
}

export default function GroupNameSection({ value, setValue }: GroupNameSectionProps) {
  return (
    <section>
      <Typography variant="heading-300" component="h3">
        {t('in-settings:groupSection.title')}
      </Typography>
      <Label className={locals.label}>
        {t('in-settings:groupSection.label')}
        <Input autoFocus onChange={e => setValue(e.target.value)} value={value ?? ''} style={{ width: '100%' }} />
      </Label>
    </section>
  );
}
