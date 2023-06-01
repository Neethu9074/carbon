/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Item, Field } from 'formalistic';
import { get } from 'lodash';
import React from 'react';

import { Result, SloEntityType } from '@instana/types';
import { Typography } from '@instana/components';
import { useObservable } from '@instana/hooks';

import {
  CommonSloForm,
  SloForm,
  sloEntityTypeKey,
  sloEntityKey,
  sloWebsiteIdKey,
  WebsiteSloForm,
  ApplicationSloForm,
  sloApplicationIdKey
} from 'in-service-levels/components/ConfigDialog/form';
import { SloSelectionSection } from 'in-service-levels/components/ConfigDialog/DialogSections/SloEntitySection/SloSelectionSection';
import SloEntityTypeSelector from 'in-service-levels/components/SloList/components/SloEntityTypeSelector';
import getApplication from 'in-applications/subscriptions/getApplication';
import getWebsite from 'in-websites/subscriptions/getWebsite';
import { t } from 'in-i18n';

interface SloScopeSectionProps {
  form: SloForm<SloEntityType> | WebsiteSloForm | ApplicationSloForm;
  onChange: (path: string[], updater: (i: Item) => Item) => void;
}

export const SloEntitySection = ({ form, onChange }: SloScopeSectionProps) => {
  const sloSloEntityTypeField = (form as unknown as CommonSloForm).get(sloEntityTypeKey).value;

  var id = '';
  if (sloSloEntityTypeField === 'website') {
    id = (form as WebsiteSloForm).getIn([sloEntityKey, sloWebsiteIdKey]).value;
  } else {
    id = (form as ApplicationSloForm).getIn([sloEntityKey, sloApplicationIdKey]).value;
  }
  const entityLabel =
    useObservable(() => {
      if (!id) return undefined;
      if (sloSloEntityTypeField === 'website') return getWebsite({ id: id }).map(getLabel);
      if (sloSloEntityTypeField === 'application') return getApplication({ id: id }).map(getLabel);
      return;
    }, [id]) ?? undefined;

  const selectedLabel = entityLabel ? entityLabel : t('in-service-levels:general.noSelection');
  return (
    <>
      <Typography variant="heading-200" component="h2">
        {t('in-service-levels:createSloDialog.selectEntityTitle')}
      </Typography>
      <SloEntityTypeSelector
        value={sloSloEntityTypeField}
        onChange={type =>
          onChange([sloEntityTypeKey], field => (field as Field<SloEntityType>).setValue(type).setTouched(true))
        }
      />
      <Typography variant="heading-100" component="h3">
        {t('in-service-levels:general.selectLabel', { selectedLabel })}
      </Typography>

      <SloSelectionSection form={form} onChange={onChange} />
    </>
  );
};

export function getLabel(result: Result<{ label?: string }>): string | undefined {
  return get(result, ['data', 'label'], null);
}
