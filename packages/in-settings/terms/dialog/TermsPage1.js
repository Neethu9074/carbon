/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import { SvgIcon } from '@instana/components';
import { Button } from '@instana/components';
import { Stack } from '@instana/components';

import TermsProgressIndicator from 'in-settings/terms/dialog/TermsProgressIndicator';
import CheckboxFancy from 'in-components/form/CheckboxFancy/CheckboxFancy';
import { TosButton } from 'in-settings/terms/dialog/DocumentLinkButtons';
import FormFooter from 'in-components/form/FormFooter/FormFooter';
import { t, Trans } from 'in-i18n';

import locals from './TermsPages.mless';

export default function TermsPage1({ form, onChange, onNext, nrPages }) {
  const [messageVisible, setMessageVisible] = useState(false);
  const isCheckboxMessagePresent = !form.get('tosAccepted').valid;

  return (
    <div className={locals.container}>
      <div className={locals.pageContent}>
        <div>
          <TermsProgressIndicator pageNumber={1} nrPages={nrPages} />
          <h1 className={locals.heading}>{t('in-settings:termsDialog.termsPage1.heading')}</h1>
        </div>

        <Stack>
          <p>{t('in-settings:termsDialog.termsPage1.introduction')}</p>

          <p>{t('in-settings:termsDialog.termsPage1.documents')}</p>

          <div>
            <TosButton withIcon label={t('in-settings:termsDialog.instanaTermsOfService')} />
          </div>

          <div>
            <span className={locals.flexRow}>
              {form.get('tosAccepted').map(({ value }) => (
                <CheckboxFancy
                  label={
                    <Trans
                      i18nKey="in-settings:termsDialog.termsPage1.agreeToS"
                      components={{
                        tosButton: <TosButton />
                      }}
                    />
                  }
                  checked={value}
                  onChange={() => onChange(form, 'tosAccepted', !value)}
                  size="large"
                />
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
            <span>
              {t('in-settings:terms.youCannotUseInstanaUntilYouHaveAcceptedTheTermsOfServiceAndPrivacyPolicy')}
            </span>
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
            [locals.disabled]: !form.get('tosAccepted').hierarchyValid
          })}
          onClick={() => handleNextClick(form, onNext, setMessageVisible)}
        >
          {t('in-settings:termsDialog.next')}
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
  if (form.get('tosAccepted').hierarchyValid) {
    setMessageVisible(false);
    onNext(2);
  } else {
    setMessageVisible(true);
  }
}
