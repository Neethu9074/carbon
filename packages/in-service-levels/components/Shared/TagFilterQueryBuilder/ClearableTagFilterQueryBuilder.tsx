/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Close } from '@carbon/icons-react';
import React from 'react';

import { Stack, StackItem } from '@instana/components';
import { Button } from '@instana/carbon';

import TagFilterQueryBuilder from 'in-service-levels/components/Shared/TagFilterQueryBuilder/TagFilterQueryBuilder';
import { TagFilterQueryBuilderProps } from 'in-service-levels/components/Shared/TagFilterQueryBuilder/types';
import { t } from 'in-i18n';

export default function ClearableTagFilterQueryBuilder({ value, onChange, ...props }: TagFilterQueryBuilderProps) {
  return (
    <Stack distribution="spaceBetween" direction="horizontal">
      <StackItem>
        <TagFilterQueryBuilder {...props} value={value} onChange={onChange} />
      </StackItem>
      {value.length > 0 && (
        <Button kind="ghost" renderIcon={Close} size="sm" onClick={() => onChange?.([])}>
          {t('in-custom-dashboards:widgets.slo.tagFilterExpressConfig.clear')}
        </Button>
      )}
    </Stack>
  );
}
