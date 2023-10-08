/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { MapForm } from 'formalistic';
import React from 'react';

// import { MapForm } from 'formalistic';
import { PermissionSet, RestrictedApplicationFilter, Result, TagFilterExpressionElementUnion } from '@instana/types';
import { Observable } from '@instana/observables';
import { useObservable } from '@instana/hooks';
import { Spacer } from '@instana/components';
import { Button } from '@instana/components';

// import {
//   AreaRole,
//   ProductArea,
//   ScopedPermissionItem
// } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/constants';
import { FormModelElement, fromBackendModel } from 'in-components/QueryBuilder/transformation/formModel';
//@ts-expect-error not migrated to typescript yet
import CreateApplicationQueryBuilder from 'in-applications/creation/components/CreateApplicationQueryBuilder';
//@ts-expect-error not migrated to typescript yet
import ApplicationScopeSelector from 'in-applications/creation/components/ApplicationScopeSelector';
// @ts-expect-error not migrated to typescript yet
import { isQueryValid } from 'in-applications/creation/components/CreateApplicationQueryBuilder';
//@ts-expect-error not migrated to typescript yet
import ServiceLiveList from 'in-applications/creation/components/ServiceLiveList';
import { FormControlProps } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/RoleAndAccessScopeColumns';
import { getField, updateFormField } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/form';
import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper/HorizontalFlexWrapper';
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import getApplicationLiveView from 'in-applications/subscriptions/getApplicationLiveView';
import DescriptionText from 'in-components/form/DescriptionText';
import { successObservable } from 'in-services/util/result';
import { pendingResult } from 'in-services/fixedObjects';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { t } from 'in-i18n';

import locals from './ApplicationFilterGroup.mless';

export interface ApplicationFilterGroupProps extends FormControlProps<any> {}

export default function ApplicationFilterGroup({ form, setForm }: ApplicationFilterGroupProps) {
  const timeConfig = useTimeConfig();
  const permissionSetField = getField<PermissionSet>(form, 'permissionSet');
  const permissionSet = permissionSetField?.value;
  // const entityPermissionKey:string = 'restrictedApplicationFilter';
  const tagFilterExpression: TagFilterExpressionElementUnion | undefined =
    permissionSet?.['restrictedApplicationFilter']?.['tagFilterExpression'] ?? undefined;
  const tagFilterExpressionField = fromBackendModel(tagFilterExpression);
  function setTagFilterExpression(
    tagFilterExpression: FormModelElement[] | [],
    form: MapForm<any>,
    setForm: { (form: MapForm<any>): void; (form: MapForm<any>): void; (arg0: any): void }
  ) {
    const backendModel = toBackendQueryModel(tagFilterExpression, true);
    const limitingFilterConfig: RestrictedApplicationFilter = {
      tagFilterExpression: tagFilterExpression ? (backendModel as any) : undefined,
      scope: form.get('scope')?.value
    };
    const permissions = { ...permissionSetField?.value, restrictedApplicationFilter: limitingFilterConfig };
    setForm(updateFormField(form, 'permissionSet', permissions, true).setTouched(true));

    // if (!permissionSet) return;

    // const updatePermissionSet = (permissions: PermissionSet) => {
    //   setForm(updateFormField(form, 'permissionSet', permissions, true));
    // };
    // const limitation = !(tagFilterExpression || form.get('scope').value)
    //   ? ScopedPermissionItem.ACCESS_ALL
    //   : ScopedPermissionItem.LIMITED_ACCESS;
    // const restPermissionSet:PermissionSet = updatePermissionSetForLimitableProductArea(
    //   permissionSet,
    //   productArea,
    //   limitation,
    //   AreaRole.OWNER
    // );
  }

  const validTagFilterExpressionResult: Result<boolean> =
    useObservable(isQueryValid, [tagFilterExpressionField, timeConfig]) ?? pendingResult;
  const servicesLiveList = useObservable(getStreamData, [form, validTagFilterExpressionResult?.data]);
  // console.log('servicesLiveList',servicesLiveList);

  return (
    <>
      <Section headingText={t('in-applications:creation.advanced.defineUsingTags')}>
        <DescriptionText className={locals.descriptionText}>
          <Spacer vertical="normal" />
          <strong>{t('in-applications:creation.advanced.andOperatorsPrecedenceBrackets')}</strong>
        </DescriptionText>

        <div className={locals.queryBuilder}>
          <div className={locals.queryBuilderExpression}>
            <CreateApplicationQueryBuilder
              value={tagFilterExpressionField}
              onChange={(tagFilterExpression: FormModelElement[]) =>
                setTagFilterExpression(tagFilterExpression, form, setForm)
              }
            />
          </div>

          <HorizontalFlexWrapper>
            {tagFilterExpressionField?.length > 0 && (
              <Button
                kind="subtle"
                icon="lib_openclose_cancel"
                size="compact"
                onClick={() => setTagFilterExpression([], form, setForm)}
              >
                {t('in-applications:creation.advanced.clear')}
              </Button>
            )}
          </HorizontalFlexWrapper>
        </div>
      </Section>

      <Section headingText={t('in-applications:creation.advanced.downstreamCalls')}>
        <DescriptionText className={locals.descriptionText}>
          {t('in-applications:creation.advanced.downstreamCallsDescription')}
        </DescriptionText>
        <ApplicationScopeSelector form={form} updateForm={setForm} />
      </Section>
      <section>
        <ServiceLiveList
          servicesLiveList={servicesLiveList}
          headerText={t('in-applications:creation.simple.liveList.matchedServicesLastHour')}
          isValidTagFilterExpression={validTagFilterExpressionResult?.data}
        />
      </section>
    </>
  );
}

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
function Section({ children, headingText }: any): any {
  return (
    <section>
      <h2 className={locals.heading}>{headingText}</h2>
      {children}
    </section>
  );
}
