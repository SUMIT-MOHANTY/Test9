// Responsive design tests
describe('Responsive Design Tests', () => {
  const breakpoints = [
    { width: 320, height: 568, name: 'mobile' },
    { width: 768, height: 1024, name: 'tablet' },
    { width: 1280, height: 800, name: 'desktop' }
  ];

  breakpoints.forEach(({width, height, name}) => {
    test(`should display correctly on ${name}`, async () => {
      await page.setViewport({ width, height });
      await page.goto('http://localhost:3000');
      const screenshot = await page.screenshot();
      expect(screenshot).toMatchImageSnapshot({
        customSnapshotIdentifier: `responsive-${name}`
      });
    });
  });
});
