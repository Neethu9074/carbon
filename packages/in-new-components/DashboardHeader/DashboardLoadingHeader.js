import PropTypes from 'prop-types';
import React from 'react';

import { evaluateClassNames } from 'in-services/util/classnames';
import Skeleton from 'in-new-components/Loading/Skeleton';
import SvgIcon from 'in-components/SvgIcon';

import loadingLocals from './DashboardLoadingHeader.mless';
import locals from './DashboardHeader.mless';

export const themes = {
  default: 'default',
  dark: 'dark',
  lightWithGrey: 'lightWithGrey'
};

export default function DashboardLoadingHeader(props) {
  const {
    theme = themes.default,
    icon,
    label,
    contextIcon,
    renderContext,
    renderMetaInformation,
    renderButtonLine
  } = props;

  return (
    <header
      className={evaluateClassNames({
        [locals.dashboardHeader]: true,
        [locals[themes[theme]]]: true
      })}
    >
      <div className={locals.firstLine}>
        {renderContext && (
          <>
            <SvgIcon className={locals.contextIcon} size="l" type={contextIcon} />
            <Skeleton className={loadingLocals.labelSkeleton} />
            <SvgIcon className={locals.contextEndIcon} size="l" type="lib_arrow_expand_right" />
          </>
        )}
        <SvgIcon className={locals.icon} size="l" type={icon} />
        {label ? <span className={locals.label}>{label}</span> : <Skeleton className={loadingLocals.labelSkeleton} />}
        {renderMetaInformation && <Skeleton className={loadingLocals.buttonSkeleton} />}
      </div>
      <div className={locals.buttonLine}>
        {renderButtonLine && <Skeleton className={loadingLocals.buttonSkeleton} />}
      </div>
    </header>
  );
}

DashboardLoadingHeader.propTypes = {
  theme: PropTypes.oneOf([themes.dark, themes.lightWithGrey, themes.default]),
  icon: PropTypes.string.isRequired,
  label: PropTypes.string,
  renderMetaInformation: PropTypes.func,
  renderButtonLine: PropTypes.func,
  contextIcon: PropTypes.string,
  renderContext: PropTypes.func
};
