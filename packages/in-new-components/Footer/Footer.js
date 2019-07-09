import connectTo from 'in-hoc/connectTo';
import React from 'react';

import { evaluateClassNames } from 'in-services/util/classnames';
import { shouldShowFloatingFooter } from 'in-services/zendesk';

import locals from './Footer.mless';

export default connectTo(
  {
    hasFloatingFooter: shouldShowFloatingFooter()
  },
  function Footer({ hasFloatingFooter, smallMargin = false }) {
    if (!hasFloatingFooter) return null;

    return (
      <footer
        className={evaluateClassNames({
          [locals.footer]: true,
          [locals.smallMargin]: smallMargin
        })}
      />
    );
  }
);
