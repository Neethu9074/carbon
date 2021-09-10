/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import { create, Observable } from '@instana/observables';
import { useObservable } from '@instana/hooks';

// @ts-expect-error
import unknown from 'in-components/Gravatar/unknown.png';
import createSubscription from 'in-subscription/subscription';
import { t } from 'in-i18n';

// @ts-expect-error
import locals from './Gravatar.mless';

export interface Props {
  className?: string;
  email?: string;
  size?: 'regular' | 'l';
}

const getGravatarUrl = createSubscription<string, string>({
  eventId: 'subscribe-gravatar-url',

  getId(email) {
    return email;
  },

  getData(subscriptionId, email) {
    return {
      subscriptionId,
      email
    };
  }
});

export default function Gravatar({ className, email, size = 'regular' }: Props) {
  const avatarUrl = useObservable(() => {
    if (!email) {
      return null;
    }

    return getGravatarUrl(email)
      .flatMap(url => onImageLoad(url))
      .startWith(null);
  }, [email]);

  const src = avatarUrl || unknown;
  const alt = avatarUrl
    ? t('in-components:gravatar.avatarUrlAlt', { email: email })
    : t('in-components:gravatar.avatarNullAlt', { email: email });

  return <img className={classNames(className, locals[size])} src={src} alt={alt} />;
}

function onImageLoad(url: string): Observable<string> {
  const result = create<string>();

  const img = new Image();
  img.onload = () => result.emit(url);
  img.onerror = () => {};
  img.src = url;

  return result;
}
