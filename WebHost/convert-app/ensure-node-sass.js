var exec = require('child_process').exec;
var fs = require('fs');

function verify() {
  const os = process.platform.toLowerCase();
  console.log(`[verify-sass] Your operating system: ${os}`);
  try {
    return fs.readdirSync('./node_modules/node-sass/vendor').filter(fn => fn.startsWith(os)).length ? true : false;
  } catch (error) {
    console.error(error);
    return false;
  }
}

function rebuild() {
  return new Promise((resolve, reject) => {
    exec('npm rebuild node-sass --force').on('exit', resolve);
  });
}

console.log('[verify-sass] Verifying correct node-sass binary exists.');
var needRebuild = verify();

if (needRebuild) {
  console.log('[verify-sass] Verified!');
} else {
  console.log('[verify-sass] Binary missing for this OS!');
  console.log("[verify-sass] Running 'npm rebuild node-sass --force'.");
  console.log('[verify-sass] This may take a moment...');
  rebuild().then(() => {
    console.log('[verify-sass] Finished!');
  });
}
