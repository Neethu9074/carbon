/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { motion } from 'framer-motion';
import React from 'react';

import { SvgIcon, Button, Link } from '@instana/components';

import { track, REQUEST_QUOTE_BUTTON_CLICKED, BUY_NOW_BUTTON_CLICKED } from 'in-services/tracking/tracking';
import { onPremLicenseInformationEnabled } from 'in-services/featureFlags';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import RequestQuoteDialog from 'in-components/RequestQuoteDialog';
import history from 'in-stores/navigation/history';
import { t, Trans } from 'in-i18n';

import locals from './UsageMessage.mless';

function getPageType(pathname = '/') {
  const pageName = pathname.split('/')[1];

  switch (pageName) {
    case 'physical':
      return { pageName: t('in-components:messageFlyout.infrastructurePageName') };
    case 'websiteMonitoring':
      return { pageName: t('in-components:messageFlyout.eumPageName') };
    case 'config':
      return { pageName: t('in-components:messageFlyout.settingsPageName') };
    case '':
      return { pageName: '--' };
    default:
      return { pageName: pageName.charAt(0).toUpperCase() + pageName.slice(1) };
  }
}

export default function UsageMessage({ message }) {
  let classes = `${locals.flyout} ${locals[message.type]}`;
  if (message.onClick) {
    classes += ` ${locals.clickable}`;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={classes}
      onClick={e => {
        if (message.onClick) {
          e.preventDefault();
          e.stopPropagation();
          message.onClick();
        }
      }}
    >
      <SvgIcon type={message.icon} className={locals.icon} />
      <div className={locals.msg}>
        <Content>{message.content}</Content>
        {onPremLicenseInformationEnabled && (
          <Subtext>
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
          </Subtext>
        )}
        {!onPremLicenseInformationEnabled && (
          <>
            <ButtonAction type={message.activeLicense} />
          </>
        )}
      </div>
    </motion.div>
  );
}

function Content({ children }) {
  return <div className={locals.content}>{children}</div>;
}

function Subtext({ children }) {
  return <div className={locals.subtext}>{children}</div>;
}
function ButtonAction({ type }) {
  return type == 'selfService' ? (
    <Button
      className={locals.button}
      kind="warning"
      onClick={e => {
        e.preventDefault();
        e.stopPropagation();
        track(BUY_NOW_BUTTON_CLICKED, getPageType(history.location.pathname));
        window.open('https://aws.amazon.com/marketplace/pp/prodview-hnqy5e3t3fzda', '_blank');
      }}
    >
      {t('in-components:messageFlyout.buyNowBtn')}
    </Button>
  ) : (
    <Button
      className={locals.button}
      kind="warning"
      onClick={e => {
        e.preventDefault();
        e.stopPropagation();
        track(REQUEST_QUOTE_BUTTON_CLICKED, getPageType(history.location.pathname));
        addActiveDialog(<RequestQuoteDialog />);
      }}
    >
      {t('in-components:messageFlyout.requestQuoteBtn')}
    </Button>
  );
}
