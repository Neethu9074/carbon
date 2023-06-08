/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { Error } from '@instana/components/types/util/dataRetrieval';
import { Link } from '@instana/legacy';

import { t, Trans } from 'in-i18n';

export interface EnrichedError {
  level: string;
  message: string | JSX.Element;
  code?: string;
}

/**
 * When the given Error has a message which contains the
 * phrase PLEASE_CONTACT_INSTANA_SUPPORT_ERROR_MSG_PHRASE it replaces it with the i18n version and encapsulates it in a
 * <a> html object to render it later in the UI.
 *
 * Without that PHRASE we treat the error as a technical error, which will hide its message behind a generic one in production builds
 */
export function enrichSavingErrorWhenContainsLimitReachedOrMarkAsTechnicalError(
  error: Error | { message: string }
): EnrichedError {
  // in ErrorResultPresenter, there is a similar check to show only a "TechnicalError",
  // but on __DEV__ it would show an empty box.
  if (typeof error === 'string' && __DEV__) {
    // This will help by showing the raw error message on development, instead of an
    // empty box:
    return enrichSavingErrorWhenContainsLimitReachedOrMarkAsTechnicalError({
      message: error
    });
  }

  if (error?.message.indexOf(PLEASE_CONTACT_INSTANA_SUPPORT_ERROR_MSG_PHRASE) >= 0) {
    const errorMessage = error.message.replaceAll(PLEASE_CONTACT_INSTANA_SUPPORT_ERROR_MSG_PHRASE, '');
    return {
      ...error,
      level: 'error',
      message: (
        <>
          {errorMessage}
          <br />
          <Trans
            i18nKey="in-alerting:smartAlerts.components.smartAlertDialog.pleaseContactSupportToRiseLimit"
            // @ts-expect-error required prop children will be filled via i18n translation
            components={{ supportLink: <Link external href="https://support.instana.com" /> }}
            values={{
              instanaSupportPortal: t('in-alerting:smartAlerts.components.smartAlertDialog.instanaSupportPortal')
            }}
          />
        </>
      )
    };
  }
  return {
    ...error,
    level: 'error',
    code: 'SERVER',
    // In dev builds we show detailed error messages here, in production builds we only show a generic error message
    message: __DEV__ ? error.message : t('in-components:error.erroneousResultPresenterMessage')
  };
}

/** Phrase which is used in the error message, when a quota or limit t is reached for
 * website/app or global app alert configs.
 * (Errors generated in the backend, when tried to add more than possible
 */
export const PLEASE_CONTACT_INSTANA_SUPPORT_ERROR_MSG_PHRASE =
  'Please contact Instana support to request an increase for this limit.';
