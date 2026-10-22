export default {
  extends: 'lighthouse:default',
  settings: {
    onlyAudits: ['metrics'],
    throttlingMethod: 'devtools',
    throttling: { requestLatencyMs: 0, downloadThroughputKbps: 0, uploadThroughputKbps: 0, cpuSlowdownMultiplier: 4 },
    screenEmulation: { mobile: true, width: 390, height: 844, deviceScaleFactor: 1, disabled: false },
    pauseAfterLoadMs: 30000,
    pauseAfterFcpMs: 30000,
    cpuQuietThresholdMs: 0,
    networkQuietThresholdMs: 0,
    maxWaitForLoad: 45000,
    disableFullPageScreenshot: true,
  },
};
