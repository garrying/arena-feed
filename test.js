import assert from 'assert';
import getArenaFeed from './index.js';

// Mock fetch for testing
global.fetch = async (url, options) => {
  // Simulate successful response
  if (options.headers.Authorization === 'Bearer valid-token') {
    return {
      ok: true,
      status: 200,
      json: async () => ({ 
        feed: [{ id: 1, title: 'Test Block' }],
        length: 1 
      })
    };
  }
  // Simulate unauthorized response
  return {
    ok: false,
    status: 401,
    json: async () => ({ error: 'Unauthorized' })
  };
};

async function runTests() {
  console.log('Running tests...\n');

  // Test 1: Should throw error without bearer token
  try {
    await getArenaFeed();
    assert.fail('Should have thrown error for missing token');
  } catch (error) {
    assert.strictEqual(error.message, 'Bearer token is required');
    console.log('✓ Test 1 passed: Throws error for missing token');
  }

  // Test 2: Should throw error with empty token
  try {
    await getArenaFeed('');
    assert.fail('Should have thrown error for empty token');
  } catch (error) {
    assert.strictEqual(error.message, 'Bearer token is required');
    console.log('✓ Test 2 passed: Throws error for empty token');
  }

  // Test 3: Should return data with valid token
  try {
    const result = await getArenaFeed('valid-token');
    assert(result.feed);
    assert.strictEqual(result.feed.length, 1);
    assert.strictEqual(result.feed[0].id, 1);
    console.log('✓ Test 3 passed: Returns data with valid token');
  } catch (error) {
    assert.fail(`Should not have thrown error: ${error.message}`);
  }

  // Test 4: Should handle HTTP errors
  try {
    await getArenaFeed('invalid-token');
    assert.fail('Should have thrown error for invalid token');
  } catch (error) {
    assert(error.message.includes('HTTP error! status: 401'));
    console.log('✓ Test 4 passed: Handles HTTP errors');
  }

  console.log('\n✅ All tests passed!');
}

runTests().catch(error => {
  console.error('Test failed:', error);
  process.exit(1);
});