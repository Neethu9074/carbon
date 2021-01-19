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
      return <img className={className} src={avatarUrl} alt={`Avatar for ${email} from gravatar.com.`} />;
    }

    return <img className={className} src={unknown} alt={`Fallback avatar for ${email}.`} />;
  }
);
