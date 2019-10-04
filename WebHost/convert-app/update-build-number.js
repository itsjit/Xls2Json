const fs = require('fs');

function readEnvFileContent(path) {
  if (fs.existsSync(path)) {
    console.debug(`File '${path}' exists.`);
    return fs.readFileSync(path, 'UTF8');
  } else {
    console.debug(`File '${path}' doesn't exists.`);
    return '';
  }
}

function writeEnvFileContent(path, content) {
  fs.writeFile(path, content, 'UTF8', err => {
    if (err) {
      throw err;
    }
    console.debug(`File '${path}' saved.`);
  });
}

function replaceEnvContentProperty(content, propertyName, propertyValue) {
  var pattern = new RegExp(`\\s*(${propertyName})\\s*=.*`);
  const lineText = `${propertyName}=${propertyValue}`;
  if (!content) {
    console.debug(`Content is empty.`);
    return lineText;
  } else if (content.match(pattern)) {
    console.debug(`Content contains the property.`);
    var newContent = content.replace(pattern, `$1=${propertyValue}`);
    console.debug(`Using new value '${lineText}'`);
    return newContent;
  } else {
    console.debug(`Content doesn't contain the property.`);
    return `${content}\n${lineText}`;
  }
}

function updateEnvFileProperty(path, propertyName, propertyValue) {
  console.debug(`Using new property value: ${propertyValue}`);
  writeEnvFileContent(path, replaceEnvContentProperty(readEnvFileContent(path), propertyName, propertyValue));
}

try {
  updateEnvFileProperty(
    '.env.local',
    'REACT_APP_BUILD_NUMBER',
    Math.random()
      .toString(36)
      .substring(2)
  );
} catch (err) {
  console.error(err);
}
