/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React, { useState } from 'react';

import { ApdexConfiguration, OrderDirection } from '@instana/types';

import ConfigDialogTimeConfigContextModification from 'in-service-levels/components/ConfigDialog/components/DialogSections/SloScopeSection/ConfigDialogTimeConfigContextModification';
import {
  APDEX_MANAGEMENT_CREATE_START,
  APDEX_MANAGEMENT_DELETE,
  APDEX_MANAGEMENT_EDIT_START
} from 'in-services/tracking/eventNames';
import useFilteredAndSortedApdexConfigurations from 'in-custom-dashboards/widgets/Apdex/hooks/useFilteredAndSortedApdexConfigurations';
import { useSlideOutDelay } from 'in-custom-dashboards/widgets/SloLegacy/hooks/useSlideOutDelay';
import CreateApdexForm from 'in-custom-dashboards/widgets/Apdex/components/CreateApdexForm';
import { CREATED_OBJECT, DELETED_OBJECT, UPDATED_OBJECT } from 'in-services/util/constants';
import { deleteApdexConfiguration } from 'in-custom-dashboards/widgets/Apdex/api';
import { ApdexEntityTypes } from 'in-custom-dashboards/widgets/Apdex/apdexTypes';
import ApdexList from 'in-custom-dashboards/widgets/Apdex/components/ApdexList';
import SlideInView, { NoHeader } from 'in-components/SlideInView/SlideInView';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import { isLoading } from 'in-services/util/result';
import { seconds } from 'in-services/time/time';
import { t } from 'in-i18n';

interface ApdexManageListProps {
  entityType: ApdexEntityTypes;
  entityId: string;
  showCreateForm?: boolean;
  onShowCreateForm: (isEditing: boolean) => void;
  onCloseCreateForm: VoidFunction;
  onChange: (apdex?: Partial<ApdexConfiguration>) => void;
}

export default function ApdexManageList({
  entityType,
  entityId,
  onChange,
  showCreateForm,
  onShowCreateForm,
  onCloseCreateForm
}: ApdexManageListProps) {
  const [query, setQuery] = useState<string>('');
  const [orderBy, setOrderBy] = useState<string>('name');
  const [orderDirection, setOrderDirection] = useState<OrderDirection>('ASC');
  const [editableApdexConfig, setEditableApdexConfig] = useState<Partial<ApdexConfiguration>>({});
  const apdexResult = useFilteredAndSortedApdexConfigurations(entityType, entityId, query, orderBy, orderDirection);
  const transitionDelay = 500;
  const [isCreateFormVisible, hideCreateForm] = useSlideOutDelay(showCreateForm, transitionDelay);
  const { unstable_trackEvent } = useSegmentTracking();

  const onShowSlideInContentChange = () => onChange(undefined);

  const onCreateConfig = () => {
    unstable_trackEvent(CREATED_OBJECT, {
      entityType,
      objectType: APDEX_MANAGEMENT_CREATE_START
    });
    setEditableApdexConfig({});
    onShowCreateForm(false);
  };

  const onEditConfig = (config: ApdexConfiguration) => {
    unstable_trackEvent(UPDATED_OBJECT, {
      entityType,
      objectType: APDEX_MANAGEMENT_EDIT_START
    });
    setEditableApdexConfig(config);
    onShowCreateForm(true);
  };

  const onDeleteApdexConfig = (id: string) => {
    unstable_trackEvent(DELETED_OBJECT, {
      entityType,
      objectType: APDEX_MANAGEMENT_DELETE
    });

    deleteApdexConfiguration(id)
      .filter(result => !isLoading(result))
      .once(onDeleteSuccess, onDeleteFailed);
  };

  return (
    <SlideInView
      onShowSlideInContentChange={onShowSlideInContentChange}
      showSlideInContent={showCreateForm}
      HeaderComponent={NoHeader}
      slideTransitionDurationMillis={transitionDelay}
      slideInContentTitle={t('in-custom-dashboards:widgets.apdex.apdexManageList.title')}
      renderSlideInContent={setFooter => {
        // Hide the form if the slide is out to not have the scroll-shadow visible afterwards
        if (!isCreateFormVisible) return <></>;
        return (
          <ConfigDialogTimeConfigContextModification>
            <CreateApdexForm
              apdexConfig={editableApdexConfig}
              entityType={entityType}
              entityId={entityId}
              setFooter={setFooter}
              onClose={onCloseCreateForm}
              onSave={apdexConfig => onChange(apdexConfig)}
            />
          </ConfigDialogTimeConfigContextModification>
        );
      }}
      staticContent={
        <ApdexList
          fetchedConfigState={apdexResult}
          onChange={({ query, orderBy, orderDirection }) => {
            setQuery(query ?? '');
            setOrderBy(orderBy!);
            setOrderDirection(orderDirection!);
          }}
          onSelect={apdexConfig => onChange(apdexConfig)}
          onCreate={onCreateConfig}
          onEdit={onEditConfig}
          onDelete={onDeleteApdexConfig}
          orderBy={orderBy}
          orderDirection={orderDirection}
          query={query}
        />
      }
      onAfterSlideOut={hideCreateForm}
      enforceMaxHeightForStaticContent
    />
  );
}

function onDeleteSuccess() {
  addMessage(
    {
      type: 'info',
      timeout: seconds.toMillis(2),
      content: t('in-custom-dashboards:widgets.apdex.apdexManageList.deleteSuccessfulMessage')
    },
    'custom-dashboard-apdex-delete-info'
  );
}

function onDeleteFailed() {
  addMessage(
    {
      type: 'danger',
      timeout: seconds.toMillis(3),
      content: t('in-custom-dashboards:widgets.apdex.apdexManageList.deleteFailedMessage')
    },
    'custom-dashboard-apdex-delete-error'
  );
}
