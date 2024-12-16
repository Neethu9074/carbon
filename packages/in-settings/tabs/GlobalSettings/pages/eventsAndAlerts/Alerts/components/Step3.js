/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment, useMemo } from 'react';

import { Link } from '@instana/components';

import Applications, {
  getSelectedApplicationConfigsByName,
  applicationSelectionTableActions,
  getSelectedApplicationsForAlertsEvents,
  submitApplicationSelection,
  noRightHeader
} from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/components/Applications';
import {
  applyOnOptions,
  scopeApplication,
  scopeEverything,
  scopeDfq
} from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/shared';
import { modeSelectedSmartAlerts } from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/Alerts/components/Step2';
import SelectListDialogButton from 'in-settings/tabs/GlobalSettings/components/SelectListDialogButton';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import SectionHeading from 'in-settings/components/SectionHeading';
import { getApplicationConfigs } from 'in-api/applicationConfigs';
import TouchedMessages from 'in-components/form/TouchedMessages';
import DescriptionText from 'in-components/form/DescriptionText';
import DfqSearchBar from 'in-components/SearchBar/DfqSearchBar';
import { Row, Col } from 'in-components/layout/Grid/Grid';
import FormGroup from 'in-settings/components/FormGroup';
import { isBlank } from 'in-services/util/string';
import ComboBox from 'in-components/ComboBox';
import Label from 'in-components/form/Label';
import connectTo from 'in-hoc/connectTo';
import { t, Trans } from 'in-i18n';

import locals from './Step3.mless';

export default connectTo(props => {
  const selectedApplicationName = props.form.get('application') ? props.form.get('application').value : '';
  if (selectedApplicationName === null || isBlank(selectedApplicationName)) {
    return {
      existingApplication: null
    };
  }
  return {
    existingApplication: getSelectedApplicationConfigsByName(selectedApplicationName)
  };
})(Step3);

function Step3({ form, setForm, onChange, onChangeApplyOn, existingApplication }) {
  let selectedApplicationIds = form.get('applicationIds') ? form.get('applicationIds').value : [];

  if (existingApplication) {
    existingApplication.forEach(app => {
      selectedApplicationIds.push(app.id);
    });
  }

  const applicationConfigs = useMemo(() => {
    return getApplicationConfigs();
  }, []);

  return (
    <Fragment>
      <SectionHeading>{t('in-settings:tabs.3Scope')}</SectionHeading>
      <Row>
        <Col lg={6}>
          {form.get('applyOn').map(field => (
            <FormGroup>
              <Label htmlFor="alert-apply-on" hasError={!field.valid && field.touched}>
                {t('in-settings:tabs.applyOnRequired')}
              </Label>
              <ComboBox
                name="alert-apply-on"
                value={field.value}
                options={getApplyOnOptions(form)}
                isClearable={false}
                onChange={e => {
                  const updatedForm = onChangeApplyOn(form, e ? e.value : null);
                  if (updatedForm) {
                    setForm(updatedForm);
                  }
                }}
              />
              <TouchedMessages field={field} />
              {form.get('applyOn').value === scopeEverything && (
                <DescriptionText>
                  <Trans i18nKey="in-settings:tabs.allEventsThatMatchTheEventTypesWillEnterTheNotificationStream" />
                </DescriptionText>
              )}
            </FormGroup>
          ))}
        </Col>
        <Col lg={6}>
          {form.get('applyOn').value === scopeDfq &&
            form.get('query').map(field => (
              <FormGroup>
                <Label htmlFor="config-query" hasError={!field.valid && field.touched}>
                  {t('in-settings:tabs.dynamicFocusQuery')}
                </Label>
                <DfqSearchBar
                  id="config-query"
                  theme="light"
                  onQueryValueChange={value => {
                    onChange('query', value);
                  }}
                  queryValue={field.value || ''}
                  manageFiltersDisabled
                />
                <DescriptionText>
                  <Trans
                    i18nKey="in-settings:tabs.dfqFormDesc"
                    components={{
                      docLink: <Link size="sm" href="https://ibm.biz/dynamic-focus-syntax" external />
                    }}
                  />
                </DescriptionText>
              </FormGroup>
            ))}
        </Col>
      </Row>
      {form.get('applyOn').value === scopeApplication && (
        <FormGroup>
          <Applications
            setTitle={false}
            loadEntities={() => getSelectedApplicationsForAlertsEvents(selectedApplicationIds, applicationConfigs)}
            hasRowNavigation={false}
            noDataMessage={t('in-settings:tabs.noApplicationPerspectivesSelected')}
            tableActions={applicationSelectionTableActions(form, setForm)}
            rightHeader={
              <SelectListDialogButton
                form={form}
                onSubmit={selectedIds => submitApplicationSelection(form, setForm, selectedIds)}
                title={t('in-settings:tabs.addApplicationPerspectives')}
                label={t('in-settings:tabs.addApplicationPerspectives')}
                listComponent={props => <Applications {...props} loadEntities={() => applicationConfigs} />}
                listComponentRightHeader={noRightHeader}
                limit={10}
                hiddenIds={selectedApplicationIds}
                createSubmitLabel={numberOfItems =>
                  numberOfItems > 0
                    ? t('in-settings:tabs.addNumberOfItemsApplicationPerspective', { count: numberOfItems })
                    : t('in-settings:tabs.add')
                }
                requiresAtLeastOneMessage={t('in-settings:tabs.pleaseSelectAtLeastOneApplicationPerspectives')}
              />
            }
          />
          <TouchedMessages field={form.get('applicationIds')} />
        </FormGroup>
      )}
      <MatchingEntitiesIndicator form={form} />
    </Fragment>
  );
}

function MatchingEntitiesIndicator({ form }) {
  return (
    <div className={locals.matchingEntitiesIndicator}>
      {form.get('matchingEntitiesQueryInProgress').value && (
        <LoadingIndicator inline className={locals.matchingEntitiesQueryInProgressIndicator} />
      )}
      {!form.get('matchingEntitiesQueryInProgress').value &&
        form.get('matchingEntities').map(field => {
          const matchingEntities = field.value;
          if (!matchingEntities && matchingEntities != 0) {
            return null;
          }
          if (matchingEntities === 0) {
            return t('in-settings:tabs.yourSelectionMatchesNoEventsInThePast2Weeks');
          } else {
            return (
              <span>
                {t('in-settings:tabs.yourSelectionMatchesSomeEventsInThePast2Weeks', {
                  operator: matchingEntities >= 10000 ? '>' : '',
                  count: matchingEntities
                })}
              </span>
            );
          }
        })}
    </div>
  );
}

function getApplyOnOptions(form) {
  const eventSelectionMode = form.get('eventSelectionMode').value;

  if (eventSelectionMode === modeSelectedSmartAlerts) {
    return applyOnOptions.filter(({ value }) => value !== scopeDfq);
  }

  return applyOnOptions;
}
