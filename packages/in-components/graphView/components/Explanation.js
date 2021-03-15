/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { physicalPath } from 'in-stores/navigation/paths/mainPaths';
import { goToPath } from 'in-stores/navigation';
import Lettering from 'in-components/Lettering';
import Button from 'in-new-components/Button';
import Link from 'in-components/Link';
import { Trans } from 'in-i18n';
import { t } from 'in-i18n';

import locals from './Explanation.mless';

export default function Explanation() {
  return (
    <div className={locals.wrapper}>
      <Lettering className={locals.lettering} />

      <h2 className={locals.header}>{t('in-components:graphView.explanationHeader')}</h2>

      <p className={locals.text}>{t('in-components:graphView.explanationP1')}</p>

      <p className={locals.text}>{t('in-components:graphView.explanationP2')}</p>

      <p className={locals.text}>
        <Trans
          i18nKey="in-components:graphView.explanationLink"
          components={{
            linkToBlog: (
              <Link
                href="https://www.instana.com/blog/monitoring-microservice-applications-introducing-dynamic-graph/"
                className={locals.link}
              />
            )
          }}
        />
      </p>

      <p className={locals.text}>
        <Button onClick={() => goToPath(physicalPath)}>{t('in-components:graphView.closeBtn')}</Button>
      </p>
    </div>
  );
}
