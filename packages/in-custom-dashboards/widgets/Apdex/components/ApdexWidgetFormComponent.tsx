/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { Item, MapForm } from 'formalistic';
import React, { useEffect } from 'react';

import { Stack, StackItem } from '@instana/components';

import {
  apdexConfigIdKey,
  defaultEntityType,
  entityIdKey,
  entityTypeKey,
  setFieldValue
} from 'in-custom-dashboards/widgets/Apdex/form';
import { APDEX_MANAGEMENT_EXIT, APDEX_MANAGEMENT_VIEW, APDEX_WIDGET_EDIT_START } from 'in-services/tracking/eventNames';
// eslint-disable-next-line import/no-deprecated
import { getField } from 'in-custom-dashboards/widgets/SloLegacy/form';
import { SloTrackerProvider, apdexWidgetTrackers, useSloTrackers } from 'in-service-levels/hooks/SloTrackerProvider';
import ConfigurationSelector from 'in-custom-dashboards/widgets/Apdex/components/ConfigurationSelector';
import ApplicationSelector from 'in-custom-dashboards/widgets/SloLegacy/components/ApplicationSelector';
import { ApdexEntityTypes, AvailableEntityTypes } from 'in-custom-dashboards/widgets/Apdex/apdexTypes';
import useApdexFormSideEffects from 'in-custom-dashboards/widgets/Apdex/hooks/useApdexFormSideEffects';
import EntityTypeSelector from 'in-custom-dashboards/widgets/Apdex/components/EntityTypeSelector';
import { SlideInViewConfig } from 'in-custom-dashboards/CustomDashboard/WidgetEditorDialog/types';
import WebsiteSelector from 'in-custom-dashboards/widgets/SloLegacy/components/WebsiteSelector';
import ApdexManageList from 'in-custom-dashboards/widgets/Apdex/components/ApdexManageList';
import Sections from 'in-components/workspace/Sections/Sections';
import { productAreas } from 'in-services/tracking/productAreas';
import Section from 'in-components/workspace/Section/Section';
import { pageNames } from 'in-services/tracking/pageNames';
import Header from 'in-components/workspace/Header';
import { t } from 'in-i18n';

export interface FormComponentProps {
  form: MapForm<any>;
  onChange: (path: string[], updater: (f: Item) => Item) => void;
  setSlideInView: (view: SlideInViewConfig<'CREATE' | 'EDIT' | undefined>) => void;
}

interface GetSlideInViewConfigProps {
  entityType: ApdexEntityTypes;
  entityId: string;
  onChange: (value: string) => void;
  track: ReturnType<typeof useSloTrackers>;
}

export default function ApdexWidgetFormComponent({ form, onChange, setSlideInView }: FormComponentProps) {
  const updateFormWithSideEffects = useApdexFormSideEffects(form, (f: Item) =>
    onChange([], () => (form.touched ? f.setTouched(true, { recurse: true }) : f))
  );
  function updateForm<T>(path: string[], value: T) {
    updateFormWithSideEffects(form.updateIn(path as any, f => setFieldValue<T>(f, value, true)));
  }

  const track = useSloTrackers();
  useEffect(() => {
    track(APDEX_WIDGET_EDIT_START, undefined);
  }, [track]);

  // eslint-disable-next-line import/no-deprecated
  const entityType = getField<ApdexEntityTypes>(form, [entityTypeKey])?.value ?? defaultEntityType;
  // eslint-disable-next-line import/no-deprecated
  const entityIdField = getField<string>(form, [entityIdKey]);
  // eslint-disable-next-line import/no-deprecated
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
              track(APDEX_MANAGEMENT_VIEW, {
                entityType: entityType
              });
              const config = getSlideInViewConfig({
                entityType,
                entityId,
                onChange: value => updateForm<string>([apdexConfigIdKey], value),
                track
              });
              setSlideInView(config);
            }}
          />
        )}
      </Sections>
    </Stack>
  );
}

function getSlideInViewConfig({
  entityType,
  entityId,
  onChange,
  track
}: GetSlideInViewConfigProps): SlideInViewConfig<'CREATE' | 'EDIT' | undefined> {
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
        track(APDEX_MANAGEMENT_EXIT, {
          entityType
        });
        slideOut();
      };
    },
    getContent({ slideOut, subSlideState: [showCreateFormState, setShowCreateFormState] }) {
      return (
        <SloTrackerProvider
          trackers={apdexWidgetTrackers}
          meta={{ productArea: productAreas.custom_dashboard, pageName: pageNames.custom_dashboard }}
        >
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
        </SloTrackerProvider>
      );
    }
  };
}
