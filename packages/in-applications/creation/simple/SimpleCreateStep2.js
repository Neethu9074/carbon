/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import CreateApplicationFilterExpression from 'in-applications/creation/components/CreateApplicationFilterExpression';
import SimpleModeStepContentWrapper from 'in-new-components/BlueprintFormMultistep/SimpleModeStepContentWrapper';
import CreateApplicationFilters from 'in-applications/creation/components/CreateApplicationFilters';
import ApplicationScopeSelector from 'in-applications/creation/components/ApplicationScopeSelector';
import { isQB2ModeEnabled } from 'in-new-components/Alerting/components/WithQB1orQB2';
import ServiceLiveList from 'in-applications/creation/components/ServiceLiveList';
import { qb2InAPCreationEnabled } from 'in-services/featureFlags';
import Spacer from 'in-applications/Forms/components/Spacer';
import Label from 'in-components/form/Label';

import locals from './SimpleCreateStep2.mless';

export default function SimpleCreateStep2({
  selectedBlueprint,
  timeConfig,
  form,
  updateForm,
  servicesLiveList,
  blueprintCatalogResult
}) {
  return (
    <SimpleModeStepContentWrapper headline="Specify your Application Perspective">
      <div className={locals.filterWrapper}>
        {isQB2ModeEnabled && qb2InAPCreationEnabled ? (
          <CreateApplicationFilterExpression
            blueprintCatalogResult={blueprintCatalogResult}
            form={form}
            selectedBlueprint={selectedBlueprint}
            timeConfig={timeConfig}
            updateForm={updateForm}
          />
        ) : (
          <CreateApplicationFilters
            form={form}
            curatedTagFilters={selectedBlueprint.curatedTagFilters}
            timeConfig={timeConfig}
            updateForm={updateForm}
            selectedBlueprint={selectedBlueprint}
          />
        )}
        <Spacer type="dark" />
        <Label>Which downstream services would you like to include?</Label>
        <ApplicationScopeSelector form={form} updateForm={updateForm} selectedBlueprint={selectedBlueprint} />
      </div>
      <ServiceLiveList servicesLiveList={servicesLiveList} headerText="Matched services in the last hour" />
    </SimpleModeStepContentWrapper>
  );
}
