/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useMemo, useState } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import Toggle from 'react-toggle';

import ServicesAndEndpointsListPresenter, {
  ServicesAndEndpointsSearchInput
} from 'in-alerting/smart-alerts/applications/scopeConfig/ServicesAndEndpointsListPresenter/ServicesAndEndpointsListPresenter';
import { ClearTagFilterExpressionButton } from 'in-alerting/smart-alerts/components/smart-alert-dialog/ClearTagFilterExpressionButton';
import AlertFilterConfigurator from 'in-alerting/smart-alerts/components/smart-alert-dialog/AlertFilterConfigurator';
import { createBoundedAlertQueryBuilder } from 'in-alerting/smart-alerts/applications/components/AlertQueryBuilder';
import { maxChartViewTimeframe } from 'in-alerting/components/Chart/chartViewConfig';
import HorizontalFlexWrapper from 'in-new-components/layout/HorizontalFlexWrapper';
import LightCard from 'in-new-components/Card/LightCard';
import Stack from 'in-new-components/layout/Stack';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/applications/scopeConfig/ScopeConfig.mless';

const timeConfig = {
  windowSize: maxChartViewTimeframe
};
export default function ScopeConfig({ form, updateForm, isGlobalSmartAlert, editMode, initialConfiguredApplications }) {
  const applications = form.get('applications').value;
  const boundaryScope = form.get('boundaryScope').value;
  const tagFilterExpression = form.get('tagFilterExpression').value;
  const includeSynthetic = form.get('includeSynthetic').value;

  const [searchQuery, setSearchQuery] = useState('');
  const [filterBySelectionState, setFilterBySelectionState] = useState(Boolean(editMode));

  const AlertQueryBuilder = useMemo(() => {
    return createBoundedAlertQueryBuilder(
      Object.values(applications)?.map(a => a.applicationId),
      boundaryScope,
      timeConfig
    );
  }, [applications, boundaryScope]);

  return (
    <LightCard
      title={
        <Tooltip content={t('in-alerting:smartAlerts.components.smartAlertDialog.scopeConfigTitleTooltip')}>
          <div className={locals.lightCardTitle}>
            {isGlobalSmartAlert
              ? t('in-alerting:smartAlerts.components.smartAlertDialog.scopeConfigTitleWithApplications')
              : t('in-alerting:smartAlerts.components.smartAlertDialog.scopeConfigTitle')}
          </div>
        </Tooltip>
      }
      headerClassName={locals.lightCardHeader}
      header={
        <LightCardHeaderControls
          filterBySelectionState={filterBySelectionState}
          setSearchQuery={setSearchQuery}
          setFilterBySelectionState={setFilterBySelectionState}
          tagFilterExpression={tagFilterExpression}
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
              applicationsSelection={applications}
              onChange={applicationsSelection =>
                updateForm(
                  form.updateIn(['applications'], field => field.setValue(applicationsSelection).setTouched(true))
                )
              }
              timeConfig={timeConfig}
              boundaryScope={boundaryScope}
              includeSynthetic={includeSynthetic}
              searchQuery={searchQuery}
              editMode={editMode}
              showInteractedItemsOnly={filterBySelectionState}
              isGlobalSmartAlert={isGlobalSmartAlert}
              initialConfiguredApplications={initialConfiguredApplications}
            />
          </div>
          <div
            className={classNames({
              [locals.alertFilterConfiguratorWrapper]: true,
              [locals.alertFilterConfiguratorWrapperBottomPadding]: tagFilterExpression.length === 0
            })}
          >
            <AlertFilterConfigurator QueryBuilderComponent={AlertQueryBuilder} form={form} updateForm={updateForm} />
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

function LightCardHeaderControls({ filterBySelectionState, setSearchQuery, setFilterBySelectionState }) {
  return (
    <HorizontalFlexWrapper>
      <HorizontalFlexWrapper>
        <div className={locals.lightCardHeaderControlsSelectionTitle}>
          {t('in-alerting:smartAlerts.components.smartAlertDialog.sortByUserSelectionLabel')}
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

ScopeConfig.propTypes = {
  isGlobalSmartAlert: PropTypes.bool,
  editMode: PropTypes.bool,
  form: PropTypes.object.isRequired,
  updateForm: PropTypes.func.isRequired,
  initialConfiguredApplications: PropTypes.object
};
