/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { Link } from '@instana/components';

import { t, Trans } from 'in-i18n';

/**
 * When the given Error has a message which contains the
 * phrase PLEASE_CONTACT_INSTANA_SUPPORT_ERROR_MSG_PHRASE it replaces it with the i18n version and encapsulates it in a
 * <a> html object to render it later in the UI.
 *
 * Without that PHRASE we set the errorCode to 'SERVER' which will be handled as a Technical error in our
 * ErrorResultPresenter, producing a general message.
 *
 * @type error: Error => Error | { readonly code: ErrorCode; message: JSX.Element }
 */
export function enrichSavingErrorWhenContainsLimitReachedOrMarkAsTechnicalError(error) {
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
      message: (
        <>
          {errorMessage}
          <br />
          <Trans
            i18nKey="in-alerting:smartAlerts.components.smartAlertDialog.pleaseContactSupportToRiseLimit"
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
    code: 'SERVER'
  };
}

/** Phrase which is used in the error message, when a quota or limit t is reached for
 * website/app or global app alert configs.
 * (Errors generated in the backend, when tried to add more than possible
 */
export const PLEASE_CONTACT_INSTANA_SUPPORT_ERROR_MSG_PHRASE =
  'Please contact Instana support to request an increase for this limit.';
