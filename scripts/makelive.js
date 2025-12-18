const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

function execCommand(command, description) {
  try {
    console.log(`\n🔄 ${description}...`);
    execSync(command, { stdio: 'inherit' });
    console.log(`✅ ${description} completed`);
    return true;
  } catch (error) {
    console.error(`❌ Error: ${description} failed`);
    return false;
  }
}

async function main() {
  console.log('🚀 Starting makelive deployment...\n');

  // Step 1: Generate version
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hour = now.getHours();
  const minute = now.getMinutes();

  const period = hour >= 12 ? 'pm' : 'am';
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  const time = `${displayHour}${minute > 0 ? '.' + String(minute).padStart(2, '0') : ''}${period}`;
  const version = `${month}.${day}.${time}`;

  const versionFile = `export const BUILD_VERSION = '${version}';\n`;
  const versionPath = path.join(__dirname, '../src/app/utils/buildVersion.ts');
  
  // Create utils directory if it doesn't exist
  const utilsDir = path.dirname(versionPath);
  if (!fs.existsSync(utilsDir)) {
    fs.mkdirSync(utilsDir, { recursive: true });
  }

  fs.writeFileSync(versionPath, versionFile);
  console.log(`✅ Version updated to: ${version}`);

  // Step 2: Git add
  if (!execCommand('git add .', 'Staging all changes')) {
    rl.close();
    process.exit(1);
  }

  // Step 3: Get commit message
  const commitMessage = await question('\n📝 Enter your commit message: ');
  if (!commitMessage.trim()) {
    console.log('❌ Commit message cannot be empty. Aborting.');
    rl.close();
    process.exit(1);
  }

  // Step 4: Git commit
  if (!execCommand(`git commit -m "${commitMessage}"`, 'Committing changes')) {
    rl.close();
    process.exit(1);
  }

  // Step 5: Git push to GitHub (default remote, usually origin)
  if (!execCommand('git push', 'Pushing to GitHub')) {
    rl.close();
    process.exit(1);
  }

  // Step 6: Git push to GitLab
  if (!execCommand('git push gitlab main', 'Pushing to GitLab')) {
    console.log('⚠️  GitLab push failed, but GitHub push succeeded');
  }

  console.log('\n🎉 All done! Your changes are live on both GitHub and GitLab!');
  console.log(`📌 Version: ${version}`);
  rl.close();
}

main().catch((error) => {
  console.error('❌ Fatal error:', error);
  rl.close();
  process.exit(1);
});

