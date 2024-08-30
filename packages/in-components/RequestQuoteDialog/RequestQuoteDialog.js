/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createMapForm, createField } from 'formalistic';
import React, { useState, useEffect } from 'react';

import { Button } from '@instana/components';

import RequestQuoteForm from 'in-components/RequestQuoteDialog/RequestQuoteForm';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import { track, REQUEST_QUOTE_SUBMITTED } from 'in-services/tracking/tracking';
import { notBlankValidator } from 'in-services/validators/string';
import { close } from 'in-components/DialogPresenter/store';
import Notification from 'in-components/form/Notification';
import requestQuote from 'in-subscription/requestQuote';
import { emptyObject } from 'in-services/fixedObjects';
import Section from 'in-settings/components/Section';
import getAccount from 'in-subscription/getAccount';
import Dialog from 'in-components/Dialog/Dialog';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

import locals from './RequestQuoteDialog.mless';

export default connectTo({
  result: getAccount()
})(RequestQuoteDialog);

function RequestQuoteDialog(props) {
  const [form, setForm] = useState(() => getInitialState(props.result).form);
  const [{ loading, error, message }, setState] = useState({ loading: true });

  function disposeSubscription(subscription) {
    if (subscription) {
      subscription.dispose();
    }
  }

  useEffect(() => {
    setForm(getInitialState(props.result).form);
  }, [props.result]);

  const onChange = (fieldName, value) => {
    const updatedForm = form.updateIn([fieldName], field => field.setValue(value).setTouched(true));

    setForm(updatedForm);
  };

  const onSubmit = e => {
    e.preventDefault();

    track(REQUEST_QUOTE_SUBMITTED);

    if (!loading && !form.hierarchyValid) {
      setForm(form.setTouched(true, { recurse: true }));
      return;
    }
    setState({ loading: true, error: false, message: null });

    const requestQuoteSubscription = requestQuote(form.toJS()).subscribe(result => {
      if (result.progress.loading) {
        return;
      } else if (result.errors.length > 0) {
        setState({ loading: false, error: true, message: result.errors.map(e => e.message).join(' ') });
        disposeSubscription(requestQuoteSubscription);
      } else {
        setState({
          loading: false,
          error: false,
          message: t('in-components:requestQuoteDialog.dialogRequestQuoteSubmittedMsg')
        });
        setTimeout(close, 3000);
        disposeSubscription(requestQuoteSubscription);
      }
    });
  };

  return (
    <Dialog title={t('in-components:requestQuoteDialog.dialogRequestQuoteTitle')} onClose={close}>
      {!form && (
        <div className={locals.loadingState}>
          <LoadingIndicator
            className={locals.loadingStateIcon}
            width={300}
            text={t('in-components:requestQuoteDialog.dialogRequestLoadingText')}
          />
        </div>
      )}

      {form && (
        <form onSubmit={onSubmit}>
          {message ? (
            <Section>
              <div className={locals.notificationWrapper}>
                <Notification failure={error} success={!error} loading={loading}>
                  {message}
                </Notification>
              </div>
            </Section>
          ) : null}

          {form ? <RequestQuoteForm form={form} onChange={onChange} /> : null}

          {form ? (
            <div className={locals.buttonWrapper}>
              <Button kind="action" onClick={close}>
                {t('forms.actions.cancel')}
              </Button>
              <Button kind="primary" type="submit" disabled={!form.hierarchyValid && form.touched}>
                {t('forms.actions.submit')}
              </Button>
            </div>
          ) : null}
        </form>
      )}
    </Dialog>
  );
}

function getInitialState(result) {
  if (!result || result.progress.loading) {
    return emptyObject;
  } else if (result.errors.length > 0) {
    return {
      form: createForm('')
    };
  }

  return {
    form: createForm(result.data.companyName || '')
  };
}

function createForm(companyName) {
  return createMapForm()
    .put('companyName', createField({ value: companyName || '', validator: notBlankValidator }))
    .put('numberOfApmHosts', createField({ value: '', validator: notBlankValidator }))
    .put('numberOfInfrastructureHosts', createField({ value: '', validator: notBlankValidator }))
    .put('numberOfYears', createField({ value: '', validator: notBlankValidator }))
    .put('billingStreet', createField({ value: '', validator: notBlankValidator }))
    .put('billingCity', createField({ value: '', validator: notBlankValidator }))
    .put('billingState', createField({ value: null, validator: notBlankValidator }))
    .put('billingCountry', createField({ value: null, validator: notBlankValidator }))
    .put('billingZip', createField({ value: '', validator: notBlankValidator }));
}
