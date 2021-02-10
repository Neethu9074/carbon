/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { Fragment, useState } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import { TosButton, PrivacyButton } from 'in-settings/terms/dialog/DocumentLinkButtons';
import TermsProgressIndicator from 'in-settings/terms/dialog/TermsProgressIndicator';
import CheckboxFancy from 'in-components/form/CheckboxFancy/CheckboxFancy';
import FormFooter from 'in-components/form/FormFooter/FormFooter';
import SvgIcon from 'in-components/SvgIcon/SvgIcon';
import Stack from 'in-new-components/layout/Stack';
import Button from 'in-new-components/Button';

import locals from './TermsPages.mless';

export default function TermsPage1({ form, onChange, onNext, nrPages }) {
  const [messageVisible, setMessageVisible] = useState(false);

  const isCheckboxMessagePresent = !form.get('tosAccepted').valid || !form.get('privacyAgreementAccepted').valid;

  return (
    <div className={locals.container}>
      <div className={locals.pageContent}>
        <div>
          <TermsProgressIndicator pageNumber={1} nrPages={nrPages} />
          <h1 className={locals.heading}>Terms of Service and Privacy Policy</h1>
        </div>

        <Stack>
          <p>
            Before moving forward, and before using Instana products and services, you need to read and agree to our
            Terms of Service and our Privacy Policy.
          </p>

          <p>Please take a moment to read the following documents:</p>

          <div>
            <div>
              <TosButton withIcon label="Instana's Terms of Service" />
            </div>

            <div>
              <PrivacyButton withIcon label="Instana's Privacy Policy" />
            </div>
          </div>

          <div>
            <span className={locals.flexRow}>
              {form.get('tosAccepted').map(({ value }) => (
                <Fragment>
                  <CheckboxFancy
                    label="I have read and agree to Instana's&nbsp;" // Terms of Service
                    checked={value}
                    onChange={() => onChange(form, 'tosAccepted', !value)}
                    size="large"
                  />
                  <TosButton />
                </Fragment>
              ))}
            </span>
            <span className={locals.flexRow}>
              {form.get('privacyAgreementAccepted').map(({ value }) => (
                <Fragment>
                  <CheckboxFancy
                    label="I have read and agree to Instana's&nbsp;" // Privacy Policy
                    checked={value}
                    onChange={() => onChange(form, 'privacyAgreementAccepted', !value)}
                    size="large"
                  />
                  <PrivacyButton />
                </Fragment>
              ))}
            </span>
          </div>
        </Stack>

        {isCheckboxMessagePresent && (
          <div
            className={classNames({
              [locals.warningText]: true,
              [locals.hidden]: !messageVisible || form.hierarchyValid
            })}
          >
            <SvgIcon className={locals.icon} type="lib_help_error_error_circle" size="s" />
            <span>You cannot use Instana until you have accepted the Terms of Service and Privacy Policy.</span>
          </div>
        )}
        {!isCheckboxMessagePresent && (
          <div
            className={classNames({
              [locals.warningText]: true,
              [locals.hidden]: true
            })}
          />
        )}
      </div>

      <FormFooter className={locals.buttons}>
        <Button
          className={classNames({
            [locals.disabled]:
              !form.get('privacyAgreementAccepted').hierarchyValid || !form.get('tosAccepted').hierarchyValid
          })}
          onClick={() => handleNextClick(form, onNext, setMessageVisible)}
        >
          Next
        </Button>
      </FormFooter>
    </div>
  );
}

TermsPage1.propTypes = {
  onNext: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  form: PropTypes.object.isRequired,
  nrPages: PropTypes.number
};

function handleNextClick(form, onNext, setMessageVisible) {
  if (form.get('privacyAgreementAccepted').hierarchyValid && form.get('tosAccepted').hierarchyValid) {
    setMessageVisible(false);
    onNext(2);
  } else {
    setMessageVisible(true);
  }
}
