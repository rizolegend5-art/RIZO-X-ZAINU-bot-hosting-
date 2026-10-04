import fs from 'fs';
import path from 'path';
import { ANDROID_PROJECT_FILES } from '../src/data/androidSourceFiles';

const targetDir = path.resolve(process.cwd(), 'android');

console.log(`Writing ${ANDROID_PROJECT_FILES.length} Android files to ${targetDir}...`);

for (const file of ANDROID_PROJECT_FILES) {
  const destPath = path.join(targetDir, file.path);
  const dirName = path.dirname(destPath);
  if (!fs.existsSync(dirName)) {
    fs.mkdirSync(dirName, { recursive: true });
  }
  fs.writeFileSync(destPath, file.content, 'utf-8');
  console.log(`✓ Created: ${file.path}`);
}

// Also create gradle wrapper files and gradlew executable script
const gradlewContent = `#!/bin/sh
# Gradle start up script for POSIX generated for RIZO X ZAINU Android Project
APP_BASE_NAME=\`basename "$0"\`
DIRNAME=\`dirname "$0"\`
GRADLE_USER_HOME="\${GRADLE_USER_HOME:-\$HOME/.gradle}"
which gradle >/dev/null 2>&1 && exec gradle "$@"
echo "Executing Gradle wrapper..."
`;

fs.writeFileSync(path.join(targetDir, 'gradlew'), gradlewContent, { mode: 0o755 });

const gradleWrapperDir = path.join(targetDir, 'gradle/wrapper');
if (!fs.existsSync(gradleWrapperDir)) {
  fs.mkdirSync(gradleWrapperDir, { recursive: true });
}

const wrapperProps = `distributionBase=GRADLE_USER_HOME
distributionPath=wrapper/dists
distributionUrl=https\\://services.gradle.org/distributions/gradle-8.2-bin.zip
networkTimeout=10000
validateDistributionUrl=true
zipStoreBase=GRADLE_USER_HOME
zipStorePath=wrapper/dists
`;
fs.writeFileSync(path.join(gradleWrapperDir, 'gradle-wrapper.properties'), wrapperProps, 'utf-8');

console.log('✅ Android Studio project successfully exported into ./android directory!');
