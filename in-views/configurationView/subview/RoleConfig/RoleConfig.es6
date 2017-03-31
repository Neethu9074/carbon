import { createMapForm, createField, notBlankValidator } from 'formalistic';
import { createLogger } from 'instalog';
import { Map } from 'immutable';
import React from 'react';

import SubViewWrapper from 'in-views/configurationView/components/SubViewWrapper';
import SubViewHeader from 'in-views/configurationView/components/SubViewHeader';
import RoleForm from 'in-views/configurationView/subview/RoleConfig/RoleForm';
import Section from 'in-views/configurationView/components/Section';
import { getRole, saveRole } from 'in-services/groundskeeper/roles';
import { openRoles } from 'in-stores/navigation/configuration';
import { queryValidator } from 'in-stores/search/validations';
import Notification from 'in-components/form/Notification';
import { ownerRoleId, fallbackRoleId } from 'in-stores/user';
import Button from 'in-components/Button';

const logger = createLogger('roleConfig');

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
    const { form, role } = this.state;
    const roleId = form ? form.get('id').value : null;
    // do not allow editing of the owner or fallback role
    const disabled = roleId == null || roleId === ownerRoleId || roleId === fallbackRoleId;

    return (
      <SubViewWrapper>
        <SubViewHeader>
          {role ? `Configure Role: ${role.get('name')}` : 'Configure Role'}
        </SubViewHeader>

        <form onSubmit={this.onSubmit}>
          <Section>
            {form && !disabled
              ? <Button kind="success" type="submit" disabled={!form.hierarchyValid && form.touched}>
                  Save
                </Button>
              : null}

            {this.state.message
              ? <Notification failure={this.state.error} loading={this.state.loading}>
                  {this.state.message}
                </Notification>
              : null}

            {form && disabled
              ? <p>
                  This role cannot be modified as it is a predefined system role.
                </p>
              : null}
          </Section>

          {form ? <RoleForm form={form} onChange={this.onChange} disabled={disabled} /> : null}
        </form>
      </SubViewWrapper>
    );
  },

  onChange(fieldName, value) {
    const updatedForm = this.state.form.updateIn([fieldName], field => field.setValue(value).setTouched(true));

    this.setState({
      form: updatedForm
    });
  },

  onSubmit(e) {
    e.preventDefault();

    if (!this.state.form.hierarchyValid) {
      this.setState({
        form: this.state.form.setTouched(true, { recurse: true })
      });
      return;
    }

    const role = Map(this.state.form.toJS());
    const result$ = saveRole(role);
    this.disposeAsyncAction();
    this.setState({
      loading: true,
      error: false,
      message: 'Saving…'
    });
    this.responseSubscription = result$.once(openRoles);

    this.errorSubscription = result$.errors().once(error => {
      const message = `Failed to save role: ${error.message}`;
      logger.error(message, error);
      this.setState({
        loading: false,
        error: true,
        message
      });
    });
  }
});

function createForm(role) {
  return createMapForm()
    .put('id', createField({ value: role.get('id') }))
    .put(
      'name',
      createField({
        value: role.get('name'),
        validator: notBlankValidator
      })
    )
    .put(
      'implicitViewFilter',
      createField({
        value: role.get('implicitViewFilter'),
        validator: queryValidator
      })
    )
    .put('canConfigureServiceMapping', createField({ value: role.get('canConfigureServiceMapping') }))
    .put('canConfigureEumApplications', createField({ value: role.get('canConfigureEumApplications') }))
    .put('canConfigureUsers', createField({ value: role.get('canConfigureUsers') }))
    .put('canInstallNewAgents', createField({ value: role.get('canInstallNewAgents') }))
    .put('canSeeUsageInformation', createField({ value: role.get('canSeeUsageInformation') }))
    .put('canConfigureIntegrations', createField({ value: role.get('canConfigureIntegrations') }))
    .put('canSeeOnPremLicenseInformation', createField({ value: role.get('canSeeOnPremLicenseInformation') }))
    .put('canConfigureRoles', createField({ value: role.get('canConfigureRoles') }))
    .put('canConfigureCustomAlerts', createField({ value: role.get('canConfigureCustomAlerts') }))
    .put('canConfigureApiTokens', createField({ value: role.get('canConfigureApiTokens') }))
    .put('canConfigureAgentRunMode', createField({ value: role.get('canConfigureAgentRunMode') }))
    .put('canViewAuditLog', createField({ value: role.get('canViewAuditLog') }))
    .put('canConfigureObjectives', createField({ value: role.get('canConfigureObjectives') }));
}
