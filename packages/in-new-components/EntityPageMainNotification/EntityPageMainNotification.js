import React from 'react';

import { evaluateClassNames } from 'in-services/util/classnames';
import PluginIcon from 'in-components/PluginIcon';
import { getSingular } from 'in-sdk/pluginName';
import SvgIcon from 'in-components/SvgIcon';

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
    children
  } = props;

  const entitySingular = getSingular(plugin) || 'Entity';
  return (
    <div
      className={evaluateClassNames({
        [locals.wrapper]: true,
        [locals.framed]: framed,
        [locals.light]: theme === 'light'
      })}
    >
      {plugin ? (
        <PluginIcon className={locals.icon} plugin={plugin} size="xxl" />
      ) : (
        <SvgIcon className={locals.icon} type={icon} size="xxl" />
      )}
      <h2 className={locals.title}>{title ? title : `${entitySingular} not found`}</h2>
      {typeof explanation === 'function' ? (
        explanation()
      ) : (
        <p className={locals.explanation}>{changeExplanation(explanation, props)}</p>
      )}

      {children}
    </div>
  );
}
