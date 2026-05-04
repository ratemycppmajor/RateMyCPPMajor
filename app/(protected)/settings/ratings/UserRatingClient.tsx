import ReviewList from '@/components/review/ReviewList';

type Review = {
  id: string;
  academicClass: string;
  rating: number;
  careerReadiness: number;
  difficulty: number;
  satisfaction: number;
  comment: string | null;
  createdAt: Date;
  userId: string;
  likes: { id: string }[];
  _count: { likes: number };
  major: {
    slug: string;
    name: string;
  };
};

type Props = {
  reviews: Review[];
};

export default function UserRatingClient({ reviews }: Props) {
  return (
    <div className="mx-auto max-w-7xl px-8 py-8 text-primary">
      {reviews.length === 0 ? (
        <p className="text-muted-foreground">No reviews yet.</p>
      ) : (
        <>
          <div className="text-sm mt-4">
            <span className="text-lg lg:text-xl font-semibold">
              {reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'}
            </span>
            <hr className="border-black/30 mt-3" />
          </div>

          <ReviewList
            reviews={reviews.map((review) => ({
              ...review,
              likeCount: review._count.likes,
              likedByMe: review.likes.length > 0,
              majorSlug: review.major.slug,
              majorName: review.major.name,
            }))}
          />
        </>
      )}
    </div>
  );
}
