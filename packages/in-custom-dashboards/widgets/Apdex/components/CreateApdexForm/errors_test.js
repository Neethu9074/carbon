/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import getTranslatedErrorMessage from 'in-custom-dashboards/widgets/Apdex/components/CreateApdexForm/errors';
import { t } from 'in-i18n';

describe('in-custom-dashboards/widgets/Apdex/components/CreateApdexForm/errors', () => {
  it('returns correct i18n error message if a known server error is provided', () => {
    // Given
    const error = {
      code: 'NOT_A_TECHNICAL_ERROR',
      message: 'Apdex configuration with this name already exists'
    };

    // When
    const translatedMessage = getTranslatedErrorMessage(error);

    // Then
    expect(translatedMessage).toBe(t('in-custom-dashboards:widgets.apdex.createApdexForm.nameExistsError'));
  });

  it('returns the default message if an unknown error is provided', () => {
    // Given
    const error = {
      code: 'NOT_A_TECHNICAL_ERROR',
      message: 'Some internal error message'
    };

    // When
    const translatedMessage = getTranslatedErrorMessage(error);

    // Then
    expect(translatedMessage).toBe(t('in-components:error.erroneousResultPresenterMessage'));
  });

  it('returns translated message with context values if an message with variables is provided', () => {
    // Given
    const error = {
      code: 'NOT_A_TECHNICAL_ERROR',
      message:
        'The maximum number of website apdex configurations (42) has been reached. Please contact Instana support to request an increase for this limit.'
    };

    // When
    const translatedMessage = getTranslatedErrorMessage(error);

    // Then
    expect(translatedMessage).toBe(
      t('in-custom-dashboards:widgets.apdex.createApdexForm.limitReachedError.website', [42])
    );
  });
});
