/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

const i18next = require('./i18n');

const errorPageI18n = (error, treq) => {
  let t = treq;
  if (!t) {
    t = i18next.getFixedT();
  }
  const translatedKeys = {
    403: {
      title: t('in-server:errorPages.403.title'),
      label: t('in-server:errorPages.403.label'),
      description: t('in-server:errorPages.403.description')
    },
    404: {
      title: t('in-server:errorPages.404.title'),
      label: t('in-server:errorPages.404.label'),
      description: t('in-server:errorPages.404.description')
    },
    500: {
      title: t('in-server:errorPages.500.title'),
      label: t('in-server:errorPages.500.label'),
      description: t('in-server:errorPages.500.description')
    },
    maintenance: {
      title: t('in-server:errorPages.maintenance.title'),
      label: t('in-server:errorPages.maintenance.label'),
      description: t('in-server:errorPages.maintenance.description')
    }
  };

  const errorInfo = {
    title: translatedKeys[error].title,
    label: translatedKeys[error].label,
    description: translatedKeys[error].description
  };

  const links = {
    statusLink: t('in-server:errorPages.links.statusLink'),
    supportLink: t('in-server:errorPages.links.supportLink'),
    homeLink: t('in-server:errorPages.links.homeLink'),
    adminLink: t('in-server:errorPages.links.adminLink'),
    signoutButtonLabel: t('in-server:errorPages.links.signoutButtonLabel')
  };

  return { ...errorInfo, ...links };
};

module.exports = errorPageI18n;
