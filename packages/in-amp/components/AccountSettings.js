/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createField, notBlankValidator } from 'formalistic';
import React from 'react';

import { valueMissingPlaceholder } from 'in-new-components/valueMissingPlaceholder';
import { getAccountAsResultObservable, refresh } from 'in-amp/api/account';
import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';
import SubViewHeader from 'in-settings/components/SubViewHeader';
import ApiItemView from 'in-settings/components/ApiItemView';
import { Row, Col } from 'in-new-components/layout/Grid';
import Message from 'in-new-components/Message';
import Title from 'in-components/Title/Title';
import SvgIcon from 'in-components/SvgIcon';
import Link from 'in-components/Link';
import { t } from 'in-i18n';

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
            <span className={locals.domains}>{field.value.join(', ')}</span>
          ))}
        </div>
      </div>

      <form>
        <Row className={locals.row}>
          <Col xs={4}>
            <span className={locals.heading}>{t('in-amp:components.accountSettings.billingAddress')}</span>
          </Col>
          <Col xs={4}>
            <span className={locals.heading}>{t('in-amp:components.accountSettings.shippingAddress')}</span>
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
          <Col xs={4}>
            <Dl>
              <FormValue
                title={t('in-amp:components.accountSettings.country')}
                form={form}
                fieldName="shippingCountry"
              />
              <FormValue title={t('in-amp:components.accountSettings.state')} form={form} fieldName="shippingState" />
              <FormValue title={t('in-amp:components.accountSettings.zip')} form={form} fieldName="shippingZip" />
              <FormValue title={t('in-amp:components.accountSettings.city')} form={form} fieldName="shippingCity" />
              <FormValue
                title={t('in-amp:components.accountSettings.address')}
                form={form}
                fieldName="shippingStreet"
              />
              <FormValue
                title={t('in-amp:components.accountSettings.additionalAddress')}
                form={form}
                fieldName="shippingStreet2"
              />
            </Dl>
          </Col>
        </Row>
        <Message
          className={locals.message}
          withIcon
          title={
            <>
              If any of the info on this page needs corrections, please contact{' '}
              <Link external href="mailto:salesops@instana.com">
                salesops@instana.com
              </Link>
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
    .put('billingZip', createField({ value: account.billingAddress.zip || '', validator: notBlankValidator }))
    .put('shippingCity', createField({ value: account.shippingAddress.city || '', validator: notBlankValidator }))
    .put('shippingCountry', createField({ value: account.shippingAddress.country || '', validator: notBlankValidator }))
    .put('shippingState', createField({ value: account.shippingAddress.state || '', validator: notBlankValidator }))
    .put('shippingStreet', createField({ value: account.shippingAddress.street || '', validator: notBlankValidator }))
    .put('shippingStreet2', createField({ value: account.shippingAddress.street2 || '', validator: notBlankValidator }))
    .put('shippingZip', createField({ value: account.shippingAddress.zip || '', validator: notBlankValidator }));
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
//     },
//     shippingAddress: {
//       city: form.shippingCity,
//       country: form.shippingCountry,
//       state: form.shippingState,
//       street: form.shippingStreet,
//       street2: form.shippingStreet2,
//       zip: form.shippingZip
//     }
//   };
// }
