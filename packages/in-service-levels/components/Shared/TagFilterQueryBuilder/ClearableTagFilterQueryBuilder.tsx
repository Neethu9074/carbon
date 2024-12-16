/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Stack, StackItem, Button } from '@instana/components';

import { TagFilterQueryBuilderProps } from 'in-service-levels/components/Shared/TagFilterQueryBuilder/types';
import { TagFilterQueryBuilder } from 'in-service-levels/components/Shared/TagFilterQueryBuilder';
import { t } from 'in-i18n';

export default function ClearableTagFilterQueryBuilder({ value, onChange, ...props }: TagFilterQueryBuilderProps) {
  return (
    <Stack distribution="spaceBetween" direction="horizontal">
      <StackItem>
        <TagFilterQueryBuilder {...props} value={value} onChange={onChange} />
      </StackItem>
      {value.length > 0 && (
        <Button kind="subtle" icon="lib_openclose_cancel" size="compact" onClick={() => onChange?.([])}>
          {t('in-custom-dashboards:widgets.slo.tagFilterExpressConfig.clear')}
        </Button>
      )}
    </Stack>
  );
}
