import React from 'react';
import rpt from 'prop-types';

import LoadingIndicator from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/infrastructure/metrics/LoadingIndicator';
import TagSelectorOverlay from 'in-new-components/TagSelectorOverlay/TagSelectorOverlay';
import DropdownButton from 'in-new-components/Button/DropdownButton';
import Overlay from 'in-new-components/overlays/Overlay';
import useObservable from 'in-hooks/useObservable';
import useTimeConfig from 'in-hooks/useTimeConfig';
import Message from 'in-new-components/Message';
import Button from 'in-new-components/Button';
import SvgIcon from 'in-components/SvgIcon';

import locals from './TypeAndMetricConfiguratorPresenter.mless';

export default function TypeAndMetricConfiguratorPresenter({
  tagName,
  getTagCatalog,
  onChange,
  label = 'Select metric',
  loadingLabel
}) {
  const timeConfig = useTimeConfig();
  const tagCatalog = useObservable(getTagCatalogObservable, [getTagCatalog, timeConfig]);

  if (tagCatalog?.errors.length > 0) {
    return <Errors errors={tagCatalog?.errors} />;
  }

  if (!tagCatalog?.data) {
    return <LoadingIndicator text={loadingLabel} />;
  }

  const typeAndMetric = tagCatalog.data.tagsByName[tagName]?.path.slice(1).map(path => path.label);

  return (
    <>
      <Overlay
        content={TagSelectorOverlay}
        props={{
          tagCatalog: tagCatalog.data,
          onChange: ({ name }) => onChange(name)
        }}
        align={'bottomLeft'}
        withoutWrapper
      >
        {({ toggle, refSetter }) =>
          typeAndMetric ? (
            <DropdownButton
              kind="secondary"
              size="compact"
              onClick={toggle}
              refSetter={refSetter}
              className={locals.configurator}
            >
              {typeAndMetric[0]} <SvgIcon className={locals.icon} type="lib_arrow_drop_right" /> {typeAndMetric[1]}
            </DropdownButton>
          ) : (
            <Button
              className={locals.noActiveGroupingButton}
              kind={'subtle'}
              size="compact"
              icon={'lib_openclose_add'}
              refSetter={refSetter}
              onClick={toggle}
            >
              {label}
            </Button>
          )
        }
      </Overlay>
    </>
  );
}

TypeAndMetricConfiguratorPresenter.propTypes = {
  onChange: rpt.func.isRequired,
  tagName: rpt.string,
  getTagCatalog: rpt.func.isRequired,
  label: rpt.string,
  loadingLabel: rpt.string
};

function getTagCatalogObservable([getTagCatalog, timeConfig]) {
  return getTagCatalog({ timeConfig });
}

function Errors({ errors }) {
  return (
    <>
      {errors.map(error => (
        <Message key={error.code} type="error" small>
          {error.message}
        </Message>
      ))}
    </>
  );
}
