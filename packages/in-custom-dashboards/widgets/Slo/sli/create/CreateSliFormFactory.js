/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import CreateApplicationSliForm from 'in-custom-dashboards/widgets/Slo/sli/create/CreateApplicationSliForm';
import CreateWebsiteSliForm from 'in-custom-dashboards/widgets/Slo/sli/create/CreateWebsiteSliForm';

export default function CreateSliFormFactory({ entityType, ...remainingProps }) {
  switch (entityType) {
    case 'application':
      return <CreateApplicationSliForm {...remainingProps} />;

    case 'website':
      return <CreateWebsiteSliForm {...remainingProps} />;
  }
}
