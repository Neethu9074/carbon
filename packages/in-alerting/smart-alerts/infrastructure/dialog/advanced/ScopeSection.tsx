/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { MapForm, Item } from 'formalistic';
import React from 'react';

import { Stack } from '@instana/components';
import { TagCatalog } from '@instana/types';

import ScopeAlertEvaluation from 'in-alerting/smart-alerts/infrastructure/dialog/advanced/ScopeAlertEvaluation';
//@ts-expect-error
import ScopeGroup from 'in-alerting/smart-alerts/infrastructure/dialog/advanced/ScopeGroup';
import ScopeAggregation from 'in-alerting/smart-alerts/infrastructure/dialog/advanced/ScopeAggregation';
import ScopeMetric from 'in-alerting/smart-alerts/infrastructure/dialog/advanced/ScopeMetric';
import ScopeFilter from 'in-alerting/smart-alerts/infrastructure/dialog/advanced/ScopeFilter';
import Sections from 'in-components/workspace/Sections';
import Section from 'in-components/workspace/Section';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/infrastructure/dialog/advanced/ScopeSection.mless';

interface ScopeSectionProps {
  form: MapForm<any>;
  updateForm: (form: MapForm<any>) => void;
  tagCatalog: TagCatalog | undefined;
  onChange: (path: string[], updater: (item: Item) => Item) => void;
  setTagFilterValid?: React.Dispatch<React.SetStateAction<boolean>>;
  isRegex: boolean;
}
export default function ScopeSection({
  form,
  updateForm,
  tagCatalog,
  onChange,
  setTagFilterValid,
  isRegex
}: ScopeSectionProps) {
  return (
    <div className={locals.container}>
      <Stack gap="xsmall">
        <Sections>
          <Section title={t('in-alerting:smartAlerts.infrastructure.advancedModeContainer.scope.metric.metric')}>
            <ScopeMetric form={form} updateForm={updateForm} onChange={onChange} isRegex={isRegex} />
          </Section>
          <ScopeAggregation form={form} updateForm={updateForm} />
          <ScopeAlertEvaluation form={form} updateForm={updateForm} />
          <ScopeFilter
            form={form}
            updateForm={updateForm}
            tagCatalog={tagCatalog}
            setTagFilterValid={setTagFilterValid}
          />
          <ScopeGroup form={form} updateForm={updateForm} tagCatalog={tagCatalog} />
        </Sections>
      </Stack>
    </div>
  );
}
