/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import unknown from 'in-components/Gravatar/unknown.png';
import getGravatarUrl from 'in-subscription/gravatar';
import { onImageLoad } from 'in-services/image';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

import locals from './Gravatar.mless';

export default connectTo(
  props => {
    return {
      avatarUrl: props.email
        ? getGravatarUrl(props.email)
            .flatMap(url => onImageLoad(url))
            .startWith(null)
        : null
    };
  },
  function Gravatar({ className, avatarUrl, email, size }) {
    className = classNames({
      [locals.regular]: size !== 'l',
      [locals.l]: size === 'l',
      [className]: className
    });

    if (avatarUrl) {
      return (
        <img className={className} src={avatarUrl} alt={t('in-components:gravatar.avatarUrlAlt', { email: email })} />
      );
    }

    return (
      <img className={className} src={unknown} alt={t('in-components:gravatar.avatarNullAlt', { email: email })} />
    );
  }
);
