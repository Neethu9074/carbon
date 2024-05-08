/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { shallow } from 'enzyme';
import React from 'react';

import { SvgIcon } from '@instana/components';

import WidgetHeader from 'in-custom-dashboards/widgets/Apdex/components/WidgetHeader';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

describe('in-custom-dashboards/widgets/Apdex/components/WidgetHeader', () => {
  it('renders the corresponding values for website entity ', () => {
    const wrapper = shallow(
      <WidgetHeader title="This is a necessary regression." entityType="website" entityLabel="Website Adex" />
    );

    expect(wrapper.find(SvgIcon).prop('type')).toBe('lib_website');
    expect(wrapper.find(SvgIcon).prop('aria-label')).toBe(
      t('in-custom-dashboards:widgets.apdex.entityInfo.tooltip_website')
    );
    expect(wrapper.find(Tooltip).prop('content')).toBe(
      t('in-custom-dashboards:widgets.apdex.entityInfo.tooltip_website')
    );
  });

  it('renders the corresponding values for application entity ', () => {
    const wrapper = shallow(
      <WidgetHeader title="This is a necessary regression." entityType="application" entityLabel="Application Adex" />
    );

    expect(wrapper.find(SvgIcon).prop('type')).toBe('lib_application');
    expect(wrapper.find(SvgIcon).prop('aria-label')).toBe(
      t('in-custom-dashboards:widgets.apdex.entityInfo.tooltip_application')
    );
    expect(wrapper.find(Tooltip).prop('content')).toBe(
      t('in-custom-dashboards:widgets.apdex.entityInfo.tooltip_application')
    );
  });
});
