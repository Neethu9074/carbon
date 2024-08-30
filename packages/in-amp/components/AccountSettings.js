/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createField } from 'formalistic';
import React from 'react';

import { SvgIcon } from '@instana/components';
import { Message } from '@instana/components';
import { Link } from '@instana/components';

import { valueMissingPlaceholder } from 'in-components/valueMissingPlaceholder';
import { getAccountAsResultObservable, refresh } from 'in-amp/api/account';
import { notBlankValidator } from 'in-services/validators/string';
import { Dl, Di } from 'in-components/HorizontalDescriptionList';
import SubViewHeader from 'in-settings/components/SubViewHeader';
import ApiItemView from 'in-settings/components/ApiItemView';
import { Row, Col } from 'in-components/layout/Grid';
import Title from 'in-components/Title/Title';
import { t, Trans } from 'in-i18n';

import locals from './AccountSettings.mless';

export default function AccountSettings() {
  return (
    <ApiItemView
      hideFooter
      getObservables={() => ({
        account: getAccountAsResultObservable()
      })}
      enrichForm={enrichForm}
      onCancelClick={refresh}
      render={render}
    />
  );
}

function render({ form }) {
  return (
    <>
      <Title title={t('in-amp:components.accountSettings.accountSettings')} />

      <div className={locals.subViewHeading}>
        <SvgIcon className={locals.icon} type="lib_home" size="l" />
        <div>
          <SubViewHeader>{form.get('name').value}</SubViewHeader>
          {form.get('companyDomains').map(field => (
            <span className={locals.domains}>
              {(field.value ?? [t('in-amp:components.accountSettings.unknownDomain')]).join(', ')}
            </span>
          ))}
        </div>
      </div>

      <form>
        <Row className={locals.row}>
          <Col xs={4}>
            <span className={locals.heading}>{t('in-amp:components.accountSettings.billingAddress')}</span>
          </Col>
        </Row>

        <Row className={locals.row}>
          <Col xs={4}>
            <Dl>
              <FormValue
                title={t('in-amp:components.accountSettings.country')}
                form={form}
                fieldName="billingCountry"
              />
              <FormValue title={t('in-amp:components.accountSettings.state')} form={form} fieldName="billingState" />
              <FormValue title={t('in-amp:components.accountSettings.zip')} form={form} fieldName="billingZip" />
              <FormValue title={t('in-amp:components.accountSettings.city')} form={form} fieldName="billingCity" />
              <FormValue title={t('in-amp:components.accountSettings.address')} form={form} fieldName="billingStreet" />
              <FormValue
                title={t('in-amp:components.accountSettings.additionalAddress')}
                form={form}
                fieldName="billingStreet2"
              />
            </Dl>
          </Col>
        </Row>
        <Message
          className={locals.message}
          withIcon
          title={
            <>
              <Trans
                i18nKey="in-amp:components.accountSettings.ifAnyOfTheInfoOnThisPageNeedsCorrectionsPleaseContact"
                components={{ linkToMail: <Link external href="mailto:salesops@instana.com" /> }}
                values={{ salesopsEmail: 'salesops@instana.com' }}
              />
            </>
          }
        />
      </form>
    </>
  );
}

function FormValue({ title, form, fieldName }) {
  return (
    <Di dtClassName={locals.title} title={title + ':'} ddClassName={locals.label}>
      {form.get(fieldName).value || valueMissingPlaceholder}
    </Di>
  );
}

function enrichForm(form, { result: { account } }) {
  return form
    .put('name', createField({ value: account.name || '', validator: notBlankValidator }))
    .put('accountId', createField({ value: account.accountId }))
    .put('companyDomains', createField({ value: account.companyDomains }))
    .put('environments', createField({ value: account.environments }))
    .put('billingCity', createField({ value: account.billingAddress.city || '', validator: notBlankValidator }))
    .put('billingCountry', createField({ value: account.billingAddress.country || '', validator: notBlankValidator }))
    .put('billingState', createField({ value: account.billingAddress.state || '', validator: notBlankValidator }))
    .put('billingStreet', createField({ value: account.billingAddress.street || '', validator: notBlankValidator }))
    .put('billingStreet2', createField({ value: account.billingAddress.street2 || '', validator: notBlankValidator }))
    .put('billingZip', createField({ value: account.billingAddress.zip || '', validator: notBlankValidator }));
}

// function fromToModel(form) {
//   return {
//     name: form.name,
//     accountId: form.accountId,
//     companyDomains: form.companyDomains,
//     environments: form.environments,
//     mutatorEmail: user.email,
//     billingAddress: {
//       city: form.billingCity,
//       country: form.billingCountry,
//       state: form.billingState,
//       street: form.billingStreet,
//       street2: form.billingStreet2,
//       zip: form.billingZip
//     }
//   };
// }
