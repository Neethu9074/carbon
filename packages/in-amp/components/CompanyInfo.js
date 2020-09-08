import { createField, notBlankValidator } from 'formalistic';
import React, { useState } from 'react';

import { valueMissingPlaceholder } from 'in-new-components/valueMissingPlaceholder';
import { getCompanyInfoAsResultObservable, refresh } from 'in-amp/api/companyInfo';
import HorizontalFlexWrapper from 'in-new-components/layout/HorizontalFlexWrapper';
import TouchedMessages from 'in-components/form/TouchedMessages';
import SubViewHeader from 'in-settings/components/SubViewHeader';
import ApiItemView from 'in-settings/components/ApiItemView';
import { Row, Col } from 'in-new-components/layout/Grid';
import Message from 'in-new-components/Message';
import Title from 'in-components/Title/Title';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';
import SvgIcon from 'in-components/SvgIcon';

import locals from './CompanyInfo.mless';

export default function CompanyInfo() {
  return (
    <ApiItemView
      hideFooter
      getObservables={() => ({
        companyInfo: getCompanyInfoAsResultObservable()
      })}
      enrichForm={enrichForm}
      onCancelClick={refresh}
      render={render}
    />
  );
}

function render({ form, setForm }) {
  // editable will come later
  const [isEditable] = useState(false);

  return (
    <>
      <Message
        className={locals.message}
        withIcon
        title="If any of the info on this page needs corrections, please contact salesops@instana.com"
      />
      <Title title="Company Information" />

      <HorizontalFlexWrapper>
        <SvgIcon className={locals.icon} type="lib_home" size="l" />
        <SubViewHeader>{form.get('name').value}</SubViewHeader>
      </HorizontalFlexWrapper>

      <form>
        <Row className={locals.row}>
          <Col xs={4}>
            <span className={locals.heading}>Billing Address</span>
          </Col>
          <Col xs={4}>
            <span className={locals.heading}>Shipping Address</span>
          </Col>
        </Row>
        <Row className={locals.row}>
          <InputField
            title="Country"
            fieldName="billingCountry"
            form={form}
            setForm={setForm}
            isEditable={isEditable}
          />
          <InputField
            title="Country"
            fieldName="shippingCountry"
            form={form}
            setForm={setForm}
            isEditable={isEditable}
          />
        </Row>
        <Row className={locals.row}>
          <InputField title="State" fieldName="billingState" form={form} setForm={setForm} isEditable={isEditable} />
          <InputField title="State" fieldName="shippingState" form={form} setForm={setForm} isEditable={isEditable} />
        </Row>
        <Row className={locals.row}>
          <InputField title="Zip" fieldName="billingZip" form={form} setForm={setForm} isEditable={isEditable} />
          <InputField title="Zip" fieldName="shippingZip" form={form} setForm={setForm} isEditable={isEditable} />
        </Row>
        <Row className={locals.row}>
          <InputField title="City" fieldName="billingCity" form={form} setForm={setForm} isEditable={isEditable} />
          <InputField title="City" fieldName="shippingCity" form={form} setForm={setForm} isEditable={isEditable} />
        </Row>
        <Row className={locals.row}>
          <InputField title="Street" fieldName="billingStreet" form={form} setForm={setForm} isEditable={isEditable} />
          <InputField title="Street" fieldName="shippingStreet" form={form} setForm={setForm} isEditable={isEditable} />
        </Row>
        <Row className={locals.row}>
          <InputField
            title="Street 2"
            fieldName="billingStreet2"
            form={form}
            setForm={setForm}
            isEditable={isEditable}
          />
          <InputField
            title="Street 2"
            fieldName="shippingStreet2"
            form={form}
            setForm={setForm}
            isEditable={isEditable}
          />
        </Row>
      </form>
    </>
  );
}

function InputField({ form, setForm, title, fieldName, isEditable }) {
  return form.get(fieldName).map(field => (
    <Col xs={4}>
      <HorizontalFlexWrapper>
        <Label className={locals.label} htmlFor={fieldName} hasError={!field.valid && field.touched}>
          {title}
        </Label>
        {isEditable ? (
          <Input
            className={locals.input}
            id={fieldName}
            value={field.value}
            onChange={e => {
              setForm(form.updateIn([fieldName], f => f.setValue(e.target.value).setTouched(true)));
            }}
            hasError={!field.valid && field.touched}
          />
        ) : (
          <Label className={locals.inputLabel} htmlFor={fieldName} hasError={!field.valid && field.touched}>
            {field.value || valueMissingPlaceholder}
          </Label>
        )}

        <TouchedMessages field={field} />
      </HorizontalFlexWrapper>
    </Col>
  ));
}

function enrichForm(form, { result: { companyInfo } }) {
  return form
    .put('name', createField({ value: companyInfo.name || '', validator: notBlankValidator }))
    .put('companyId', createField({ value: companyInfo.companyId }))
    .put('companyDomains', createField({ value: companyInfo.companyDomains }))
    .put('environments', createField({ value: companyInfo.environments }))
    .put('billingCity', createField({ value: companyInfo.billingAddress.city || '', validator: notBlankValidator }))
    .put(
      'billingCountry',
      createField({ value: companyInfo.billingAddress.country || '', validator: notBlankValidator })
    )
    .put('billingState', createField({ value: companyInfo.billingAddress.state || '', validator: notBlankValidator }))
    .put('billingStreet', createField({ value: companyInfo.billingAddress.street || '', validator: notBlankValidator }))
    .put(
      'billingStreet2',
      createField({ value: companyInfo.billingAddress.street2 || '', validator: notBlankValidator })
    )
    .put('billingZip', createField({ value: companyInfo.billingAddress.zip || '', validator: notBlankValidator }))
    .put('shippingCity', createField({ value: companyInfo.shippingAddress.city || '', validator: notBlankValidator }))
    .put(
      'shippingCountry',
      createField({ value: companyInfo.shippingAddress.country || '', validator: notBlankValidator })
    )
    .put('shippingState', createField({ value: companyInfo.shippingAddress.state || '', validator: notBlankValidator }))
    .put(
      'shippingStreet',
      createField({ value: companyInfo.shippingAddress.street || '', validator: notBlankValidator })
    )
    .put(
      'shippingStreet2',
      createField({ value: companyInfo.shippingAddress.street2 || '', validator: notBlankValidator })
    )
    .put('shippingZip', createField({ value: companyInfo.shippingAddress.zip || '', validator: notBlankValidator }));
}

// function fromToModel(form) {
//   return {
//     name: form.name,
//     companyId: form.companyId,
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
