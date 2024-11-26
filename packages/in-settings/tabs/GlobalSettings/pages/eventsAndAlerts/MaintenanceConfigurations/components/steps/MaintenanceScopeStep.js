/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React, { useMemo, useState } from 'react';

import { Link, PreviewPill, Stack } from '@instana/components';

import Applications, {
  applicationSelectionTableActions,
  getSelectedApplicationsForAlert,
  submitApplicationSelection,
  noRightHeader
} from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/components/Applications';
import { createBoundedAlertQueryBuilder } from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/MaintenanceConfigurations/api';
import { useRemoveInvalidTagsFromFilterExpression } from 'in-alerting/smart-alerts/hooks/useRemoveInvalidTagsFromFilterExpression';
import AlertFilterConfigurator from 'in-alerting/smart-alerts/components/dialog/AlertFilterConfigurator';
import SelectListDialogButton from 'in-settings/tabs/GlobalSettings/components/SelectListDialogButton';
import { syntheticsFilterForMaintenanceWindowsEnabled } from 'in-services/featureFlags';
import LightCard from 'in-alerting/components/LightCard/LightCard';
import DescriptionText from 'in-components/form/DescriptionText';
import TouchedMessages from 'in-components/form/TouchedMessages';
import DfqSearchBar from 'in-components/SearchBar/DfqSearchBar';
import IconLabel from 'in-alerting/components/IconLabel';
import FormGroup from 'in-components/form/FormGroup';
import ComboBox from 'in-components/ComboBox';
import Label from 'in-components/form/Label';
import { days } from 'in-services/time';
import { t, Trans } from 'in-i18n';

import locals from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/MaintenanceConfigurations/MaintenanceConfigurationForm.mless';

export default function MaintenanceScopeStep(props) {
  const { form, onChange, onChangeApplyOn, setForm } = props;
  const selectedApplicationIds = form.get('applicationIds') ? form.get('applicationIds').value : [];
  const [tagFilterExpression, setTFE] = useState([]);

  const tagSuggestionTimeConfig = useMemo(
    () => ({
      windowSize: days.toMillis(1),
      autoRefresh: true
    }),
    []
  );

  const { getTagCatalog, QueryBuilder: AlertQueryBuilder } = useMemo(
    () => createBoundedAlertQueryBuilder(tagSuggestionTimeConfig),
    [tagSuggestionTimeConfig]
  );

  useRemoveInvalidTagsFromFilterExpression(getTagCatalog, tagFilterExpression, filteredTagFilterExpression => {
    if (filteredTagFilterExpression.length !== tagFilterExpression) setTFE(filteredTagFilterExpression);
  });

  const getMaintenanceScopeOptions = () => {
    const options = [];
    options.push({ value: 'application', label: t('in-settings:tabs.applicationPerspective') });
    options.push({
      value: 'dfq',
      label: t('in-settings:tabs.selectedEntitiesDynamicFocusQuery')
    });
    if (syntheticsFilterForMaintenanceWindowsEnabled) {
      // Im sorry, I have sinned and not provided a string to the label property. Forgive me TypeScript gods (required for beta tag)
      options.push({
        value: 'synthetic',
        label: t('in-settings:tabs.syntheticTests')
      });
    }
    options.push({ value: 'all', label: t('in-settings:tabs.allAvailableEntities') });

    return options;
  };

  // Provide a custom render rather than breaking typescript
  function Option(props) {
    const { data: option } = props;
    if (option.value !== 'synthetic') return option.label;
    return (
      <Stack direction="horizontal" distribution="spaceBetween" align="center">
        {t('in-settings:tabs.syntheticTests')}
        <PreviewPill className={locals.previewBadge} />
      </Stack>
    );
  }

  return (
    <FormGroup className={locals.mwWrapper}>
      <div className={locals.inputContainer}>
        {form.get('applyOn').map(field => (
          <FormGroup>
            <Label htmlFor="maintenance-applyOn" hasError={!field.valid && field.touched}>
              {t('in-settings:tabs.applyOn')}
            </Label>
            <ComboBox
              name="maintenance-applyOn"
              value={field.value}
              options={getMaintenanceScopeOptions()}
              isClearable={false}
              onChange={e => {
                const updatedForm = onChangeApplyOn(form, e ? e.value : null);
                if (updatedForm) {
                  setForm(updatedForm);
                }
              }}
              components={{ Option }}
            />
            <TouchedMessages field={field} />
            {form.get('applyOn').value === 'all' && (
              <DescriptionText>
                <Trans i18nKey="in-settings:tabs.allAlertsWillBeMutedForTheDurationOfThisMaintenanceWindow" />
              </DescriptionText>
            )}
          </FormGroup>
        ))}
        {form.get('applyOn').value === 'dfq' &&
          form.get('query').map(field => (
            <FormGroup className={locals.dfqForm}>
              <Label htmlFor="maintenance-query" hasError={!field.valid && field.touched}>
                {t('in-settings:tabs.dynamicFocusQuery')}
              </Label>
              <DfqSearchBar
                id="maintenance-query"
                theme="light"
                onQueryValueChange={value => {
                  onChange('query', value);
                }}
                queryValue={field.value || ''}
                manageFiltersDisabled
              />
              <DescriptionText>
                <Trans
                  i18nKey="in-settings:tabs.aNonEmptyFilterQueryWhichDefinesTheMatchingAlerts"
                  components={{
                    docLink: <Link size="sm" href="https://ibm.biz/dynamic-focus-syntax" external />
                  }}
                />
              </DescriptionText>
            </FormGroup>
          ))}

        {form.get('applyOn').value === 'application' &&
          form.get('applicationIds').map(field => (
            <FormGroup>
              <Applications
                setTitle={false}
                loadEntities={() => getSelectedApplicationsForAlert(selectedApplicationIds)}
                hasRowNavigation={false}
                noDataMessage={t('in-settings:tabs.noApplicationPerspectivesSelected')}
                tableActions={applicationSelectionTableActions(form, setForm)}
                rightHeader={
                  <SelectListDialogButton
                    form={form}
                    onSubmit={selectedIds => submitApplicationSelection(form, setForm, selectedIds)}
                    title={t('in-settings:tabs.addApplicationPerspectives')}
                    label={t('in-settings:tabs.addApplicationPerspectives')}
                    listComponent={Applications}
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
              <TouchedMessages field={field} />
            </FormGroup>
          ))}

        {form.get('applyOn').value === 'synthetic' && (
          <FormGroup>
            <LightCard
              title={
                <IconLabel
                  noBottomMargin
                  type={'lib_synthetic'}
                  text={t('in-alerting:smartAlerts.synthetics.selectTests.testAttached')}
                />
              }
              darkFrame
            >
              <AlertFilterConfigurator
                QueryBuilderComponent={AlertQueryBuilder}
                form={form}
                updateForm={form => setForm(form)}
              />
            </LightCard>
          </FormGroup>
        )}
      </div>
    </FormGroup>
  );
}
