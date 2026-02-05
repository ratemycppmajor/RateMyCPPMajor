'use client';

import { updateReview } from '@/actions/update-review';
import { createReview } from '@/actions/create-review';
import { AddReviewWithRelations } from '@/types/major';
import Image from 'next/image';
import { useState, useTransition } from 'react';
import StarRating from './StarRating';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

type ReviewData = {
  id: string;
  rating: number;
  comment: string | null;
  careerReadiness: number;
  difficulty: number;
  satisfaction: number;
};

type Props = {
  major: AddReviewWithRelations;
  review?: ReviewData;
};

interface Ratings {
  major: number;
  careerReadiness: number;
  difficulty: number;
  satisfaction: number;
  [key: string]: number;
}

export default function ReviewClient({ major, review }: Props) {
  const [ratings, setRatings]: [
    Ratings,
    React.Dispatch<React.SetStateAction<Ratings>>,
  ] = useState({
    major: review?.rating ?? 0,
    careerReadiness: review?.careerReadiness ?? 0,
    difficulty: review?.difficulty ?? 0,
    satisfaction: review?.satisfaction ?? 0,
  });

  const [reviewText, setReviewText] = useState(review?.comment || '');
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const ratingOptions = [
    {
      name: 'Major',
      key: 'major' as const,
      description: 'Overall rating of the major program',
    },
    {
      name: 'Career Readiness',
      key: 'careerReadiness' as const,
      description: 'How well the major prepares you for your career',
    },
    {
      name: 'Difficulty',
      key: 'difficulty' as const,
      description: 'Academic challenge and workload',
    },
    {
      name: 'Satisfaction',
      key: 'satisfaction',
      description: 'Overall satisfaction with the program',
    },
  ];

  const handleUpdate = () => {
    startTransition(async () => {
      setError(null);

      if (!review) return;

      const result = await updateReview({
        reviewId: review.id,
        reviewText,
        ratings,
      });

      if (result?.error) {
        setError(result.error);
        return;
      }

      router.push(`/majors/${major.slug}/${review.id}`);
    });
  };

  const handleSubmit = () => {
    startTransition(async () => {
      setError(null);

      const result = await createReview({
        slug: major.slug,
        reviewText,
        ratings,
      });

      if (result?.error) {
        setError(result.error);
        return;
      }

      router.push(`/majors/${major.slug}`);
    });
  };

  const handleRatingChange = (key: keyof typeof ratings, value: number) => {
    setRatings((prev) => ({ ...prev, [key]: value }));
  };

  const isFormValid =
    ratings.major > 0 &&
    ratings.careerReadiness > 0 &&
    ratings.difficulty > 0 &&
    ratings.satisfaction > 0 &&
    reviewText.length >= 60;

  return (
    <div>
      {/* Hero */}
      <div className="relative h-[400px] w-full">
        <Image
          id="top"
          src="/images/add_major_banner.jpg"
          fill={true}
          alt="CPP campus"
          loading="eager"
          style={{ objectFit: 'cover' }}
        />
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-black/50 to-black"></div>

        <span className="absolute w-full bottom-6 md:bottom-8 text-white">
          <div className="text-center">
            <div className="w-10/12 mx-auto md:flex flex-col md:items-center space-y-4 justify-center">
              <h1 className="text-2xl md:text-4xl font-bold w-full md:w-10/12 ml-0 mb-0 items-center">
                {major.name}
              </h1>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                <span>{major.department.college.name}</span>
                <span>|</span>
                <span>{major.department.name}</span>
              </div>
            </div>
          </div>
        </span>
      </div>

      {/* Create/Edit review */}
      <section className="mx-auto max-w-7xl px-8 py-8">
        <h2 className="my-6 text-2xl lg:text-3xl font-medium">
          {!review ? 'Write a' : 'Edit'} Review
        </h2>

        <div className="flex flex-col gap-y-10">
          {ratingOptions.map((option) => (
            <StarRating
              key={option.key}
              label={option.name}
              description={option.description}
              value={ratings[option.key]}
              onChangeAction={(value) => handleRatingChange(option.key, value)}
            />
          ))}

          <div className="flex flex-col gap-3 p-6 border rounded-xl bg-card">
            <label className="font-semibold text-xl">Write a review</label>
            <span className="text-primary/80">
              Discuss your thoughts, feelings, or concerns about the major
            </span>
            <Textarea
              placeholder="Share your experience with this major..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              className="min-h-[130px] resize-none md:text-lg text-black"
            />
            <p className="text-muted-foreground text-sm">
              Your message must be at least 60 words.
            </p>
          </div>

          {error && <p className="text-destructive text-sm">{error}</p>}
          <div className="flex justify-center gap-4 pt-4">
            <div className={!isFormValid ? 'cursor-not-allowed' : ''}>
              <Button
                size="lg"
                onClick={!review ? handleSubmit : handleUpdate}
                disabled={!isFormValid || isPending}
                className="min-w-[140px] p-7 text-base cursor-pointer"
              >
                {!review
                  ? isPending
                    ? 'Submitting...'
                    : 'Submit Review'
                  : isPending
                    ? 'Updating...'
                    : 'Update Review'}
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
