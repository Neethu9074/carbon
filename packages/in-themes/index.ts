/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { getThemeOverride } from '@instana/components';
import { themes } from '@instana/design-tokens';

import theme from 'in-themes/active.json';

interface UseThemeParams {
  overridingTheme?: 'g10' | 'default' | undefined;
}

/**
 * Returns the design tokens depending on the current theme:
 *
 * if carbon theme is activated then it returns
 *  {@link themes.g10}
 * else
 *  {@link themes.default}
 *
 * Internally it uses {@link getThemeOverride()} to get current theme from the
 * browser's localStorage.
 *
 * -> This will be improved by using React Context in the future.
 * Currently not needed, and
 */
export function useTheme(params?: UseThemeParams) {
  const currentTheme = params?.overridingTheme ?? getThemeOverride();

  // same behaviour as in other places: use g10 if not specified as default
  if (currentTheme === 'default') {
    return themes.default;
  }
  return themes.g10;
}

/**
 * @deprecated for getting tokens depending on current theme, please use the hook {@link useTheme()}
 */
export default theme;
