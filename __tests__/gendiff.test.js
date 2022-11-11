/* eslint-disable */
import * as fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import makeConsoleDiff from '../src/gendiff.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const readFile = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8');

test('plain', () => {
    const file1 = getFixturePath('1_plain_file1.json');
    const file2 = getFixturePath('1_plain_file2.json');
    const correctResult = readFile('1_plain_correct_result');
    expect(makeConsoleDiff(file1, file2)).toEqual(correctResult);
});