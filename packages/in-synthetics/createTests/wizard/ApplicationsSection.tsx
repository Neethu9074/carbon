/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { Field, MapForm, Item } from 'formalistic';
import { useCallback, useState } from 'react';
import React, { useMemo } from 'react';

import { Checkbox, RadioButton, SearchInput } from '@instana/components';
import { GroupPermissionEntity, Result } from '@instana/types';
import { Button } from '@instana/components';

import ExpandableLightCard from 'in-alerting/components/ExpandableLightCard/ExpandableLightCard';
import NoDataAvailable from 'in-components/Errors/NoDataAvailable/NoDataAvailable';
import { syntheticRbacLimitedEnabled } from 'in-services/featureFlags';
import { LoadingIndicator } from 'in-components/LoadingIndicators';
import { t } from 'in-i18n';

import locals from 'in-synthetics/createTests/advanced/IdentifySection.mless';

interface ApplicationsSectionProps {
  form: MapForm<any>;
  updateForm: (form: MapForm<any>) => void;
  applications: Result<GroupPermissionEntity[]>;
}
export default function ApplicationsSection({ form, updateForm, applications }: ApplicationsSectionProps) {
  const applicationField = (form.get('applicationId') as Field<string>) || null;
  const applicationsField = (form.get('applications') as Field<string[]>) || [];
  const [searchInput, setSearchInput] = useState('');

  const filterApplications = useCallback(
    (apps: Result<GroupPermissionEntity[]> | undefined) => {
      return apps?.data?.filter((app: GroupPermissionEntity | undefined) =>
        app?.name.toLowerCase().includes(searchInput.toLowerCase())
      );
    },
    [searchInput]
  );

  const filteredApplications: GroupPermissionEntity[] | undefined = useMemo(
    () => filterApplications(applications),
    [applications, filterApplications]
  );

  const [visibleItems, setVisibleItems] = useState(10);

  const handleLoadMore = (event: React.MouseEvent) => {
    event.preventDefault();
    setVisibleItems(prevVisibleItems => prevVisibleItems + 10);
  };

  if (applications.progress?.loading) {
    return <LoadingIndicator size="xl" />;
  }
  if (!applications.data?.filter(Boolean)?.length) {
    return <NoDataAvailable text={t('in-synthetics:dialog.createTest.noApplicationsFound')} />;
  }

  let header = (
    <SearchInput className={locals.rightHeader} maxWidth="140" query={searchInput} onChange={q => setSearchInput(q)} />
  );

  const loadMoreApplications = () => {
    return (
      <div className={locals.center}>
        {visibleItems < (filteredApplications?.length ?? 0) && (
          <Button kind="action" onClick={handleLoadMore}>
            {t('in-synthetics:dialog.createTest.advancedMode.loadMore')}
          </Button>
        )}
      </div>
    );
  };

  const renderApplications = () => {
    if (syntheticRbacLimitedEnabled) {
      return (
        <div>
          {filteredApplications
            ?.filter(Boolean)
            .slice(0, visibleItems)
            .map((app: Record<string, any>) => {
              return (
                <div key={app.id} className={locals.item}>
                  <Checkbox
                    key={app.id}
                    label={app.name}
                    checked={applicationsField?.value.includes(app.id)}
                    onChange={() => {
                      let selectedApplications: string[] = applicationsField.value;
                      if (selectedApplications.includes(app.id)) {
                        selectedApplications = selectedApplications.filter(application => application !== app.id);
                      } else {
                        selectedApplications = [...selectedApplications, app.id];
                      }
                      updateForm(
                        form.updateIn(['applications'], (field: Item) =>
                          (field as Field<string[]>).setValue(selectedApplications).setTouched(true)
                        )
                      );
                    }}
                  />
                </div>
              );
            })}
          {loadMoreApplications()}
        </div>
      );
    } else {
      return (
        <div>
          {filteredApplications
            ?.filter(Boolean)
            .slice(0, visibleItems)
            .map((app: Record<string, any>) => {
              return (
                <div key={app.id} className={locals.item}>
                  <RadioButton
                    key={app.id}
                    label={app.name}
                    checked={applicationField?.value === app.id}
                    onChange={() => {
                      let selectedApplication: string = applicationField.value;
                      selectedApplication = selectedApplication === app.id ? null : app.id;
                      updateForm(
                        form.updateIn(['applicationId'], (field: Item) =>
                          (field as Field<string>).setValue(selectedApplication).setTouched(true)
                        )
                      );
                    }}
                  />
                </div>
              );
            })}
          {loadMoreApplications()}
        </div>
      );
    }
  };

  return (
    <ExpandableLightCard
      className={locals.container}
      title={
        syntheticRbacLimitedEnabled
          ? t('in-synthetics:dialog.createTest.basicDetails.labelApplications')
          : t('in-synthetics:dialog.createTest.basicDetails.labelApplication')
      }
      bodyWithoutPadding
      openByDefault
      darkFrame
      framed
      header={header}
    >
      {filteredApplications?.length != 0 ? (
        renderApplications()
      ) : (
        <NoDataAvailable text={t('in-synthetics:dialog.createTest.noMatchingFound')} />
      )}
    </ExpandableLightCard>
  );
}
