/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';
import PropTypes from 'prop-types';

import { CookiePolicyButton, PrivacyButton } from 'in-settings/terms/dialog/DocumentLinkButtons';
import ExpandableCookieList from 'in-settings/terms/cookies/ExpandableCookieList';
import FormFooter from 'in-components/form/FormFooter/FormFooter';
import TermsProgressIndicator from './TermsProgressIndicator';
import Button from 'in-new-components/Button/Button';

import locals from './TermsPages.mless';

export default function TermsPage3({ onBack, onNext, onChange, form, nrPages }) {
  return (
    <div className={locals.container}>
      <div className={locals.pageContent}>
        <div>
          <TermsProgressIndicator pageNumber={3} nrPages={nrPages} />
          <h1 className={locals.heading}>Cookies</h1>

          <p>
            When you use our product, Instana uses cookies and other tracking technologies (&quot;Cookies&quot;). In
            addition to Cookies which are necessary for the proper functioning of the product, subject to your
            preferences, Instana and its authorized partners may also use Cookies to analyze and optimize the product
            funtionality.
          </p>

          <p>
            For more information, please visit our <PrivacyButton fontSize={12} /> or{' '}
            <CookiePolicyButton fontSize={12} />.
          </p>

          <ExpandableCookieList form={form} onChange={onChange} />
        </div>
      </div>

      <FormFooter className={locals.buttons}>
        <Button onClick={() => onBack(2)} kind="secondary">
          Back
        </Button>
        <Button onClick={() => onNext(4)}>Next</Button>
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
