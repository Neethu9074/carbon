/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import CreateApplicationSliForm, {
  CreateApplicationSliFormProps
} from 'in-custom-dashboards/widgets/Slo/sli/create/CreateApplicationSliForm';
import CreateWebsiteSliForm, {
  CreateWebsiteSliFormProps
} from 'in-custom-dashboards/widgets/Slo/sli/create/CreateWebsiteSliForm';
import { SliType } from 'in-types';

type CreateSliFormFactoryProps<SLI_TYPE extends Lowercase<SliType>> = {
  entityType: SLI_TYPE;
} & (SLI_TYPE extends 'application' ? CreateApplicationSliFormProps : CreateWebsiteSliFormProps);

export default function CreateSliFormFactory<SLI_TYPE extends Lowercase<SliType>>({
  entityType,
  ...remainingProps
}: CreateSliFormFactoryProps<SLI_TYPE>) {
  switch (entityType) {
    case 'application':
      return <CreateApplicationSliForm {...(remainingProps as CreateApplicationSliFormProps)} />;

    case 'website':
      return <CreateWebsiteSliForm {...(remainingProps as CreateWebsiteSliFormProps)} />;

    default:
      return null;
  }
}
