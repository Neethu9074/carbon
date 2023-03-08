/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useMemo, useState } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import { Toggle, Stack, Spacer } from '@instana/components';

import ServicesAndEndpointsListPresenter, {
  ServicesAndEndpointsSearchInput
} from 'in-alerting/smart-alerts/applications/scopeConfig/ServicesAndEndpointsListPresenter/ServicesAndEndpointsListPresenter';
import { ClearTagFilterExpressionButton } from 'in-alerting/smart-alerts/components/dialog/ClearTagFilterExpressionButton';
import { createBoundedAlertQueryBuilder } from 'in-alerting/smart-alerts/synthetics/components/AlertQueryBuilder';
import SectionLabelWithSubtext from 'in-components/workspace/SectionLabelWithSubtext/SectionLabelWithSubtext';
import ScopeMigrationMessage from 'in-alerting/smart-alerts/applications/scopeConfig/ScopeMigrationMessage';
import AlertFilterConfigurator from 'in-alerting/smart-alerts/components/dialog/AlertFilterConfigurator';
import ExpandableLightCard from 'in-alerting/components/ExpandableLightCard/ExpandableLightCard';
import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper';
import { days } from 'in-services/time';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/applications/scopeConfig/ScopeConfig.mless';

/**
 * Timeframe used for both the entities listed in the advanced AP/Service/Endpoint selector and for the tag-suggestions
 * in QB2. The bigger the timeframe, the better the coverage of entities to be selected, even for entities that did not receive
 * any calls recently. However, large timeframes makes resolving entities/suggestions and UI interaction slow, or even impossible
 * due to timeouts.
 */
const scopeSelectionTimeConfig = {
  windowSize: days.toMillis(1)
};
export default function ScopeConfig({
  form,
  updateForm,
  isGlobalSmartAlert,
  editMode,
  migrationMode,
  scopeMigrationDetails,
  initialConfiguredApplications
}) {
  const applications = form.get('applications').value;
  const boundaryScope = form.get('boundaryScope').value;
  const tagFilterExpression = form.get('tagFilterExpression').value;
  const includeInternal = form.get('includeInternal').value;
  const includeSynthetic = form.get('includeSynthetic').value;
  const isBuiltIn = form.get('builtIn').value;
  const alertType = form.get('rule').get('alertType').value;
  const thresholdType = form.get('threshold').get('type').value;

  const [searchQuery, setSearchQuery] = useState('');
  const [filterBySelectionState, setFilterBySelectionState] = useState(Boolean(editMode));
  const shouldDisplayAlertConfigurator = !isBuiltIn || tagFilterExpression.length > 0;

  const { QueryBuilder } = useMemo(() => {
    return createBoundedAlertQueryBuilder(
      applications,
      boundaryScope,
      scopeSelectionTimeConfig,
      thresholdType,
      alertType
    );
  }, [applications, boundaryScope, thresholdType, alertType]);

  return (
    <ExpandableLightCard
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
      bodyWithoutPadding
      openByDefault
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
              includeInternal={includeInternal}
              includeSynthetic={includeSynthetic}
              searchQuery={searchQuery}
              editMode={editMode}
              showInteractedItemsOnly={filterBySelectionState}
              isGlobalSmartAlert={isGlobalSmartAlert}
              initialConfiguredApplications={initialConfiguredApplications}
              validationError={
                !form.get('applications').valid &&
                t('in-alerting:smartAlerts.components.smartAlertDialog.scopeConfigSelectOneEntryMessage')
              }
            />
          </div>
          {shouldDisplayAlertConfigurator && (
            <div
              className={classNames({
                [locals.alertFilterConfiguratorWrapper]: true,
                [locals.alertFilterConfiguratorWrapperBottomPadding]: !tagFilterExpression.length || isBuiltIn
              })}
            >
              <AlertFilterConfigurator QueryBuilderComponent={QueryBuilder} form={form} updateForm={updateForm} />
            </div>
          )}
        </Stack>
        {tagFilterExpression.length > 0 && !isBuiltIn && (
          <div className={locals.clearButtonWrapper}>
            <ClearTagFilterExpressionButton form={form} updateForm={updateForm} />
          </div>
        )}
      </div>
      {migrationMode && scopeMigrationDetails && (
        <ScopeMigrationMessage scopeMigrationDetails={scopeMigrationDetails} />
      )}
    </ExpandableLightCard>
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
  migrationMode: PropTypes.bool,
  scopeMigrationDetails: PropTypes.shape({
    query: PropTypes.string,
    result: PropTypes.string.isRequired
  }),
  form: PropTypes.object.isRequired,
  updateForm: PropTypes.func.isRequired,
  initialConfiguredApplications: PropTypes.object
};
