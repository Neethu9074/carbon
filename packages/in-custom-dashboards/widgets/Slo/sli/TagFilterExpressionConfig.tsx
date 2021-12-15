/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Button } from '@instana/components';

import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';
import LightCard from 'in-alerting/components/LightCard/LightCard';
import { QueryBuilderComponent } from 'in-components/QueryBuilder';
import IconLabel from 'in-alerting/components/IconLabel';
import { t } from 'in-i18n';

import locals from './TagFilterExpressionConfig.mless';

interface TagFilterExpressionConfigProps {
  label: string;
  icon: string;
  value: FormModelElement[];
  onChange: (value: FormModelElement[]) => void;
  QueryBuilderComponent: QueryBuilderComponent;
}

export default function TagFilterExpressionConfig({
  label,
  icon,
  QueryBuilderComponent,
  value,
  onChange
}: TagFilterExpressionConfigProps) {
  return (
    <LightCard
      title={<IconLabel text={label} type={icon} noBottomMargin />}
      headerClassName={locals.header}
      header={
        value.length > 0 && (
          <Button
            className={locals.clearButton}
            kind="subtle"
            icon="lib_openclose_cancel"
            size="compact"
            onClick={() => onChange([])}
          >
            {t('in-custom-dashboards:widgets.slo.tagFilterExpressConfig.clear')}
          </Button>
        )
      }
      darkFrame
    >
      <div className={locals.querybuilderLayoutWrapper}>
        <QueryBuilderComponent value={value} onChange={onChange} />
      </div>
    </LightCard>
  );
}
