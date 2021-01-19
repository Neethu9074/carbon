/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { Fragment } from 'react';

import { userSettings, teamSettings } from 'in-settings/navigation/paths';
import { getView } from 'in-stores/navigation';
import Title from 'in-components/Title';
import Link from 'in-components/Link';

export default function NotFoundPage() {
  return (
    <Fragment>
      <Title>Not Found</Title>
      <h1>Settings Page Not Found</h1>
      <p>
        We could not find the settings page you were looking for. We are sorry about that. Maybe you would like to try
        one of the following links instead?
      </p>
      <ul>
        <li>
          <Link href$={getView(teamSettings)}>Team Settings</Link>
        </li>
        <li>
          <Link href$={getView(userSettings)}>User Settings</Link>
        </li>
      </ul>
    </Fragment>
  );
}
