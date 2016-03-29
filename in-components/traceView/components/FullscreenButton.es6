import React from 'react';

import Icon from 'in-components/Icon';

import './FullscreenButton.less';

const block = 'in-fullscreen-button';

export default function FullscreenButton({onClick}) {
  return (
    <Icon type='fullscreen'
          className={block}
          onClick={onClick} />
  );
}

FullscreenButton.propTypes = {
  onClick: React.PropTypes.func
};
