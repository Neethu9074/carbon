import { fromPromise } from 'reactive-observables';
import { compose } from 'recompose';
import React from 'react';

import countries from 'promise-loader?global,geonames!in-services/geonames/countries';
import RequestQuoteForm from 'in-components/RequestQuoteDialog/RequestQuoteForm';
import states from 'promise-loader?global,geonames!in-services/geonames/states';
import { getCountryById, getStateById } from 'in-services/geonames/geonames';
import { createMapForm, createField, notBlankValidator } from 'formalistic';
import InfiniteCircle from 'in-new-components/Loading/InfiniteCircle';
import Section from 'in-views/configurationView/components/Section';
import withPropDependingState from 'in-hoc/withPropDependingState';
import { createTracker } from 'in-services/tracking/mixpanel';
import getCompanyInfo from 'in-subscription/getCompanyInfo';
import { close } from 'in-components/DialogPresenter/store';
import Notification from 'in-components/form/Notification';
import requestQuote from 'in-subscription/requestQuote';
import { emptyObject } from 'in-services/fixedObjects';
import Button from 'in-new-components/Button';
import Dialog from 'in-components/Dialog';
import connect from 'in-hoc/connectTo';

import locals from './RequestQuoteDialog.mless';
const submittedTracker = createTracker('requestQuote.submitted');

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
      <Dialog>
        {!form && (
          <div className={locals.loadingState}>
            <InfiniteCircle
              className={locals.loadingStateIcon}
              width={300}
              customText="Loading necessary information…"
            />
          </div>
        )}

        {form && (
          <form onSubmit={this.onSubmit}>
            <Section>
              {this.state.message ? (
                <div className={locals.notificationWrapper}>
                  <Notification failure={this.state.error} success={!this.state.error} loading={this.state.loading}>
                    {this.state.message}
                  </Notification>
                </div>
              ) : null}
            </Section>

            {form ? <RequestQuoteForm form={form} onChange={this.onChange} /> : null}

            {form ? (
              <div className={locals.buttonWrapper}>
                <Button kind="action" onClick={close}>
                  Cancel
                </Button>
                <Button kind="primary" type="submit" disabled={!form.hierarchyValid && form.touched}>
                  Submit
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

    submittedTracker();

    const { countries, states } = this.props;
    const countryList = countries == null ? [] : countries.list;
    const stateList = states == null ? [] : states.list;

    if (!this.props.form.hierarchyValid) {
      this.props.setForm(this.props.form.setTouched(true, { recurse: true }));
      return;
    }

    this.setState({ loading: true, error: false, message: null });

    const json = this.props.form.toJS();

    this.requestQuoteSubscription = requestQuote({
      ...json,
      billingState: getStateById(stateList, json.billingState).name,
      billingCountry: getCountryById(countryList, json.billingCountry).name
    }).subscribe(result => {
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
          message: 'Your quote request has been successfully submitted.'
        });
        setTimeout(close, 3000);
      }
    });
  };
}

export default compose(
  connect({
    result: getCompanyInfo(),
    countries: fromPromise(countries()),
    states: fromPromise(states())
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
