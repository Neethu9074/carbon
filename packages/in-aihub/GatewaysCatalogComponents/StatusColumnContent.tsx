/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useState } from 'react';

import {
  CarbonComposedModal as ComposedModal,
  CarbonModalFooter as ModalFooter,
  CarbonModalHeader as ModalHeader,
  CarbonModalBody as ModalBody,
  CarbonStack as Stack,
  Typography,
  CarbonButton as Button
} from '@instana/components';
import type { Result } from '@instana/types';
import { Toggle } from '@instana/carbon';

import { refreshGatewaysData } from 'in-aihub/GatewaysCatalogComponents/useGatewaysData';
import type { Gateway } from 'in-aihub/GatewaysCatalogComponents/useGatewaysData';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import { enableGateway, getEnabledGateway } from 'in-aihub/api';
import { ENABLE_GATEWAY } from 'in-aihub/constants/eventNames';
import { hasError, isLoading } from 'in-services/util/result';
import { seconds } from 'in-services/time/time';
import { t } from 'in-i18n';

interface StatusColumnContentProps {
  gateway: Gateway;
}

export default function StatusColumnContent({ gateway }: StatusColumnContentProps) {
  const { id, name } = gateway;
  const enabled = gateway.enabled === true;
  const [loading, setLoading] = useState(false);
  const { trackCta } = useSegmentTracking();

  const enableGatewayFunc = () => {
    setLoading(true);

    // Call API to update gateway
    enableGateway(id).once(
      () => {
        setLoading(false);

        // Track the enable gateway event
        trackCta(ENABLE_GATEWAY, {
          gatewayId: id,
          gatewayName: name,
          aiModel: gateway.aiModel,
          capabilities: gateway.supports?.capabilities
        });

        close();
        addMessage(
          {
            type: 'info',
            timeout: seconds.toMillis(2),
            content: t('in-aihub:gateways.statusToggle.enabledSuccess', { name })
          },
          'gateway-status-update-info'
        );
        refreshGatewaysData(); // Close the confirmation dialog
      },
      error => {
        setLoading(false);
        addMessage(
          {
            type: 'danger',
            timeout: seconds.toMillis(15),
            content: t('in-aihub:gateways.statusToggle.updateFailed', { name, errorMessage: error.message })
          },
          'gateway-status-update-error'
        );
        close(); // Close the confirmation dialog
      }
    );
  };

  // Helper function to show the confirmation dialog
  const showConfirmationDialog = (enabledGatewayName?: string) => {
    const confirmationDialog = (
      <ComposedModal aria-label="Confirm gateway enable" size="md" open onClose={close}>
        <ModalHeader title={<div>{t('in-aihub:gateways.statusToggle.enableConfirmTitle')}</div>} />
        <ModalBody>
          <Stack orientation="vertical" gap="small">
            <Typography variant="body-regular">
              {t('in-aihub:gateways.statusToggle.enableConfirmDescription', {
                name: enabledGatewayName || ''
              })}
            </Typography>
            <Typography variant="body-regular">{t('in-aihub:gateways.statusToggle.enableConfirmQuestion')}</Typography>{' '}
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Button kind="secondary" onClick={close}>
            {t('in-aihub:gateways.statusToggle.enableConfirmCancel')}
          </Button>
          <Button kind="primary" dangerDescription={t('in-applications:buttonDelete')} onClick={enableGatewayFunc}>
            {t('in-aihub:gateways.statusToggle.enableConfirmProceed')}
          </Button>
        </ModalFooter>
      </ComposedModal>
    );

    addActiveDialog(confirmationDialog);
  };

  const toggleGatewayStatus = () => {
    // If gateway is enabled and user is trying to disable it, show error notification
    if (enabled) {
      addMessage(
        {
          type: 'danger',
          timeout: seconds.toMillis(5),
          title: t('in-aihub:gateways.statusToggle.disableTitle'),
          content: t('in-aihub:gateways.statusToggle.disableMessage')
        },
        'gateway-status-update-error'
      );
      return;
    }

    // Get the capability from the current gateway
    const capability = gateway.supports?.capabilities?.[0];

    if (!capability) {
      // If no capability is found, proceed with the default behavior
      showConfirmationDialog();
      return;
    }
    // Set loading state while fetching data
    setLoading(true);

    // Call API to get the enabled gateway for this capability
    getEnabledGateway(capability)
      .filter(res => !isLoading(res))
      .once(
        result => {
          setLoading(false);

          if (hasError(result)) {
            showConfirmationDialog();
            return;
          }

          // Extract the data from the result - simplified approach
          const anyResult = result as Result<Gateway>;

          // Handle different response formats and ensure we always have an array
          const enabledGateways =
            anyResult && Array.isArray(anyResult.data)
              ? anyResult.data
              : Array.isArray(anyResult?.data)
              ? anyResult.data
              : [];

          // Show dialog with gateway name if available
          if (enabledGateways.length > 0) {
            showConfirmationDialog(enabledGateways[0].name);
          } else {
            showConfirmationDialog();
          }
        },
        () => {
          setLoading(false);
          showConfirmationDialog();
        }
      );
  };

  return (
    <Toggle
      disabled={loading}
      hideLabel
      size="sm"
      labelText={enabled ? t('in-aihub:gateways.statusToggle.enabled') : t('in-aihub:gateways.statusToggle.disabled')}
      id={`${id}-status-toggle`}
      toggled={enabled}
      onToggle={toggleGatewayStatus}
    />
  );
}
