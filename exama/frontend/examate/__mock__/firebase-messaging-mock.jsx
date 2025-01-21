export const getMessaging = jest.fn(() => ({
    getToken: jest.fn(() => Promise.resolve('mock-token')),
    onMessage: jest.fn(),
  }));