/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';

import { generateUniqueShortId } from '@instana/utils';

import {
  useValidateApplicationFilterExpression,
  useApplicationQueryBuilder
} from 'in-custom-dashboards/widgets/Slo/sli/hooks/useApplicationQueryBuilder';
import { useApplicationSliFormSideEffects } from 'in-custom-dashboards/widgets/Slo/sli/hooks/useSliFormSideEffects';
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { ApplicationSliForm } from 'in-custom-dashboards/widgets/Slo/sli/ApplicationSliForm';
import { sliFieldNames, createForm } from 'in-custom-dashboards/widgets/Slo/sli/sliForm';
import CreateSliForm from 'in-custom-dashboards/widgets/Slo/sli/create/CreateSliForm';
import { availabilityType } from 'in-custom-dashboards/widgets/Slo/sli/sliTypes';
import { LoadingIndicator } from 'in-components/LoadingIndicators';
import { createSliConfiguration } from 'in-custom-dashboards/api';
import useApplication from 'in-applications/hooks/useApplication';

export default function CreateApplicationSliForm({ entityId, close, sliConfig, setFooter }) {
  const [application, status] = useApplication(entityId);

  if (status !== 'resolved' || sliConfig == null) {
    return <LoadingIndicator size="xl" />;
  }
  return (
    <CreateApplicationSliFormComponent
      entityId={entityId}
      application={application}
      close={close}
      sliConfig={sliConfig}
      setFooter={setFooter}
    />
  );
}

function CreateApplicationSliFormComponent({ entityId, application, close, sliConfig, setFooter }) {
  const [form, setForm] = useState(createForm('application', sliConfig ?? {}, entityId, application));
  const updateForm = useApplicationSliFormSideEffects(form, setForm);

  const { QueryBuilder, isQueryValid } = useApplicationQueryBuilder({
    applicationId: application.id,
    boundaryScope: application.boundaryScope
  });
  const filterExpressionValid = useValidateExpressions({ form, isQueryValid });

  return (
    <CreateSliForm
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
      <ApplicationSliForm
        form={form}
        onChange={(path, fn) => updateForm(form.updateIn(path, fn))}
        apName={application.label}
        QueryBuilderComponent={QueryBuilder}
      />
    </CreateSliForm>
  );
}

function useValidateExpressions({ form, isQueryValid }) {
  const sliEntityForm = form.get('sliEntity');
  const goodEventFilterExpression = sliEntityForm.get(sliFieldNames.goodEventFilterExpression)?.value;
  const badEventFilterExpression = sliEntityForm.get(sliFieldNames.badEventFilterExpression)?.value;

  const goodEventsValid = useValidateApplicationFilterExpression({
    filterExpression: goodEventFilterExpression,
    isQueryValid
  });

  const badEventsValid = useValidateApplicationFilterExpression({
    filterExpression: badEventFilterExpression,
    isQueryValid
  });

  return goodEventsValid && badEventsValid;
}

function toBackendFormat(formData) {
  const sliEntity = formData.sliEntity;
  const sliType = sliEntity.sliType;

  if (sliType === availabilityType) {
    return {
      ...formData,
      sliEntity: {
        ...sliEntity,
        goodEventFilterExpression: toBackendQueryModel(sliEntity.goodEventFilterExpression),
        badEventFilterExpression: toBackendQueryModel(sliEntity.badEventFilterExpression)
      }
    };
  }

  return formData;
}
