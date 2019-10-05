const fs = require('fs');

function readEnvFile(path) {
  if (fs.existsSync(path)) {
    console.debug(`File '${path}' exists.`);
    return fs.readFileSync(path, 'UTF8');
  } else {
    console.debug(`File '${path}' doesn't exist.`);
    return '';
  }
}

function writeEnvFile(path, content) {
  fs.writeFile(path, content, 'UTF8', err => {
    if (err) {
      throw err;
    }
    console.debug(`File '${path}' saved.`);
  });
}

function replaceEnvVariable(content, variableName, variableValue) {
  var pattern = new RegExp(`\\s*(${variableName})\\s*=.*`);
  const lineText = `${variableName}=${variableValue}`;
  if (!content) {
    console.debug(`Content is empty.`);
    return lineText;
  } else if (content.match(pattern)) {
    console.debug(`Content already contains the variable.`);
    var newContent = content.replace(pattern, `$1=${variableValue}`);
    console.debug(`Using new value '${lineText}'`);
    return newContent;
  } else {
    console.debug(`Content doesn't contain the variable.`);
    return `${content}\n${lineText}`;
  }
}

function updateEnvFileVariable(path, propertyName, propertyValue) {
  console.debug(`Using new variable value: ${propertyValue}`);
  writeEnvFile(path, replaceEnvVariable(readEnvFile(path), propertyName, propertyValue));
}

try {
  updateEnvFileVariable(
    '.env.local',
    'REACT_APP_BUILD_NUMBER',
    Math.random()
      .toString(36)
      .substring(2)
  );
} catch (err) {
  console.error(err);
}
