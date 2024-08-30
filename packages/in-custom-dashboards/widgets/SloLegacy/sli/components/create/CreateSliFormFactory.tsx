/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import CreateApplicationSliForm from 'in-custom-dashboards/widgets/SloLegacy/sli/components/create/CreateApplicationSliForm';
import CreateWebsiteSliForm from 'in-custom-dashboards/widgets/SloLegacy/sli/components/create/CreateWebsiteSliForm';
import { SliConfigBySliType, SliType } from 'in-custom-dashboards/widgets/SloLegacy/sli/sliTypes';

export interface CreateSliFormProps<SLI_TYPE extends SliType> {
  entityId: string;
  close: () => void;
  sliConfig?: Partial<SliConfigBySliType<SLI_TYPE>>;
  setFooter: (footer: React.ReactNode) => void;
  onSave: (config: SliConfigBySliType<SLI_TYPE>) => void;
}

interface CreateSliFormFactoryProps<SLI_TYPE extends SliType> extends CreateSliFormProps<SLI_TYPE> {
  entityType: SLI_TYPE;
}

export default function CreateSliFormFactory<SLI_TYPE extends SliType>({
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
