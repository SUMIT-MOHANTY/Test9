import { api } from '../api';

// Mock fetch API
global.fetch = jest.fn();

describe('API Service', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should fetch features successfully', async () => {
    // Mock successful response
    const mockFeatures = [
      { id: 1, title: 'Feature 1', description: 'Description 1', icon: 'icon1' }
    ];

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, data: mockFeatures }),
    });

    // Call the function
    const result = await api.getFeatures();

    // Assertions
    expect(result).toEqual(mockFeatures);
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('should handle contact form submission', async () => {
    // Mock successful response
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, message: 'Form submitted successfully' }),
    });

    // Test data
    const formData = {
      name: 'John Doe',
      email: 'john@example.com',
      message: 'Test message'
    };

    // Call the function
    const result = await api.submitContactForm(formData);

    // Assertions
    expect(result.success).toBe(true);
    expect(result.message).toBe('Form submitted successfully');
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('should validate email in contact form', async () => {
    // Test data with invalid email
    const formData = {
      name: 'John Doe',
      email: 'invalid-email',
      message: 'Test message'
    };

    // Call the function
    const result = await api.submitContactForm(formData);

    // Assertions
    expect(result.success).toBe(false);
    expect(result.message).toContain('valid email');
    // Fetch should not be called due to validation error
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('should handle API errors properly', async () => {
    // Mock error response
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({ success: false, error: 'Server error' }),
    });

    // Try to fetch features
    try {
      await api.getFeatures();
      // Should not reach here
      expect(true).toBe(false);
    } catch (error) {
      // Assertions
      expect(error).toBeDefined();
      expect(global.fetch).toHaveBeenCalledTimes(1);
    }
  });
});
