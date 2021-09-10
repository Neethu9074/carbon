/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import { useObservable } from '@instana/hooks';
import { create } from '@instana/observables';

import createSubscription from 'in-subscription/subscription';
import unknown from 'in-components/Gravatar/unknown.png';
import { t } from 'in-i18n';

import locals from './Gravatar.mless';

const getGravatarUrl = createSubscription({
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

export default function Gravatar({ className, email, size }) {
  const avatarUrl = useObservable(() => {
    if (!email) {
      return null;
    }

    return getGravatarUrl(email)
      .flatMap(url => onImageLoad(url))
      .startWith(null);
  }, [email]);

  className = classNames(className, {
    [locals.regular]: size !== 'l',
    [locals.l]: size === 'l'
  });

  const src = avatarUrl || unknown;
  const alt = avatarUrl
    ? t('in-components:gravatar.avatarUrlAlt', { email: email })
    : t('in-components:gravatar.avatarNullAlt', { email: email });

  return <img className={className} src={src} alt={alt} />;
}

function onImageLoad(url) {
  const result = create();

  const img = new Image();
  img.onload = () => result.emit(url);
  img.onerror = () => {};
  img.src = url;

  return result;
}
