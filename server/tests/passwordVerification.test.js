import test from 'node:test';
import assert from 'node:assert/strict';
import bcrypt from 'bcryptjs';
import { verifyStoredPassword } from '../utils/passwordUtils.js';

test('verifies legacy plain-text passwords after trimming', async () => {
  assert.equal(await verifyStoredPassword('iem123', 'iem123'), true);
  assert.equal(await verifyStoredPassword('iem123', ' iem123 '), true);
});

test('verifies bcrypt hashes', async () => {
  const bcryptHash = await bcrypt.hash('Admin@123', 10);
  assert.equal(await verifyStoredPassword('Admin@123', bcryptHash), true);
});
