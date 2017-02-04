import React from 'react';

import getGravatarUrl from 'in-services/subscription/gravatar';
import {joinClassNames} from 'in-services/util/classnames';
import unknown from 'in-components/Gravatar/unknown.png';
import {onImageLoad} from 'in-services/image';
import connectTo from 'in-hoc/connectTo';

const block = 'in-gravatar';

export default connectTo(props => {
  return {
    avatarUrl: getGravatarUrl(props.email)
      .flatMap(url => onImageLoad(url))
  };
}, function Gravatar({avatarUrl, email, className}) {
  if (avatarUrl) {
    return (
      <img src={avatarUrl}
           alt={`Avatar for ${email} from gravatar.com.`}
           className={joinClassNames(block, className)} />
    );
  }

  return (
    <img src={unknown}
         alt={`Fallback avatar for ${email}.`}
         className={joinClassNames(block, className)} />
  );
});
