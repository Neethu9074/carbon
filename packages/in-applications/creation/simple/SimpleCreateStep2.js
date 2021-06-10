/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import CreateApplicationFilterExpression from 'in-applications/creation/components/CreateApplicationFilterExpression';
import SimpleModeStepContentWrapper from 'in-components/BlueprintFormMultistep/SimpleModeStepContentWrapper';
import ApplicationScopeSelector from 'in-applications/creation/components/ApplicationScopeSelector';
import ServiceLiveList from 'in-applications/creation/components/ServiceLiveList';
import Spacer from 'in-applications/Forms/components/Spacer';
import Label from 'in-components/form/Label';
import { t } from 'in-i18n';

import locals from './SimpleCreateStep2.mless';

export default function SimpleCreateStep2({
  selectedBlueprint,
  timeConfig,
  form,
  updateForm,
  servicesLiveList,
  blueprintCatalogResult,
  isValidTagFilterExpression
}) {
  return (
    <SimpleModeStepContentWrapper headline={t('in-applications:creation.simple.step2.headline')}>
      <div className={locals.filterWrapper}>
        <CreateApplicationFilterExpression
          blueprintCatalogResult={blueprintCatalogResult}
          form={form}
          selectedBlueprint={selectedBlueprint}
          timeConfig={timeConfig}
          updateForm={updateForm}
        />
        <Spacer type="dark" />
        <Label>{t('in-applications:creation.simple.step2.includeDownstreamServices')}</Label>
        <ApplicationScopeSelector form={form} updateForm={updateForm} selectedBlueprint={selectedBlueprint} />
      </div>
      <ServiceLiveList
        servicesLiveList={servicesLiveList}
        headerText={t('in-applications:creation.simple.liveList.matchedServicesLastHour')}
        isValidTagFilterExpression={isValidTagFilterExpression}
      />
    </SimpleModeStepContentWrapper>
  );
}
