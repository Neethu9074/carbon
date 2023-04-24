/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import { Button, Link } from '@instana/components';
import { useObservable } from '@instana/hooks';

import { track, REQUEST_QUOTE_BUTTON_CLICKED, BUY_NOW_BUTTON_CLICKED } from 'in-services/tracking/tracking';
import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import { onPremLicenseInformationEnabled } from 'in-services/featureFlags';
import { useLocation } from 'in-stores/navigation/LocationStateProvider';
import { messages$ } from 'in-components/MessageFlyout/stores/messages';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import RequestQuoteDialog from 'in-components/RequestQuoteDialog';
import Sticky from 'in-components/Sticky';
import { t, Trans } from 'in-i18n';

import locals from './NotificationBarSticky.mless';

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
        <div className={locals.section}>
          <div className={locals.leftContent}>
            <span className={locals.description}>{message.content}</span>
          </div>
          <div className={locals.rightContent}>
            {onPremLicenseInformationEnabled && (
              <div className={locals.subText}>
                <Trans
                  i18nKey="in-components:messageFlyout.alreadyHaveLicense"
                  components={{
                    linkToDocker: (
                      <Link
                        className={locals.link}
                        external
                        href="https://www.ibm.com/docs/obi/current?topic=installer-license-activation-renewal"
                      />
                    ),
                    linkToKubernetes: (
                      <Link
                        className={locals.link}
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
                    kind="secondary"
                    target="_blank"
                    href="https://aws.amazon.com/marketplace/pp/prodview-hnqy5e3t3fzda"
                    rel="noopener noreferrer"
                    onClick={track(BUY_NOW_BUTTON_CLICKED, getPageType(location.pathname))}
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
              </>
            )}
          </div>
        </div>
      }
    />
  );
}
