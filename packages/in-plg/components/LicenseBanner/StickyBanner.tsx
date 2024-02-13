/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import classNames from 'classnames';
import React from 'react';

import { Link, Button, SvgIcon, Typography, Stack } from '@instana/components';

//@ts-expect-error missing typescript migration
import { getQueuedLicensesAsResultObservable } from 'in-amp/api/account';
//@ts-expect-error missing typescript migration
import RequestQuoteDialog from 'in-components/RequestQuoteDialog';
import { BUY_NOW_BUTTON_CLICKED, REQUEST_QUOTE_BUTTON_CLICKED, track } from 'in-services/tracking/tracking';
import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper/HorizontalFlexWrapper';
import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import { onPremLicenseInformationEnabled } from 'in-services/featureFlags';
import { useLocation } from 'in-stores/navigation/LocationStateProvider';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { Message } from 'in-components/MessageFlyout/stores/messages';
import AssistMe from 'in-plg/components/AssistMe/AssistMe';
import Sticky from 'in-components/Sticky';
import { Trans, t } from 'in-i18n';

import locals from './StickyBanner.mless';

interface StickyBannerProps {
  message: Message;
}

export function StickyBanner({ message }: StickyBannerProps) {
  const location = useLocation();
  let queuedLicenseDetails: any;
  getQueuedLicensesAsResultObservable(1).subscribe((queuedLicense: any) => {
    queuedLicenseDetails = queuedLicense;
  });
  const tryOfferLicenseType =
    message.activeLicense == 'selfService' ||
    message.activeLicense == 'quota' ||
    message.activeLicense == 'free_not_for_resale';
  const queuedUpLicense = queuedLicenseDetails.data?.items[0]?.license.name;
  const isPaidLicenseUsage = message.activeLicense == 'hostBasedPaid';
  const noQueuedLicense = queuedUpLicense !== 'paidPerUse' && queuedUpLicense !== 'hostBasedPaid';
  return (
    <Sticky
      header={
        <HorizontalFlexWrapper className={locals.section}>
          {
            //@ts-expect-error missing class name type
            <Typography className={locals.title} noMargin onDark variant="heading-200">
              {t('in-plg:licenseBanner.freeTrialBannerTitle')}
            </Typography>
          }
          <Stack align="center" direction="horizontal" gap="small">
            {(message.activeLicense == 'selfService' ||
              message.activeLicense == 'quota' ||
              (message.activeLicense == 'free_not_for_resale' && message.remainingDays! <= 30) ||
              (message.remainingDays! <= 30 && isPaidLicenseUsage && noQueuedLicense)) && (
              <>
                <span className={locals.description}>{message.content}</span>
                <IconForRemainingDays remainingDays={message.remainingDays} />
              </>
            )}
            <div
              className={classNames({
                [locals.verticalLine]: tryOfferLicenseType
              })}
            />
            {onPremLicenseInformationEnabled && (
              <div className={locals.subText}>
                <Trans
                  i18nKey="in-plg:licenseBanner.alreadyHaveLicense"
                  components={{
                    linkToDocker: (
                      //@ts-expect-error missing translation
                      <Link
                        className={locals.bannerLink}
                        external
                        href="https://www.ibm.com/docs/obi/current?topic=installer-license-activation-renewal"
                      />
                    ),
                    linkToKubernetes: (
                      //@ts-expect-error missing translation
                      <Link
                        className={locals.bannerLink}
                        external
                        href="https://www.ibm.com/docs/obi/current?topic=kubernetes-installing-operator-based-instana-setup#312-downloading-the-license-file"
                      />
                    )
                  }}
                />
              </div>
            )}
            {!onPremLicenseInformationEnabled && (
              <>
                {message.activeLicense == 'selfService' && (
                  <Button
                    className={locals.button}
                    data-walkme-id="wm-buyonaws"
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
                {(message.activeLicense == 'selfService' ||
                  message.activeLicense == 'quota' ||
                  (message.remainingDays! <= 30 && isPaidLicenseUsage && noQueuedLicense)) && (
                  <Button
                    className={locals.button}
                    data-walkme-id="wm-requestaquote"
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
                )}
                <AssistMe tryOfferLicenseType={tryOfferLicenseType} />
              </>
            )}
          </Stack>
        </HorizontalFlexWrapper>
      }
    />
  );
}

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

const IconForRemainingDays = ({ remainingDays = -1 }: { remainingDays: number | undefined }) => {
  /**
   * Days remaining for the free trial to end are converted into hours.
   */
  if (remainingDays >= 6) {
    return <SvgIcon type="lib_uncheck" color="var(--ids-color-option-green-500)" />;
  } else if (remainingDays >= 4 && remainingDays <= 5) {
    return <SvgIcon type="lib_help_error_warning" color="var(--ids-color-option-yellow-500)" />;
  } else if (remainingDays >= 0 && remainingDays <= 3) {
    return <SvgIcon type="lib_help_error_info_circle" color="var(--ids-color-option-red-500)" />;
  } else {
    return <SvgIcon type="lib_help_error_info_circle" color="var(--ids-color-option-red-500)" />;
  }
};
