/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t, Trans } from 'in-i18n';
import PropTypes from 'prop-types';
import React from 'react';

import { CookiePolicyButton, PrivacyButton } from 'in-settings/terms/dialog/DocumentLinkButtons';
import ExpandableCookieList from 'in-settings/terms/cookies/ExpandableCookieList';
import FormFooter from 'in-components/form/FormFooter/FormFooter';
import TermsProgressIndicator from './TermsProgressIndicator';
import Button from 'in-new-components/Button/Button';
import Stack from 'in-new-components/layout/Stack';

import locals from './TermsPages.mless';

export default function TermsPage3({ onBack, onNext, onChange, form, nrPages }) {
  return (
    <div className={locals.container}>
      <div className={locals.pageContent}>
        <div>
          <TermsProgressIndicator pageNumber={3} nrPages={nrPages} />
          <h1 className={locals.heading}>{t('in-settings:termsDialog.termsPage3.heading')}</h1>

          <Stack>
            <p>{t('in-settings:termsDialog.termsPage3.introduction')}</p>

            <p>
              <Trans
                i18nKey="in-settings:termsDialog.termsPage3.moreInformation"
                components={{
                  privacyButton: <PrivacyButton />,
                  cookiePolicyButton: <CookiePolicyButton />
                }}
              />
            </p>

            <ExpandableCookieList form={form} onChange={onChange} />
          </Stack>
        </div>
      </div>

      <FormFooter className={locals.buttons}>
        <Button onClick={() => onBack(2)} kind="secondary">
          {t('in-settings:termsDialog.back')}
        </Button>
        <Button onClick={() => onNext(4)}>{t('in-settings:termsDialog.next')}</Button>
      </FormFooter>
    </div>
  );
}

TermsPage3.propTypes = {
  onBack: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  form: PropTypes.object.isRequired,
  nrPages: PropTypes.number
};
