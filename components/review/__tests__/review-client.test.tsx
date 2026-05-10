import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import ReviewClient from '@/components/review/ReviewClient';

const mockPush = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: { alt?: string; src?: string }) => (
    <img alt={props.alt ?? ''} src={props.src ?? ''} />
  ),
}));

const mockCreateReview = jest.fn();
jest.mock('@/actions/create-review', () => ({
  createReview: (...args: unknown[]) => mockCreateReview(...args),
}));

jest.mock('@/actions/update-review', () => ({
  updateReview: jest.fn(),
}));

const major = {
  name: 'Computer Science',
  slug: 'computer-science',
  department: {
    name: 'Computer Science Department',
    college: { name: 'College of Engineering' },
  },
};

describe('ReviewClient', () => {
  beforeEach(() => {
    mockPush.mockClear();
    mockCreateReview.mockReset();
  });

  it('shows create copy when no existing review is passed', () => {
    render(<ReviewClient major={major} />);

    expect(screen.getByRole('heading', { name: 'Write a Review' })).toBeTruthy();
    expect(
      screen.getByRole('button', { name: 'Submit Review' }),
    ).toBeTruthy();
  });

  it('disables submit until the form is valid', () => {
    render(<ReviewClient major={major} />);

    const submit = screen.getByRole('button', { name: 'Submit Review' });
    expect((submit as HTMLButtonElement).disabled).toBe(true);
  });

  it('submits when required fields are filled', async () => {
    mockCreateReview.mockResolvedValue({ success: true });

    render(<ReviewClient major={major} />);

    fireEvent.change(screen.getByLabelText('Select class standing'), {
      target: { value: 'junior' },
    });

    fireEvent.click(screen.getByLabelText('Rate Major 5 out of 5'));
    fireEvent.click(screen.getByLabelText('Rate Career Readiness 5 out of 5'));
    fireEvent.click(screen.getByLabelText('Rate Difficulty 4 out of 5'));
    fireEvent.click(screen.getByLabelText('Rate Satisfaction 5 out of 5'));

    const longComment = 'word '.repeat(20).trim();
    fireEvent.change(
      screen.getByPlaceholderText('Share your experience with this major...'),
      { target: { value: longComment } },
    );

    const submit = screen.getByRole('button', { name: 'Submit Review' });
    expect((submit as HTMLButtonElement).disabled).toBe(false);

    fireEvent.click(submit);

    await waitFor(() => {
      expect(mockCreateReview).toHaveBeenCalledWith(
        expect.objectContaining({
          slug: 'computer-science',
          academicClass: 'junior',
          reviewText: longComment,
          ratings: {
            major: 5,
            careerReadiness: 5,
            difficulty: 4,
            satisfaction: 5,
          },
        }),
      );
    });

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/majors/computer-science');
    });
  });

  it('shows edit copy when a review is provided', () => {
    const review = {
      id: 'rev-1',
      academicClass: 'senior' as const,
      rating: 4,
      comment: 'Existing thoughts',
      careerReadiness: 4,
      difficulty: 3,
      satisfaction: 5,
    };

    render(<ReviewClient major={major} review={review} />);

    expect(screen.getByRole('heading', { name: 'Edit Review' })).toBeTruthy();
    expect(
      screen.getByRole('button', { name: 'Update Review' }),
    ).toBeTruthy();
  });
});
