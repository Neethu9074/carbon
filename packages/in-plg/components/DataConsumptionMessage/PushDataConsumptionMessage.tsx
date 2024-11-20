/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Button } from '@instana/components';

import { addMessage, removeMessage } from 'in-components/MessageFlyout/stores/messages';
import { DataUsageProps } from 'in-plg/components/DataConsumptionMessage/types';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { REVIEW_DATA_USAGE_BUTTON } from 'in-services/tracking/eventNames';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { dataUsageNotificationEnabled } from 'in-services/featureFlags';
import { ampUsage } from 'in-settings/navigation/paths';
import { config } from 'in-services/config';
import http from 'in-services/http';
import { Trans, t } from 'in-i18n';

import locals from 'in-plg/components/DataConsumptionMessage/PushDataConsumptionMessage.mless';

let expanded: boolean = false;

export default function PushDataConsumptionMessage() {
  const { activeLicenseType } = config;
  if (
    dataUsageNotificationEnabled &&
    window.instana.user?.role?.name === 'Owner' &&
    window.instana.user?.role?.canViewAccountAndBillingInformation
  ) {
    getDataUsageAsResultInternal().once(data => {
      const dataUsagePercentage = data?.body.percentage;
      const roundOffValue = roundOff(dataUsagePercentage).roundedPercentage;
      const storeValue = roundOff(dataUsagePercentage).storageValue;
      const changeStorageValue = dataUsageRangeChange(storeValue);
      if (changeStorageValue) {
        localStorage.setItem('showDataUsageNotificationValue', storeValue);
      }
      if (activeLicenseType === 'hostBasedPaid' && dataUsagePercentage >= 80 && changeStorageValue) {
        addMessage(
          {
            title: getTitle(dataUsagePercentage),
            type: 'info',
            icon: 'info',
            content: <DataConsumptionMessageContent roundOffValue={roundOffValue} />
          },
          'data-consumption-message'
        );
      }
    });
  }
}

function DataConsumptionMessageContent({ roundOffValue }: { roundOffValue: number }) {
  const { createHrefToPath } = useNavigation();
  const { trackCta } = useSegmentTracking();
  return (
    <>
      <Trans
        i18nKey="in-plg:dataConsumptionMessage.description"
        values={{
          dataConsumption: roundOffValue,
          remainingText:
            roundOffValue >= 100
              ? t('in-plg:dataConsumptionMessage.remainingTextHundred')
              : t('in-plg:dataConsumptionMessage.remainingText')
        }}
      />
      <Button
        size="compact"
        kind="tertiary"
        className={locals.button}
        href={createHrefToPath(ampUsage)}
        onClick={() => {
          setExpandState(true);
          trackCta(REVIEW_DATA_USAGE_BUTTON);
          removeMessage('data-consumption-message');
        }}
      >
        {t('in-plg:dataConsumptionMessage.buttonText')}
      </Button>
    </>
  );
}

//Round off to the lower limit
function roundOff(percentage: number): { roundedPercentage: number; storageValue: string } {
  const thresholds = [
    { min: 100, roundedPercentage: 100, storageValue: '10' },
    { min: 90, roundedPercentage: 90, storageValue: '9' },
    { min: 80, roundedPercentage: 80, storageValue: '8' }
  ];
  for (const threshold of thresholds) {
    if (percentage >= threshold.min) {
      return { roundedPercentage: threshold.roundedPercentage, storageValue: threshold.storageValue };
    }
  }
  return { roundedPercentage: 0, storageValue: '0' };
}

function getTitle(percentage: number): string {
  const titles = [
    { min: 100, key: t('in-plg:dataConsumptionMessage.hundred.title') },
    { min: 90, key: t('in-plg:dataConsumptionMessage.ninety.title') },
    { min: 80, key: t('in-plg:dataConsumptionMessage.eighty.title') }
  ];
  for (const title of titles) {
    if (percentage >= title.min) {
      return title.key;
    }
  }
  return '';
}

function dataUsageRangeChange(storeValue: string) {
  return localStorage.getItem('showDataUsageNotificationValue') !== storeValue;
}

function getDataUsageAsResultInternal() {
  return http<DataUsageProps>({
    method: 'GET',
    maxRetries: 3,
    url: `/api/dataConsumption`
  });
}

// Expanding learn more when the button is clicked
export function getExpandState() {
  return expanded;
}
export function setExpandState(expand: boolean) {
  expanded = expand;
}
