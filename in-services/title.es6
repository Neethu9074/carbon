import config from 'in-services/config';

export function setWindowTitle(title) {
  document.title = title;
}

export function setWindowTitleFromRoute(title) {
  document.title = `${title} – Instana (${config.tenantUnit}-${config.tenant})`;
}
