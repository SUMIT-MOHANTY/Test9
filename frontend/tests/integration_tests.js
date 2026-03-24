// Integration tests for frontend-backend communication
describe('API Integration Tests', () => {
  test('should fetch data from backend successfully', async () => {
    await page.goto('http://localhost:3000');

    // Wait for API call to complete
    await page.waitForResponse(response =>
      response.url().includes('/api/') &&
      response.status() === 200
    );

    // Check if data is rendered properly
    const content = await page.$eval('.data-container', el => el.textContent);
    expect(content).not.toBe('Loading...');
    expect(content).not.toContain('Error');
  });

  test('should handle API errors gracefully', async () => {
    // Mock failed API response
    await page.setRequestInterception(true);
    page.on('request', request => {
      if (request.url().includes('/api/')) {
        request.respond({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Internal Server Error' })
        });
      } else {
        request.continue();
      }
    });

    await page.goto('http://localhost:3000');

    // Check if error message is displayed
    const errorMessage = await page.$eval('.error-message', el => el.textContent);
    expect(errorMessage).toContain('Error');
  });
});
