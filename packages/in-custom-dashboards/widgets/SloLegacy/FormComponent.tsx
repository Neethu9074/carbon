/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import SloFormComponent, {
  FormComponentProps
} from 'in-custom-dashboards/widgets/SloLegacy/components/SloFormComponent';
import { productAreas } from 'in-services/tracking/productAreas';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import { pageNames } from 'in-services/tracking/pageNames';

export default function FormComponent(props: FormComponentProps) {
  return (
    <>
      <ViewTrackingMeta
        data={{ productArea: productAreas.custom_dashboard, pageRootName: pageNames.custom_dashboard }}
      />
      <SloFormComponent {...props} />
    </>
  );
}
