/*
 * (c) Copyright IBM Corp. 2023
 * (c) Copyright Instana Inc.
 */

import { Field, MapForm } from 'formalistic';
import React from 'react';

import { Toggle, Button, SvgIcon, Stack } from '@instana/components';

// @ts-expect-error needs migration to typescript
import PermissionsList from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Permissions/PermissionsList';
import ExpirationDateDropdown from 'in-settings/components/ApiTokenExpiration/ExpirationDateDropdown/ExpirationDateDropdown';
import AsyncTokenCopyButton from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/ApiTokens/AsyncTokenCopyButton';
import TenantInfoBanner from 'in-settings/tabs/SecurityAndAccess/components/TenantInfoBanner/TenantInfoBanner';
import { ProductPermission, apiTokenPermissions, productOwnerPermissions } from 'in-stores/permission';
import HorizontalFormGroup from 'in-settings/components/HorizontalFormGroup';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import { apiTokenExpirationEnabled } from 'in-services/featureFlags';
import TouchedMessages from 'in-components/form/TouchedMessages';
import FormGroup from 'in-settings/components/FormGroup';
import { Row, Col } from 'in-components/layout/Grid';
import Title from 'in-components/lists/Title/Title';
import Dialog from 'in-components/Dialog/Dialog';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';
import Tooltip from 'in-components/Tooltip';
import config from 'in-services/config';
import { role } from 'in-stores/user';
import { t, Trans } from 'in-i18n';

import locals from './ApiTokens.mless';

interface ProductPermissionProps extends ProductPermission {
  value?: string | null | undefined;
}

interface ApiTokenFormProps {
  form: MapForm<any>;
  onChange: (fieldName: string, val: any) => void;
  disabled?: boolean;
  createNewToken?: boolean;
  setForm: (form: MapForm<any>) => void;
}

const permissionsForList = apiTokenPermissions.filter(permission => !permission.isOwnerPermission);

export default function ApiTokenForm({ form, onChange, disabled, createNewToken, setForm }: ApiTokenFormProps) {
  return (
    <fieldset data-testid="apitokenform" disabled={disabled}>
      {!createNewToken
        ? form.get('accessGrantingToken').map((field: Field<string>) => (
            <FormGroup className={locals.apiTokenAccessTokenContainer}>
              <Label id="api-token-accessGrantingToken">{field.value}</Label>
              <Tooltip align="rightMiddle" content={t('in-settings:tabs.copyApiTokenToClipboard')}>
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
      {apiTokenExpirationEnabled && <ExpirationDateDropdown id="api-token-expiration" form={form} setForm={setForm} />}
      <TenantInfoBanner>
        <Trans
          i18nKey="in-settings:tabs.apiTokenAlwaysHaveReadAccess"
          values={{ tenantUnit: config.tenantUnit, tenant: config.tenant }}
        />
      </TenantInfoBanner>
      <Row>
        <Col lg>
          <FormGroup>
            <Title>{t('in-settings:tabs.ownerPermissions')}</Title>
            {productOwnerPermissions.map((productOwnerPermission: ProductPermissionProps) => (
              <HorizontalFormGroup key={productOwnerPermission.label} noHelpTextSpacer>
                <Stack gap="xsmall" direction="horizontal" align="center">
                  <Label htmlFor={`permission-${productOwnerPermission.value}`}>{productOwnerPermission.label}</Label>
                  {productOwnerPermission.description && (
                    <Tooltip content={productOwnerPermission.description} align="auto">
                      <SvgIcon type="lib_help_error_info_outline" size="s" />
                    </Tooltip>
                  )}
                </Stack>
                <Toggle
                  id={`permission-${productOwnerPermission.keyForApiTokenApi}`}
                  checked={form.get(productOwnerPermission.keyForApiTokenApi).value}
                  onToggle={e => {
                    // check if value is currently false -> user sets permission to true
                    if (e) {
                      addActiveDialog(
                        <ConfirmationDialog onChange={() => onChange(productOwnerPermission.keyForApiTokenApi, true)} />
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
                  onToggle={e => onChange(entity.keyForApiTokenApi, e)}
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
      <p className={locals.confirmationDialogMessage}>
        {t('in-settings:tabs.youAreAssigningThisApiTokenOwnerPermissions')}
      </p>
      <div>
        <Button
          kind="primary"
          className={locals.confirmationDialogButton}
          onClick={() => {
            onChange();
            close();
          }}
        >
          {t('in-settings:tabs.yesIUnderstand')}
        </Button>
      </div>
    </Dialog>
  );
}
