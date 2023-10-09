/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Button } from '@instana/components';

// @ts-expect-error missing typescript migration
import RequestQuoteDialog from 'in-components/RequestQuoteDialog';
import { BUY_NOW_BUTTON_CLICKED, REQUEST_QUOTE_BUTTON_CLICKED, track } from 'in-services/tracking/tracking';
import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { Message } from 'in-components/MessageFlyout/stores/messages';
import { t } from 'in-i18n';

import locals from './TrialExpiryDialog.mless';

function getPageType(pathname = '/') {
  const pageName = pathname.split('/')[1];

  switch (pageName) {
    case 'physical':
      return { pageName: 'Infrastructure' };
    case 'websiteMonitoring':
      return { pageName: 'EUM' };
    case 'config':
      return { pageName: 'Settings' };
    case '':
      return { pageName: '--' };
    default:
      return { pageName: pageName.charAt(0).toUpperCase() + pageName.slice(1) };
  }
}
interface CustomButtonsProps {
  message: Message;
}

export function CustomButtons({ message }: CustomButtonsProps) {
  return (
    <>
      {message.activeLicense == 'selfService' && (
        <Button
          className={locals.button}
          kind="primaryv2"
          target="_blank"
          href="https://aws.amazon.com/marketplace/search/results?prevFilters=%257B%2522sr%2522%3A%25220-1%2522%2C%2522ref_%2522%3A%2522beagle%2522%2C%2522applicationId%2522%3A%2522AWSMPContessa%2522%257D&searchTerms=ibm+instana+observability"
          //@ts-expect-error missing rel
          rel="noopener noreferrer"
          onClick={() => track(BUY_NOW_BUTTON_CLICKED, getPageType(location.pathname))}
        >
          {t('in-plg:licenseBanner.buyNowBtn')}
        </Button>
      )}
      <Button
        className={locals.button}
        kind="secondary"
        target="_blank"
        onClick={e => {
          stopPropagationAndPreventDefault(e);
          track(REQUEST_QUOTE_BUTTON_CLICKED, getPageType(location.pathname));
          addActiveDialog(<RequestQuoteDialog />);
        }}
      >
        {t('in-plg:licenseBanner.requestQuoteBtn')}
      </Button>
    </>
  );
}
