/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createMapForm, createField } from 'formalistic';
import { compose } from 'recompose';
import React from 'react';

import { Button } from '@instana/components';

import RequestQuoteForm from 'in-components/RequestQuoteDialog/RequestQuoteForm';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import { track, REQUEST_QUOTE_SUBMITTED } from 'in-services/tracking/tracking';
import withPropDependingState from 'in-hoc/withPropDependingState';
import { notBlankValidator } from 'in-services/validators/string';
import { close } from 'in-components/DialogPresenter/store';
import Notification from 'in-components/form/Notification';
import requestQuote from 'in-subscription/requestQuote';
import { emptyObject } from 'in-services/fixedObjects';
import Section from 'in-settings/components/Section';
import getAccount from 'in-subscription/getAccount';
import Dialog from 'in-components/Dialog/Dialog';
import connect from 'in-hoc/connectTo';
import { t } from 'in-i18n';

import locals from './RequestQuoteDialog.mless';

class RequestQuoteDialog extends React.Component {
  static displayName = 'RequestQuoteDialog';

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      error: false,
      message: null
    };
  }

  render() {
    const { form } = this.props;
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
          <form onSubmit={this.onSubmit}>
            {this.state.message ? (
              <Section>
                <div className={locals.notificationWrapper}>
                  <Notification failure={this.state.error} success={!this.state.error} loading={this.state.loading}>
                    {this.state.message}
                  </Notification>
                </div>
              </Section>
            ) : null}

            {form ? <RequestQuoteForm form={form} onChange={this.onChange} /> : null}

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

  onChange = (fieldName, value) => {
    const updatedForm = this.props.form.updateIn([fieldName], field => field.setValue(value).setTouched(true));

    this.props.setForm(updatedForm);
  };

  componentWillUnmount() {
    if (this.requestQuoteSubscription) {
      this.requestQuoteSubscription.dispose();
      this.requestQuoteSubscription = null;
    }
  }

  onSubmit = e => {
    e.preventDefault();

    track(REQUEST_QUOTE_SUBMITTED);

    if (!this.props.form.hierarchyValid) {
      this.props.setForm(this.props.form.setTouched(true, { recurse: true }));
      return;
    }

    this.setState({ loading: true, error: false, message: null });

    this.requestQuoteSubscription = requestQuote(this.props.form.toJS()).subscribe(result => {
      if (result.progress.loading) {
        return;
      } else if (result.errors.length > 0) {
        this.setState({
          loading: false,
          error: true,
          message: result.errors.map(e => e.message).join(' ')
        });
        return;
      } else {
        this.setState({
          loading: false,
          error: false,
          message: t('in-components:requestQuoteDialog.dialogRequestQuoteSubmittedMsg')
        });
        setTimeout(close, 3000);
      }
    });
  };
}

export default compose(
  connect({
    result: getAccount()
  }),
  withPropDependingState({
    getInitialState,
    resets: [
      {
        getResettingProps: () => ['result'],
        onReset: getInitialState
      }
    ],
    reducerName: 'setForm',
    reducer: (prevState, form) => ({ form })
  })
)(RequestQuoteDialog);

function getInitialState({ result }) {
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
