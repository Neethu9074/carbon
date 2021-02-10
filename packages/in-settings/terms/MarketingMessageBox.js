/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import PropTypes from 'prop-types';
import React from 'react';

import { DataProtectionMailButton, PrivacyButton } from 'in-settings/terms/dialog/DocumentLinkButtons';
import Message from 'in-new-components/Message';

import locals from './MarketingMessageBox.mless';

export default function MarketingMessageBox({ fontSize }) {
  return (
    <Message className={locals.messageBox} style={fontSize}>
      <p>
        You can withdraw your marketing consent at any time by submitting an opt-out request (email to{' '}
        <DataProtectionMailButton fontSize={fontSize} />
        ). Also you may unsubscribe from receiving marketing emails by clicking the unsubscribe link in each email.
      </p>
      <p>
        More information on our processing can be found in the Instana <PrivacyButton fontSize={fontSize} />.
      </p>
      <p>
        By submitting this form you acknowledge that you have read and understand the Instana{' '}
        <PrivacyButton fontSize={fontSize} />.
      </p>
    </Message>
  );
}

MarketingMessageBox.propTypes = {
  fontSize: PropTypes.number
};
