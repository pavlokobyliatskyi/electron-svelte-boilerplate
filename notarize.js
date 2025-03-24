exports.default = async function notarizing(context) {
  const { electronPlatformName, appOutDir } = context;
  if (electronPlatformName !== 'darwin') {
    return;
  }

  const appName = context.packager.appInfo.productFilename;

  if (
    !(
      'APPLE_ID' in process.env &&
      'APPLE_ID_PASSWORD' in process.env &&
      'APPLE_TEAM_ID' in process.env
    )
  ) {
    return;
  }

  await require('@electron/notarize').notarize({
    appBundleId: build.appId,
    appPath: `${appOutDir}/${appName}.app`,
    appleId: process.env.APPLE_ID,
    appleIdPassword: process.env.APPLE_ID_PASSWORD,
    teamId: process.env.APPLE_TEAM_ID,
  });
};
