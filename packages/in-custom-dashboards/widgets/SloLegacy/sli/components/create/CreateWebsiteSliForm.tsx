/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';
import { Item } from 'formalistic';

import { Observable } from '@instana/observables';

import {
  useValidateWebsiteFilterExpression,
  useWebsiteQueryBuilder
} from 'in-service-levels/hooks/useWebsiteQueryBuilder';
import { CreateSliFormProps } from 'in-custom-dashboards/widgets/SloLegacy/sli/components/create/CreateSliFormFactory';
import { useWebsiteSliFormSideEffects } from 'in-custom-dashboards/widgets/SloLegacy/sli/hooks/useSliFormSideEffects';
import { createForm, WebsiteSliEntityFormData } from 'in-custom-dashboards/widgets/SloLegacy/sli/sliForm';
import CreateSliForm from 'in-custom-dashboards/widgets/SloLegacy/sli/components/create/CreateSliForm';
import { WebsiteSliForm } from 'in-custom-dashboards/widgets/SloLegacy/sli/WebsiteSliForm';
import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';
import { websiteTimeBased } from 'in-custom-dashboards/widgets/SloLegacy/sli/sliTypes';
import { LoadingIndicator } from 'in-components/LoadingIndicators';
import { Result, TimeConfig, Website } from 'in-types';
import useWebsite from 'in-websites/hooks/useWebsite';

export default function CreateWebsiteSliForm({
  entityId,
  close,
  sliConfig,
  setFooter,
  onSave
}: CreateSliFormProps<'website'>) {
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
      onSave={onSave}
    />
  );
}

function CreateWebsiteSliFormComponent({
  entityId,
  website,
  sliConfig,
  close,
  setFooter,
  onSave
}: CreateSliFormProps<'website'> & { website: Website }) {
  const [form, setForm] = useState(createForm('website', sliConfig ?? {}, entityId, website));
  const updateForm = useWebsiteSliFormSideEffects(form, setForm as (f: Item) => void);

  const sliEntity = form.get('sliEntity')?.toJS() as WebsiteSliEntityFormData;
  const { QueryBuilder, isQueryValid } = useWebsiteQueryBuilder(sliEntity);

  const filterExpressionValid = useValidateExpressions({ sliEntity, isQueryValid });

  return (
    <CreateSliForm
      entityType="website"
      form={form}
      updateForm={updateForm}
      setFooter={setFooter}
      editMode={!!sliConfig?.id}
      close={close}
      filterExpressionValid={filterExpressionValid}
      onSave={onSave}
    >
      <WebsiteSliForm
        form={form}
        onChange={(path, fn) => updateForm(form.updateIn(path as any, fn))}
        websiteName={website.label}
        QueryBuilderComponent={QueryBuilder}
      />
    </CreateSliForm>
  );
}

interface UseValidateExpressionsProps {
  sliEntity: WebsiteSliEntityFormData;
  isQueryValid: (filterExpression: FormModelElement[] | undefined, tc: TimeConfig) => Observable<Result<boolean>>;
}

function useValidateExpressions({ sliEntity, isQueryValid }: UseValidateExpressionsProps): boolean {
  const { filterExpression, goodEventFilterExpression, badEventFilterExpression, sliType } = sliEntity;

  const filterExpressionValid = useValidateWebsiteFilterExpression({
    filterExpression: filterExpression,
    isQueryValid
  });

  const goodEventsValid = useValidateWebsiteFilterExpression({
    filterExpression: goodEventFilterExpression,
    isQueryValid
  });
  const badEventsValid = useValidateWebsiteFilterExpression({
    filterExpression: badEventFilterExpression,
    isQueryValid
  });

  return sliType === websiteTimeBased ? filterExpressionValid : goodEventsValid && badEventsValid;
}
