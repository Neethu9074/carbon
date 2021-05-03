/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { SvgIcon } from '@instana/components';
import { Link } from '@instana/components';

import { getTrackingSnippet } from 'in-websites/trackingSnippet';
import Toggle from 'in-components/form/Toggle';
import Label from 'in-components/form/Label';
import Tooltip from 'in-components/Tooltip';
import Code from 'in-components/Code';
import { t } from 'in-i18n';

import locals from './TrackingSnippetPresenter.mless';

export default function TrackingSnippetPresenter({ websiteId, trackSessions, setTrackSessions }) {
  const eumSnippet = getTrackingSnippet({ key: websiteId, trackSessions });

  return (
    <div className={locals.snippetWrapper}>
      <div className={locals.snippet}>
        <Code code={eumSnippet} lang="html" showLineNumbers={false} />
      </div>

      <div className={locals.options}>
        <div className={locals.option}>
          <Label htmlFor="trackSessions" className={locals.label}>
            {t('in-websites:trackingSnippet.trackingSnippetPresenterLabelTrackSessions')}&nbsp;
            <Tooltip content={t('in-websites:trackingSnippet.trackingSnippetPresenterTooltip')}>
              <Link
                href="https://instana.com/docs/website_monitoring/api/#session-tracking"
                external
                className={locals.helpWrapper}
              >
                <SvgIcon type="lib_help_error_help_outline" size="xs" className={locals.help} />
              </Link>
            </Tooltip>
          </Label>
          <Toggle id="trackSessions" checked={trackSessions} onChange={e => setTrackSessions(e.target.checked)} />
        </div>
      </div>
    </div>
  );
}
