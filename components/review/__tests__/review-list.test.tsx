import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import ReviewList from '@/components/review/ReviewList';
import { likeReview } from '@/actions/like-review';
import { useCurrentUser } from '@/hooks/use-current-user';

const mockPush = jest.fn();
const mockRefresh = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    refresh: mockRefresh,
  }),
  usePathname: () => '/majors/computer-science',
}));

jest.mock('@/hooks/use-current-user', () => ({
  useCurrentUser: jest.fn(),
}));

jest.mock('@/actions/like-review', () => ({
  likeReview: jest.fn(),
}));

jest.mock('@/actions/delete-review', () => ({
  deleteReview: jest.fn(),
}));

const mockUseCurrentUser = useCurrentUser as jest.MockedFunction<
  typeof useCurrentUser
>;
const mockLikeReview = likeReview as jest.MockedFunction<typeof likeReview>;

function makeReview(overrides: Record<string, unknown> = {}) {
  return {
    id: 'review-1',
    academicClass: 'junior',
    rating: 4,
    careerReadiness: 4,
    difficulty: 3,
    satisfaction: 5,
    comment: 'Solid program overall.',
    createdAt: '2024-06-01',
    userId: 'user-1',
    majorSlug: 'computer-science',
    majorName: 'Computer Science',
    likeCount: 1,
    likedByMe: false,
    ...overrides,
  };
}

describe('ReviewList', () => {
  beforeEach(() => {
    mockPush.mockClear();
    mockRefresh.mockClear();
    mockLikeReview.mockReset();
    mockUseCurrentUser.mockReset();
  });

  it('renders review content', () => {
    mockUseCurrentUser.mockReturnValue({
      user: undefined,
      status: 'unauthenticated',
    });

    render(<ReviewList reviews={[makeReview()]} />);

    expect(screen.getByText('Solid program overall.')).toBeTruthy();
    expect(screen.getByText('1')).toBeTruthy();
  });

  it('redirects to login when liking without a session', () => {
    mockUseCurrentUser.mockReturnValue({
      user: undefined,
      status: 'unauthenticated',
    });

    render(<ReviewList reviews={[makeReview()]} />);

    fireEvent.click(screen.getByLabelText('Like review'));

    expect(mockPush).toHaveBeenCalledWith('/login');
    expect(mockLikeReview).not.toHaveBeenCalled();
  });

  it('calls likeReview when a user is signed in', async () => {
    mockUseCurrentUser.mockReturnValue({
      user: { id: 'user-2', name: 'Test' },
      status: 'authenticated',
    });
    mockLikeReview.mockResolvedValue({ liked: true });

    render(<ReviewList reviews={[makeReview()]} />);

    fireEvent.click(screen.getByLabelText('Like review'));

    await waitFor(() => {
      expect(mockLikeReview).toHaveBeenCalledWith('review-1');
    });
  });

  it('shows load more when there are additional reviews', () => {
    mockUseCurrentUser.mockReturnValue({
      user: undefined,
      status: 'unauthenticated',
    });

    const reviews = Array.from({ length: 6 }, (_, i) =>
      makeReview({ id: `r-${i}`, comment: `Comment ${i}` }),
    );

    render(<ReviewList reviews={reviews} initialVisibleCount={5} />);

    expect(screen.getByLabelText('Load more reviews')).toBeTruthy();
    expect(screen.queryByText('Comment 5')).toBeNull();

    fireEvent.click(screen.getByLabelText('Load more reviews'));

    expect(screen.getByText('Comment 5')).toBeTruthy();
  });
});
