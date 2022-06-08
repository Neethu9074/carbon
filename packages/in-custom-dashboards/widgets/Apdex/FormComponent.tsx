/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { Item, MapForm } from 'formalistic';
import React from 'react';

import { Stack, StackItem } from '@instana/components';

import {
  apdexConfigIdKey,
  defaultEntityType,
  entityIdKey,
  entityTypeKey,
  getField,
  updateFormField
} from 'in-custom-dashboards/widgets/Apdex/form';
import ConfigurationSelector from 'in-custom-dashboards/widgets/Apdex/components/ConfigurationSelector';
import { ApdexEntityTypes, AvailableEntityTypes } from 'in-custom-dashboards/widgets/Apdex/apdexTypes';
import EntityTypeSelector from 'in-custom-dashboards/widgets/Apdex/components/EntityTypeSelector';
import WebsiteSelector from 'in-custom-dashboards/widgets/Slo/components/WebsiteSelector';
import Sections from 'in-components/workspace/Sections/Sections';
import Section from 'in-components/workspace/Section/Section';
import Header from 'in-components/workspace/Header';
import { t } from 'in-i18n';

interface FormComponentProps {
  form: MapForm;
  onChange: (path: string[], updater: (f: Item) => Item) => void;
}

export default function FormComponent({ form, onChange }: FormComponentProps) {
  function updateForm<T>(fieldKey: string, value: T) {
    const item = updateFormField<T>(form, fieldKey, value, true);
    onChange([], () => item);
  }

  const entityType = getField<ApdexEntityTypes>(form, entityTypeKey)?.value ?? defaultEntityType;
  const entityIdField = getField<string>(form, entityIdKey);
  const configIdField = getField<string>(form, apdexConfigIdKey);
  const entityId = entityIdField?.value || '';
  const showEntityTypeSelector = AvailableEntityTypes.length > 1;

  return (
    <Stack gap="xsmall">
      <Header>
        <Stack direction="horizontal" distribution="spaceBetween" align="end" wrap>
          <StackItem>{t('in-custom-dashboards:widgets.apdex.formComponent.title')}</StackItem>
        </Stack>
      </Header>
      {showEntityTypeSelector && (
        <Sections>
          <Section title={t('in-custom-dashboards:widgets.apdex.formComponent.entityTypeTitle')}>
            <EntityTypeSelector
              value={entityType}
              onChange={type => updateForm<ApdexEntityTypes>(entityTypeKey, type)}
            />
          </Section>
        </Sections>
      )}
      {entityIdField && (
        <WebsiteSelector websiteIdField={entityIdField} onChange={id => updateForm<string>(entityIdKey, id)} />
      )}
      <Sections>
        {configIdField && (
          <ConfigurationSelector
            field={configIdField}
            entityId={entityId}
            entityType={entityType}
            onChange={value => updateForm<string>(apdexConfigIdKey, value)}
            onOpenConfigurationManager={() => {
              // TODO: Implement SlideInView.
              // This is called by clicking the manage button and should open the manage list view.
            }}
          />
        )}
      </Sections>
    </Stack>
  );
}
