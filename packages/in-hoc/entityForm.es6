import React, { Fragment } from 'react';
import { fromJS } from 'immutable';

import { getDisplayName } from 'in-hoc/internal/getDisplayName';
import LoadingIndicator from 'in-components/LoadingIndicator';
import Title from 'in-components/Title';

export const savingMessage = 'Saving…';

export default function entityForm(ComposedComponent) {
  return class extends React.Component {
    static displayName = getDisplayName(ComposedComponent, 'EntityFormHoc');

    state = {
      loading: true,
      error: false,
      form: null,
      entity: null,
      message: 'Loading…',
      saveEnabled: true
    };

    componentWillMount() {
      this.load(this.props);
    }

    componentWillReceiveProps(nextProps) {
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
        return <LoadingIndicator type="dark" />;
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
        message: 'Loading…',
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
        this.setState({
          loading: false,
          error: true,
          message: 'Failed to load data.'
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
        const message = `Failed to save: ${error.message}`;
        this.setState({
          loading: false,
          error: true,
          message
        });
      });
    };

    onChange = (fieldName, value, updateFormDefinition) => {
      const { entity } = this.state;
      let updatedForm = this.state.form;
      if (Array.isArray(fieldName)) {
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
