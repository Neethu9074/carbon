/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { getLinkToAnalyze } from 'in-logging/navigation/paths';
import Overlay from 'in-new-components/overlays/Overlay';
import { Li, Ul } from 'in-new-components/lists/List';
import Button from 'in-new-components/Button';
import SvgIcon from 'in-components/SvgIcon';
import { t } from 'in-i18n';

import locals from './AnalyzeLogsButton.mless';

export default function AnalyzeLogsButton({ log }) {
  const serviceId = getServiceId(log.logTags);

  return (
    <Overlay
      align="bottomLeft"
      content={() => (
        <Ul>
          <Li href$={getLinkToTagFilterExpression({ name: 'log.message', value: log.message })}>
            {t('in-analyze:logDetails.similarLogs')}
          </Li>
          {serviceId && (
            <Li
              href$={getLinkToTagFilterExpression({
                name: 'log.custom',
                key: 'service_id',
                value: serviceId
              })}
            >
              {t('in-analyze:logDetails.similarServiceLogs')}
            </Li>
          )}
        </Ul>
      )}
      withoutWrapper
    >
      {({ toggle, refSetter, isOpen }) => (
        <Button kind="primary" icon="lib_analyze" onClick={toggle} refSetter={refSetter}>
          {t('in-analyze:logDetails.analyzeLogsLabel')}
          <SvgIcon className={locals.expandIcon} type={isOpen ? 'lib_arrow_drop_up' : 'lib_arrow_drop_down'} />
        </Button>
      )}
    </Overlay>
  );
}

function getLinkToTagFilterExpression(tagFilterExpression) {
  return getLinkToAnalyze({
    tagFilterExpression: [{ type: 'TAG_FILTER', operator: 'EQUALS', ...tagFilterExpression }]
  });
}

function getServiceId(logTags) {
  return logTags
    .filter(({ name, key }) => name === 'log.custom' && key === 'service_id')
    .map(({ stringValue }) => stringValue)[0];
}
