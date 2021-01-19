/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { createLogger } from '@instana/logger';
import React from 'react';

import { ThemeContext } from 'in-themes/themes';

const logger = createLogger('in-themes/themeDependentComponentSwitcher');

export function buildThemeDependentComponentSwitcher({ name, definitions }) {
  Comp.displayName = `ThemeDependentComponentSwitcher(${name})`;
  return Comp;

  function Comp(props) {
    return (
      <ThemeContext.Consumer>{theme => doRender(theme, definitions, props, Comp.displayName)}</ThemeContext.Consumer>
    );
  }
}

function doRender(theme, definitions, props, name) {
  const Comp = definitions[theme];
  if (!Comp) {
    logger.error("No theme definition found for theme '%s' for component '%s'", theme, name);
    return null;
  }
  return <Comp {...props} />;
}
