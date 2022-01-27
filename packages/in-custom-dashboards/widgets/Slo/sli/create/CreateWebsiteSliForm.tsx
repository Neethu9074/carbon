/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';
import { Item } from 'formalistic';

import { generateUniqueShortId } from '@instana/utils';

import {
  CombinedWebsiteSliEntity,
  isWebsiteEventBasedSliEntity,
  isWebsiteSliEntity,
  NewSliConfig,
  SliConfig
} from 'in-custom-dashboards/widgets/Slo/sli/sliTypes';
import {
  useValidateWebsiteFilterExpression,
  useWebsiteQueryBuilder
} from 'in-custom-dashboards/widgets/Slo/websiteQueryBuilder';
import { createForm, SliFormData, WebsiteSliEntityFormData } from 'in-custom-dashboards/widgets/Slo/sli/sliForm';
import { useWebsiteSliFormSideEffects } from 'in-custom-dashboards/widgets/Slo/sli/hooks/useSliFormSideEffects';
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import CreateSliForm from 'in-custom-dashboards/widgets/Slo/sli/create/CreateSliForm';
import { WebsiteSliForm } from 'in-custom-dashboards/widgets/Slo/sli/WebsiteSliForm';
import { LoadingIndicator } from 'in-components/LoadingIndicators';
import { createSliConfiguration } from 'in-custom-dashboards/api';
import useWebsite from 'in-websites/hooks/useWebsite';
import { Website, WebsiteSliEntity } from 'in-types';

interface CreateWebsiteSliFormProps {
  entityId: string;
  close: () => void;
  sliConfig?: SliConfig<WebsiteSliEntity>;
  setFooter: (footer: React.ReactNode) => void;
}

export default function CreateWebsiteSliForm({ entityId, close, sliConfig, setFooter }: CreateWebsiteSliFormProps) {
  const [website, status] = useWebsite(entityId);

  if (status !== 'resolved' || sliConfig == null) {
    return <LoadingIndicator size="xl" />;
  }
  return (
    <CreateWebsiteSliFormComponent
      entityId={entityId}
      website={website!}
      close={close}
      sliConfig={sliConfig}
      setFooter={setFooter}
    />
  );
}

function CreateWebsiteSliFormComponent({
  entityId,
  website,
  sliConfig,
  close,
  setFooter
}: CreateWebsiteSliFormProps & { website: Website }) {
  const [form, setForm] = useState(createForm('website', sliConfig ?? {}, entityId, website));
  const updateForm = useWebsiteSliFormSideEffects(form, setForm as (f: Item) => void);

  const sliEntity = form.get('sliEntity')?.toJS() as WebsiteSliEntityFormData;
  const { QueryBuilder, isQueryValid } = useWebsiteQueryBuilder(sliEntity);

  const filterExpressionValid = useValidateWebsiteFilterExpression({
    isQueryValid,
    ...sliEntity
  });

  return (
    <CreateSliForm<'WEBSITE'>
      form={form}
      updateForm={updateForm}
      setFooter={setFooter}
      editMode={!!sliConfig?.id}
      close={close}
      filterExpressionValid={filterExpressionValid}
      onSubmit={submittedFormData =>
        createSliConfiguration({
          ...toBackendFormat(submittedFormData),
          id: generateUniqueShortId(9)
        })
      }
    >
      <WebsiteSliForm
        form={form}
        onChange={(path, fn) => updateForm(form.updateIn(path, fn))}
        websiteName={website.label}
        QueryBuilderComponent={QueryBuilder}
      />
    </CreateSliForm>
  );
}

function toBackendFormat(formData: SliFormData<'WEBSITE'>): NewSliConfig<CombinedWebsiteSliEntity> {
  const sliEntity = formData.sliEntity;

  if (isWebsiteSliEntity(sliEntity)) {
    const { filterExpression, ...entity } = sliEntity as Omit<
      WebsiteSliEntityFormData,
      'goodEventFilterExpression' | 'badEventFilterExpression'
    >;
    return {
      ...formData,
      sliEntity: {
        ...entity,
        filterExpression: toBackendQueryModel(filterExpression)
      }
    };
  }

  if (isWebsiteEventBasedSliEntity(sliEntity)) {
    const { goodEventFilterExpression, badEventFilterExpression, ...entity } = sliEntity as Omit<
      WebsiteSliEntityFormData,
      'filterExpression'
    >;
    return {
      ...formData,
      sliEntity: {
        ...entity,
        goodEventFilterExpression: toBackendQueryModel(goodEventFilterExpression),
        badEventFilterExpression: toBackendQueryModel(badEventFilterExpression)
      }
    };
  }

  return undefined as never;
}
