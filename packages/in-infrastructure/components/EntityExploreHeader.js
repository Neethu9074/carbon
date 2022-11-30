/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Switch, Route } from 'react-router-dom';
import React from 'react';

import TypeSelector from 'in-infrastructure/Explore/components/TypeSelector';
import AnalyzeHeader from 'in-analyze/components/AnalyzeHeader';
import Dashboard from 'in-infrastructure/Dashboard';
import { noop } from 'in-services/util/function';
import Footer from 'in-components/Footer';
import Sticky from 'in-components/Sticky';
import { t } from 'in-i18n';

export default function EntityExploreHeader({
  children,
  addFooter,
  onTypeSelected = noop,
  headerHref$,
  onHeaderClick,
  renderTypeSelector = true
}) {
  const headerLabel = renderTypeSelector ? <TypeSelector onTypeSelected={onTypeSelected} /> : undefined;

  const contextConfigurations = renderTypeSelector
    ? [
        {
          renderContext: () => t('in-analyze:analyzeHeader.entityExploreTypeSelectedTitle'),
          contextIcon: 'lib_analyze_inverted'
        }
      ]
    : undefined;

  return (
    <Switch>
      <Route path={'*/dashboard'} component={Dashboard} />
      <Route path="/*">
        <Sticky
          header={
            <AnalyzeHeader
              contextConfigurations={contextConfigurations}
              label={headerLabel}
              headerHref$={headerHref$}
              onHeaderClick={onHeaderClick}
            />
          }
        >
          {children}
          {addFooter && <Footer />}
        </Sticky>
      </Route>
    </Switch>
  );
}
