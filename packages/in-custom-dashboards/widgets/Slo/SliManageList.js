import React, { useState } from 'react';

import SlideInView, { NoHeader } from 'in-new-components/SlideInView/SlideInView';
import CreateNewSLIForm from 'in-custom-dashboards/widgets/Slo/CreateSLIForm';
import { getSliConfigurations } from 'in-custom-dashboards/api';
import SliList from 'in-custom-dashboards/widgets/Slo/SliList';
import { isLoading, hasError } from 'in-services/util/result';
import { compareIgnoreCase } from 'in-services/util/string';
import Message from 'in-new-components/Message';
import Button from 'in-new-components/Button';
import { role } from 'in-stores/user';

import locals from './SliManageList.mless';

export default function SliManageList({ applicationId, apName, apDefaultBoundaryScope, subSlideState }) {
  const [sliSelected, setSelectedSli] = subSlideState;
  const queryState = useState('');
  const close = () => setSelectedSli(null);

  const sliDetailsViewSlideIn = (
    <div className={locals.slideInWrapper}>
      {sliSelected && (
        <CreateNewSLIForm
          apName={apName}
          sliConfig={sliSelected}
          applicationId={applicationId}
          apDefaultBoundaryScope={apDefaultBoundaryScope}
          close={close}
        />
      )}
    </div>
  );
  const sliManageListMain = (
    <div>
      {!role.canConfigureServiceLevelIndicators && (
        <Message className={locals.message} withIcon>
          You are not having the required <i>CAN_CONFIGURE_SERVICE_LEVEL_INDICATORS</i> permission to create or edit
          SLIs.
        </Message>
      )}
      <SliList
        onChange={({ query }) => {
          queryState[1](query);
        }}
        getItems={() =>
          getSliConfigurations().map(onlyWithAPidAndNameMatchingQuery(applicationId, queryState[0])) ?? null
        }
        rightHeader={
          role.canConfigureServiceLevelIndicators && (
            <Button
              kind="action"
              onClick={() => setSelectedSli({})}
              icon="lib_openclose_add_circle_outline"
              className={locals.createButton}
            >
              Create SLI
            </Button>
          )
        }
        query={queryState[0]}
        selectSli={setSelectedSli}
      />
    </div>
  );

  return (
    <SlideInView
      onShowSlideInContentChange={close}
      showSlideInContent={!!sliSelected}
      HeaderComponent={NoHeader}
      slideTransitionDurationMillis={500}
      slideInContentTitle={'SLI List'}
      slideInContent={sliDetailsViewSlideIn}
      staticContent={sliManageListMain}
      enforceMaxHeightForStaticContent
    />
  );
}

export const onlyWithAPidAndNameMatchingQuery = (applicationId, nameQuery = '') => {
  return sliConfigs => {
    if (isLoading(sliConfigs) || hasError(sliConfigs)) {
      return sliConfigs;
    }

    return {
      ...sliConfigs,
      data: {
        items:
          sliConfigs?.data
            ?.filter(sli => sli?.sliEntity?.applicationId === applicationId)
            .filter(sli => sli?.sliName.includes(nameQuery))
            .sort((a, b) => compareIgnoreCase(a.sliName, b.sliName)) ?? []
      }
    };
  };
};
