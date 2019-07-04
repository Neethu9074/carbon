import connectTo from 'in-hoc/connectTo';
import React from 'react';

import { shouldShowFloatingFooter } from 'in-services/zendesk';

import locals from './Footer.mless';

export default connectTo(
  {
    hasFloatingFooter: shouldShowFloatingFooter()
  },
  function Footer({ hasFloatingFooter }) {
    if (!hasFloatingFooter) return null;

    return <footer className={locals.footer} />;
  }
);
