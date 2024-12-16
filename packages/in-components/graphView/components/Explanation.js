/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Button } from '@instana/components';
import { Link } from '@instana/components';

import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { physicalPath } from 'in-stores/navigation/paths/mainPaths';
import Lettering from 'in-components/Lettering';
import { Trans } from 'in-i18n';
import { t } from 'in-i18n';

import locals from './Explanation.mless';

export default function Explanation() {
  const { createHrefToPath } = useNavigation();
  return (
    <div className={locals.wrapper}>
      <Lettering className={locals.lettering} />

      <h2 className={locals.header}>{t('in-components:graphView.explanationHeader')}</h2>

      <p className={locals.text}>{t('in-components:graphView.explanationP1')}</p>

      <p className={locals.text}>{t('in-components:graphView.explanationP2')}</p>

      <p className={locals.text}>{t('in-components:graphView.explanationP3')}</p>

      <p className={locals.text}>
        <Trans
          i18nKey="in-components:graphView.explanationLink"
          components={{
            linkToBlog: (
              <Link
                external
                className={locals.link}
                href="https://www.ibm.com/blog/monitoring-microservices-applications-introducing-the-dynamic-graph/"
              />
            )
          }}
        />
      </p>

      <p className={locals.text}>
        <Button href={createHrefToPath(physicalPath)}>{t('in-components:graphView.closeBtn')}</Button>
      </p>
    </div>
  );
}
