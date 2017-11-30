import { createLogger } from 'instalog';
import { fromJS } from 'immutable';
import React from 'react';

import SubViewWrapper from 'in-views/configurationView/components/SubViewWrapper';
import SubViewHeader from 'in-views/configurationView/components/SubViewHeader';
import Section from 'in-views/configurationView/components/Section';
import Notification from 'in-components/form/Notification';
import Button from 'in-components/Button';
import Title from 'in-components/Title';

const logger = createLogger('BasicEntityOverview');

export default class extends React.Component {
  static displayName = 'BasicEntityOverview';

  state = {
    loading: true,
    error: false,
    message: 'Loading…',
    form: null,
    entity: null
  };

  componentWillMount() {
    this.load(this.props.match.params.id);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.match.params.id !== nextProps.match.params.id) {
      this.load(nextProps.match.params.id);
    }
  }

  componentWillUnmount() {
    this.disposeAsyncAction();
  }

  render() {
    const { title, getEntityTitle, defaultEntityTitle, Form } = this.props;
    const { form, entity } = this.state;

    return (
      <SubViewWrapper>
        <Title title={title} />
        <SubViewHeader>
          {getEntityTitle ? `Configure ${getEntityTitle(entity)}` : `Configure ${defaultEntityTitle || ''}`}
        </SubViewHeader>

        <form onSubmit={this.onSubmit}>
          <Section>
            {form ? (
              <Button kind="success" type="submit" disabled={!form.hierarchyValid && form.touched}>
                Save
              </Button>
            ) : null}

            {this.state.message ? (
              <Notification failure={this.state.error} loading={this.state.loading}>
                {this.state.message}
              </Notification>
            ) : null}
          </Section>

          {form ? <Form form={form} onChange={this.onChange} /> : null}
        </form>
      </SubViewWrapper>
    );
  }

  load = id => {
    this.disposeAsyncAction();

    if (!id) {
      const entity = fromJS(this.props.createEntity());
      this.setState({
        loading: false,
        error: false,
        message: null,
        entity,
        form: this.props.createForm(entity)
      });
      return;
    }

    this.setState({
      loading: true,
      error: false,
      message: 'Loading…',
      form: null
    });

    const apiEntityResult$ = this.props.getEntity(id);
    this.responseSubscription = apiEntityResult$.once(entity => {
      this.setState({
        loading: false,
        error: false,
        message: null,
        entity,
        form: this.props.createForm(entity)
      });
    });

    this.errorSubscription = apiEntityResult$.errors().once(() => {
      this.setState({
        loading: false,
        error: true,
        message: 'Failed to load data.'
      });
    });
  };

  disposeAsyncAction = () => {
    if (this.responseSubscription) {
      this.responseSubscription.dispose();
    }

    if (this.errorSubscription) {
      this.errorSubscription.dispose();
    }
  };

  onChange = (fieldName, value) => {
    let updatedForm = this.state.form;
    if (Array.isArray(fieldName)) {
      for (let i = 0, length = fieldName.length; i < length; i++) {
        updatedForm = updatedForm.updateIn([fieldName[i]], setFieldValue.bind(null, value[i]));
      }
    } else {
      updatedForm = updatedForm.updateIn([fieldName], field => field.setValue(value).setTouched(true));
    }

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

    const entity = this.state.entity;
    const form = this.state.form;
    const result$ = this.props.save(entity, form);

    this.disposeAsyncAction();
    this.setState({
      loading: true,
      error: false,
      message: 'Saving…'
    });
    this.responseSubscription = result$.once(this.props.openEntities);

    this.errorSubscription = result$.errors().once(error => {
      const message = `Failed to save: ${error.message}`;
      logger.error(message, error);
      this.setState({
        loading: false,
        error: true,
        message
      });
    });
  };
}

function setFieldValue(value, field) {
  return field.setValue(value).setTouched(true);
}
