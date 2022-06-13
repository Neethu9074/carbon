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
  setFieldValue
} from 'in-custom-dashboards/widgets/Apdex/form';
import ConfigurationSelector from 'in-custom-dashboards/widgets/Apdex/components/ConfigurationSelector';
import { ApdexEntityTypes, AvailableEntityTypes } from 'in-custom-dashboards/widgets/Apdex/apdexTypes';
import EntityTypeSelector from 'in-custom-dashboards/widgets/Apdex/components/EntityTypeSelector';
import { SlideInViewConfig } from 'in-custom-dashboards/CustomDashboard/WidgetEditorDialog/types';
import ApdexManageList from 'in-custom-dashboards/widgets/Apdex/components/ApdexManageList';
import WebsiteSelector from 'in-custom-dashboards/widgets/Slo/components/WebsiteSelector';
import Sections from 'in-components/workspace/Sections/Sections';
import Section from 'in-components/workspace/Section/Section';
import Header from 'in-components/workspace/Header';
import { Nullish } from 'in-types';
import { t } from 'in-i18n';

interface FormComponentProps {
  form: MapForm;
  onChange: (path: string[], updater: (f: Item) => Item) => void;
  setSlideInView: (view: SlideInViewConfig<Nullish>) => void;
}

export default function FormComponent({ form, onChange, setSlideInView }: FormComponentProps) {
  function updateForm<T>(path: string[], value: T) {
    onChange(path, field => setFieldValue<T>(field, value, true));
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
              onChange={type => updateForm<ApdexEntityTypes>([entityTypeKey], type)}
            />
          </Section>
        </Sections>
      )}
      {entityIdField && (
        <WebsiteSelector websiteIdField={entityIdField} onChange={id => updateForm<string>([entityIdKey], id)} />
      )}
      <Sections>
        {configIdField && (
          <ConfigurationSelector
            field={configIdField}
            entityId={entityId}
            entityType={entityType}
            onChange={value => updateForm<string>([apdexConfigIdKey], value)}
            onOpenConfigurationManager={() => {
              const config = getSlideInViewConfig(entityType, entityId, value =>
                updateForm<string>([apdexConfigIdKey], value)
              );
              setSlideInView(config);
            }}
          />
        )}
      </Sections>
    </Stack>
  );
}

function getSlideInViewConfig(
  entityType: ApdexEntityTypes,
  entityId: string,
  onChange: (value: string) => void
): SlideInViewConfig<Nullish> {
  return {
    renderTitle(): string {
      return t('in-custom-dashboards:widgets.apdex.formComponent.manageListTitle');
    },
    slideOutHandler(slideOut): () => void {
      return slideOut;
    },
    getContent({ slideOut }) {
      return (
        <ApdexManageList
          entityId={entityId}
          entityType={entityType}
          onChange={value => {
            // It is important to call slideOut() before onChange(), otherwise
            // the new state of the form will be overwritten by an old state
            slideOut();
            if (value?.id) onChange(value.id);
          }}
        />
      );
    }
  };
}
