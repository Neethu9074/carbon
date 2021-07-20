/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useMemo, useState } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import { Toggle, Stack, Spacer } from '@instana/components';

import ServicesAndEndpointsListPresenter, {
  ServicesAndEndpointsSearchInput
} from 'in-alerting/smart-alerts/applications/scopeConfig/ServicesAndEndpointsListPresenter/ServicesAndEndpointsListPresenter';
import { ClearTagFilterExpressionButton } from 'in-alerting/smart-alerts/components/smart-alert-dialog/ClearTagFilterExpressionButton';
import AlertFilterConfigurator from 'in-alerting/smart-alerts/components/smart-alert-dialog/AlertFilterConfigurator';
import { createBoundedAlertQueryBuilder } from 'in-alerting/smart-alerts/applications/components/AlertQueryBuilder';
import SectionLabelWithSubtext from 'in-components/workspace/SectionLabelWithSubtext/SectionLabelWithSubtext';
import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper';
import LightCard from 'in-alerting/components/LightCard/LightCard';
import { days } from 'in-services/time';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/applications/scopeConfig/ScopeConfig.mless';

/**
 * Timeframe used for both the entities listed in the advanced AP/Service/Endpoint selector, as well as for the tag-suggestions
 * in QB2. The bigger the timeframe, the better the coverage of entities to be selected, even for entities that did not receive
 * any calls recently. However, large timeframes makes resolving entities/suggestions and UI interaction slow, or even impossible
 * due to timeouts.
 */
const scopeSelectionTimeConfig = {
  windowSize: days.toMillis(1)
};
export default function ScopeConfig({ form, updateForm, isGlobalSmartAlert, editMode, initialConfiguredApplications }) {
  const applications = form.get('applications').value;
  const boundaryScope = form.get('boundaryScope').value;
  const tagFilterExpression = form.get('tagFilterExpression').value;
  const includeSynthetic = form.get('includeSynthetic').value;
  const isBuiltIn = form.get('builtIn').value;

  const [searchQuery, setSearchQuery] = useState('');
  const [filterBySelectionState, setFilterBySelectionState] = useState(Boolean(editMode));
  const shouldDisplayAlertConfigurator = !isBuiltIn || tagFilterExpression.length > 0;

  const AlertQueryBuilder = useMemo(() => {
    return createBoundedAlertQueryBuilder(applications, boundaryScope, scopeSelectionTimeConfig);
  }, [applications, boundaryScope]);

  return (
    <LightCard
      title={
        <SectionLabelWithSubtext
          subtext={t('in-alerting:smartAlerts.components.smartAlertDialog.scopeConfigTitleTooltip')}
        >
          <div className={locals.lightCardTitle}>
            {isGlobalSmartAlert
              ? t('in-alerting:smartAlerts.components.smartAlertDialog.scopeConfigTitleWithApplications')
              : t('in-alerting:smartAlerts.components.smartAlertDialog.scopeConfigTitle')}
          </div>
        </SectionLabelWithSubtext>
      }
      headerClassName={locals.lightCardHeader}
      header={
        <LightCardHeaderControls
          filterBySelectionState={filterBySelectionState}
          setSearchQuery={setSearchQuery}
          setFilterBySelectionState={setFilterBySelectionState}
        />
      }
      withoutPadding
      darkFrame
      framed
    >
      <div className={locals.scopeConfigContainer}>
        <Stack>
          <div
            className={classNames({
              [locals.servicesAndEndpointsListPresenterWrapper]: shouldDisplayAlertConfigurator
            })}
          >
            <ServicesAndEndpointsListPresenter
              applicationsSelection={applications}
              onChange={applicationsSelection =>
                updateForm(
                  form.updateIn(['applications'], field => field.setValue(applicationsSelection).setTouched(true))
                )
              }
              timeConfig={scopeSelectionTimeConfig}
              boundaryScope={boundaryScope}
              includeSynthetic={includeSynthetic}
              searchQuery={searchQuery}
              editMode={editMode}
              showInteractedItemsOnly={filterBySelectionState}
              isGlobalSmartAlert={isGlobalSmartAlert}
              initialConfiguredApplications={initialConfiguredApplications}
            />
          </div>
          {shouldDisplayAlertConfigurator && (
            <div
              className={classNames({
                [locals.alertFilterConfiguratorWrapper]: true,
                [locals.alertFilterConfiguratorWrapperBottomPadding]: !tagFilterExpression.length || isBuiltIn
              })}
            >
              <AlertFilterConfigurator QueryBuilderComponent={AlertQueryBuilder} form={form} updateForm={updateForm} />
            </div>
          )}
        </Stack>
        {tagFilterExpression.length > 0 && !isBuiltIn && (
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
        <Spacer horizontal="xxsmall" />
        <Toggle
          checked={filterBySelectionState}
          onChange={() => {
            setFilterBySelectionState(_showInteractedItemsOnly => !_showInteractedItemsOnly);
          }}
        />
        <Spacer horizontal="xxsmall" />
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
