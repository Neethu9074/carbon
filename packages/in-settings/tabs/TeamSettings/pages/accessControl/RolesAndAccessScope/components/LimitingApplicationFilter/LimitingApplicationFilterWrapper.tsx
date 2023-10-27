/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { MapFormItems } from 'formalistic';
import React from 'react';

import { Observable } from '@instana/observables';
import { useObservable } from '@instana/hooks';
import { Result } from '@instana/types';
import { t } from '@instana/i18n-react';

import LimitingApplicationFilter from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/components/LimitingApplicationFilter/LimitingApplicationFilter';
// @ts-expect-error not migrated to typescript yet
import { isQueryValid } from 'in-applications/creation/components/CreateApplicationQueryBuilder';
//@ts-expect-error not migrated to typescript yet
import ServiceLiveList from 'in-applications/creation/components/ServiceLiveList';
import { FormControlProps } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/RoleAndAccessScopeColumns';
import { getField } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/form';
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import getApplicationLiveView from 'in-applications/subscriptions/getApplicationLiveView';
import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';
import { successObservable } from 'in-services/util/result';
import { pendingResult } from 'in-services/fixedObjects';
import useTimeConfig from 'in-hooks/useTimeConfig';

import locals from './LimitingApplicationFilter.mless';

export interface LimitingApplicationFilterWrapperProps<FORM_TYPE extends MapFormItems>
  extends FormControlProps<FORM_TYPE> {}

export default function LimitingApplicationFilterWrapper<FORM_TYPE extends MapFormItems>({
  form,
  setForm
}: LimitingApplicationFilterWrapperProps<FORM_TYPE>) {
  const timeConfig = useTimeConfig();
  const tagFilterExpressionField = getField<FormModelElement[]>(form, 'tagFilterExpression');
  const tagFilterExpression = tagFilterExpressionField?.value;

  const validTagFilterExpressionResult: Result<boolean> =
    useObservable(isQueryValid, [tagFilterExpression, timeConfig]) ?? pendingResult;
  const isValidTagFilterExpression = validTagFilterExpressionResult?.data;
  const servicesLiveList = useObservable(getStreamData, [form, isValidTagFilterExpression]);

  function getStreamData([form, isValidTagFilterExpression]: any): Observable<Result<any>> {
    const jsForm = form.toJS();
    const downstreamScope = jsForm.scope;
    const tagFilterExpression = jsForm.tagFilterExpression;

    if (!isValidTagFilterExpression || tagFilterExpression.length === 0) {
      return successObservable([]);
    }

    return getApplicationLiveView({
      // The live view is based on historic data from last hour
      timeConfig: { to: null, windowSize: 3600000, focusedMoment: null, autoRefresh: false },
      pagination: { page: 1, pageSize: 100 },
      downstreamScope,
      tagFilterExpression: toBackendQueryModel(tagFilterExpression)
    });
  }

  return (
    <div className={locals.limitingFilter_wrapper}>
      <LimitingApplicationFilter form={form} setForm={setForm} />
      <div className={locals.limitingFilter_wrapper_servicesLiveList}>
        <ServiceLiveList
          servicesLiveList={servicesLiveList}
          headerText={t('in-applications:creation.simple.liveList.matchedServicesLastHour')}
          isValidTagFilterExpression={validTagFilterExpressionResult?.data}
        />
      </div>
    </div>
  );
}
