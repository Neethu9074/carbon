/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React, { useState } from 'react';

import { KeyValue } from '@instana/components';
import { Trans, t } from '@instana/i18n-react';
import { Link } from '@instana/components';

import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper/HorizontalFlexWrapper';
import RedisTLSDeployContent from 'in-synthetics/createLocation/steps/RedisTLSDeployContent';
import InlineTabNavigation from 'in-components/InlineTabNavigation/InlineTabNavigation';
import CopyToClipboardButton from 'in-components/CopyToClipboardButton';
import { PoPProperties } from 'in-synthetics/utils/constants';
import CodeComponent from 'in-components/Code';

import locals from 'in-synthetics/createLocation/steps/DeployTabSelection.mless';

export default function DeployTabSelection({ downloadKey, agentKey, syntheticAcceptorURL }: PoPProperties) {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const popDocsUrl = 'https://ibm.biz/pop_deployment';
  const docLinkComponent = (
    <Trans
      i18nKey="in-synthetics:dashboard.testList.popDialog.subTitle"
      components={{
        documentationLink: (
          <Link href={popDocsUrl} external>
            &nbsp;
          </Link>
        )
      }}
    />
  );

  const tabList = [
    {
      text: t('in-synthetics:dashboard.testList.popDialog.simpleTab')
    },
    {
      text: t('in-synthetics:dashboard.testList.popDialog.redisTab')
    }
  ];

  return (
    <div>
      <HorizontalFlexWrapper className={locals.header}>
        <KeyValue
          inverted
          customValue={t('in-synthetics:dashboard.testList.popDialog.title')}
          label={docLinkComponent}
          accentuated
        />
        <CopyToClipboardButton
          kind="action"
          getText={() => {
            return activeTabIndex == 0
              ? t('in-synthetics:dashboard.testList.popDialog.simpleCode', {
                  downloadKey: downloadKey,
                  instanaAgentKey: agentKey,
                  syntheticAcceptorURL: syntheticAcceptorURL
                })
              : t('in-synthetics:dashboard.testList.popDialog.redisCode', {
                  downloadKey: downloadKey,
                  instanaAgentKey: agentKey,
                  syntheticAcceptorURL: syntheticAcceptorURL
                });
          }}
        />
      </HorizontalFlexWrapper>
      <section>
        <InlineTabNavigation tabList={tabList} activeTabIndex={activeTabIndex} onTabSelect={setActiveTabIndex} />
      </section>
      <div className={locals.content}>
        {activeTabIndex == 0 ? (
          <CodeComponent
            code={t('in-synthetics:dashboard.testList.popDialog.simpleCode', {
              downloadKey: downloadKey,
              instanaAgentKey: agentKey,
              syntheticAcceptorURL: syntheticAcceptorURL
            })}
            lang="json"
            showLineNumbers={false}
            withoutCopyButton
          />
        ) : (
          <RedisTLSDeployContent
            redisCode={t('in-synthetics:dashboard.testList.popDialog.redisCode', {
              downloadKey: downloadKey,
              instanaAgentKey: agentKey,
              syntheticAcceptorURL: syntheticAcceptorURL
            })}
          />
        )}
      </div>
    </div>
  );
}
