/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Spacer } from '@instana/components';

import CreateApplicationFilterExpression from 'in-applications/creation/components/CreateApplicationFilterExpression';
import SimpleModeStepContentWrapper from 'in-components/BlueprintFormMultistep/SimpleModeStepContentWrapper';
import ApplicationScopeSelector from 'in-applications/creation/components/ApplicationScopeSelector';
import { findByRestrictingApplicationId } from 'in-applications/creation/contributionFilters';
import ServiceLiveList from 'in-applications/creation/components/ServiceLiveList';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import { hasError, isLoading } from 'in-services/util/result';
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
  isValidTagFilterExpression,
  userRestrictedApplicationsResult
}) {
  const restrictingApplicationIdField = form.get('restrictingApplicationId');

  if (isLoading(userRestrictedApplicationsResult) || hasError(userRestrictedApplicationsResult)) {
    // keep showing a loading indicator even on error, until we a proper design for error handling
    return (
      <SimpleModeStepContentWrapper headline={t('in-applications:creation.simple.step2.headline')}>
        <div className={locals.loadingIndicator}>
          <LoadingIndicator />
        </div>
      </SimpleModeStepContentWrapper>
    );
  }

  const userRestrictedApplications = userRestrictedApplicationsResult.data;
  const selectedUserGroupRestrictions = findByRestrictingApplicationId(
    userRestrictedApplications,
    restrictingApplicationIdField.value
  );

  return (
    <SimpleModeStepContentWrapper headline={t('in-applications:creation.simple.step2.headline')}>
      <div className={locals.filterWrapper}>
        <CreateApplicationFilterExpression
          blueprintCatalogResult={blueprintCatalogResult}
          form={form}
          selectedBlueprint={selectedBlueprint}
          timeConfig={timeConfig}
          updateForm={updateForm}
          userRestrictedApplications={userRestrictedApplications}
        />
        <Spacer vertical="normal" />
        <Label>{t('in-applications:creation.simple.step2.includeDownstreamServices')}</Label>
        <ApplicationScopeSelector
          form={form}
          updateForm={updateForm}
          selectedBlueprint={selectedBlueprint}
          maxScope={selectedUserGroupRestrictions?.filter?.scope}
        />
      </div>
      <ServiceLiveList
        servicesLiveList={servicesLiveList}
        headerText={t('in-applications:creation.simple.liveList.matchedServicesLastHour')}
        isValidTagFilterExpression={isValidTagFilterExpression}
      />
    </SimpleModeStepContentWrapper>
  );
}
