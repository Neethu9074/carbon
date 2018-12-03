import React from 'react';

import RequestQuoteForm from 'in-components/RequestQuoteDialog/RequestQuoteForm';
import { createMapForm, createField, notBlankValidator } from 'formalistic';
import Section from 'in-views/configurationView/components/Section';
import Notification from 'in-components/form/Notification';
import Dialog from 'in-components/Dialog';
import Button from 'in-components/Button';

export default class extends React.Component {
  static displayName = 'RequestQuoteDialog';

  state = {
    loading: true,
    error: false,
    message: null,
    //todo: getCompanyName
    form: createForm(null),
    companyName: null
  };

  render() {
    const { form } = this.state;

    return (
      <Dialog>
        <form onSubmit={this.onSubmit}>
          <Section>
            {this.state.message ? (
              <Notification failure={this.state.error} loading={this.state.loading}>
                {this.state.message}
              </Notification>
            ) : null}
          </Section>

          {form ? <RequestQuoteForm form={form} onChange={this.onChange} /> : null}

          {form ? (
            <Button kind="success" type="submit" disabled={!form.hierarchyValid && form.touched}>
              Submit
            </Button>
          ) : null}
        </form>
      </Dialog>
    );
  }

  onChange = (fieldName, value) => {
    const updatedForm = this.state.form.updateIn([fieldName], field => field.setValue(value).setTouched(true));

    this.setState({
      form: updatedForm
    });
  };

  onSubmit = e => {
    e.preventDefault();

    if (!this.state.form.hierarchyValid) {
      this.setState({
        form: this.state.form.setTouched(true, { recurse: true })
      });
      return;
    }
    //do something
  };
}

function createForm(companyName) {
  return createMapForm()
    .put('companyName', createField({ value: companyName || '', validator: notBlankValidator }))
    .put('numberOfApmHosts', createField({ validator: notBlankValidator }))
    .put('numberOfInfraHosts', createField({ validator: notBlankValidator }))
    .put('numberOfYears', createField({ validator: notBlankValidator }))
    .put('billingStreet', createField({ validator: notBlankValidator }))
    .put('billingCity', createField({ validator: notBlankValidator }))
    .put('billingState', createField({ validator: notBlankValidator }))
    .put('billingCountry', createField({ validator: notBlankValidator }))
    .put('billingZip', createField({ validator: notBlankValidator }));
}
