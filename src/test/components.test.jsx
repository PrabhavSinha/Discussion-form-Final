import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Badge from '../components/UI/Badge.jsx';
import Avatar from '../components/UI/Avatar.jsx';
import { EmptyState, ErrorState } from '../components/UI/LoadingSpinner.jsx';

// ─── Badge ────────────────────────────────────────────────────────────────
describe('Badge', () => {
  it('renders with children text', () => {
    render(<Badge>Hello</Badge>);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('applies default variant class', () => {
    const { container } = render(<Badge>Test</Badge>);
    expect(container.firstChild).toHaveClass('badge');
  });

  it('accepts variant prop', () => {
    const { container } = render(<Badge variant="pinned">Pinned</Badge>);
    expect(container.firstChild.className).toContain('rust');
  });
});

// ─── Avatar ───────────────────────────────────────────────────────────────
describe('Avatar', () => {
  const user = { id: 'u1', name: 'Alice Bob', avatar: 'AB' };

  it('renders initials', () => {
    render(<Avatar user={user} />);
    expect(screen.getByText('AB')).toBeInTheDocument();
  });

  it('has correct aria-label', () => {
    render(<Avatar user={user} />);
    expect(screen.getByRole('img', { name: /Avatar for Alice Bob/i })).toBeInTheDocument();
  });

  it('returns null for undefined user', () => {
    const { container } = render(<Avatar user={undefined} />);
    expect(container.firstChild).toBeNull();
  });
});

// ─── EmptyState ───────────────────────────────────────────────────────────
describe('EmptyState', () => {
  it('renders title and description', () => {
    render(<EmptyState icon="🌿" title="Nothing here" description="No content yet" />);
    expect(screen.getByText('Nothing here')).toBeInTheDocument();
    expect(screen.getByText('No content yet')).toBeInTheDocument();
  });

  it('renders action button when provided', () => {
    render(
      <EmptyState
        icon="🌿"
        title="Empty"
        action={<button>Do Something</button>}
      />
    );
    expect(screen.getByText('Do Something')).toBeInTheDocument();
  });
});

// ─── ErrorState ───────────────────────────────────────────────────────────
describe('ErrorState', () => {
  it('renders the error message', () => {
    render(<ErrorState message="Network failure" />);
    expect(screen.getByText('Network failure')).toBeInTheDocument();
  });

  it('calls onRetry when try again is clicked', () => {
    const onRetry = vi.fn();
    render(<ErrorState message="Oops" onRetry={onRetry} />);
    fireEvent.click(screen.getByText('Try again'));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('does not render retry button without onRetry prop', () => {
    render(<ErrorState message="Oops" />);
    expect(screen.queryByText('Try again')).toBeNull();
  });
});
