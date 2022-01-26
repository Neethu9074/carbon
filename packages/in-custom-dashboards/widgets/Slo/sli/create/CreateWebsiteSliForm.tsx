/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';

import { generateUniqueShortId } from '@instana/utils';

import {
  useValidateWebsiteFilterExpression,
  useWebsiteQueryBuilder
} from 'in-custom-dashboards/widgets/Slo/websiteQueryBuilder';
import { useWebsiteSliFormSideEffects } from 'in-custom-dashboards/widgets/Slo/sli/hooks/useSliFormSideEffects';
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import CreateSliForm from 'in-custom-dashboards/widgets/Slo/sli/create/CreateSliForm';
import { WebsiteSliForm } from 'in-custom-dashboards/widgets/Slo/sli/WebsiteSliForm';
import { websiteEventBased } from 'in-custom-dashboards/widgets/Slo/sli/sliTypes';
import { createForm } from 'in-custom-dashboards/widgets/Slo/sli/sliForm';
import { LoadingIndicator } from 'in-components/LoadingIndicators';
import { createSliConfiguration } from 'in-custom-dashboards/api';
import useWebsite from 'in-websites/hooks/useWebsite';

export default function CreateWebsiteSliForm({ entityId, close, sliConfig, setFooter }) {
  const [website, status] = useWebsite(entityId);

  if (status !== 'resolved' || sliConfig == null) {
    return <LoadingIndicator size="xl" />;
  }
  return (
    <CreateWebsiteSliFormComponent
      entityId={entityId}
      website={website}
      close={close}
      sliConfig={sliConfig}
      setFooter={setFooter}
    />
  );
}

function CreateWebsiteSliFormComponent({ entityId, website, sliConfig, close, setFooter }) {
  const [form, setForm] = useState(createForm('website', sliConfig ?? {}, entityId, website));
  const updateForm = useWebsiteSliFormSideEffects(form, setForm);

  const sliEntity = form.get('sliEntity').toJS();
  const { QueryBuilder, isQueryValid } = useWebsiteQueryBuilder(sliEntity);

  const filterExpressionValid = useValidateWebsiteFilterExpression({
    isQueryValid,
    ...sliEntity
  });

  return (
    <CreateSliForm
      form={form}
      updateForm={updateForm}
      setFooter={setFooter}
      editMode={!!sliConfig.id}
      close={close}
      filterExpressionValid={filterExpressionValid}
      toBackendFormat={toBackendFormat}
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

function toBackendFormat(formData) {
  const fData = { ...formData, sliEntity: { ...formData.sliEntity } };

  const sliEntity = fData.sliEntity;
  const sliType = sliEntity.sliType;

  sliEntity.filterExpression = toBackendQueryModel(sliEntity.filterExpression);

  if (sliType === websiteEventBased) {
    sliEntity.goodEventFilterExpression = toBackendQueryModel(sliEntity.goodEventFilterExpression);
    sliEntity.badEventFilterExpression = toBackendQueryModel(sliEntity.badEventFilterExpression);
  }

  return fData;
}
