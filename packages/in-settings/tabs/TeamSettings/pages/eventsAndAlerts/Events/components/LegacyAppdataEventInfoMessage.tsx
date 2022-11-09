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
  disallowed?: boolean;
  deleted?: boolean;
}

const smartAlertMigrationUrl =
  'https://www.ibm.com/docs/en/obi/current?topic=applications-smart-alerts' +
  '#how-to-migrate-a-custom-event-on-application-service-or-endpoint-metrics-to-smart-alerts';

export default function LegacyAppdataEventInfoMessage({ migrated, saved, disallowed, deleted }: Props) {
  return (
    <Message type="neutral" withIcon small>
      <TransContent migrated={migrated} saved={saved} disallowed={disallowed} deleted={deleted} />
    </Message>
  );
}

function TransContent({ migrated, saved, disallowed, deleted }: Props) {
  const docsLink = (
    <Link href={smartAlertMigrationUrl} external>
      &nbsp;
    </Link>
  );

  if (deleted) {
    return <Trans i18nKey="in-settings:tabs.deletedEventMessage" />;
  }

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
    if (disallowed) {
      return (
        <Trans
          i18nKey="in-settings:tabs.disallowedEventMessage"
          components={{
            documentationLink: docsLink
          }}
        />
      );
    }

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
