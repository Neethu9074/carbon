import React from 'react';

import { getIconType } from 'in-components/SvgIcon/infrastructureIconType';
import classNames from 'classnames';
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
    children,
    withBackground
  } = props;

  const entitySingular = getSingular(plugin) || 'Entity';
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
