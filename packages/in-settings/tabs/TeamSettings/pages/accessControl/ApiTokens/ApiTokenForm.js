/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Button } from '@instana/components';

import PermissionsList from 'in-settings/tabs/TeamSettings/pages/accessControl/Permissions/PermissionsList.js';
import { apiTokenPermissions, productOwnerPermissions } from 'in-stores/permission';
import HorizontalFormGroup from 'in-settings/components/HorizontalFormGroup';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import SectionHeading from 'in-settings/components/SectionHeading';
import TouchedMessages from 'in-components/form/TouchedMessages';
import FormGroup from 'in-settings/components/FormGroup';
import { Row, Col } from 'in-new-components/layout/Grid';
import Dialog from 'in-new-components/Dialog/Dialog';
import Toggle from 'in-components/form/Toggle';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

import locals from './ApiTokens.mless';

const permissionsForList = apiTokenPermissions.filter(permission => !permission.isOwnerPermission);

export default function ApiTokenForm({ form, onChange, disabled }) {
  return (
    <fieldset disabled={disabled}>
      <SectionHeading>{t('in-settings:tabs.general')}</SectionHeading>

      {form.get('accessGrantingToken').map(field => (
        <FormGroup>
          <Label htmlFor="api-token-accessGrantingToken">{t('in-settings:tabs.apiToken')}</Label>
          <Input id="api-token-accessGrantingToken" value={field.value} readOnly />
        </FormGroup>
      ))}

      {form.get('name').map(field => (
        <FormGroup>
          <Label htmlFor="api-token-name" hasError={!field.valid && field.touched}>
            {t('in-settings:tabs.name')}
          </Label>
          <Input
            id="api-token-name"
            value={field.value}
            onChange={e => onChange('name', e.target.value)}
            hasError={!field.valid && field.touched}
            disabled={disabled}
            autoFocus
          />
          <TouchedMessages field={field} />
        </FormGroup>
      ))}

      <Row>
        <Col lg>
          <FormGroup>
            <Label>{t('in-settings:tabs.ownerPermissions')}</Label>
            {productOwnerPermissions.map(({ value, label, description, keyForApiTokenApi }) => (
              <HorizontalFormGroup key={label} helpText={description}>
                <Label htmlFor={`permission-${value}`}>{label}</Label>
                <Toggle
                  id={`permission-${keyForApiTokenApi}`}
                  checked={form.get(keyForApiTokenApi).value}
                  onChange={e => {
                    // check if value is currently false -> user sets permission to true
                    if (e.target.checked) {
                      addActiveDialog(<ConfirmationDialog onChange={() => onChange(keyForApiTokenApi, true)} />);
                    } else {
                      onChange(keyForApiTokenApi, false);
                    }
                  }}
                  disabled={!role.canConfigureApiTokens}
                />
              </HorizontalFormGroup>
            ))}
          </FormGroup>
        </Col>
      </Row>

      <PermissionsList
        permissions={permissionsForList}
        listActions={[
          {
            id: 'toggleEnabledAction',
            sortable: false,
            width: '5rem',
            widthInAbsoluteUnit: true,
            getContent(entity) {
              return (
                <Toggle
                  id={`permission-${entity.keyForApiTokenApi}`}
                  checked={form.get(entity.keyForApiTokenApi).map(field => field.value)}
                  onChange={e => onChange(entity.keyForApiTokenApi, e.target.checked)}
                  disabled={!role.canConfigureApiTokens}
                />
              );
            }
          }
        ]}
      />
    </fieldset>
  );
}

function ConfirmationDialog({ onChange }) {
  return (
    <Dialog
      className={locals.confirmationDialog}
      title={t('in-settings:tabs.ownerPermissions')}
      doNotCloseOnOutsideClick
      onClose={close}
    >
      <p>{t('in-settings:tabs.youAreAssigningThisApiTokenOwnerPermissions')}</p>

      <Button
        kind="primary"
        className={locals.confirmationDialogButton}
        onClick={() => {
          onChange();
          close();
        }}
      >
        Yes, I understand
      </Button>
    </Dialog>
  );
}
