/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';

import { Stack, DashboardButton, SvgIconSizes, Typography } from '@instana/components';
import { themes } from '@instana/design-tokens';
import { t } from '@instana/i18n-react';

import { AccountActivationProp } from 'in-plg/pages/WelcomePage/widgets/hooks/useGetAccountActivation';
import OnboardingStepBuilder from 'in-plg/pages/WelcomePage/OnboardingStepBuilder';

import locals from 'in-plg/components/WelcomeHeader/OnboardingCarousel/OnboardingCarousel.mless';

export default function OnboardingCarousel({
  accountActivationData: activation
}: {
  accountActivationData: AccountActivationProp;
}) {
  //we cannot provide correct type for activationData as the json object keys are dynamic
  const [activationData, setActivationData] = useState<any>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState((localStorage.getItem('expandedState') as unknown as boolean) ?? true);
  const [isScrollDisabled, setIsScrollDisabled] = useState(false);
  const [isLeftDisabled, setIsLeftDisabled] = useState(false);
  const [isRightDisabled, setIsRightDisabled] = useState(false);
  const collapsibleButton = {
    showOnboardingTasks: t('in-plg:welcomepage.collapsibleButton.showOnboardingTasks'),
    hideOnboardingTasks: t('in-plg:welcomepage.collapsibleButton.hideOnboardingTasks')
  };

  const checkScrollPosition = useCallback(() => {
    const scrollContainer = scrollContainerRef?.current;
    if (scrollContainer) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainer;
      const isAtStart = scrollLeft === 0;
      const isAtEnd = scrollLeft + clientWidth >= scrollWidth;
      setIsLeftDisabled(isAtStart);
      setIsRightDisabled(isAtEnd);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollContainerRef, isExpanded]);

  const handleScrollLeft = () => {
    if (scrollContainerRef?.current) {
      const { clientWidth } = scrollContainerRef.current;
      scrollContainerRef.current.scrollBy({
        left: -clientWidth,
        behavior: 'smooth'
      });

      setTimeout(checkScrollPosition, 1000);
    }
  };

  const handleScrollRight = () => {
    if (scrollContainerRef?.current) {
      const { clientWidth } = scrollContainerRef.current;
      scrollContainerRef.current.scrollBy({
        left: clientWidth,
        behavior: 'smooth'
      });
      setTimeout(checkScrollPosition, 1000);
    }
  };

  const preventMouseScroll = useCallback(event => {
    if (scrollContainerRef.current && scrollContainerRef.current.contains(event.target)) {
      event.preventDefault();
    }
  }, []);

  const toggleVisibility = () => {
    setIsScrollDisabled(true);
    window.removeEventListener('scroll', handleScroll);
    setIsExpanded((prev: boolean) => !prev);
    setTimeout(() => {
      setIsScrollDisabled(false);
    }, 100);
  };

  const handleScroll = useCallback(() => {
    if (!isScrollDisabled) {
      setIsExpanded(false);
    }
  }, [isScrollDisabled]);

  useEffect(() => {
    const resizeHandler = () => {
      checkScrollPosition();
    };
    window.addEventListener('resize', resizeHandler);
    return window.removeEventListener('resize', checkScrollPosition);
  }, [checkScrollPosition]);

  useEffect(() => {
    if (!activation || Object.keys(activation).length === 0) {
      return;
    }
    setActivationData(activation);
    checkScrollPosition();
  }, [activation, isExpanded, checkScrollPosition]);

  useEffect(() => {
    const timeoutId = setTimeout(checkScrollPosition, 1500);
    window.addEventListener('wheel', preventMouseScroll, { passive: false });
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('wheel', preventMouseScroll);
    };
  }, [checkScrollPosition, preventMouseScroll]);

  useEffect(() => {
    localStorage.setItem('expandedState', isExpanded.toString());
  }, [isExpanded]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  return (
    activationData &&
    activation !== null && (
      <Stack direction="vertical" distribution="center">
        {isExpanded && (
          <div className={locals.carouselStack}>
            <Stack direction="vertical" gap="medium">
              <div className={locals.carouselTitle}>
                <Typography variant="heading-05">{t('in-plg:welcomepage.foldableTileTitle')}</Typography>
              </div>
              <div ref={scrollContainerRef} id="carouselStack" className={locals.carousel}>
                <OnboardingStepBuilder activation={activationData} />
              </div>
            </Stack>
          </div>
        )}
        <div className={`${locals.toolbarSection} ${!isExpanded ? locals.expanded : ''}`}>
          <Stack direction="horizontal" align="center" distribution="spaceBetween">
            <Stack align="start">
              <DashboardButton
                kind="ghost"
                size="sm"
                className={locals.hideButton}
                aria-expanded={isExpanded}
                icon={isExpanded ? 'lib_arrow_expand_up' : 'lib_arrow_expand_down'}
                iconSize={SvgIconSizes.s}
                onClick={toggleVisibility}
              >
                {isExpanded ? collapsibleButton?.hideOnboardingTasks : collapsibleButton?.showOnboardingTasks}
              </DashboardButton>
            </Stack>
            {isExpanded && (
              <Stack direction="horizontal" gap="disabled" distribution="end" align="end">
                <DashboardButton
                  kind="ghost"
                  onClick={handleScrollLeft}
                  iconSize="xs"
                  ariaLabel="Explore previous tasks"
                  disabled={isLeftDisabled}
                  icon="lib_arrow_drop_left"
                  iconDescription="lib_arrow_drop_left"
                  iconColor={
                    isLeftDisabled
                      ? themes.default.ids.color.option.neutral['500']
                      : themes.default.ids.color.option.black
                  }
                />
                <DashboardButton
                  kind="ghost"
                  iconSize="xs"
                  onClick={handleScrollRight}
                  ariaLabel="Explore next tasks"
                  disabled={isRightDisabled}
                  icon="lib_arrow_drop_right"
                  iconDescription="lib_arrow_drop_right"
                  iconColor={
                    isRightDisabled
                      ? themes.default.ids.color.option.neutral['500']
                      : themes.default.ids.color.option.black
                  }
                />
              </Stack>
            )}
          </Stack>
        </div>
      </Stack>
    )
  );
}
