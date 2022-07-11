/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React, { useEffect, useState } from 'react';

import useFilteredApdexConfigurations from 'in-custom-dashboards/widgets/Apdex/hooks/useFilteredApdexConfigurations';
import CreateApdexForm from 'in-custom-dashboards/widgets/Apdex/components/CreateApdexForm';
import { deleteApdexConfiguration } from 'in-custom-dashboards/widgets/Apdex/api';
import { ApdexEntityTypes } from 'in-custom-dashboards/widgets/Apdex/apdexTypes';
import ApdexList from 'in-custom-dashboards/widgets/Apdex/components/ApdexList';
import SlideInView, { NoHeader } from 'in-components/SlideInView/SlideInView';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import { isLoading } from 'in-services/util/result';
import { seconds } from 'in-services/time/time';
import { ApdexConfiguration } from 'in-types';
import { t } from 'in-i18n';

const slideTransitionDurationMillis = 500;

interface ApdexManageListProps {
  entityType: ApdexEntityTypes;
  entityId: string;
  showCreateForm?: boolean;
  onShowCreateForm: VoidFunction;
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
  const [editableApdexConfig, setEditableApdexConfig] = useState<Partial<ApdexConfiguration>>({});
  const [apdexResult, setQuery] = useFilteredApdexConfigurations(entityType, entityId);
  const [isCreateFormVisible, hideCreateForm] = useSlideOutDelay(showCreateForm);

  const onShowSlideInContentChange = () => onChange(undefined);
  const onCreateConfig = () => {
    setEditableApdexConfig({});
    onShowCreateForm();
  };
  const onEditConfig = (config: ApdexConfiguration) => {
    setEditableApdexConfig(config);
    onShowCreateForm();
  };

  return (
    <SlideInView
      onShowSlideInContentChange={onShowSlideInContentChange}
      showSlideInContent={showCreateForm}
      HeaderComponent={NoHeader}
      slideTransitionDurationMillis={slideTransitionDurationMillis}
      slideInContentTitle={t('in-custom-dashboards:widgets.apdex.apdexManageList.title')}
      renderSlideInContent={setFooter => {
        // Hide the form if the slide is out to not have the scroll-shadow visible afterwards
        if (!isCreateFormVisible) return <></>;
        return (
          <CreateApdexForm
            apdexConfig={editableApdexConfig}
            entityType={entityType}
            entityId={entityId}
            setFooter={setFooter}
            onClose={onCloseCreateForm}
            onSave={apdexConfig => onChange(apdexConfig)}
          />
        );
      }}
      staticContent={
        <ApdexList
          fetchedConfigState={apdexResult}
          onChange={({ query }) => setQuery(query ?? '')}
          onSelect={apdexConfig => onChange(apdexConfig)}
          onCreate={onCreateConfig}
          onEdit={onEditConfig}
          onDelete={onDeleteApdexConfig}
        />
      }
      onAfterSlideOut={hideCreateForm}
      enforceMaxHeightForStaticContent
    />
  );
}

function onDeleteApdexConfig(id: string) {
  deleteApdexConfiguration(id)
    .filter(result => !isLoading(result))
    .once(onDeleteSuccess, onDeleteFailed);
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

/*
 * This hook is used to render the create form only if it's opened and the
 * slide-transition was finished. It should prevent the SlideInView from render
 * a shadow if the content has been scrolled.
 */
function useSlideOutDelay(
  visibility?: boolean,
  transitionDelay = slideTransitionDurationMillis
): [boolean, VoidFunction] {
  const [isVisible, setIsVisible] = useState(!!visibility);

  useEffect(() => {
    if (visibility) setIsVisible(true);
  }, [visibility]);

  function hide() {
    setTimeout(() => setIsVisible(false), transitionDelay);
  }

  return [isVisible, hide];
}
