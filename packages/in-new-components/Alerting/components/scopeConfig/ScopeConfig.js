/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import Toggle from 'react-toggle';
import { isEqual } from 'lodash';
import { t } from 'in-i18n';

import ServicesAndEndpointsListPresenter, {
  ServicesAndEndpointsSearchInput
} from 'in-new-components/Alerting/components/scopeConfig/ServicesAndEndpointsListPresenter/ServicesAndEndpointsListPresenter';
import { ClearTagFilterExpressionButton } from 'in-new-components/Alerting/components/AlertTagFilterExpressionConfig';
import HorizontalFlexWrapper from 'in-new-components/layout/HorizontalFlexWrapper/HorizontalFlexWrapper';
import getApplicationsCursorPaginated from 'in-subscription/application/getApplicationsCursorPaginated';
import getEndpointsCursorPaginated from 'in-applications/subscriptions/getEndpointsCursorPaginated';
import AlertFilterConfigurator from 'in-new-components/Alerting/components/AlertFilterConfigurator';
import getServicesCursorPaginated from 'in-subscription/application/getServicesCursorPaginated';
import getApplication from 'in-subscription/application/getApplication';
import { propTypeTimeConfig } from 'in-stores/time/config';
import LightCard from 'in-new-components/Card/LightCard';
import Stack from 'in-new-components/layout/Stack';

import locals from './ScopeConfig.mless';

export default function ScopeConfig({ form, updateForm, QueryBuilderComponent, timeConfig, editMode }) {
  const applications = form.get('applications').value;
  const boundaryScope = form.get('boundaryScope').value;
  const alertApplicationId = form.get('applicationId').value;
  const tagFilterExpression = form.get('tagFilterExpression').value;
  const initialApplicationsState = form.get('hiddenFields').get('initialApplicationsState').value;

  const [searchQuery, setSearchQuery] = useState('');

  const [filterBySelectionState, setFilterBySelectionState] = useState(Boolean(editMode));

  const isInDefaultState = isEqual(initialApplicationsState, applications);

  useEffect(() => {
    if (editMode && filterBySelectionState && isInDefaultState) {
      return;
    }
    setFilterBySelectionState(_showInteractedItemsOnly => {
      return !isInDefaultState && _showInteractedItemsOnly;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInDefaultState]);

  return (
    <LightCard
      title={<div className={locals.lightCardTitle}>{t('in-new-components:alerting.components.scopeConfigTitle')}</div>}
      headerClassName={locals.lightCardHeader}
      header={
        <LightCardHeaderControls
          filterBySelectionState={filterBySelectionState}
          setSearchQuery={setSearchQuery}
          setFilterBySelectionState={setFilterBySelectionState}
          tagFilterExpression={tagFilterExpression}
          isInDefaultState={isInDefaultState}
        />
      }
      withoutPadding
      darkFrame
      framed
    >
      <div className={locals.scopeConfigContainer}>
        <Stack>
          <div className={locals.servicesAndEndpointsListPresenterWrapper}>
            <ServicesAndEndpointsListPresenter
              apiSubscriptions={{
                getApplication,
                getApplicationsCursorPaginated,
                getServicesCursorPaginated,
                getEndpointsCursorPaginated
              }}
              applicationsSelection={applications}
              onChange={applicationsSelection =>
                updateForm(
                  form
                    .updateIn(['applications'], field => field.setValue(applicationsSelection).setTouched(true))
                    .updateIn(['hiddenFields', 'calculateThresholdOnBackend'], f => f.setValue(true))
                )
              }
              alertApplicationId={alertApplicationId}
              timeConfig={timeConfig}
              boundaryScope={boundaryScope}
              searchQuery={searchQuery}
              showInteractedItemsOnly={filterBySelectionState}
              editMode={editMode}
              isGlobalSmartAlert={false}
            />
          </div>
          <div
            className={classNames({
              [locals.alertFilterConfiguratorWrapper]: true,
              [locals.alertFilterConfiguratorWrapperBottomPadding]: tagFilterExpression.length === 0
            })}
          >
            <AlertFilterConfigurator
              QueryBuilderComponent={QueryBuilderComponent}
              form={form}
              updateForm={updateForm}
            />
          </div>
        </Stack>
        {tagFilterExpression.length > 0 && (
          <div className={locals.clearButtonWrapper}>
            <ClearTagFilterExpressionButton form={form} updateForm={updateForm} />
          </div>
        )}
      </div>
    </LightCard>
  );
}

ScopeConfig.propTypes = {
  QueryBuilderComponent: PropTypes.func.isRequired,
  editMode: PropTypes.bool,
  form: PropTypes.object.isRequired,
  timeConfig: propTypeTimeConfig.isRequired,
  updateForm: PropTypes.func.isRequired
};

function LightCardHeaderControls({
  filterBySelectionState,
  setSearchQuery,
  setFilterBySelectionState,
  isInDefaultState
}) {
  return (
    <HorizontalFlexWrapper>
      <HorizontalFlexWrapper>
        {!isInDefaultState && <div className={locals.lightCardHeaderControlsDirtyStateIndicator}>*</div>}
        <div className={locals.lightCardHeaderControlsSelectionTitle}>
          {t('in-new-components:alerting.components.filterBySelectedEntitiesLabel')}
        </div>
        <Toggle
          checked={filterBySelectionState}
          onChange={() => {
            setFilterBySelectionState(_showInteractedItemsOnly => !_showInteractedItemsOnly);
          }}
        />
      </HorizontalFlexWrapper>
      <div className={locals.lightCardHeaderControlsSearchInputWrapper}>
        <ServicesAndEndpointsSearchInput onChange={query => setSearchQuery(query)} />
      </div>
    </HorizontalFlexWrapper>
  );
}
