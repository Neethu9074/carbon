/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { Error } from '@instana/types';

import { isTechnicalError } from 'in-services/util/error';
import { t } from 'in-i18n';

type TranslateCallback = (contextParams: any[]) => string;

/*
  A list for mapping server errors and translations

  The first element of a tuple is the RegExp which is matched against the server error
  and the second one is the callback function which does the actual translation.

  NOTE: Second parameter has to be a callback function to make the in-i18n/translations test happy.
*/
const regExpErrors: Array<[RegExp, TranslateCallback]> = [
  [
    /Apdex configuration with this name already exists/,
    contextParams => t('in-custom-dashboards:widgets.apdex.createApdexForm.nameExistsError', contextParams)
  ],
  [
    /The maximum number of website apdex configurations \((\d+)\) has been reached/,
    contextParams => t('in-custom-dashboards:widgets.apdex.createApdexForm.limitReachedError.website', contextParams)
  ],
  [
    /The maximum number of application apdex configurations \((\d+)\) has been reached/,
    contextParams =>
      t('in-custom-dashboards:widgets.apdex.createApdexForm.limitReachedError.application', contextParams)
  ],
  [
    /The maximum number of service level objective configurations (\((\d+)\)) has been reached/,
    contextParams => t('in-service-levels:general.serverErrors.sloLimitReachedError', contextParams)
  ]
];

/*
  Iterates over the regExpErrors array and matches every element against the corresponding expression.
  It'll immediately return the translated string if there is a match.

  RegExp groups are passed as parameters array to the translate function so that they can be used
  within the translated message.

  It returns translated message or `in-components:error.erroneousResultPresenterMessage` error as a default
*/
function translateFromRegExpMapping(message: string): string {
  let translatedMessage;

  regExpErrors.some(([regExp, translate]) => {
    const result = message.match(regExp);

    if (result) {
      const [, ...contextParams] = result;
      translatedMessage = translate(contextParams);
    }

    return !!result;
  });

  return translatedMessage ?? t('in-components:error.erroneousResultPresenterMessage');
}

export default function getTranslatedErrorMessage({ code, message }: Error): string {
  if (isTechnicalError(code) && __DEV__) {
    // If it is a technical error it will return a raw error message on development
    return message;
  }

  return translateFromRegExpMapping(message);
}
