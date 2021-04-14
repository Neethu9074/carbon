/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import LocallyChangedTheme from 'in-themes/LocallyChangedTheme';
import ErrorBoundary from 'in-components/ErrorBoundary';
import Header from 'in-new-components/workspace/Header';
import Stack from 'in-new-components/layout/Stack';
import widgets from 'in-custom-dashboards/widgets';
import Button from 'in-new-components/Button';
import { lightV2 } from 'in-themes/themes';
import { t } from 'in-i18n';

import locals from './WidgetPreview.mless';

export default function WidgetPreview({ form, onChange }) {
  let content;

  const widget = widgets[form.get('type').value];
  const config = form.get('config').toJS();

  if (form.hierarchyValid) {
    content = (
      <LocallyChangedTheme theme={lightV2}>
        <widget.Widget title={form.get('title').value || '–'} config={config} isPreview />
      </LocallyChangedTheme>
    );
  } else {
    content = (
      <p className={locals.invalidConfig}>
        {t(
          'in-custom-dashboards:customDashboard.widgetEditorDialog.widgetPreview.previewNotAvailWidgetConfigIncomplete'
        )}
        <Button
          kind="action"
          className={locals.button}
          onClick={() => onChange([], f => f.setTouched(true, { recurse: true }))}
        >
          {t('in-custom-dashboards:customDashboard.widgetEditorDialog.widgetPreview.highlightMissingConfig')}
        </Button>
      </p>
    );
  }

  return (
    <ErrorBoundary
      name={t('in-custom-dashboards:customDashboard.widgetEditorDialog.widgetPreview.customDashboardPreviewTitle', {
        title: widget.title
      })}
      meta={config}
    >
      <div className={locals.preview}>
        <Stack space="normal">
          <Header>{t('in-custom-dashboards:customDashboard.widgetEditorDialog.widgetPreview.preview')}</Header>
          {content}
        </Stack>
      </div>
    </ErrorBoundary>
  );
}
