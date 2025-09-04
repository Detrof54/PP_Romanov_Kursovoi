import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AddUser } from '../../src/app/_components/user/addUser';

vi.mock('~/app/api/action/user', () => ({
  createUser: vi.fn(),
}));

describe('AddUser Component', () => {
  it('рендерит форму с данными и кнопку добавить', () => {
    const { container } = render(<AddUser />);

    const form = container.querySelector('form');
    expect(form).not.toBeNull();

    const emailInput = container.querySelector('input[name="email"]');
    const firstnameInput = container.querySelector('input[name="firstname"]');
    const surnameInput = container.querySelector('input[name="surname"]');

    expect(emailInput).toBeDefined();
    expect(firstnameInput).toBeDefined();
    expect(surnameInput).toBeDefined();

    const submitButton = screen.getByRole('button', { name: /добавить/i });
    expect(submitButton).toBeDefined();
  });
});
