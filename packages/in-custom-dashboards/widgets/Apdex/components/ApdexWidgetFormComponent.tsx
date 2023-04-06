/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { Item, MapForm } from 'formalistic';
import React, { useEffect } from 'react';

import { Stack, StackItem } from '@instana/components';

import {
  ApdexWidgetTrackerProvider,
  defaultTrackers,
  useApdexWidgetTrackers
} from 'in-custom-dashboards/widgets/Apdex/components/ApdexWidgetTrackerProvider';
import {
  apdexConfigIdKey,
  defaultEntityType,
  entityIdKey,
  entityTypeKey,
  setFieldValue
} from 'in-custom-dashboards/widgets/Apdex/form';
import { APDEX_MANAGEMENT_EXIT, APDEX_MANAGEMENT_VIEW, APDEX_WIDGET_EDIT_START } from 'in-services/tracking/eventNames';
import ConfigurationSelector from 'in-custom-dashboards/widgets/Apdex/components/ConfigurationSelector';
import { ApdexEntityTypes, AvailableEntityTypes } from 'in-custom-dashboards/widgets/Apdex/apdexTypes';
import useApdexFormSideEffects from 'in-custom-dashboards/widgets/Apdex/hooks/useApdexFormSideEffects';
import EntityTypeSelector from 'in-custom-dashboards/widgets/Apdex/components/EntityTypeSelector';
import { SlideInViewConfig } from 'in-custom-dashboards/CustomDashboard/WidgetEditorDialog/types';
import ApplicationSelector from 'in-custom-dashboards/widgets/Slo/components/ApplicationSelector';
import ApdexManageList from 'in-custom-dashboards/widgets/Apdex/components/ApdexManageList';
import WebsiteSelector from 'in-custom-dashboards/widgets/Slo/components/WebsiteSelector';
import Sections from 'in-components/workspace/Sections/Sections';
import { getField } from 'in-custom-dashboards/widgets/Slo/form';
import Section from 'in-components/workspace/Section/Section';
import Header from 'in-components/workspace/Header';
import { t } from 'in-i18n';

export interface FormComponentProps {
  form: MapForm<any>;
  onChange: (path: string[], updater: (f: Item) => Item) => void;
  setSlideInView: (view: SlideInViewConfig<'CREATE' | 'EDIT' | undefined>) => void;
}

export default function ApdexWidgetFormComponent({ form, onChange, setSlideInView }: FormComponentProps) {
  const updateFormWithSideEffects = useApdexFormSideEffects(form, (f: Item) => onChange([], () => f));
  function updateForm<T>(path: string[], value: T) {
    updateFormWithSideEffects(form.updateIn(path as any, f => setFieldValue<T>(f, value, true)));
  }

  const track = useApdexWidgetTrackers();
  useEffect(() => {
    track(APDEX_WIDGET_EDIT_START);
  }, [track]);

  const entityType = getField<ApdexEntityTypes>(form, [entityTypeKey])?.value ?? defaultEntityType;
  const entityIdField = getField<string>(form, [entityIdKey]);
  const configIdField = getField<string>(form, [apdexConfigIdKey]);
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
      {entityIdField && entityType === 'website' && (
        <WebsiteSelector websiteIdField={entityIdField} onChange={id => updateForm<string>([entityIdKey], id)} />
      )}
      {entityIdField && entityType === 'application' && (
        <ApplicationSelector apIdField={entityIdField} onChange={id => updateForm<string>([entityIdKey], id)} />
      )}
      <Sections>
        {configIdField && (
          <ConfigurationSelector
            field={configIdField}
            entityId={entityId}
            entityType={entityType}
            onChange={value => updateForm<string>([apdexConfigIdKey], value)}
            onOpenConfigurationManager={() => {
              track(APDEX_MANAGEMENT_VIEW, { entityType: entityType });
              const config = getSlideInViewConfig(
                entityType,
                entityId,
                value => updateForm<string>([apdexConfigIdKey], value),
                track
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
  onChange: (value: string) => void,
  track: ReturnType<typeof useApdexWidgetTrackers>
): SlideInViewConfig<'CREATE' | 'EDIT' | undefined> {
  return {
    renderTitle(showCreateFormState): string {
      if (!showCreateFormState) return t('in-custom-dashboards:widgets.apdex.formComponent.manageListTitle');

      return showCreateFormState === 'EDIT'
        ? t('in-custom-dashboards:widgets.apdex.formComponent.editApdex')
        : t('in-custom-dashboards:widgets.apdex.formComponent.createApdex');
    },
    slideOutHandler(slideOut, [showCreateFormState, setShowCreateFormState]): () => void {
      if (showCreateFormState) return () => setShowCreateFormState(undefined);
      return () => {
        track(APDEX_MANAGEMENT_EXIT, { entityType });
        slideOut();
      };
    },
    getContent({ slideOut, subSlideState: [showCreateFormState, setShowCreateFormState] }) {
      return (
        <ApdexWidgetTrackerProvider value={defaultTrackers}>
          <ApdexManageList
            entityId={entityId}
            entityType={entityType}
            onChange={value => {
              // It is important to call slideOut() before onChange(), otherwise
              // the new state of the form will be overwritten by an old state
              slideOut();
              if (value?.id) onChange(value.id);
            }}
            showCreateForm={Boolean(showCreateFormState)}
            onShowCreateForm={isEditing => setShowCreateFormState(isEditing ? 'EDIT' : 'CREATE')}
            onCloseCreateForm={() => setShowCreateFormState(undefined)}
          />
        </ApdexWidgetTrackerProvider>
      );
    }
  };
}
