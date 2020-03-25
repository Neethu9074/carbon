import { createField } from 'formalistic';
import React from 'react';

import TouchedMessages from 'in-components/form/TouchedMessages';
import SubViewHeader from 'in-settings/components/SubViewHeader';
import DescriptionText from 'in-components/form/DescriptionText';
import ApiItemView from 'in-settings/components/ApiItemView';
import { neutral } from 'in-new-components/Message/types';
import FormGroup from 'in-settings/components/FormGroup';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';
import Title from 'in-components/Title';

import locals from './GoogleSSO.mless';

export default function GoogleSSO() {
  return (
    <ApiItemView
      getObservables={() => ({})}
      enrichForm={enrichForm}
      saveItem={saveItem}
      render={render}
      renderLoadingState={renderLoadingState}
    />
  );
}

function renderLoadingState() {
  return <div>Loading</div>;
}

function render({ form, setForm }) {
  return (
    <>
      <Title title="Google SSO Configuration" />
      <SubViewHeader subscript="Configure allowed email domains.">Google SSO Configuration</SubViewHeader>

      <form>
        <p>
          Only users with email addresses at the following domains will be allowed to sign in to your Instana tenant:
        </p>

        {form.get('emails').map(field => (
          <FormGroup className={locals.maxWidth}>
            <Label htmlFor="google_sso_emails" hasError={!field.valid && field.touched}>
              Domains
            </Label>

            <Input
              className={locals.input}
              type="text"
              id="google_sso_emails"
              value={field.value}
              onChange={e => {
                setForm(form.updateIn(['emails'], f => f.setValue(e.target.value).setTouched(true)));
              }}
              placeholder="@example.com, @example.io"
              autoComplete="off"
              hasError={!field.valid && field.touched}
            />
            <DescriptionText>Separate multiple domains with a comma</DescriptionText>
            <TouchedMessages field={field} />
          </FormGroup>
        ))}
      </form>
    </>
  );
}

function saveItem({ setMessage }) {
  // const emails = form.get('emails').value;

  setMessage({ text: 'Saving SSO config', type: neutral });
  // const setRoleResult$ = setRole(userId, roleId);
  // setRoleResult$.once(
  //   () => {
  //     setMessage({ text: 'Role change successfully saved.', type: success });
  //   },
  //   error => setMessage({ text: `Failed to set user role: ${error.message}`, type: errorType })
  // );
}

function enrichForm(form) {
  return form.put(
    'emails',
    createField({
      value: ''
    })
  );
}
