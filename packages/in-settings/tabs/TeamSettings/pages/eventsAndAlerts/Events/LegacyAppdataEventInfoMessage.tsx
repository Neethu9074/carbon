/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import { Link, Message } from '@instana/components';

import { Trans } from 'in-i18n';

interface Props {
  migrated?: boolean;
  saved?: boolean;
}

export default function LegacyAppdataEventInfoMessage({ migrated, saved }: Props) {
  return (
    <Message type="neutral" withIcon small>
      <TransContent migrated={migrated} saved={saved} />
    </Message>
  );
}

function TransContent({ migrated, saved }: Props) {
  const docsLink = (
    <Link href="https://www.ibm.com/docs/en/obi/current?topic=applications-smart-alerts" external>
      &nbsp;
    </Link>
  );

  if (migrated) {
    return (
      <Trans
        i18nKey="in-settings:tabs.migratedEventMessage"
        components={{
          documentationLink: docsLink
        }}
      />
    );
  }
  if (saved) {
    return (
      <Trans
        i18nKey="in-settings:tabs.deprecatedEventMessage"
        components={{
          documentationLink: docsLink
        }}
      />
    );
  }
  return (
    <Trans
      i18nKey="in-settings:tabs.deprecatedEventSelectedMessage"
      components={{
        documentationLink: docsLink
      }}
    />
  );
}
