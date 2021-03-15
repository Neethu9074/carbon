/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createField, notBlankValidator, createMapForm, createListForm } from 'formalistic';
import rpt from 'prop-types';
import React from 'react';

import { getStrippedGroupsAsResultObservable } from 'in-settings/tabs/TeamSettings/api/groups';
import TouchedMessages from 'in-components/form/TouchedMessages';
import { defaultRoleId, fallbackRoleId } from 'in-stores/user';
import { submitInviteUserTracker } from 'in-settings/tracker';
import { close } from 'in-components/DialogPresenter/store';
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
import { t } from 'in-i18n';

import locals from './InviteUserDialog.mless';

export default connectTo(
  {
    groups: getStrippedGroupsAsResultObservable()
  },
  class InviteUserDialog extends React.Component {
    static displayName = 'UserInvitatonDialog';

    static propTypes = {
      onSubmit: rpt.func.isRequired,
      groups: rpt.object
    };

    state = {
      form: createListForm({
        validator: invites => {
          if (invites.length === 0) {
            return [
              {
                severity: 'error',
                message: t('in-settings:tabs.pleaseInviteAtLeastOneUser')
              }
            ];
          }
          return null;
        },

        items: [emptyInvite()]
      })
    };

    render() {
      if (!this.props.groups) {
        // skip inital rendering, but render when the data has been loaded
        return null;
      }

      const { form } = this.state;
      let sortedGroups;

      if (this.props.groups.data) {
        sortedGroups = this.props.groups.data
          .filter(group => group.id !== fallbackRoleId)
          .map(group => {
            return { id: group.id, name: group.name };
          });
      }

      const canSelectGroup = sortedGroups !== undefined && sortedGroups.length !== 0;

      return (
        <Dialog
          className={locals.dialog}
          title={t('in-settings:tabs.inviteUserToTenant', { tenant: config.tenant })}
          onClose={close}
        >
          <form onSubmit={this.onSubmit(canSelectGroup)}>
            {form.map((invite, i) => (
              <Row className={locals.row} key={i}>
                <Col xs={7}>
                  {invite.get('email').map(field => {
                    return (
                      <FormGroup>
                        <Label htmlFor={`invitation-email_${i}`} hasError={!field.valid && field.touched}>
                          {t('in-settings:tabs.emailAddress')}
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
                  {canSelectGroup &&
                    invite.get('groupId').map(field => (
                      <FormGroup>
                        <Label htmlFor={`invitation-role_${i}`} hasError={!field.valid && field.touched}>
                          {t('in-settings:tabs.Group')}
                        </Label>
                        <Select
                          id={`invitation-group_${i}`}
                          value={field.value}
                          onChange={e => this.onChange([i, 'groupId'], e.target.value)}
                          hasError={!field.valid && field.touched}
                        >
                          {sortedGroups &&
                            sortedGroups.map(group => (
                              <option value={group.id} key={`invitation-group_${group.id}`}>
                                {group.name}
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
                {t('in-settings:tabs.anotherUser')}
              </Button>
            </div>

            <Button
              className={locals.button}
              kind="primary"
              type="submit"
              disabled={!form.hierarchyValid && form.touched}
            >
              {t('in-settings:tabs.inviteUser')}
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

    onSubmit = canSelectGroup => {
      const { groups } = this.props;

      return event => {
        event.preventDefault();

        if (!this.state.form.hierarchyValid) {
          this.setState({
            form: this.state.form.setTouched(true, { recurse: true })
          });
          return;
        }

        // use default role when user is not allowed to choose a role
        let groupId;

        this.state.form.items.forEach(invite => {
          if (canSelectGroup) {
            groupId = invite.get('groupId').value;
            const group = groups.length ? groups.find(group => group.id === groupId) : null;
            const groupName = group && group.name ? group.name : 'default';
            submitInviteUserTracker({ group: groupName });
          } else {
            groupId = defaultRoleId;
            submitInviteUserTracker({ group: 'default' });
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
      'groupId',
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
