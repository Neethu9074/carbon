/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { generateUniqueShortId } from '@instana/utils';
import { createLogger } from '@instana/logger';

import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import { ineum } from 'in-services/tracking/ineum';
import { Trans } from 'in-i18n';

const logger = createLogger('in-component.ErrorBoundary');

const messageId = 'errorBoundary-uncaught-error';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    const errorId = generateUniqueShortId();
    const args = {
      name: this.props.name,
      errorId,
      meta: {
        ...(this.props.meta || {}),
        errorId
      },
      error,
      info
    };
    reportErrorToInstana(args);
    reportErrorToConsole(args);
    reportErrorToEndUser(args);
  }

  render() {
    if (this.state.hasError) {
      return null;
    }

    return this.props.children;
  }
}

function reportErrorToInstana({ meta, error, info }) {
  ineum('reportError', error, {
    componentStack: info.componentStack,
    meta: meta
  });
}

function reportErrorToConsole({ name, error, info }) {
  const message = ['An unhandled error occurred within the React component tree'];
  if (name) {
    message.push(`which was caught at boundary ${name}.`);
  }
  message.push(error);
  message.push(info);

  logger.error.apply(logger, message);
}

function reportErrorToEndUser({ errorId }) {
  addMessage(
    {
      type: 'danger',
      title: <Trans i18nKey="in-components:errorBoundary.message.title" />,
      content: <Trans i18nKey="in-components:errorBoundary.message.content" values={{ errorId }} />
    },
    messageId
  );
}
