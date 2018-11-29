import { compose, withProps } from 'recompose';
import React from 'react';

import Switch from 'in-new-components/LocationAwareTabView/components/Switch';
import Header from 'in-new-components/LocationAwareTabView/components/Header';
import BreadcrumbHeader from 'in-components/breadcrumb/BreadcrumbHeader';
import { emptyObject } from 'in-services/fixedObjects';
import Sticky from 'in-components/Sticky';
import connectTo from 'in-hoc/connectTo';

export default compose(
  connectTo(props => ({
    result: props.result$
  })),
  withProps(({ result, withProps: customWithPropsExtension, props }) => {
    if (customWithPropsExtension) {
      return {
        props: {
          ...props,
          ...customWithPropsExtension({ result, ...props })
        }
      };
    }
    return emptyObject;
  })
)(TabView);

function TabView({
  result,
  tabs,
  filterTabByResult = () => () => true,
  HeaderComponent,
  location,
  props,
  withoutBreadcrumb = false,
  useFullAvailableWidth = false,
  withoutPadding = false
}) {
  const filteredTabs = tabs.filter(filterTabByResult(result));
  return (
    <section>
      <Sticky
        header={
          <div>
            {!withoutBreadcrumb && <BreadcrumbHeader useFullAvailableWidth />}
            <Header
              location={location}
              tabs={filteredTabs}
              result={result}
              props={props}
              HeaderComponent={HeaderComponent}
              useFullAvailableWidth={useFullAvailableWidth}
            />
          </div>
        }
      >
        <Switch tabs={filteredTabs} result={result} location={location} props={props} withoutPadding={withoutPadding} />
      </Sticky>
    </section>
  );
}
