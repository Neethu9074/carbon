import React, { Fragment } from 'react';

import SvgIcon from 'in-components/SvgIcon';

import locals from './NoContent.mless';

export default function NoContent({ width, height, isLoading, errors }) {
  let content;

  if (isLoading) {
    content = <SvgIcon className={locals.loadingIcon} type="lib_actions_loading" spinning height={48} />;
  } else if (errors) {
    content = (
      <Fragment>
        <SvgIcon className={locals.icon} type="lib_help_error_error_circle" height={48} />
        An unexpected error occurred
      </Fragment>
    );
  } else {
    content = (
      <Fragment>
        <SvgIcon className={locals.icon} type="lib_views_stats" height={48} />
        No data available
      </Fragment>
    );
  }

  return (
    <div className={locals.noContentIconWrapper} style={{ width, height: height + 60 }}>
      {content}
    </div>
  );
}
