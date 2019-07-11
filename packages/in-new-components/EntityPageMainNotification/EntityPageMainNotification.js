import React from 'react';

import { evaluateClassNames } from 'in-services/util/classnames';
import PluginIcon from 'in-components/PluginIcon';
import { getSingular } from 'in-sdk/pluginName';
import SvgIcon from 'in-components/SvgIcon';

import locals from './EntityPageMainNotification.mless';

export default function EntityPageMainNotification({
  title,
  explanation,
  renderExplanation,
  theme,
  icon = 'lib_missing_data',
  plugin,
  framed,
  children
}) {
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
        <PluginIcon className={locals.icon} plugin={plugin} dimension={56} />
      ) : (
        <SvgIcon className={locals.icon} type={icon} width={56} height={56} />
      )}
      <h2 className={locals.title}>{title ? title : `${entitySingular} not found`}</h2>
      {renderExplanation ? renderExplanation() : <p className={locals.explanation}>{explanation}</p>}
      {children}
    </div>
  );
}
