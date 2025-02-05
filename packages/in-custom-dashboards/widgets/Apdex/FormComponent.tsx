/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import ApdexWidgetFormComponent, {
  FormComponentProps
} from 'in-custom-dashboards/widgets/Apdex/components/ApdexWidgetFormComponent';
import { productAreas } from 'in-services/tracking/productAreas';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import { pageNames } from 'in-services/tracking/pageNames';

export default function FormComponent(props: FormComponentProps) {
  return (
    <>
      <ViewTrackingMeta
        data={{ pageRootName: pageNames.custom_dashboard, productArea: productAreas.custom_dashboard }}
      />
      <ApdexWidgetFormComponent {...props} />
    </>
  );
}
