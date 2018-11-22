import React from 'react';

import Paragraph from 'in-websites/NewWebsiteFlow/Paragraph';
import CopyToClipboard from 'in-components/CopyToClipboard';
import Actions from 'in-websites/NewWebsiteFlow/Actions';
import Header from 'in-websites/NewWebsiteFlow/Header';
import Frame from 'in-websites/NewWebsiteFlow/Frame';
import { getEumSnippet } from 'in-services/eum';
import Button from 'in-new-components/Button';
import Code from 'in-components/Code';

export default function ReadyStep({ websiteId, websiteName, websiteLink$ }) {
  const eumSnippet = getEumSnippet({ key: websiteId });

  return (
    <Frame>
      <Header>
        Everything
        {`'`}s Ready!
      </Header>

      <Paragraph>
        Everything is ready to monitor your website <strong>{websiteName}</strong>. Add the tracking script to your
        website to track real users or go to the dashboard.
      </Paragraph>

      <Code code={eumSnippet} lang="html" showLineNumbers={false} />

      <Actions>
        <CopyToClipboard getText={() => eumSnippet}>
          {refSetter => (
            <Button kind="secondary" refSetter={refSetter}>
              Copy to clipboard
            </Button>
          )}
        </CopyToClipboard>

        <Button kind="primaryv2" href$={websiteLink$}>
          Go to website dashboard
        </Button>
      </Actions>
    </Frame>
  );
}
