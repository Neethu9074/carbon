import React from 'react';

import FullscreenViewHeading from 'in-components/layout/FullscreenViewHeading';
import { getEumSnippet } from 'in-services/eum';
import SvgIcon from 'in-components/SvgIcon';
import Button from 'in-components/Button';
import Code from 'in-components/Code';

import './Waiting.less';

const block = 'in-wait-website-form';

export default function Waiting({ websiteName, eumKey, isWaiting, href$ }) {
  return (
    <div className={block}>
      <FullscreenViewHeading
        className={`${block}__heading`}
        iconClassName={!isWaiting ? `${block}__heading-icon` : null}
        iconType={isWaiting ? 'globe' : 'ok'}
      >
        {isWaiting ? 'Working…' : 'Everything Ready!'}
      </FullscreenViewHeading>

      <p className={`${block}__explanation`}>
        {isWaiting
          ? <span>
              We are preparing everything to monitor your website <strong>{websiteName}</strong>. While we do this, add
              the tracking script to your website.
            </span>
          : <span>
              Everything is ready to monitor your website <strong>{websiteName}</strong>. Add the tracking script to
              your website to track real users.
            </span>}
      </p>

      <Code code={getEumSnippet({ key: eumKey })} lang="html" showLineNumbers={false} />

      <Button
        kind={isWaiting ? 'secondary' : 'default'}
        disabled={isWaiting}
        className={`${block}__action`}
        href$={href$}
      >
        {isWaiting && <SvgIcon spinning type="spinner" width={20} className={`${block}__spinner`} />}
        {isWaiting ? 'Enabling monitoring…' : 'Go to website dashboard'}
      </Button>
    </div>
  );
}
