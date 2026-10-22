/**
 * Integration is deliberately unconfigured for this fictional hotel concept.
 * Set an official HTTPS booking URL OR an authorized HTTPS/same-origin endpoint.
 * Never place credentials here: this configuration is included in the public bundle.
 */
export type BookingConfig = {
  officialUrl: string | null;
  requestEndpoint: string | null;
  recipientLabel: string | null;
  privacyUrl?: string | null;
};

export const bookingConfig: BookingConfig = {
  officialUrl: null,
  requestEndpoint: null,
  recipientLabel: null,
  privacyUrl: null,
};

/** Only explicit HTTPS destinations may receive a visitor or their information. */
export function officialBookingUrl(config: BookingConfig): string | null {
  if (!config.officialUrl) return null;
  try {
    const url = new URL(config.officialUrl);
    return url.protocol === 'https:' && !url.username && !url.password ? url.href : null;
  } catch { return null; }
}

export function requestEndpoint(config: BookingConfig): string | null {
  if (!config.requestEndpoint || !config.recipientLabel?.trim()) return null;
  const endpoint = config.requestEndpoint.trim();
  if (/^\/(?!\/)/.test(endpoint) && !endpoint.includes('\\') && !endpoint.includes('#') && !/[\r\n]/.test(endpoint)) return endpoint;
  try {
    const url = new URL(endpoint);
    return url.protocol === 'https:' && !url.username && !url.password && !url.hash ? url.href : null;
  } catch { return null; }
}
