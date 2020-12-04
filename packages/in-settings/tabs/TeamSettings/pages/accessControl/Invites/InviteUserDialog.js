import { createField, notBlankValidator, createMapForm, createListForm } from 'formalistic';
import rpt from 'prop-types';
import React from 'react';

import { groupPermissionsEnabled } from 'in-services/featureFlags';
import TouchedMessages from 'in-components/form/TouchedMessages';
import { defaultRoleId, fallbackRoleId } from 'in-stores/user';
import { submitInviteUserTracker } from 'in-settings/tracker';
import { close } from 'in-components/DialogPresenter/store';
import { combineDataAndError } from 'in-services/util/ro';
import { Row, Col } from 'in-new-components/layout/Grid';
import FormGroup from 'in-settings/components/FormGroup';
import Dialog from 'in-new-components/Dialog/Dialog';
import Select from 'in-components/form/Select';
import Button from 'in-new-components/Button';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';
import SvgIcon from 'in-components/SvgIcon';
import { config } from 'in-services/config';
import connectTo from 'in-hoc/connectTo';
import { getRoles } from 'in-api/roles';

import locals from './InviteUserDialog.mless';

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
      form: createListForm({
        validator: invites => {
          if (invites.length === 0) {
            return [
              {
                severity: 'error',
                message: `Please invite at least one user.`
              }
            ];
          }
          return null;
        },

        items: [emptyInvite()]
      })
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
        <Dialog className={locals.dialog} title={`Invite user to ${config.tenant}`} onClose={close}>
          <form onSubmit={this.onSubmit(canSelectRole)}>
            {form.map((invite, i) => (
              <Row className={locals.row} key={i}>
                <Col xs={7}>
                  {invite.get('email').map(field => {
                    return (
                      <FormGroup>
                        <Label htmlFor={`invitation-email_${i}`} hasError={!field.valid && field.touched}>
                          Email Address
                        </Label>
                        <Input
                          id={`invitation-email_${i}`}
                          type="email"
                          value={field.value}
                          onChange={e => this.onChange([i, 'email'], e.target.value)}
                          hasError={!field.valid && field.touched}
                          autoFocus
                        />
                        <TouchedMessages field={field} />
                      </FormGroup>
                    );
                  })}
                </Col>
                <Col xs={4}>
                  {canSelectRole &&
                    invite.get('roleId').map(field => (
                      <FormGroup>
                        <Label htmlFor={`invitation-role_${i}`} hasError={!field.valid && field.touched}>
                          {groupPermissionsEnabled ? 'Group' : 'Role'}
                        </Label>
                        <Select
                          id={`invitation-role_${i}`}
                          value={field.value}
                          onChange={e => this.onChange([i, 'roleId'], e.target.value)}
                          hasError={!field.valid && field.touched}
                        >
                          {sortedRoles &&
                            sortedRoles.map(role => (
                              <option value={role.get('id')} key={`invitation-role_${role.get('id')}`}>
                                {role.get('name')}
                              </option>
                            ))}
                        </Select>
                        <TouchedMessages field={field} />
                      </FormGroup>
                    ))}
                </Col>
                <Col xs={1}>
                  <SvgIcon className={locals.removeButton} type="lib_actions_delete" onClick={() => this.onRemove(i)} />
                </Col>
              </Row>
            ))}

            <div className={locals.anotherUserRow}>
              <Button
                kind="action"
                icon="lib_openclose_add_circle_outline"
                className={locals.button}
                onClick={() =>
                  this.setState({
                    form: form.push(emptyInvite()).setTouched(true)
                  })
                }
              >
                Another user
              </Button>
            </div>

            <Button
              className={locals.button}
              kind="primary"
              type="submit"
              disabled={!form.hierarchyValid && form.touched}
            >
              Invite User
            </Button>
          </form>
        </Dialog>
      );
    }

    onChange = (path, value) => {
      this.setState({
        form: this.state.form.updateIn(path, field => field.setValue(value).setTouched(true))
      });
    };

    onRemove = path => {
      this.setState({
        form: this.state.form.remove(path).setTouched(true)
      });
    };

    onSubmit = canSelectRole => {
      const {
        roles: { data: userRoles }
      } = this.props;

      return event => {
        event.preventDefault();

        if (!this.state.form.hierarchyValid) {
          this.setState({
            form: this.state.form.setTouched(true, { recurse: true })
          });
          return;
        }

        // use default role when user is not allowed to choose a role
        let roleId;

        this.state.form.items.forEach(invite => {
          if (canSelectRole) {
            roleId = invite.get('roleId').value;
            const role = userRoles.length ? userRoles.find(role => role.get('id') === roleId) : null;
            const roleName = role && role.get('name') ? role.get('name') : 'default';
            submitInviteUserTracker({ role: roleName });
          } else {
            roleId = defaultRoleId;
            submitInviteUserTracker({ role: 'default' });
          }
        });

        this.props.onSubmit(this.state.form.toJS());
      };
    };
  }
);

function emptyInvite() {
  return createMapForm()
    .put(
      'roleId',
      createField({
        value: defaultRoleId,
        validator: notBlankValidator
      })
    )
    .put(
      'email',
      createField({
        value: '',
        validator: notBlankValidator
      })
    );
}
