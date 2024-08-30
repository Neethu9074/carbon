/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Message, Link } from '@instana/components';

import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { t } from 'in-i18n';

import locals from './InvalidUrlAlert.mless';

interface Props {
  description: string;
  href: string;
  linkText: string;
}
export default function InvalidUrlAlert({ description, href, linkText }: Props): JSX.Element {
  const { location, navigate } = useNavigation();

  return (
    <div className={locals.center}>
      <Message
        type={'error'}
        dismissible
        title={t('in-applications:dashboards.pageCannotBeFound')}
        inline={false}
        description={description}
        onClose={() => {
          navigate({ ...location, pathname: href.substring(2) }, true);
        }}
      >
        <Link href={href} className={locals.linkStyle}>
          {linkText}
        </Link>
      </Message>
    </div>
  );
}
