import { render, screen, waitFor } from '@testing-library/react';
import Weather from './Weather';

// Mock the fetch function
global.fetch = jest.fn();

describe('Weather Component', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  test('renders weather component', () => {
    render(<Weather />);
    expect(screen.getByText('Weather')).toBeInTheDocument();
  });

  test('shows loading state initially', () => {
    render(<Weather />);
    expect(screen.getByText('Loading weather data...')).toBeInTheDocument();
  });

  test('displays weather data after successful fetch', async () => {
    // Mock successful API response
    const mockWeatherData = {
      current: {
        temp_c: 20,
        condition: { text: 'Sunny' },
        humidity: 65,
        wind_kph: 10
      },
      location: {
        name: 'Test City',
        localtime: '2024-03-27 12:00'
      }
    };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockWeatherData
    });

    render(<Weather />);

    // Wait for the loading message to disappear
    await waitFor(() => {
      expect(screen.queryByText('Loading weather data...')).not.toBeInTheDocument();
    });

    // Check if weather data is displayed
    expect(screen.getByText('Test City')).toBeInTheDocument();
    expect(screen.getByText('20°C')).toBeInTheDocument();
    expect(screen.getByText('Sunny')).toBeInTheDocument();
    expect(screen.getByText('65%')).toBeInTheDocument();
    expect(screen.getByText('10 km/h')).toBeInTheDocument();
  });

  test('handles API error gracefully', async () => {
    // Mock failed API response
    global.fetch.mockRejectedValueOnce(new Error('API Error'));

    render(<Weather />);

    // Wait for the error message to appear
    await waitFor(() => {
      expect(screen.getByText('Error loading weather data')).toBeInTheDocument();
    });
  });

  test('formats date and time correctly', async () => {
    const mockWeatherData = {
      current: {
        temp_c: 20,
        condition: { text: 'Sunny' },
        humidity: 65,
        wind_kph: 10
      },
      location: {
        name: 'Test City',
        localtime: '2024-03-27 12:00'
      }
    };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockWeatherData
    });

    render(<Weather />);

    await waitFor(() => {
      expect(screen.getByText('Test City')).toBeInTheDocument();
    });

    // Check if date and time are formatted correctly
    expect(screen.getByText(/March 27, 2024/)).toBeInTheDocument();
    expect(screen.getByText(/12:00/)).toBeInTheDocument();
  });
}); 