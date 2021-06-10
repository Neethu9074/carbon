/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import PropTypes from 'prop-types';
import React from 'react';

import { DataProtectionMailButton, PrivacyButton } from 'in-settings/terms/dialog/DocumentLinkButtons';
import Message from 'in-components/Message';
import { t, Trans } from 'in-i18n';

import locals from './MarketingMessageBox.mless';

export default function MarketingMessageBox({ fontSize }) {
  return (
    <Message className={locals.messageBox} style={fontSize}>
      <p>
        <Trans
          i18nKey="in-settings:termsDialog.marketingMessageBox.firstParagraph"
          components={{
            dataProtectionMailButton: <DataProtectionMailButton fontSize={fontSize} />
          }}
        />
      </p>
      <p>
        {t('in-settings:termsDialog.marketingMessageBox.secondParagraph')} <PrivacyButton fontSize={fontSize} />
      </p>
      <p>
        {t('in-settings:termsDialog.marketingMessageBox.thirdParagraph')} <PrivacyButton fontSize={fontSize} />
      </p>
    </Message>
  );
}

MarketingMessageBox.propTypes = {
  fontSize: PropTypes.number
};
