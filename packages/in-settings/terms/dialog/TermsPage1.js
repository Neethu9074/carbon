import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';

import TermsProgressIndicator from 'in-settings/terms/dialog/TermsProgressIndicator';
import CheckboxFancy from 'in-components/form/CheckboxFancy/CheckboxFancy';
import evaluateClassNames from 'in-services/util/classnames';
import RolesSelector from 'in-settings/terms/RolesSelector';
import SvgIcon from 'in-components/SvgIcon/SvgIcon';
import Button from 'in-new-components/Button';

import locals from './TermsPages.mless';

export default function TermsPage1({ form, onChange, onNext }) {
  const [messageVisible, setMessageVisible] = useState(false);

  const isRoleMessagePresent = form.get('dynamicRole') && !form.get('dynamicRole').valid;
  const isCheckboxMessagePresent =
    !form.get('tosAccepted').valid || !form.get('privacyAgreementAccepted').valid || !form.get('role').valid;

  return (
    <div className={locals.container}>
      <div>
        <TermsProgressIndicator />
        <h1 className={locals.heading}>Welcome to Instana!</h1>
        <p>We need to make sure you&apos;ve read and agree to our terms and privacy policy before you get started.</p>
        <TosButton /> and <PrivacyButton />
      </div>
      <div>
        <RolesSelector form={form} onChange={(fieldName, value) => onChange(form, fieldName, value)} />
      </div>
      <div className={locals.flexColumn}>
        <p>Let us help you get the most out of Instana with success tips and tutorials by email.</p>
        {form.get('productTips').map(({ value }) => (
          <CheckboxFancy
            label="Product onboarding & success tips"
            checked={value}
            onChange={() => onChange(form, 'productTips', !value)}
            size="large"
          />
        ))}
        {form.get('marketingMessages').map(({ value }) => (
          <CheckboxFancy
            label="Marketing messages"
            checked={value}
            onChange={() => onChange(form, 'marketingMessages', !value)}
            size="large"
          />
        ))}
      </div>
      <div className={locals.flexColumn}>
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
      {isCheckboxMessagePresent && (
        <div
          className={evaluateClassNames({
            [locals.warningText]: true,
            [locals.hidden]: !messageVisible || form.hierarchyValid
          })}
        >
          <SvgIcon className={locals.icon} type="lib_help_error_error_circle" size="s" />
          <span>
            You cannot use Instana until you have accepted the Terms of Service and Privacy Policy and selected a role.
          </span>
        </div>
      )}
      {isRoleMessagePresent && (
        <div
          className={evaluateClassNames({
            [locals.warningText]: true,
            [locals.hidden]: !messageVisible || form.hierarchyValid
          })}
        >
          <SvgIcon className={locals.icon} type="lib_help_error_error_circle" size="s" />
          <span>You need to type in a role.</span>
        </div>
      )}
      {!isRoleMessagePresent && !isCheckboxMessagePresent && (
        <div
          className={evaluateClassNames({
            [locals.warningText]: true,
            [locals.hidden]: true
          })}
        />
      )}
      <div className={locals.buttons}>
        <Button
          className={evaluateClassNames({ [locals.disabled]: !form.hierarchyValid })}
          onClick={() => handleNextClick(form, onNext, setMessageVisible)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

TermsPage1.propTypes = {
  onNext: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  form: PropTypes.object.isRequired
};

function handleNextClick(form, onNext, setMessageVisible) {
  if (form.hierarchyValid) {
    setMessageVisible(false);
    onNext(2);
  } else {
    setMessageVisible(true);
  }
}

function TosButton() {
  return (
    <Button
      style={{ padding: 0 }}
      kind="action"
      target="_blank"
      href="https://instana.com/docs/instana-terms-latest.pdf"
    >
      Terms of Service
    </Button>
  );
}

function PrivacyButton() {
  return (
    <Button
      style={{ padding: 0, margin: 0 }}
      kind="action"
      target="_blank"
      href="https://instana.com/docs/instana-privacy-policy-latest.pdf"
    >
      Privacy Policy
    </Button>
  );
}
