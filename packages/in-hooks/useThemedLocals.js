/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { useContext, useMemo } from 'react';

import { ThemeContext } from '@instana/components';

// This hook takes style definitions, typically imported and used via import locals from './XXX.mless'
// With the current selected theme, it searches this style for ending name with the theme.
//
// Example:
// theme = "light"
// The logic searches for any definition which ends with "_light".
//
// All matches are stored in a temporary object (themeStyles) without this prefix.
// At the end, the current style will be return and all finding will be overriden. This allows the user
// to just use the style in the component like 'className={locals.button}' withouth taking care which theme
// is active. In the style itself, there can be multiple definitions (.button, .button_dark, .button_contrast, ...)
// and the right style is taken without chaning the component in any way again.
export default function useThemedLocals(style) {
  // the current used theme consumed via hook
  const theme = useContext(ThemeContext);

  // the calculation is not that expensive but only needs to be done once the style or theme change
  // the style should never change since it's the .mless imported content.
  const stylesByTheme = useMemo(() => {
    // found style definitions go here
    const themeStyles = {};

    // all style definitions defined in the .mless file
    const styleProps = Object.keys(style);

    for (const jsName of styleProps) {
      const cssName = style[jsName];
      // if we find a style, ending with the current theme string (e.g. .button_dark),
      // we store it as .button and refer to the style of .button_dark.
      if (jsName.endsWith(`_${theme}`)) {
        // + 1 also erases the underscore
        themeStyles[jsName.substr(0, jsName.length - (theme.length + 1))] = cssName;
      }
    }

    // return the style with overrides from the found theme definitions
    return { ...style, ...themeStyles };
  }, [style, theme]);

  return stylesByTheme;
}
