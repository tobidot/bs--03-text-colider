const fs = require('fs');
const path = require('path');

// Read the package.json file
let packageJsonPathArray = [__dirname, 'package.json'];
let packageJsonPath = path.resolve(...packageJsonPathArray);
while (!fs.existsSync(packageJsonPath) && packageJsonPath !== '/package.json') {
    packageJsonPathArray.splice(1, 0, '..');
    packageJsonPath = path.resolve(...packageJsonPathArray);
}
if (!fs.existsSync(packageJsonPath)) {
    console.error('Could not find package.json');
    process.exit(1);
}
console.log('Package.json found:', packageJsonPath);
let packageJson = JSON.parse(fs.readFileSync(packageJsonPath));

// Increment the version number
const [major, minor, patch] = packageJson.version.split('.').map(Number);
packageJson.version = `${major}.${minor}.${patch + 1}`;

// Write the updated package.json back to file
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

console.log('Package version incremented:', packageJson.version);
