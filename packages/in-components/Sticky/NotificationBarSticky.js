/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import { Link, Spacer, SvgIcon, Button, Typography } from '@instana/components';
import { useObservable } from '@instana/hooks';

import { BUY_NOW_BUTTON_CLICKED, REQUEST_QUOTE_BUTTON_CLICKED, track } from 'in-services/tracking/tracking';
import HorizontalFlexWrapper from '../layout/HorizontalFlexWrapper/HorizontalFlexWrapper';
import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import { onPremLicenseInformationEnabled } from 'in-services/featureFlags';
import { useLocation } from 'in-stores/navigation/LocationStateProvider';
import { messages$ } from 'in-components/MessageFlyout/stores/messages';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import RequestQuoteDialog from 'in-components/RequestQuoteDialog';
import IconButton from 'in-components/IconButton/IconButton';
import Sticky from 'in-components/Sticky';
import { Trans, t } from 'in-i18n';

import locals from './NotificationBarSticky.mless';

const windowHref = window.location.href;
if (windowHref.indexOf('preloadWalkMe') !== -1) {
  (function () {
    var walkme = document.createElement('script');
    walkme.type = 'text/javascript';
    walkme.async = true;
    walkme.src =
      'https://cdn.walkme.com/users/9ef25d161f0e453a8f3e4dea9390a967/walkme_9ef25d161f0e453a8f3e4dea9390a967_https.js';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(walkme, s);
    window._walkmeConfig = { smartLoad: true };
  })();
}
var assistMeController;
function init() {
  assistMeController = window.initAssistMeController({
    productId: 'a875055db9b7697d9da869d8f5db0f7c',
    topSpacing: '46px',
    zIndex: 4500
  });
}
function onClickAssistMe() {
  if (!assistMeController) {
    init();
  }
  return assistMeController.isOpen() ? assistMeController.close() : assistMeController.open();
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

export default function NotificationBarSticky() {
  const messages = useObservable(messages$, []);
  if (!messages || messages.length === 0) {
    return null;
  }
  return (
    <>
      {messages
        .filter(message => message.isLicenseUsageMsg)
        .map(message => (
          <Content key={message.id} message={message} />
        ))}
    </>
  );
}

function Content({ message }) {
  const location = useLocation();
  return (
    <Sticky
      header={
        <HorizontalFlexWrapper className={locals.section}>
          <Typography className={locals.title} noMargin onDark variant="heading-200">
            {t('in-components:notificationBarSticky.freeTrialBannerTitle')}
          </Typography>
          <div className={locals.rightContent}>
            <span className={locals.description}>{message.content}</span>
            <Spacer horizontal="small" />
            {message.activeLicense == 'selfService' && message.activeLicense == 'quota' && (
              <>
                <IconForRemainingDays remainingDays={message.remainingDays} />
                <Spacer horizontal="small" />
              </>
            )}
            <div className={locals.verticalLine} />
            <Spacer horizontal="small" />
            {onPremLicenseInformationEnabled && (
              <div className={locals.subText}>
                <Trans
                  i18nKey="in-components:messageFlyout.alreadyHaveLicense"
                  components={{
                    linkToDocker: (
                      <Link
                        className={locals.bannerLink}
                        external
                        href="https://www.ibm.com/docs/obi/current?topic=installer-license-activation-renewal"
                      />
                    ),
                    linkToKubernetes: (
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
                {message.activeLicense == 'selfService' && message.activeLicense == 'quota' && (
                  <Button
                    className={locals.button}
                    kind="primaryv2"
                    target="_blank"
                    href="https://aws.amazon.com/marketplace/search/results?prevFilters=%257B%2522sr%2522%3A%25220-1%2522%2C%2522ref_%2522%3A%2522beagle%2522%2C%2522applicationId%2522%3A%2522AWSMPContessa%2522%257D&searchTerms=ibm+instana+observability"
                    rel="noopener noreferrer"
                    onClick={() => track(BUY_NOW_BUTTON_CLICKED, getPageType(location.pathname))}
                  >
                    {t('in-components:messageFlyout.buyNowBtn')}
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
                  {t('in-components:messageFlyout.requestQuoteBtn')}
                </Button>
                {message.activeLicense == 'selfService' && message.activeLicense == 'quota' && (
                  <IconButton
                    buttonType="button"
                    kind="secondary"
                    type="lib_help_error_help_outline"
                    onClick={onClickAssistMe}
                  />
                )}
              </>
            )}
          </div>
        </HorizontalFlexWrapper>
      }
    />
  );
}
const IconForRemainingDays = ({ remainingDays }) => {
  /**
   * Days remaining for the free trial to end are converted into hours.
   */
  if (remainingDays >= 6 && remainingDays <= 14) {
    return <SvgIcon type={'lib_uncheck'} color={'var(--ids-color-option-green-500'} />;
  } else if (remainingDays >= 4 && remainingDays <= 5) {
    return <SvgIcon type={'ib_help_error_warning'} color={'var(--ids-color-option-yellow-500)'} />;
  } else if (remainingDays >= 0 && remainingDays <= 3) {
    return <SvgIcon type={'lib_help_error_info_circle'} color={'var(--ids-color-option-red-500)'} />;
  } else {
    return <SvgIcon type={'lib_help_error_info_circle'} color={'var(--ids-color-option-red-500)'} />;
  }
};
