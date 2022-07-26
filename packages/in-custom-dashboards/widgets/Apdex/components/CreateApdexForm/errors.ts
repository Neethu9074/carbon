/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { isTechnicalError } from 'in-services/util/error';
import { Error } from 'in-types';
import { t } from 'in-i18n';

const APDEX_CONFIG_NAME_EXISTS_SERVER_ERROR = 'Apdex configuration with this name already exists';

const i18nErrors: Record<string, string> = {
  [APDEX_CONFIG_NAME_EXISTS_SERVER_ERROR]: t('in-custom-dashboards:widgets.apdex.createApdexForm.nameExistsError')
};

export default function getTranslatedErrorMessage({ code, message }: Error): string {
  if (isTechnicalError(code) && __DEV__) {
    // If it is a technical error it will return a raw error message on development
    return message;
  } else if (message in i18nErrors) {
    return i18nErrors[message];
  }

  // returns error message like in `ErronousResultPresenter` as default
  return t('in-components:error.erroneousResultPresenterMessage');
}
