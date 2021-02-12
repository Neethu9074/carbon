/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { motion } from 'framer-motion';
import React from 'react';

import { track, REQUEST_QUOTE_BUTTON_CLICKED } from 'in-services/tracking/tracking';
import { onPremLicenseInformationEnabled } from 'in-services/featureFlags';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import RequestQuoteDialog from 'in-components/RequestQuoteDialog';
import history from 'in-stores/navigation/history';
import Button from 'in-new-components/Button';
import SvgIcon from 'in-components/SvgIcon';
import { t } from 'in-i18n';

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
        e.preventDefault();
        e.stopPropagation();
        if (message.onClick) {
          message.onClick();
        }
      }}
    >
      <SvgIcon type={message.icon} className={locals.icon} />
      <div className={locals.msg}>
        <Content content={message.content} />
        {!onPremLicenseInformationEnabled && (
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
        )}
      </div>
    </motion.div>
  );
}

function Content({ content }) {
  return <div className={locals.content}>{content}</div>;
}
