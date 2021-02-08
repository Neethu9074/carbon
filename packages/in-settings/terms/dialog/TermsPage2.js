/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';
import PropTypes from 'prop-types';

import { DataProtectionMailButton, PrivacyButton } from 'in-settings/terms/dialog/DocumentLinkButtons';
import TermsProgressIndicator from 'in-settings/terms/dialog/TermsProgressIndicator';
import CheckboxFancy from 'in-components/form/CheckboxFancy/CheckboxFancy';
import FormFooter from 'in-components/form/FormFooter/FormFooter';
import Stack from 'in-new-components/layout/Stack/Stack';
import Message from 'in-new-components/Message';
import Button from 'in-new-components/Button';

import locals from './TermsPages.mless';

export default function TermsPage2({ onBack, onNext, onChange, form, fullTermsConfigEnabled, nrPages }) {
  return (
    <div className={locals.container}>
      <div className={locals.pageContent}>
        <div>
          <TermsProgressIndicator pageNumber={2} nrPages={nrPages} />
          <h1 className={locals.heading}>Messaging</h1>
        </div>

        <Stack>
          {form.get('productTips').map(({ value }) => (
            <CheckboxFancy
              label="Product onboarding & success tips"
              explanation="to help you make the most of Instana products"
              checked={value}
              onChange={() => onChange(form, 'productTips', !value)}
              size="large"
            />
          ))}
          {form.get('marketingMessages').map(({ value }) => (
            <CheckboxFancy
              label="Marketing messages"
              explanation="related to Instana products, services and offerings"
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
                  label="User Testing Group"
                  explanation="to participate in optional interviews and survey with our product team"
                  checked={value}
                  onChange={() => onChange(form, 'testingGroup', !value)}
                  size="large"
                />
              ))}
        </Stack>

        <Message className={locals.messageBox}>
          <p>
            You can withdraw your marketing consent at any time by submitting an opt-out request (email to
            <DataProtectionMailButton fontSize={12} />
            ). Also you may unsubscribe from receiving marketing emails by clicking the unsubscribe link in each email.
          </p>
          <p>
            More information on our processing can be found in the Instana <PrivacyButton fontSize={12} />.
          </p>
          <p>
            By submitting this form you acknowledge that you have read and understand the Instana
            <PrivacyButton fontSize={12} />.
          </p>
        </Message>
      </div>

      <FormFooter className={locals.buttons}>
        <Button onClick={() => onBack(1)} kind="secondary">
          Back
        </Button>
        <Button onClick={() => onNext(3)}>Next</Button>
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
