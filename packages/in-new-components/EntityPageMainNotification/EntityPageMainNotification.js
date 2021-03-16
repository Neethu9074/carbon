/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import { getIconType } from 'in-components/SvgIcon/infrastructureIconType';
import { getPluginName } from 'in-sdk/pluginName';
import SvgIcon from 'in-components/SvgIcon';
import { t } from 'in-i18n';

import locals from './EntityPageMainNotification.mless';

export default function EntityPageMainNotification(props) {
  const {
    title,
    explanation,
    theme,
    icon = 'lib_missing_data',
    plugin,
    framed,
    changeExplanation = ex => ex,
    children,
    withBackground
  } = props;

  const entitySingular = getPluginName(plugin, 1) || t('in-new-components:entityPageMainNotification.labelEntity');
  return (
    <div
      className={classNames({
        [locals.wrapper]: true,
        [locals.framed]: framed,
        [locals.light]: theme === 'light',
        [locals.withBackground]: withBackground
      })}
    >
      <SvgIcon className={locals.icon} type={plugin ? getIconType(plugin) : icon} size="xxl" />
      <h2 className={locals.title}>
        {title ? title : t('in-new-components:entityPageMainNotification.labelNotFound', { entity: entitySingular })}
      </h2>
      {typeof explanation === 'function' ? (
        explanation()
      ) : (
        <p className={locals.explanation}>{changeExplanation(explanation, props)}</p>
      )}

      {children}
    </div>
  );
}
