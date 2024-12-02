/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { isBoolean } from 'lodash';
import React from 'react';

import {
  Button,
  CarbonMenuItem,
  CarbonModal,
  IconButton,
  LoadingSkeleton,
  SvgIcon,
  Typography
} from '@instana/components';
import { interval } from '@instana/observables';
import { useObservable } from '@instana/hooks';

import {
  getBuiltInEventSpecificationMutable,
  getCustomEventSpecificationMutable,
  setBuiltInEventSpecificationsEnabled,
  setCustomEventSpecificationsEnabled
} from 'in-api/eventSpecifications';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import { CustomEventSpecificationWithMetadata } from 'in-types';
import { EventOrMap } from 'in-events/types';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

import locals from 'in-events/components/tabs/Summary/DisableEventConfigButton.mless';

type DisableEventConfigButtonProps = {
  reload: () => void;
  event: EventOrMap;
  eventType: string;
  buttonKind?: any;
  buttonType?: 'button' | 'iconButton' | 'menuItem';
};

export default function DisableEventConfigButton({
  reload,
  buttonKind = 'secondary',
  event,
  eventType,
  buttonType = 'button'
}: DisableEventConfigButtonProps) {
  const { trackCta } = useSegmentTracking();
  const segmentPropertyChannel = 'EVENT_ACTIONS';
  const ctaEvent = 'event.actions.pause';
  const eventSpecId = event.getIn(['metadata', 'eventSpecificationId'], null);
  let configType = event.getIn(['metadata', 'eventConfigurationType'], null);
  const targetEventConfigTypes = ['Custom Event', 'Built-In Event'];

  const configOnDBEnabled: boolean | null | undefined = useObservable(
    interval(1000).flatMap(() => {
      if (configType == 'Custom Event') {
        return getCustomEventSpecificationMutable(eventSpecId).map(
          result => (result?.enabled && !result?.deleted) ?? false
        );
      }
      return getBuiltInEventSpecificationMutable(eventSpecId).map(result => result?.enabled ?? false);
    }),
    []
  );

  const isConfigLoading = !isBoolean(configOnDBEnabled);
  const handleDisableConfig = () => {
    trackCta(ctaEvent, { startTime: event.get('start') }, segmentPropertyChannel);

    if (!role?.canConfigureEventsAndAlerts || !configOnDBEnabled) return;

    const disableFn =
      configType === 'Custom Event' ? setCustomEventSpecificationsEnabled : setBuiltInEventSpecificationsEnabled;
    close();
    disableFn(eventSpecId, false).once(
      (config: CustomEventSpecificationWithMetadata) => {
        if (config.enabled === false) {
          addMessage({
            type: 'success',
            title: t('in-events:disableConfiguration.successTitle'),
            content: t('in-events:disableConfiguration.successContent'),
            timeout: 5000
          });
        } else {
          addMessage({
            type: 'warning',
            title: t('in-events:disableConfiguration.errorTitle'),
            content: t('in-events:disableConfiguration.errorContent'),
            timeout: 5000
          });
        }
      },
      () => {
        addMessage({
          type: 'warning',
          title: t('in-events:disableConfiguration.errorTitle'),
          content: t('in-events:disableConfiguration.errorContent'),
          timeout: 5000
        });
      }
    );
    reload();
  };
  if (eventSpecId == null) {
    return null;
  }

  if (configType == null) {
    return null;
  }

  if (configType != null && !targetEventConfigTypes.includes(configType)) {
    return null;
  }

  if (!role?.canConfigureEventsAndAlerts) {
    return null;
  }

  if (isConfigLoading) {
    return <LoadingSkeleton className={locals.eventButtonSkeleton} />;
  }

  const buttonName =
    eventType === 'incident'
      ? t('in-events:disableConfiguration.incidentButtonName')
      : t('in-events:disableConfiguration.eventButtonName');

  const confirmationMessage =
    configType == 'Custom Event'
      ? t('in-events:disableConfiguration.confirmationFallbackCustom')
      : t('in-events:disableConfiguration.confirmationFallbackBuiltIn');

  // For incident overview header types
  if (buttonType === 'iconButton') {
    return (
      <IconButton
        type="lib_actions_pause"
        kind={buttonKind}
        disabled={!configOnDBEnabled}
        iconSize="xs"
        isWrapperedByTooltip
        align="left"
        iconDescription={buttonName}
        onClick={() =>
          addActiveDialog(
            <ConfirmationDialog
              handleDisableConfig={handleDisableConfig}
              buttonName={buttonName}
              confirmationMessage={confirmationMessage}
            />
          )
        }
      />
    );
  }

  // for menuButtons
  if (buttonType === 'menuItem') {
    return (
      <CarbonMenuItem
        label={buttonName}
        onClick={() =>
          addActiveDialog(
            <ConfirmationDialog
              handleDisableConfig={handleDisableConfig}
              buttonName={buttonName}
              confirmationMessage={confirmationMessage}
            />
          )
        }
        renderIcon={() => <SvgIcon type="lib_actions_pause" size="xs" />}
        disabled={!configOnDBEnabled}
      />
    );
  }

  return (
    <Button
      kind={buttonKind}
      onClick={() =>
        addActiveDialog(
          <ConfirmationDialog
            handleDisableConfig={handleDisableConfig}
            buttonName={buttonName}
            confirmationMessage={confirmationMessage}
          />
        )
      }
      disabled={!configOnDBEnabled}
      iconSize="xs"
    >
      {buttonName}
    </Button>
  );
}

interface ConfirmationDialogProps {
  handleDisableConfig: () => void;
  buttonName: string;
  confirmationMessage: string;
}
const ConfirmationDialog = ({ handleDisableConfig, buttonName, confirmationMessage }: ConfirmationDialogProps) => {
  return (
    <CarbonModal
      modalHeading={buttonName}
      open
      primaryButtonText={t('in-events:disableConfiguration.confirmationYes')}
      secondaryButtonText={t('in-events:disableConfiguration.confirmationNo')}
      onRequestSubmit={handleDisableConfig}
      onRequestClose={close}
    >
      <Typography variant="body-regular">{t('in-events:disableConfiguration.confirmationBodyExplain')}</Typography>
      <br />
      <Typography variant="body-regular">{t('in-events:disableConfiguration.confirmationBodyQuestion')}</Typography>
      <br />
      <Typography variant="body-regular">{confirmationMessage}</Typography>
    </CarbonModal>
  );
};
