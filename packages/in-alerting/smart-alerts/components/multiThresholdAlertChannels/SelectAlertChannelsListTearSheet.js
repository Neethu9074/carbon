/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { Button } from '@instana/components';

//@ts-expect-error TS Migration
import AlertChannelsListForSlideIn from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/AlertChannels/AlertChannelsList';
import {
  updateDefaultSelectionsToForm,
  getThresholdFieldStatus
} from 'in-alerting/smart-alerts/components/multiThresholdAlertChannels/utils';
import AlertConfigSlideInContentWrapper from 'in-alerting/smart-alerts/components/dialog/AlertConfigSlideInContentWrapper';
import { limitForConnectedAlertChannels } from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/Alerts/Alert';
import SelectListDialogContentComponent from 'in-settings/tabs/GlobalSettings/components/SelectListDialogContent';
import AlertChannelCreation from 'in-alerting/smart-alerts/components/dialog/AlertChannelCreation';
import DialogContentWrapper from 'in-alerting/smart-alerts/components/dialog/DialogContentWrapper';
import DialogWithSlideInView from 'in-components/Dialog/DialogWithSlideInView';
import DialogFooter from 'in-components/BlueprintFormMultistep/DialogFooter';
import SlideInView from 'in-components/SlideInView/SlideInView';
import SaveButton from 'in-components/form/SaveButton';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/components/dialog/ConfigureAlertChannel.mless';

export default function SelectAlertChannelsListTearSheet({
  form,
  updateForm,
  close,
  numberOfAlertChannelListRows,
  alertChannelPerSeverityEnabled
}) {
  const [slideInViewVisible, setSlideInViewVisible] = useState(false);
  const [slideInConfig, setSlideInConfig] = useState(null);
  const setSliderState = ({ slideInConfig, isVisible }) => {
    if (slideInConfig) {
      setSlideInConfig(slideInConfig);
    }
    setSlideInViewVisible(isVisible);
  };
  const selectedChannels = form?.get('alertChannels')?.value;
  const selectedChannelsArrayField = form?.get('hiddenFields')?.get('selectedChannelList');
  const { warningThresholdFieldDisabled, criticalThresholdFieldDisabled } = getThresholdFieldStatus(form);

  return (
    <DialogWithSlideInView
      title={t('in-alerting:smartAlerts.components.smartAlertDialog.selectAlertChannelButtonTitle')}
      slideInViewTitle={t('in-alerting:smartAlerts.components.smartAlertDialog.createAlertChannelTitle')}
      titleIconType="lib_alerts_create"
      onClose={() => {
        close();
      }}
      slideInViewVisible={slideInViewVisible}
      slideInViewComponent={slideInConfig?.component}
      onSlideInViewTitleClick={() => setSlideInViewVisible(!slideInViewVisible)}
      doNotCloseOnOutsideClick
      removeBottomPaddingWhenFooterIsShown
    >
      <DialogContentWrapper>
        <SelectListDialogContent
          form={form}
          updateForm={updateForm}
          setSliderState={setSliderState}
          selectedChannelsArrayField={selectedChannelsArrayField}
          limitForConnectedAlertChannels={limitForConnectedAlertChannels}
          selectedChannels={selectedChannels}
          warningThresholdFieldDisabled={warningThresholdFieldDisabled}
          criticalThresholdFieldDisabled={criticalThresholdFieldDisabled}
          close={close}
          numberOfAlertChannelListRows={numberOfAlertChannelListRows}
          alertChannelPerSeverityEnabled={alertChannelPerSeverityEnabled}
        />
      </DialogContentWrapper>
    </DialogWithSlideInView>
  );
}

function SelectListDialogContent({
  form,
  updateForm,
  setSliderState,
  selectedChannelsArrayField,
  limitForConnectedAlertChannels,
  selectedChannels,
  warningThresholdFieldDisabled,
  criticalThresholdFieldDisabled,
  close,
  numberOfAlertChannelListRows,
  alertChannelPerSeverityEnabled
}) {
  return (
    <SelectListDialogContentComponent
      listComponent={AlertChannelsListForSlideIn}
      listComponentRightHeader={
        role?.canConfigureIntegrations && (
          <Button
            className={locals.createAlertChannelButton}
            kind="action"
            icon="lib_actions_build_outline"
            onClick={() => {
              setSliderState({
                slideInConfig: {
                  component: (
                    <SlideInView
                      staticContent={
                        <AlertConfigSlideInContentWrapper>
                          <AlertChannelCreation
                            onCancel={() =>
                              setSliderState({
                                slideInConfig: {},
                                isVisible: false
                              })
                            }
                            isTearsheet
                            alertChannelPerSeverityEnabled={alertChannelPerSeverityEnabled}
                          />
                        </AlertConfigSlideInContentWrapper>
                      }
                    />
                  )
                },
                isVisible: true
              });
            }}
          >
            {t('in-alerting:smartAlerts.components.smartAlertDialog.createAlertChannelTitle')}
          </Button>
        )
      }
      hiddenIds={selectedChannelsArrayField.value}
      limit={limitForConnectedAlertChannels}
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
        close();
      }}
      renderCustomFormActions={numberOfItems => {
        return (
          <DialogFooter
            form={form}
            onSecondaryActionClick={() => close()}
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
    />
  );
}

SelectAlertChannelsListTearSheet.propTypes = {
  form: PropTypes.object.isRequired,
  updateForm: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired,
  numberOfAlertChannelListRows: PropTypes.number,
  alertChannelPerSeverityEnabled: PropTypes.bool
};
