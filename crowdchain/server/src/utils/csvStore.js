const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');
const { stringify } = require('csv-stringify/sync');

const dataDir = path.join(__dirname, '../../data');

const getFilePath = (modelName) => path.join(dataDir, `${modelName}.csv`);

const readAll = (modelName) => {
  const filePath = getFilePath(modelName);
  if (!fs.existsSync(filePath)) return [];
  const content = fs.readFileSync(filePath, 'utf-8');
  return parse(content, { columns: true, skip_empty_lines: true });
};

const writeAll = (modelName, data) => {
  const filePath = getFilePath(modelName);
  if (data.length === 0) {
    // Write just headers or nothing. In our app we won't hit empty arrays normally after it's populated.
    return; 
  }
  const content = stringify(data, { header: true });
  fs.writeFileSync(filePath, content, 'utf-8');
};

const insertRecord = (modelName, record) => {
  const data = readAll(modelName);
  data.push(record);
  writeAll(modelName, data);
};

const updateRecord = (modelName, idField, idValue, updates) => {
  const data = readAll(modelName);
  const index = data.findIndex(req => req[idField] === String(idValue));
  if (index !== -1) {
    data[index] = { ...data[index], ...updates };
    writeAll(modelName, data);
    return data[index];
  }
  return null;
};

const deleteRecord = (modelName, idField, idValue) => {
  let data = readAll(modelName);
  const initialLength = data.length;
  data = data.filter(req => req[idField] !== String(idValue));
  if (data.length !== initialLength) {
    writeAll(modelName, data);
    return true;
  }
  return false;
};

module.exports = { readAll, writeAll, insertRecord, updateRecord, deleteRecord };
