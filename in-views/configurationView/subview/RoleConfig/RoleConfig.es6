import {createMapForm, createField, notBlankValidator} from 'formalistic';
import {parse} from 'lucene';
import React from 'react';

import SubViewWrapper from 'in-views/configurationView/components/SubViewWrapper';
import SubViewHeader from 'in-views/configurationView/components/SubViewHeader';
import RoleForm from 'in-views/configurationView/subview/RoleConfig/RoleForm';
import Section from 'in-views/configurationView/components/Section';
import {ownerRoleId, fallbackRoleId} from 'in-stores/user';
import {getRole} from 'in-services/groundskeeper/roles';

import './RoleConfig.less';

const block = 'in-config-view-role';

export default React.createClass({
  displayName: 'RoleConfig',

  getInitialState() {
    return {
      loading: true,
      error: false,
      message: 'Loading Role…',
      form: null,
      role: null
    };
  },

  componentWillMount() {
    this.loadRole(this.props.params.roleId);
  },

  componentWillReceiveProps(nextProps) {
    if (this.props.params.roleId !== nextProps.params.roleId) {
      this.loadRole(nextProps.params.roleId);
    }
  },

  loadRole(roleId) {
    this.disposeAsyncAction();

    this.setState({
      loading: true,
      error: false,
      message: 'Loading Role…',
      form: null,
      role: null
    });

    const result$ = getRole(roleId);
    this.responseSubscription = result$.once(role => {
      this.setState({
        loading: false,
        error: false,
        message: null,
        role,
        form: createForm(role)
      });
    });

    this.errorSubscription = result$.errors().once(() => {
      this.setState({
        loading: false,
        error: true,
        message: 'Failed to load role.'
      });
    });
  },

  componentWillUnmount() {
    this.disposeAsyncAction();
  },

  disposeAsyncAction() {
    if (this.responseSubscription) {
      this.responseSubscription.dispose();
    }

    if (this.errorSubscription) {
      this.errorSubscription.dispose();
    }
  },

  render() {
    const {form} = this.state;
    const roleId = form ? form.get('id').value : null;
    // do not allow editing of the owner or fallback role
    const disabled = roleId == null || roleId === ownerRoleId || roleId === fallbackRoleId;

    return (
      <SubViewWrapper>
        <SubViewHeader>
          {form ? `Configure Role: ${form.get('name').value}` : 'Configure Role'}
        </SubViewHeader>

        <Section>
          {form && disabled ?
            <p className={`${block}__disabled-hint`}>
              This role cannot be modified as it is a predefined system role.
            </p>
          : null}
        </Section>

        {form != null ?
          <RoleForm form={form}
                    onSubmit={this.onSubmit}
                    onChange={this.onChange}
                    disabled={disabled} />
        : null}
      </SubViewWrapper>
    );
  },

  onChange(fieldName, value) {
    const updatedForm = this.state.form.updateIn([fieldName], field =>
      field.setValue(value).setTouched(true)
    );

    this.setState({
      form: updatedForm
    });
  },

  onSubmit(e) {
    e.preventDefault();

    if (!this.state.form.hierarchyValid) {
      this.setState({
        form: this.state.form.setTouched(true, {recurse: true})
      });
      return;
    }

    // console.log('submit form', this.state.form.toJS());
  }
});


function createForm(role) {
  return createMapForm()
    .put('id', createField({value: role.get('id')}))
    .put('name', createField({
      value: role.get('name'),
      validator: notBlankValidator
    }))
    .put('implicitViewFilter', createField({
      value: role.get('implicitViewFilter'),
      validator(query) {
        try {
          parse(query);
          return null;
        } catch (e) {
          return [{
            severity: 'error',
            message: `Please enter a valid lucene query. Parsing error: ${e.message}`
          }];
        }
      }
    }))
    .put('canConfigureServiceMapping', createField({value: role.get('canConfigureServiceMapping')}))
    .put('canConfigureEumApplications', createField({value: role.get('canConfigureEumApplications')}))
    .put('canConfigureUsers', createField({value: role.get('canConfigureUsers')}))
    .put('canInstallNewAgents', createField({value: role.get('canInstallNewAgents')}))
    .put('canSeeUsageInformation', createField({value: role.get('canSeeUsageInformation')}))
    .put('canConfigureIntegrations', createField({value: role.get('canConfigureIntegrations')}))
    .put('canSeeOnPremLicenseInformation', createField({value: role.get('canSeeOnPremLicenseInformation')}))
    .put('canConfigureRoles', createField({value: role.get('canConfigureRoles')}));
}
