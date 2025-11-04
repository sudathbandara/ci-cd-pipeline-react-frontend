import { render, screen } from '@testing-library/react';
import App from './App';

test('renders login page', () => {
  render(<App />);
  const titleElement = screen.getByText(/welcome back/i);
  expect(titleElement).toBeInTheDocument();
});

test('renders username input field', () => {
  render(<App />);
  const usernameInput = screen.getByLabelText(/username/i);
  expect(usernameInput).toBeInTheDocument();
});

test('renders password input field', () => {
  render(<App />);
  const passwordInput = screen.getByLabelText(/password/i);
  expect(passwordInput).toBeInTheDocument();
});

test('renders login button', () => {
  render(<App />);
  const loginButton = screen.getByRole('button', { name: /login/i });
  expect(loginButton).toBeInTheDocument();
});

test('renders remember me checkbox', () => {
  render(<App />);
  const rememberMeCheckbox = screen.getByLabelText(/remember me/i);
  expect(rememberMeCheckbox).toBeInTheDocument();
});

test('renders forgot password button', () => {
  render(<App />);
  const forgotPasswordButton = screen.getByText(/forgot password/i);
  expect(forgotPasswordButton).toBeInTheDocument();
});
