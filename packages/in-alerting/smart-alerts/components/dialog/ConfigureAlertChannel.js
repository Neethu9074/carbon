/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { filter } from 'lodash';

import { Button } from '@instana/components';

import AlertConfigSlideInContentWrapper from 'in-alerting/smart-alerts/components/dialog/AlertConfigSlideInContentWrapper';
import AlertChannelsList from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/AlertChannels/AlertChannelsList';
import { limitForConnectedAlertChannels } from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Alerts/Alert';
import SelectListDialogContentComponent from 'in-settings/tabs/TeamSettings/components/SelectListDialogContent';
import { getAlertChannelsInfosMutable, getAlertChannelsAsResultObservable } from 'in-api/alertChannels';
import AlertChannelCreation from 'in-alerting/smart-alerts/components/dialog/AlertChannelCreation';
import SlideInView, { NoHeader } from 'in-components/SlideInView/SlideInView';
import DialogFooter from 'in-components/BlueprintFormMultistep/DialogFooter';
import NoChannelSelected from 'in-alerting/components/NoChannelSelected';
import TouchedMessages from 'in-components/form/TouchedMessages';
import { alwaysEmptyArray } from 'in-services/fixedStreams';
import SaveButton from 'in-components/form/SaveButton';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/components/dialog/ConfigureAlertChannel.mless';

export default function ConfigureAlertChannel({
  form,
  onChange,
  setSliderState,
  setCustomSlideInHeaderConfig,
  numberOfAlertChannelListRows = 5
}) {
  const alertChannelInfos = getAlertChannelsAsResultObservable('')
    .map(result => {
      if (result == null || result?.progress?.loading) {
        return null;
      }
      return result?.data ?? [];
    })
    .startWith(null);

  return (
    <>
      <AlertChannelsList
        setTitle={false}
        loadEntities={() => getSelectedAlertChannelsInfos(form.get('alertChannelIds').value, alertChannelInfos)}
        hasRowNavigation={false}
        renderNoDataAvailable={() => <NoChannelSelected />}
        tableActions={alertChannelSelectionTableActions(form, onChange)}
        rightHeader={
          <Button
            className={locals.selectButton}
            kind="action"
            onClick={() =>
              setSliderState({
                slideInConfig: {
                  component: (
                    <SelectListDialogContent
                      form={form}
                      onSubmit={selectedIds => {
                        const currentAlertChannelIds = form.get('alertChannelIds').value ?? [];
                        onChange(['alertChannelIds'], field =>
                          field.setValue(currentAlertChannelIds.concat(selectedIds)).setTouched(true)
                        );
                        setSliderState({ isVisible: false });
                      }}
                      numberOfAlertChannelListRows={numberOfAlertChannelListRows}
                      setCustomSlideInHeaderConfig={setCustomSlideInHeaderConfig}
                      setSliderState={setSliderState}
                    />
                  ),
                  title: t('in-alerting:smartAlerts.components.smartAlertDialog.selectAlertChannelButtonTitle')
                },
                isVisible: true
              })
            }
            icon="lib_openclose_add_circle_outline"
          >
            {t('in-alerting:smartAlerts.components.smartAlertDialog.selectAlertChannelButton')}
          </Button>
        }
      />
      <TouchedMessages field={form.get('alertChannelIds')} />
    </>
  );
}

function SelectListDialogContent({
  form,
  onSubmit,
  setSliderState,
  setCustomSlideInHeaderConfig,
  numberOfAlertChannelListRows
}) {
  const initialState = false;
  const [slideInContentVisible, setSlideInContentVisible] = useState(initialState);
  const alertChannelInfos = useMemo(() => {
    return getAlertChannelsInfosMutable().startWith(null);
  }, []);

  return (
    <SlideInView
      staticContent={
        <AlertConfigSlideInContentWrapper>
          <SelectListDialogContentComponent
            listComponent={props => <AlertChannelsList {...props} loadEntities={() => alertChannelInfos} />}
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
            hiddenIds={form.get('alertChannelIds').value}
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

function getSelectedAlertChannelsInfos(selectedChannels, alertChannelInfos) {
  if (selectedChannels.length === 0) {
    return alwaysEmptyArray;
  }
  return alertChannelInfos.map(channels => filter(channels, channel => selectedChannels.indexOf(channel.id) >= 0));
}

function alertChannelSelectionTableActions(form, onChange) {
  return {
    deselect: {
      deselect: deselectedEntity => {
        if (deselectedEntity) {
          const value = form.get('alertChannelIds').value.filter(referencedId => referencedId !== deselectedEntity.id);
          onChange(['alertChannelIds'], field => field.setValue(value).setTouched(true));
        }
      }
    }
  };
}

ConfigureAlertChannel.propTypes = {
  form: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  setSliderState: PropTypes.func.isRequired,
  setCustomSlideInHeaderConfig: PropTypes.func.isRequired,
  numberOfAlertChannelListRows: PropTypes.number
};
