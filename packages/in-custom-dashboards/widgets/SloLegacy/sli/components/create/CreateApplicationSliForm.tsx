/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Field, Item, MapForm } from 'formalistic';
import React, { useState } from 'react';

import { Application, ApplicationBoundaryScope, Result, TimeConfig } from '@instana/types';
import { Observable } from '@instana/observables';

import {
  useValidateApplicationFilterExpression,
  useApplicationQueryBuilder
} from 'in-service-levels/hooks/useApplicationQueryBuilder';
import { useApplicationSliFormSideEffects } from 'in-custom-dashboards/widgets/SloLegacy/sli/hooks/useSliFormSideEffects';
import { CreateSliFormProps } from 'in-custom-dashboards/widgets/SloLegacy/sli/components/create/CreateSliFormFactory';
import CreateSliForm from 'in-custom-dashboards/widgets/SloLegacy/sli/components/create/CreateSliForm';
import { ApplicationSliForm } from 'in-custom-dashboards/widgets/SloLegacy/sli/ApplicationSliForm';
import { sliFieldNames, createForm } from 'in-custom-dashboards/widgets/SloLegacy/sli/sliForm';
import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';
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
      onSave={onSave}
    >
      <ApplicationSliForm
        form={form}
        onChange={(path, fn) => updateForm(form.updateIn(path as any, fn))}
        apName={application.label}
        QueryBuilderComponent={QueryBuilder}
      />
    </CreateSliForm>
  );
}

interface UseValidateExpressionsProps {
  form: MapForm<any>;
  isQueryValid: (filterExpression: FormModelElement[], timeConfig: TimeConfig) => Observable<Result<boolean>>;
}

function useValidateExpressions({ form, isQueryValid }: UseValidateExpressionsProps): boolean {
  const sliEntityForm = form.get('sliEntity') as MapForm<any>;
  const goodEventFilterExpression = (
    sliEntityForm.get(sliFieldNames.goodEventFilterExpression) as Field<FormModelElement[]>
  )?.value;
  const badEventFilterExpression = (
    sliEntityForm.get(sliFieldNames.badEventFilterExpression) as Field<FormModelElement[]>
  )?.value;

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
