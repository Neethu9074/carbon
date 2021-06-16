/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import PropTypes from 'prop-types';
import React from 'react';

import { Button } from '@instana/components';
import { Stack } from '@instana/components';

import TermsProgressIndicator from 'in-settings/terms/dialog/TermsProgressIndicator';
import CheckboxFancy from 'in-components/form/CheckboxFancy/CheckboxFancy';
import MarketingMessageBox from 'in-settings/terms/MarketingMessageBox';
import FormFooter from 'in-components/form/FormFooter/FormFooter';
import { t } from 'in-i18n';

import locals from './TermsPages.mless';

export default function TermsPage2({ onBack, onNext, onChange, form, fullTermsConfigEnabled, nrPages }) {
  return (
    <div className={locals.container}>
      <div className={locals.pageContent}>
        <div>
          <TermsProgressIndicator pageNumber={2} nrPages={nrPages} />
          <h1 className={locals.heading}>{t('in-settings:termsDialog.termsPage2.heading')}</h1>
        </div>

        <Stack>
          {form.get('productTips').map(({ value }) => (
            <CheckboxFancy
              label={t('in-settings:termsDialog.productOnboarding')}
              explanation={t('in-settings:termsDialog.productOnboardingExplanation')}
              checked={value}
              onChange={() => onChange(form, 'productTips', !value)}
              size="large"
            />
          ))}
          {form.get('marketingMessages').map(({ value }) => (
            <CheckboxFancy
              label={t('in-settings:termsDialog.marketingMessages')}
              explanation={t('in-settings:termsDialog.marketingMessagesExplanation')}
              checked={value}
              onChange={() => onChange(form, 'marketingMessages', !value)}
              size="large"
            />
          ))}
          {fullTermsConfigEnabled &&
            form
              .get('testingGroup')
              .map(({ value }) => (
                <CheckboxFancy
                  label={t('in-settings:termsDialog.testingGroup')}
                  explanation={t('in-settings:termsDialog.testingGroupExplanation')}
                  checked={value}
                  onChange={() => onChange(form, 'testingGroup', !value)}
                  size="large"
                />
              ))}

          <MarketingMessageBox />
        </Stack>
      </div>

      <FormFooter className={locals.buttons}>
        <Button onClick={() => onBack(1)} kind="secondary">
          {t('in-settings:termsDialog.back')}
        </Button>
        <Button onClick={() => handleNextClick(form, onNext, onChange)}>{t('in-settings:termsDialog.next')}</Button>
      </FormFooter>
    </div>
  );
}

TermsPage2.propTypes = {
  onBack: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  form: PropTypes.object.isRequired,
  fullTermsConfigEnabled: PropTypes.bool,
  nrPages: PropTypes.number
};

function handleNextClick(form, onNext, onChange) {
  onChange(form, 'privacyAgreementAccepted', true);
  onNext(3);
}
