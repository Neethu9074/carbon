import React from 'react';

import TemporaryPresenter from 'in-components/TemporaryPresenter';
import connectTo from 'in-hoc/connectTo';

export default connectTo(props => {
  if (props.config$) {
    return {
      config: props.config$
    };
  }
  return {};
}, function StoreAwareTemporaryPresenter({config}) {
  if (!config) {
    return null;
  }

  return (
    <TemporaryPresenter id={config.id}
                        duration={config.duration}>
      {config.children}
    </TemporaryPresenter>
  );
});
