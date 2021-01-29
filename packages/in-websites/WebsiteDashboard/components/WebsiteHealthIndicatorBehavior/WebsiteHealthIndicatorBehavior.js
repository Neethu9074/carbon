/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import WebsiteOpenIssuesList from 'in-websites/WebsiteDashboard/components/WebsiteHealthIndicatorBehavior/WebsiteOpenIssuesList';
import getWebsiteHealthInfo from 'in-subscription/website/getWebsiteHealthInfo';
import { getTimeConfigAlignedToResultTime } from 'in-stores/time/config';
import Overlay from 'in-new-components/overlays/Overlay';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  ({ websiteId, openIssues, maxSeverity, timeConfig }) => {
    // openIssues and maxSeverity may be provided externally in cases where this component is used in lists.
    if (openIssues != null && maxSeverity != null) {
      return {};
    }

    const healthInfo$ = getWebsiteHealthInfo({
      websiteId,
      timeConfig
    }).filter(healthInfo => healthInfo.data != null);

    return {
      healthInfo: healthInfo$.map(result => result.data),
      openIssues: healthInfo$.map(result => result.data.openIssues.length),
      maxSeverity: healthInfo$.map(result => result.data.maxSeverity),
      timeConfig: healthInfo$.map(result => getTimeConfigAlignedToResultTime(timeConfig, result))
    };
  },
  function WebsiteHealthIndicatorBehavior(props) {
    const { openIssues, maxSeverity, render, healthInfo } = props;

    if (render) {
      return render(healthInfo);
    }

    if (openIssues == null || openIssues < 0) {
      return null;
    }

    if (openIssues === 0) {
      return (
        <props.IndicatorPresenter
          showCheckAsNeutral
          maxSeverity={maxSeverity}
          openIssues={
            props.inContentArea
              ? openIssues
              : t('in-websites:websiteDashboard.components.websiteHealthIndicatorBehaviorNoIssues')
          }
        />
      );
    }

    return (
      <Overlay props={props} content={Content} withoutWrapper inContentArea={props.inContentArea}>
        {Indicator}
      </Overlay>
    );
  }
);

function Indicator({ openIssues, maxSeverity, IndicatorPresenter, refSetter, toggle }) {
  return (
    <IndicatorPresenter
      openIssues={t('in-websites:websiteDashboard.components.websiteHealthIndicatorBehaviorNumbersOfIssues', {
        count: openIssues
      })}
      maxSeverity={maxSeverity}
      onClick={toggle}
      refSetter={refSetter}
    />
  );
}

function Content(props) {
  return <WebsiteOpenIssuesList {...props} />;
}
