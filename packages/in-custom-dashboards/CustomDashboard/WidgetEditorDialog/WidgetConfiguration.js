/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Stack, StackItem } from '@instana/components';

import WidgetPreview from 'in-custom-dashboards/CustomDashboard/WidgetEditorDialog/WidgetPreview';
import SectionLabelWithSubtext from 'in-components/workspace/SectionLabelWithSubtext';
import InputInSection from 'in-components/form/Input/InputInSection';
import HelpAction from 'in-components/workspace/HelpAction';
import Sections from 'in-components/workspace/Sections';
import Divider from 'in-components/workspace/Divider';
import Header from 'in-components/workspace/Header';
import widgets from 'in-custom-dashboards/widgets';
import { t } from 'in-i18n';

export default function WidgetConfiguration({ form, onChange, setSlideInView }) {
  const selectedType = form.get('type').value;
  const widget = widgets[selectedType];

  return (
    <Stack gap="large">
      <StackItem>
        <widget.Form
          form={form.get('config')}
          onChange={(path, fn) => onChange(['config', ...path], fn)}
          setSlideInView={setSlideInView}
        />
      </StackItem>

      <Divider />

      <Stack gap="normal">
        <Header>{t('in-custom-dashboards:customDashboard.widgetEditorDialog.widgetConfiguration.widgetName')}</Header>
        <Sections>
          <WidgetTitleInput form={form} onChange={onChange} />
        </Sections>
      </Stack>

      <WidgetPreview form={form} onChange={onChange} />
    </Stack>
  );
}

function WidgetTitleInput({ form, onChange }) {
  const field = form.get('title');
  return (
    <InputInSection
      id="widget-title"
      hasError={!field.valid && field.touched}
      label={
        <SectionLabelWithSubtext
          subtext={t('in-custom-dashboards:customDashboard.widgetEditorDialog.widgetConfiguration.optional')}
        >
          {t('in-custom-dashboards:customDashboard.widgetEditorDialog.widgetConfiguration.name')}
        </SectionLabelWithSubtext>
      }
      type="text"
      value={field.value}
      onChange={e => onChange(['title'], field => field.setValue(e.target.value).setTouched(true))}
      actions={
        <HelpAction>
          {t('in-custom-dashboards:customDashboard.widgetEditorDialog.widgetConfiguration.helpAction')}
        </HelpAction>
      }
      maxLength={256}
    />
  );
}
