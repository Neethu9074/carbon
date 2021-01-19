/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import SubViewHeader from 'in-settings/components/SubViewHeader';
import ApiItemView from 'in-settings/components/ApiItemView';
import { neutral } from 'in-new-components/Message/types';
import Title from 'in-components/Title';

export default function SamlMapping() {
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

function render() {
  return (
    <>
      <Title title="Configure SAML Mapping" />
      <SubViewHeader>SAML Mapping</SubViewHeader>
      <p>Users in the SAML groups below will be added to the selected instana teams.</p>
      <form />
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
  return form;
}
