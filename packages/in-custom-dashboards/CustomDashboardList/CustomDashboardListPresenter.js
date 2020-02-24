import React from 'react';

import DashboardHeaderShadowModule from 'in-new-components/DashboardHeader/DashboardHeaderShadowModule';
import { getCustomDashboardLink, getNewCustomDashboardLink } from 'in-custom-dashboards/navigation/url';
import ErroneousResultPresenter from 'in-new-components/Errors/ErroneousResultPresenter';
import { IndeterminateLoadingIndicator } from 'in-new-components/LoadingIndicators';
import DashboardHeader, { themes } from 'in-new-components/DashboardHeader';
import NoDataAvailable from 'in-new-components/Errors/NoDataAvailable';
import { compareIgnoreCase } from 'in-services/util/string';
import { Ul, Li } from 'in-new-components/lists/List';
import Button from 'in-new-components/Button';

import locals from './CustomDashboardListPresenter.mless';

export default function CustomDashboardListPresenter({ customDashboards }) {
  let content;
  if (!customDashboards || customDashboards.progress.loading) {
    content = (
      <div className={locals.loading}>
        <IndeterminateLoadingIndicator />
      </div>
    );
  } else if (customDashboards.errors.length > 0) {
    content = <ErroneousResultPresenter errors={customDashboards.errors} />;
  } else if (customDashboards.data.length === 0) {
    content = <NoDataAvailable title="No dashboards configured." height={100} />;
  } else {
    content = (
      <Ul className={locals.list}>
        {customDashboards.data
          .slice()
          .sort((a, b) => compareIgnoreCase(a.title, b.title))
          .map(({ id, title }) => (
            <Li key={id} href$={getCustomDashboardLink(id)}>
              {title}
            </Li>
          ))}
      </Ul>
    );
  }

  return (
    <>
      <DashboardHeader
        icon="lib_views_grid"
        label="Dashboards"
        title="Dashboards"
        theme={themes.light}
        renderButtonLine={renderButtonLine}
      />
      <DashboardHeaderShadowModule />
      {content}
    </>
  );
}

function renderButtonLine() {
  return (
    <Button href$={getNewCustomDashboardLink()} kind="create">
      Create custom dashboard
    </Button>
  );
}
