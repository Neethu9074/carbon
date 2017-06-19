import { createMapForm, createField, notBlankValidator } from 'formalistic';
import rpt from 'prop-types';
import React from 'react';

import ValidationBlock from 'in-components/form/ValidationBlock';
import { close } from 'in-components/DialogPresenter/store';
import { getRoles } from 'in-services/api/roles';
import FormGroup from 'in-components/form/FormGroup';
import Select from 'in-components/form/Select';
import { fallbackRoleId } from 'in-stores/user';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';
import { ownerRoleId } from 'in-stores/user';
import Button from 'in-components/Button';
import { config } from 'in-services/config';
import Dialog from 'in-components/Dialog';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  {
    roles: getRoles()
  },
  class extends React.Component {
    static displayName = 'UserInvitatonDialog';

    static propTypes = {
      onSubmit: rpt.func.isRequired,
      roles: rpt.any
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
            value: ownerRoleId,
            validator: notBlankValidator
          })
        )
    };

    render() {
      const { form } = this.state;
      let sortedRoles;
      if (this.props.roles) {
        sortedRoles = this.props.roles
          .toArray()
          .filter(role => role.get('id') !== fallbackRoleId)
          .sort((a, b) => a.get('name').localeCompare(b.get('name')));
      }

      return (
        <Dialog header={`Invite user to ${config.tenant}`} onClose={close}>
          <form onSubmit={this.onSubmit}>
            {form.get('email').map(field =>
              <FormGroup>
                <Label htmlFor="invitation-email" hasError={!field.valid}>
                  Email Address
                </Label>
                <Input
                  id="invitation-email"
                  type="email"
                  value={field.value}
                  onChange={e => this.onChange('email', e.target.value)}
                  hasError={!field.valid}
                  autoFocus
                />
                {field.messages.map((message, i) =>
                  <ValidationBlock hasError key={i}>
                    {message.message}
                  </ValidationBlock>
                )}
              </FormGroup>
            )}

            {form.get('roleId').map(field =>
              <FormGroup>
                <Label htmlFor="invitation-role-id" hasError={!field.valid}>
                  Role
                </Label>
                <Select
                  id="invitation-role-id"
                  value={field.value}
                  onChange={e => this.onChange('roleId', e.target.value)}
                  hasError={!field.valid}
                >
                  {sortedRoles &&
                    sortedRoles.map(role =>
                      <option value={role.get('id')} key={role.get('id')}>
                        {role.get('name')}
                      </option>
                    )}
                </Select>
                {field.messages.map((message, i) =>
                  <ValidationBlock hasError key={i}>
                    {message.message}
                  </ValidationBlock>
                )}
              </FormGroup>
            )}

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

    onSubmit = e => {
      e.preventDefault();

      if (!this.state.form.hierarchyValid) {
        this.setState({
          form: this.state.form.setTouched(true, { recurse: true })
        });
        return;
      }

      this.props.onSubmit(this.state.form.get('email').value, this.state.form.get('roleId').value);
    };
  }
);
