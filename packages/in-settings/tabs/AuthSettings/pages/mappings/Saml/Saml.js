/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import SubViewHeader from 'in-settings/components/SubViewHeader';
import ApiItemView from 'in-settings/components/ApiItemView';
import Title from 'in-components/Title';
import { t } from 'in-i18n';

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
      <Title title={t('in-settings:tabs.configureSamlMapping')} />
      <SubViewHeader>{t('in-settings:tabs.samlMapping')}</SubViewHeader>
      <p>{t('in-settings:tabs.usersInTheSamlGroupsBelowWillBeAddedToTheSelectedInstanaTeams')}</p>
      <form />
    </>
  );
}

function saveItem({ setMessage }) {
  // const emails = form.get('emails').value;

  setMessage({ text: t('in-settings:tabs.savingSsoConfig'), type: 'neutral' });
  // const setRoleResult$ = setRole(userId, roleId);
  // setRoleResult$.once(
  //   () => {
  //     setMessage({ text: t('in-settings:tabs.roleChangeSuccessfullySaved'), type: success });
  //   },
  //   error => setMessage({ text: `Failed to set user role: ${error.message}`, type: errorType })
  // );
}

function enrichForm(form) {
  return form;
}
