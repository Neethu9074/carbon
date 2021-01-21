/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import WidgetTypeSidebar from 'in-custom-dashboards/CustomDashboard/WidgetEditorDialog/WidgetTypeSelector/WidgetTypeSidebar';
import { SideNavigationWrapper } from 'in-new-components/SideNavigation/SideNavigation';
import widgets from 'in-custom-dashboards/widgets';

import locals from './WidgetTypeSelector.mless';

export default function WidgetTypeSelector({ form, onChangeType }) {
  const selectedType = form.get('type').value;
  const widget = widgets[selectedType];

  return (
    <SideNavigationWrapper sidebar={<WidgetTypeSidebar form={form} onChangeType={onChangeType} />}>
      {widget && widget.showCase && (
        <div className={locals.wrapper}>
          <img
            className={locals.img}
            src={widget.showCase}
            alt={`Show case of the ${widget.label} widget`}
            key={selectedType} // Added to notify react about the image has changed to avoid from displaying old image
          />
        </div>
      )}
    </SideNavigationWrapper>
  );
}
