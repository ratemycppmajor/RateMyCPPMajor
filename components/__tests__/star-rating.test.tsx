import { fireEvent, render, screen } from '@testing-library/react';

import StarRating from '@/components/review/StarRating';

describe('StarRating', () => {
  const defaultProps = {
    label: 'Difficulty',
    description: 'How difficult the major is',
    value: 3,
    onChangeAction: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all five rating buttons', () => {
    render(<StarRating {...defaultProps} />);

    expect(screen.getAllByRole('button')).toHaveLength(5);
    expect(screen.getByText('Rate the Difficulty')).toBeTruthy();
    expect(screen.getByText('How difficult the major is')).toBeTruthy();
  });

  it('calls onChangeAction with selected rating on click', () => {
    render(<StarRating {...defaultProps} />);

    fireEvent.click(screen.getByLabelText('Rate Difficulty 4 out of 5'));

    expect(defaultProps.onChangeAction).toHaveBeenCalledWith(4);
  });
});
