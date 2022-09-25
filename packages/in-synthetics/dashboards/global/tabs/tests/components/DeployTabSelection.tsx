/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React, { useState } from 'react';

import { KeyValue } from '@instana/components';
import { t } from '@instana/i18n-react';

// @ts-expect-error Module needs to be translated to TS
import InlineTabNavigation from 'in-components/InlineTabNavigation';
import RedisTLSDeployContent from 'in-synthetics/dashboards/global/tabs/tests/components/RedisTLSDeployContent';
import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper/HorizontalFlexWrapper';
import CopyToClipboardButton from 'in-components/CopyToClipboardButton';
import { PoPProperties } from 'in-synthetics/utils/constants';
import CodeComponent from 'in-components/Code';

import locals from './DeployTabSelection.mless';

export default function DeployTabSelection({ downloadKey, agentKey, syntheticAcceptorURL }: PoPProperties) {
  const [activeTabIndex, setActiveTabIndex] = useState(0);

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
          label={t('in-synthetics:dashboard.testList.popDialog.subTitle')}
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
            wrapperClassName={locals.code}
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
