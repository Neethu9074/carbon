/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import CreateApplicationSliForm from 'in-custom-dashboards/widgets/Slo/sli/create/CreateApplicationSliForm';
import CreateWebsiteSliForm from 'in-custom-dashboards/widgets/Slo/sli/create/CreateWebsiteSliForm';
import { SliConfigBySliType } from 'in-custom-dashboards/widgets/Slo/sli/sliTypes';
import { SliType } from 'in-types';

export interface CreateSliFormProps<SLI_TYPE extends Lowercase<SliType>> {
  entityId: string;
  close: () => void;
  sliConfig?: Partial<SliConfigBySliType<SLI_TYPE>>;
  setFooter: (footer: React.ReactNode) => void;
}

interface CreateSliFormFactoryProps<SLI_TYPE extends Lowercase<SliType>> extends CreateSliFormProps<SLI_TYPE> {
  entityType: SLI_TYPE;
}

export default function CreateSliFormFactory<SLI_TYPE extends Lowercase<SliType>>({
  entityType,
  ...remainingProps
}: CreateSliFormFactoryProps<SLI_TYPE>) {
  switch (entityType) {
    case 'application':
      return <CreateApplicationSliForm {...(remainingProps as CreateSliFormProps<'application'>)} />;

    case 'website':
      return <CreateWebsiteSliForm {...(remainingProps as CreateSliFormProps<'website'>)} />;

    default:
      return null;
  }
}
