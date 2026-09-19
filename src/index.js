const actionModules = {
  checkout: './action-checkout',
  'clone-and-install': './action-clone-and-install',
  // The finish action will only work OK when triggered from a different Workflow
  // - Artifacts are only available and visible in the API after the producing wokflow completes
  finish: './action-finish',
  init: './action-init',
  'resolve-pr': './action-resolve-pr',
  'update-status': './action-update-status'
};

const exec = async () => {
  const actionName = process.argv[2];
  if (!actionName || !actionModules[actionName]) {
    throw new Error('Invalid run, you need to specify the action "node index.js <actionName>"');
  }
  const action = require(actionModules[actionName]);
  await action();
};

exec()
  .then(() => {
    console.log('Process completed!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Error while running JKube CI automation');
    console.error(err);
    process.exit(1);
  });
