/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Field, Item, MapForm } from 'formalistic';
import React, { useState } from 'react';

import { Observable } from '@instana/observables';

import {
  CombinedApplicationSliEntity,
  isAvailabilitySliEntity,
  NewSliConfig,
  SliConfigBySliType
} from 'in-custom-dashboards/widgets/Slo/sli/sliTypes';
import {
  useValidateApplicationFilterExpression,
  useApplicationQueryBuilder
} from 'in-custom-dashboards/widgets/Slo/sli/hooks/useApplicationQueryBuilder';
import { useApplicationSliFormSideEffects } from 'in-custom-dashboards/widgets/Slo/sli/hooks/useSliFormSideEffects';
import { CreateSliFormProps } from 'in-custom-dashboards/widgets/Slo/sli/components/create/CreateSliFormFactory';
import { Application, ApplicationBoundaryScope, ApplicationSliEntity, Result, TimeConfig } from 'in-types';
import { sliFieldNames, createForm, SliFormData } from 'in-custom-dashboards/widgets/Slo/sli/sliForm';
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import CreateSliForm from 'in-custom-dashboards/widgets/Slo/sli/components/create/CreateSliForm';
import { ApplicationSliForm } from 'in-custom-dashboards/widgets/Slo/sli/ApplicationSliForm';
import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';
import { createSliConfiguration } from 'in-custom-dashboards/widgets/Slo/sli/api';
import { LoadingIndicator } from 'in-components/LoadingIndicators';
import useApplication from 'in-applications/hooks/useApplication';

export default function CreateApplicationSliForm({
  entityId,
  close,
  sliConfig,
  setFooter,
  onSave
}: CreateSliFormProps<'application'>) {
  const [application, status] = useApplication(entityId);

  if (status !== 'resolved' || sliConfig == null) {
    return <LoadingIndicator size="xl" />;
  }
  return (
    <CreateApplicationSliFormComponent
      entityId={entityId}
      application={application!}
      close={close}
      sliConfig={sliConfig}
      setFooter={setFooter}
      onSave={onSave}
    />
  );
}

function CreateApplicationSliFormComponent({
  entityId,
  application,
  close,
  sliConfig,
  setFooter,
  onSave
}: CreateSliFormProps<'application'> & { application: Application }) {
  const [form, setForm] = useState(createForm('application', sliConfig ?? {}, entityId, application));
  const updateForm = useApplicationSliFormSideEffects(form, setForm as (f: Item) => void);

  const { QueryBuilder, isQueryValid } = useApplicationQueryBuilder({
    applicationId: application.id,
    boundaryScope: application.boundaryScope as ApplicationBoundaryScope
  });
  const filterExpressionValid = useValidateExpressions({ form, isQueryValid });

  return (
    <CreateSliForm
      entityType="application"
      form={form}
      updateForm={updateForm}
      setFooter={setFooter}
      editMode={!!sliConfig?.id}
      close={close}
      filterExpressionValid={filterExpressionValid}
      onSubmit={submittedFormData =>
        createSliConfiguration({
          ...toBackendFormat(submittedFormData)
        }).tap(data => {
          if (data.status < 400) onSave(data.body as SliConfigBySliType<'application'>);
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

interface UseValidateExpressionsProps {
  form: MapForm;
  isQueryValid: (filterExpression: FormModelElement[], timeConfig: TimeConfig) => Observable<Result<boolean>>;
}

function useValidateExpressions({ form, isQueryValid }: UseValidateExpressionsProps): boolean {
  const sliEntityForm = form.get('sliEntity') as MapForm;
  const goodEventFilterExpression = (sliEntityForm.get(sliFieldNames.goodEventFilterExpression) as Field<
    FormModelElement[]
  >)?.value;
  const badEventFilterExpression = (sliEntityForm.get(sliFieldNames.badEventFilterExpression) as Field<
    FormModelElement[]
  >)?.value;

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

function toBackendFormat(formData: SliFormData<'application'>): NewSliConfig<CombinedApplicationSliEntity> {
  const sliEntity = formData.sliEntity;

  if (isAvailabilitySliEntity(sliEntity)) {
    return {
      ...formData,
      sliEntity: {
        ...sliEntity,
        goodEventFilterExpression: toBackendQueryModel(sliEntity.goodEventFilterExpression),
        badEventFilterExpression: toBackendQueryModel(sliEntity.badEventFilterExpression)
      }
    };
  }

  return formData as NewSliConfig<ApplicationSliEntity>;
}
