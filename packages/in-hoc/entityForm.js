/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { Fragment } from 'react';
import { fromJS } from 'immutable';

import LoadingIndicator from 'in-new-components/LoadingIndicators/LoadingIndicator';
import { getDisplayName } from 'in-hoc/internal/getDisplayName';
import { scrollToTopSmoothly } from 'in-services/util/dom';
import Title from 'in-components/Title';
import { t } from 'in-i18n';

export const savingMessage = t('in-hoc:entityFormSaving');

export default function entityForm(ComposedComponent) {
  return class extends React.Component {
    static displayName = getDisplayName(ComposedComponent, 'EntityFormHoc');

    state = {
      loading: true,
      error: false,
      form: null,
      entity: null,
      message: t('in-hoc:entityFormLoading'),
      saveEnabled: true
    };

    UNSAFE_componentWillMount() {
      this.load(this.props);
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
      if (this.props.entityId !== nextProps.entityId) {
        this.load(nextProps);
      }
    }

    componentWillUnmount() {
      this.disposeAsyncAction();
    }

    render() {
      const { title } = this.props;
      const { form, entity } = this.state;

      if (!entity) {
        return <LoadingIndicator />;
      }

      return (
        <Fragment>
          <Title title={title} />
          <form onSubmit={this.onSubmit}>
            <ComposedComponent
              {...this.props}
              {...this.state}
              entity={entity}
              form={form}
              onChange={this.onChange}
              setForm={form => this.setState({ form })}
              setSaveEnabled={this.setSaveEnabled}
              saveEnabled={this.state.saveEnabled}
            />
          </form>
        </Fragment>
      );
    }

    disposeAsyncAction = () => {
      if (this.responseSubscription) {
        this.responseSubscription.dispose();
      }

      if (this.errorSubscription) {
        this.errorSubscription.dispose();
      }
    };

    load = ({ entityId, createDefaultEntity, getEntityFromApi }) => {
      this.disposeAsyncAction();

      if (!entityId) {
        const entity = fromJS(createDefaultEntity());
        this.setState({
          loading: false,
          error: false,
          message: null,
          entity,
          isCreate: true,
          form: this.props.createForm(entity)
        });
        return;
      }

      this.setState({
        loading: true,
        error: false,
        message: t('in-hoc:entityFormLoading'),
        isCreate: false,
        form: null
      });

      const apiEntityResult$ = getEntityFromApi(entityId);
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
        scrollToTopSmoothly();
        this.setState({
          loading: false,
          error: true,
          message: t('in-hoc:entityFormFailedToLoadData')
        });
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
      const result$ = this.props.saveEntity(entity, form);

      this.disposeAsyncAction();
      this.setState({
        loading: true,
        error: false,
        message: savingMessage
      });
      this.responseSubscription = result$.once(this.props.openEntities);

      this.errorSubscription = result$.errors().once(error => {
        let message = error.message;
        if (
          error.response &&
          error.response.body &&
          error.response.body.errors &&
          error.response.body.errors.length > 0
        ) {
          message = error.response.body.errors.join(', ');
        }
        scrollToTopSmoothly();
        this.setState({
          loading: false,
          error: true,
          message: t('in-hoc:entityFormFailedToSave', { SaveFailureMessage: message })
        });
      });
    };

    onChange = (fieldName, value, updateFormDefinition, forceSetValue) => {
      if (typeof fieldName === 'function') {
        const updater = fieldName;
        const updatedForm = updater(this.state.form);
        this.setState({
          form: updatedForm
        });
        return updatedForm;
      }
      const { entity } = this.state;
      let updatedForm = this.state.form;
      if (forceSetValue) {
        updatedForm = updatedForm.put([fieldName], value);
      } else if (Array.isArray(fieldName)) {
        for (let i = 0, length = fieldName.length; i < length; i++) {
          updatedForm = updatedForm.updateIn([fieldName[i]], setFieldValue.bind(null, value[i]));
        }
      } else {
        updatedForm = updatedForm.updateIn([fieldName], field => field.setValue(value).setTouched(true));
      }

      if (updateFormDefinition) {
        updatedForm = updateFormDefinition(updatedForm, entity);
      }

      this.setState({
        form: updatedForm
      });

      return updatedForm;
    };

    setSaveEnabled = enabled => {
      this.setState({
        saveEnabled: enabled
      });
    };
  };
}

function setFieldValue(value, field) {
  return field.setValue(value).setTouched(true);
}
