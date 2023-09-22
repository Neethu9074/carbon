/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Field } from 'formalistic';
import React from 'react';

import { Toggle, Button } from '@instana/components';

// @ts-expect-error
import AsyncTokenCopyButton from 'in-settings/tabs/TeamSettings/pages/accessControl/ApiTokens/AsyncTokenCopyButton';
// @ts-expect-error
import PermissionsList from 'in-settings/tabs/TeamSettings/pages/accessControl/Permissions/PermissionsList.js';
import { ProductPermission, apiTokenPermissions, productOwnerPermissions } from 'in-stores/permission';
import HorizontalFormGroup from 'in-settings/components/HorizontalFormGroup';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import TouchedMessages from 'in-components/form/TouchedMessages';
import FormGroup from 'in-settings/components/FormGroup';
import { Row, Col } from 'in-components/layout/Grid';
import Dialog from 'in-components/Dialog/Dialog';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';
import Tooltip from 'in-components/Tooltip';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

import locals from './ApiTokens.mless';
import { FormProp } from './ApiToken';

interface ProductPermissionProps extends ProductPermission {
  value?: string | null | undefined;
}

interface ApiTokenFormProps {
  form: FormProp;
  onChange: (fieldName: string, val: any) => void;
  disabled?: boolean;
  createNewToken?: boolean;
}

const permissionsForList = apiTokenPermissions.filter(permission => !permission.isOwnerPermission);

export default function ApiTokenForm({ form, onChange, disabled, createNewToken }: ApiTokenFormProps) {
  return (
    <fieldset disabled={disabled}>
      {!createNewToken
        ? form.get('accessGrantingToken').map((field: Field<string>) => (
            <FormGroup noFlex>
              <Label className={locals.apiTokenLabel} id="api-token-accessGrantingToken">
                {field.value}
              </Label>
              <Tooltip align="topRight" content={t('in-settings:tabs.copyApiTokenToClipboard')}>
                <AsyncTokenCopyButton
                  internalId={form.get('internalId').value}
                  token={form.get('accessGrantingToken').value}
                  updateToken={(token: string) => onChange('accessGrantingToken', token)}
                />
              </Tooltip>
            </FormGroup>
          ))
        : null}

      {form.get('name').map((field: Field<string>) => (
        <FormGroup>
          <Label htmlFor="api-token-name" hasError={!field.valid && field.touched}>
            {t('in-settings:tabs.personalApiTokenNameDescription')}
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
            {productOwnerPermissions.map((productOwnerPermission: ProductPermissionProps) => (
              <HorizontalFormGroup key={productOwnerPermission.label} helpText={productOwnerPermission.description}>
                <Label htmlFor={`permission-${productOwnerPermission.value}`}>{productOwnerPermission.label}</Label>
                <Toggle
                  id={`permission-${productOwnerPermission.keyForApiTokenApi}`}
                  checked={form.get(productOwnerPermission.keyForApiTokenApi).value}
                  onChange={e => {
                    // check if value is currently false -> user sets permission to true
                    if (e.target.checked) {
                      addActiveDialog(
                        <ConfirmationDialog
                          onChange={() => onChange(productOwnerPermission.keyForApiTokenApi, true)}
                        />
                      );
                    } else {
                      onChange(productOwnerPermission.keyForApiTokenApi, false);
                    }
                  }}
                  disabled={!role?.canConfigureApiTokens}
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
            getContent(entity: ProductPermissionProps) {
              return (
                <Toggle
                  id={`permission-${entity.keyForApiTokenApi}`}
                  checked={form.get(entity.keyForApiTokenApi).map((field: Field<string>) => field.value)}
                  onChange={e => onChange(entity.keyForApiTokenApi, e.target.checked)}
                  disabled={!role?.canConfigureApiTokens}
                />
              );
            }
          }
        ]}
      />
    </fieldset>
  );
}

function ConfirmationDialog({ onChange }: { onChange: () => void }) {
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
