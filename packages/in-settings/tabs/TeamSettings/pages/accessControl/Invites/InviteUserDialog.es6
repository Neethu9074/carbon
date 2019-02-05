import { createMapForm, createField, notBlankValidator } from 'formalistic';
import rpt from 'prop-types';
import React from 'react';

import TouchedMessages from 'in-components/form/TouchedMessages';
import { defaultRoleId, fallbackRoleId } from 'in-stores/user';
import { close } from 'in-components/DialogPresenter/store';
import { combineDataAndError } from 'in-services/util/ro';
import FormGroup from 'in-settings/components/FormGroup';
import Select from 'in-components/form/Select';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';
import { config } from 'in-services/config';
import Button from 'in-components/Button';
import Dialog from 'in-components/Dialog';
import connectTo from 'in-hoc/connectTo';
import { getRoles } from 'in-api/roles';

export default connectTo(
  {
    roles: combineDataAndError(getRoles())
  },
  class InviteUserDialog extends React.Component {
    static displayName = 'UserInvitatonDialog';

    static propTypes = {
      onSubmit: rpt.func.isRequired,
      roles: rpt.object
    };

    state = {
      form: createMapForm()
        .put(
          'email',
          createField({
            value: '',
            validator: notBlankValidator
          })
        )
        .put(
          'roleId',
          createField({
            value: defaultRoleId,
            validator: notBlankValidator
          })
        )
    };

    render() {
      if (!this.props.roles) {
        // skip inital rendering, but render when the data has been loaded
        return null;
      }

      const { form } = this.state;
      let sortedRoles;
      if (this.props.roles.data) {
        sortedRoles = this.props.roles.data
          .toArray()
          .filter(role => role.get('id') !== fallbackRoleId)
          .sort((a, b) => a.get('name').localeCompare(b.get('name')));
      }

      const canSelectRole = sortedRoles !== undefined && sortedRoles.length !== 0;

      return (
        <Dialog header={`Invite user to ${config.tenant}`} onClose={close}>
          <form onSubmit={this.onSubmit(canSelectRole)}>
            {form.get('email').map(field => (
              <FormGroup>
                <Label htmlFor="invitation-email" hasError={!field.valid && field.touched}>
                  Email Address
                </Label>
                <Input
                  id="invitation-email"
                  type="email"
                  value={field.value}
                  onChange={e => this.onChange('email', e.target.value)}
                  hasError={!field.valid && field.touched}
                  autoFocus
                />
                <TouchedMessages field={field} />
              </FormGroup>
            ))}
            {canSelectRole &&
              form.get('roleId').map(field => (
                <FormGroup>
                  <Label htmlFor="invitation-role-id" hasError={!field.valid && field.touched}>
                    Role
                  </Label>
                  <Select
                    id="invitation-role-id"
                    value={field.value}
                    onChange={e => this.onChange('roleId', e.target.value)}
                    hasError={!field.valid && field.touched}
                  >
                    {sortedRoles &&
                      sortedRoles.map(role => (
                        <option value={role.get('id')} key={role.get('id')}>
                          {role.get('name')}
                        </option>
                      ))}
                  </Select>
                  <TouchedMessages field={field} />
                </FormGroup>
              ))}

            <Button kind="success" type="submit" disabled={!form.hierarchyValid && form.touched}>
              Invite User
            </Button>
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

    onSubmit = canSelectRole => {
      return event => {
        event.preventDefault();

        if (!this.state.form.hierarchyValid) {
          this.setState({
            form: this.state.form.setTouched(true, { recurse: true })
          });
          return;
        }

        // use default role when user is not allowed to choose a role
        const roleId = canSelectRole ? this.state.form.get('roleId').value : defaultRoleId;

        this.props.onSubmit(this.state.form.get('email').value, roleId);
      };
    };
  }
);
