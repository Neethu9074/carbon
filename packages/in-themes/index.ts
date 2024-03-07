/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

// @ts-expect-error there are no ts typedefinitions
import oldTheme from 'in-themes/theme';

/**
 * For getting tokens depending on current theme (with ...cds...),
 *
 * @deprecated this shall not be used and will soon be removed! Replace with directly importing tokens via
 * import { themes } from '@instana/design-tokens';
 * Find more details on https://pages.github.ibm.com/instana/ui-foundation/?path=/docs/design-tokens-general-usage--docs
 */
export default oldTheme;
