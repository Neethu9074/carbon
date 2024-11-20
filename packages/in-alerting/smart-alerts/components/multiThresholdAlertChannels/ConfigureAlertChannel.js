/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { Button, Stack, Spacer } from '@instana/components';

import createMemoizedObservableForReferencedEntities from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/Alerts/components/memoizeReferencedEntitiesObservable';
import {
  updateChannelListsToForm,
  updateDefaultSelectionsToForm
} from 'in-alerting/smart-alerts/components/multiThresholdAlertChannels/utils';
import AlertChannelsListForSlideIn from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/AlertChannels/AlertChannelsList';
import AlertConfigSlideInContentWrapper from 'in-alerting/smart-alerts/components/dialog/AlertConfigSlideInContentWrapper';
import { limitForConnectedAlertChannels } from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/Alerts/Alert';
import AlertChannelsList from 'in-alerting/smart-alerts/components/multiThresholdAlertChannels/AlertChannelsList';
import SelectListDialogContentComponent from 'in-settings/tabs/GlobalSettings/components/SelectListDialogContent';
import AlertChannelCreation from 'in-alerting/smart-alerts/components/dialog/AlertChannelCreation';
import { isEmpty } from 'in-alerting/smart-alerts/components/dialog/sharedFunctions';
import SlideInView, { NoHeader } from 'in-components/SlideInView/SlideInView';
import DialogFooter from 'in-components/BlueprintFormMultistep/DialogFooter';
import NoChannelSelected from 'in-alerting/components/NoChannelSelected';
import { getAlertChannelsInfosMutable } from 'in-api/alertChannels';
import TouchedMessages from 'in-components/form/TouchedMessages';
import { alwaysEmptyArray } from 'in-services/fixedStreams';
import SaveButton from 'in-components/form/SaveButton';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/components/dialog/ConfigureAlertChannel.mless';

export default function ConfigureAlertChannel({
  form,
  onChange,
  updateForm,
  setSliderState,
  setCustomSlideInHeaderConfig,
  numberOfAlertChannelListRows = 5,
  isTearSheet = false,
  simpleMode = false
}) {
  const selectedChannels = form.get('alertChannels').value;
  //console.log('selectedChannels', selectedChannels);

  const warningThresholdField = form.get('threshold')?.get('warningThreshold');
  const criticalThresholdField = form.get('threshold')?.get('criticalThreshold');
  const warningThresholdFieldDisabled =
    isEmpty(warningThresholdField?.get('value')?.value) && !warningThresholdField?.get('isCheckboxSelected')?.value;
  const criticalThresholdFieldDisabled =
    isEmpty(criticalThresholdField?.get('value')?.value) && !criticalThresholdField?.get('isCheckboxSelected')?.value;
  const selectedChannelsArrayField = form.get('hiddenFields').get('selectedChannelList');

  return (
    <>
      <AlertChannelsList
        setTitle={false}
        form={form}
        onChange={onChange}
        loadEntities={() => getSelectedAlertChannels(selectedChannelsArrayField.value)}
        enabledChannels={form.get('alertChannels').value}
        hasRowNavigation={false}
        renderNoDataAvailable={() => <NoChannelSelected />}
        tableActions={alertChannelSelectionTableActions(form, updateForm)}
        simpleMode={simpleMode}
        rightHeader={
          <Stack gap="xxsmall">
            {!warningThresholdFieldDisabled &&
              !criticalThresholdFieldDisabled &&
              selectedChannelsArrayField.value.length > 0 && (
                <>
                  <Spacer vertical="large" /> <Spacer vertical="xsmall" />
                </>
              )}
            <Button
              kind="action"
              disabled={warningThresholdFieldDisabled && criticalThresholdFieldDisabled && !simpleMode}
              onClick={() => {
                if (!isTearSheet) {
                  setSliderState({
                    slideInConfig: {
                      component: (
                        <SelectListDialogContent
                          form={form}
                          onSubmit={selectedIds => {
                            const currentAlertChannelIds = selectedChannelsArrayField.value;
                            updateDefaultSelectionsToForm(
                              form,
                              updateForm,
                              selectedChannels,
                              warningThresholdFieldDisabled,
                              criticalThresholdFieldDisabled,
                              selectedIds,
                              currentAlertChannelIds
                            );
                            setSliderState({ isVisible: false });
                          }}
                          numberOfAlertChannelListRows={numberOfAlertChannelListRows}
                          setCustomSlideInHeaderConfig={setCustomSlideInHeaderConfig}
                          setSliderState={setSliderState}
                          selectedIds={selectedChannelsArrayField.value}
                        />
                      ),
                      title: t('in-alerting:smartAlerts.components.smartAlertDialog.selectAlertChannelButtonTitle')
                    },
                    isVisible: true
                  });
                }
              }}
              icon="lib_openclose_add_circle_outline"
            >
              {t('in-alerting:smartAlerts.components.smartAlertDialog.selectAlertChannelButton')}
            </Button>
            <Spacer size="disabled" />
          </Stack>
        }
      />
      <TouchedMessages field={form.get('alertChannels')} />
    </>
  );
}

function SelectListDialogContent({
  form,
  onSubmit,
  setSliderState,
  setCustomSlideInHeaderConfig,
  numberOfAlertChannelListRows,
  selectedIds
}) {
  const initialState = false;

  const [slideInContentVisible, setSlideInContentVisible] = useState(initialState);

  return (
    <SlideInView
      staticContent={
        <AlertConfigSlideInContentWrapper>
          <SelectListDialogContentComponent
            listComponent={AlertChannelsListForSlideIn}
            listComponentRightHeader={
              role.canConfigureIntegrations && (
                <Button
                  className={locals.createAlertChannelButton}
                  kind="action"
                  icon="lib_actions_build_outline"
                  onClick={() => {
                    setSlideInContentVisible(true);
                    setCustomSlideInHeaderConfig({
                      title: t('in-alerting:smartAlerts.components.smartAlertDialog.createAlertChannelTitle'),
                      onClose() {
                        setSlideInContentVisible(false);
                      }
                    });
                  }}
                >
                  {t('in-alerting:smartAlerts.components.smartAlertDialog.createAlertChannelTitle')}
                </Button>
              )
            }
            hiddenIds={selectedIds}
            limit={limitForConnectedAlertChannels}
            onSubmit={onSubmit}
            renderCustomFormActions={numberOfItems => {
              return (
                <DialogFooter
                  form={form}
                  onSecondaryActionClick={() =>
                    setSliderState({
                      slideInConfig: {},
                      isVisible: false
                    })
                  }
                  secondaryActionText={t('in-alerting:smartAlerts.components.smartAlertDialog.cancelTitle')}
                  renderCustomSaveAction={() => (
                    <SaveButton type="submit" kind="create" disabled={!numberOfItems}>
                      {numberOfItems
                        ? t('in-alerting:smartAlerts.components.smartAlertDialog.addChannel', {
                            count: numberOfItems
                          })
                        : t('in-alerting:smartAlerts.components.smartAlertDialog.add')}
                    </SaveButton>
                  )}
                />
              );
            }}
            pageSize={numberOfAlertChannelListRows}
            preventCloseOnSubmit
          />
        </AlertConfigSlideInContentWrapper>
      }
      slideInContent={
        <AlertConfigSlideInContentWrapper>
          <AlertChannelCreation onCancel={() => setSlideInContentVisible(initialState)} />
        </AlertConfigSlideInContentWrapper>
      }
      showSlideInContent={slideInContentVisible}
      onShowSlideInContentChange={setSlideInContentVisible}
      HeaderComponent={NoHeader}
      enforceMaxHeightForStaticContent
      onAfterSlideOut={() => {
        setCustomSlideInHeaderConfig({
          title: null,
          onClose: null
        });
      }}
    />
  );
}

const getSelectedAlertChannels = createMemoizedObservableForReferencedEntities(function (selectedChannels) {
  if (selectedChannels.length === 0) {
    return alwaysEmptyArray;
  }
  // null is treated as a pending result when converting the HTTP response into a result
  return getAlertChannelsInfosMutable(selectedChannels).startWith(null);
});

function alertChannelSelectionTableActions(form, updateForm) {
  const selectedChannelsArray = form.get('hiddenFields').get('selectedChannelList').value;

  return {
    deselect: {
      deselect: deselectedEntity => {
        if (deselectedEntity) {
          const deselectedId = deselectedEntity.id;
          const remainingChannels = selectedChannelsArray.filter(referencedId => referencedId !== deselectedId);
          const formChannelIds = form.get('alertChannels').value || {};
          const newWarningSelections = (formChannelIds.WARNING || []).filter(
            referencedId => referencedId !== deselectedId
          );
          const newCriticalSelections = (formChannelIds.CRITICAL || []).filter(
            referencedId => referencedId !== deselectedId
          );

          updateChannelListsToForm(form, updateForm, remainingChannels, newWarningSelections, newCriticalSelections);
        }
      }
    }
  };
}

ConfigureAlertChannel.propTypes = {
  form: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  updateForm: PropTypes.func.isRequired,
  setSliderState: PropTypes.func.isRequired,
  setCustomSlideInHeaderConfig: PropTypes.func.isRequired,
  numberOfAlertChannelListRows: PropTypes.number,
  isTearSheet: PropTypes.bool,
  simpleMode: PropTypes.bool
};
