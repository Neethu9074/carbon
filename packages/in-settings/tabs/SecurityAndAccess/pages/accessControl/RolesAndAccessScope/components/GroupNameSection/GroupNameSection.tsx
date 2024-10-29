/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useRef, useEffect } from 'react';

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
  const groupNameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus on group name input to allow direct typing
    if (groupNameInputRef.current) {
      groupNameInputRef.current.focus();
    }
  }, []);

  return (
    <section>
      <Typography variant="heading-300" component="h3">
        {t('in-settings:groupSection.title')}
      </Typography>
      <Label className={locals.label} htmlFor="group-name">
        {t('in-settings:groupSection.label')}
      </Label>
      <Input
        id="group-name"
        className={locals.groupName}
        onChange={e => setValue(e.target.value)}
        value={value ?? ''}
        ref={groupNameInputRef}
      />
    </section>
  );
}
