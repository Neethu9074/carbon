import React from 'react';

import { activeDialogs$ } from 'in-components/DialogPresenter/store';
import useDisabledBodyScroll from 'in-hooks/useDisabledBodyScroll';
import { evaluateClassNames } from 'in-services/util/classnames';
import connectTo from 'in-hoc/connectTo';

import locals from './DialogPresenter.mless';

export default connectTo(
  {
    activeDialogs: activeDialogs$
  },
  function DialogPresenter({ activeDialogs }) {
    useDisabledBodyScroll(activeDialogs.length > 0);

    return (
      <>
        {React.Children.map(activeDialogs, (dialog, index) => (
          <div
            className={evaluateClassNames({
              [locals.wrapper]: true,
              [locals.lastWrapper]: index === activeDialogs.length - 1
            })}
          >
            {React.cloneElement(dialog, { key: index })}
          </div>
        ))}
      </>
    );
  }
);
