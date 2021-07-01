/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import WidgetTypeSidebar from 'in-custom-dashboards/CustomDashboard/WidgetEditorDialog/WidgetTypeSelector/WidgetTypeSidebar';
import { SideNavigationWrapper } from 'in-components/SideNavigation/SideNavigation';
import ErrorBoundary from 'in-components/ErrorBoundary';
import widgets from 'in-custom-dashboards/widgets';

import locals from './WidgetTypeSelector.mless';

export default function WidgetTypeSelector({ form, onChangeType }) {
  const selectedType = form.get('type').value;
  const widget = widgets[selectedType];

  return (
    <SideNavigationWrapper sidebar={<WidgetTypeSidebar form={form} onChangeType={onChangeType} />}>
      <ErrorBoundary name="widget-showcase">
        <div className={locals.wrapper}>{widget && widget.ShowCaseComponent && <widget.ShowCaseComponent />}</div>
      </ErrorBoundary>
    </SideNavigationWrapper>
  );
}
