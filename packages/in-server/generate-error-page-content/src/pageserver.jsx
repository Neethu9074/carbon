/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

// eslint-disable-next-line no-restricted-imports
import { Button, Link, Stack, Form } from '@carbon/react';
import * as ReactDOMServer from 'react-dom/server';
import { Launch } from '@carbon/icons-react';
import React from 'react';

import { ErrorPage } from './components/ErrorPage';
import './index.scss';

export function SSRRender(error) {
  const title = `{{title}}`;
  const label = `{{label}}`;
  const description = `{{description}}`;

  const StatusPageLink = (
    <Link href="https://status.instana.io/" renderIcon={() => <Launch />}>
      {'{{statusLink}}'}
    </Link>
  );
  const SupportPageLink = (
    <Link href="https://www.ibm.com/mysupport/s/?language=en_US" renderIcon={() => <Launch />}>
      {'{{supportLink}}'}
    </Link>
  );
  const HomeButton = (fullwidth) => {return <Button href="../#/home" size="md" className={fullwidth ? "buttonWidth" : null}>{'{{homeLink}}'}</Button>};
  const AdminLink = <Link>{'{{adminLink}}'}</Link>;
  const SignOutButton = (
    <Form id="access-denied-signout-form" method="post">
      <Button type="submit" title="{{user.email}}" kind="secondary" size="md" className="buttonWidth">
        {'{{signoutButtonLabel}}'}
      </Button>
    </Form>
  );

  const errorTypes = {
    404: {
      kind: '404',
      link1: StatusPageLink,
      link2: SupportPageLink,
      homeButton: HomeButton()
    },
    403: {
      kind: '403',
      link1: AdminLink,
      homeButton: HomeButton(true),
      signoutButton: SignOutButton
    },
    500: {
      kind: 'custom',
      link1: StatusPageLink,
      link2: SupportPageLink
    },
    maintenance: {
      kind: 'custom',
      link1: StatusPageLink,
      link2: SupportPageLink
    }
  };

  const errorType = errorTypes[error];

  return ReactDOMServer.renderToStaticMarkup(
    <ErrorPage title={title} label={label} description={description} kind={errorType?.kind}>
      <Stack gap={9}>
        <Stack gap={2}>
          {errorType?.link1}
          {errorType?.link2}
        </Stack>
        <Stack orientation="horizontal" gap={2}>
          {errorType?.homeButton}
          {errorType?.signoutButton}
        </Stack>
      </Stack>
    </ErrorPage>
  );
}

