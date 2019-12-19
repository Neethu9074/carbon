import PropTypes from 'prop-types';
import React from 'react';

import TimeSelection from 'in-new-components/time/TimeSelection/TimeSelection';
import { joinClassNames } from 'in-services/util/classnames';
import Skeleton from 'in-new-components/Loading/Skeleton';
import SvgIcon from 'in-components/SvgIcon';
import Title from 'in-components/Title';

import locals from './DashboardHeader.mless';

export const themes = {
  light: 'light',
  dark: 'dark',
  default: 'default'
};

export default function DashboardHeader(props) {
  const { theme = themes.default, icon, title, contextIcon, renderContext, renderTimeSelection, result } = props;
  let { label, renderIcon, renderMetaInformation, renderButtonLine } = props;

  const isLoading = result && result.data == null;

  if (isLoading) {
    label = getSkeletonLabel();

    if (renderButtonLine) {
      renderButtonLine = getSkeletonButton;
    }
    if (renderMetaInformation) {
      renderMetaInformation = getSkeletonButton;
    }
    if (!icon || renderIcon) {
      renderIcon = getSkeletonIcon;
    }
  }
  return (
    <header className={joinClassNames(locals.dashboardHeader, locals[theme])}>
      <Title title={title} />
      <div className={locals.firstLine}>
        <div className={locals.leftContent}>
          {renderContext && (
            <>
              <SvgIcon className={locals.contextIcon} size="l" type={contextIcon} />
              <span className={locals.context}>{renderContext(props)}</span>
              {icon && label && <SvgIcon className={locals.contextEndIcon} size="l" type="lib_arrow_expand_right" />}
            </>
          )}
          {renderIcon ? renderIcon() : <SvgIcon className={locals.icon} type={icon} size="l" />}
          <span className={locals.label}>{label}</span>
          {renderMetaInformation && renderMetaInformation(props)}
        </div>
        {renderTimeSelection ? renderTimeSelection(props) : <TimeSelection darkTheme={theme === themes.dark} />}
      </div>
      {renderButtonLine && <div className={locals.buttonLine}>{renderButtonLine(props)}</div>}
    </header>
  );
}

function getSkeletonButton() {
  return <Skeleton className={locals.buttonSkeleton} />;
}

function getSkeletonLabel() {
  return <Skeleton className={locals.labelSkeleton} />;
}

function getSkeletonIcon() {
  return <Skeleton className={locals.iconSkeleton} />;
}

DashboardHeader.propTypes = {
  theme: PropTypes.oneOf([themes.dark, themes.lightWithGrey, themes.default]),
  result: PropTypes.any,
  icon: PropTypes.string,
  renderIcon: PropTypes.func,
  title: PropTypes.string,
  renderTimeSelection: PropTypes.func,
  label: PropTypes.string,
  renderMetaInformation: PropTypes.func,
  renderButtonLine: PropTypes.func,
  contextIcon: PropTypes.string,
  renderContext: PropTypes.func
};
