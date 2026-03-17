// Headers that are constant throughout the app session
export const staticHeaders = {
  'Content-Type': 'application/json',
  'appName': 'NVantage - Middleware Qa',
  'buildNumber': '10005',
  'packageName': 'com.coditas.omnenest.omnenest_mobile_app.middlewareqa',
  'appVersion': '1.0.6',
  'os': 'android',
  'deviceId': '2abe6bee-768f-4714-ab8d-2da64540bda8',
  'deviceIp': '10.0.2.16',
  'source': 'MOB',
  'appInstallId': '2abe6bee-768f-4714-ab8d-2da64540bda8',
  'userAgent': 'com.coditas.omnenest.omnenest_mobile_app.middlewareqa/1.0.6 (Google google sdk_gphone64_x86_64; Android 15 SDK35)',
};

// Headers that MUST be fresh for every request
export const getDynamicHeaders = () => ({
  'timestamp': Date.now().toString(),
  'xRequestId': `2abe6bee-768f-4714-ab8d-2da64540bda8-${Date.now()}`
});