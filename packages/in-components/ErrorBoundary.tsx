/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { ErrorInfo } from 'react';

import { generateUniqueShortId } from '@instana/utils';
import { createLogger } from '@instana/logger';
import { t } from '@instana/i18n-react';

import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import { ineum } from 'in-services/tracking/ineum';
import { Trans } from 'in-i18n';

const logger = createLogger('in-component.ErrorBoundary');

const messageId = 'errorBoundary-uncaught-error';

interface ReportArgs {
  name: string;
  errorId: string;
  meta: Record<string, string | number | boolean> & { errorId: string };
  error: Error;
  info: ErrorInfo;
}

interface State {
  hasError: boolean;
}

type Props = React.PropsWithChildren<{
  name: string;
  meta?: Record<string, string | number | boolean>;
}>;

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    const errorId = generateUniqueShortId();
    const args: ReportArgs = {
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

function reportErrorToInstana({ meta, error, info }: ReportArgs) {
  ineum('reportError', error, {
    componentStack: info.componentStack,
    meta: meta
  });
}

function reportErrorToConsole({ name, error, info }: ReportArgs) {
  const message: any[] = ['An unhandled error occurred within the React component tree'];
  if (name) {
    message.push(`which was caught at boundary ${name}.`);
  }
  message.push(error);
  message.push(info);

  logger.error.apply(logger, message);
}

function reportErrorToEndUser({ errorId }: ReportArgs) {
  addMessage(
    {
      type: 'danger',
      title: t('in-components:errorBoundary.message.title'),
      content: <Trans i18nKey="in-components:errorBoundary.message.content" values={{ errorId }} />
    },
    messageId
  );
}
