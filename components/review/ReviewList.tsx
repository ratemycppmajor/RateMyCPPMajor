'use client'

import { useEffect, useMemo, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Star, ThumbsUp, Trash, Pencil } from "lucide-react"
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { deleteReview } from '@/actions/delete-review'
import { likeReview } from '@/actions/like-review'

type Review = {
  id: string
  rating: number
  careerReadiness: number
  difficulty: number
  satisfaction: number
  comment: string | null
  createdAt: Date | string 
  userId: string
  majorSlug: string 
  majorName: string
  likeCount?: number
  likedByMe?: boolean
}

type Props = {
  reviews: Review[]
  showLoadMore?: boolean 
  initialVisibleCount?: number 
}

export default function ReviewList({ 
  reviews, 
  showLoadMore = true,
  initialVisibleCount = 5 
}: Props) {
  const [isDeleting, startDeleteTransition] = useTransition()
  const [isLiking, startLikeTransition] = useTransition()
  const router = useRouter()
  const { data: session } = useSession()
  const currentUserId = session?.user?.id
  const pathname = usePathname();

  const isSettings = pathname === "/settings/ratings";

  const REVIEWS_PER_VIEW = 5
  const [visibleCount, setVisibleCount] = useState(initialVisibleCount)

  const initialLikeState = useMemo(() => {
    const map = new Map<string, { liked: boolean; count: number }>()

    for (const r of reviews) {
      map.set(r.id, {
        liked: !!r.likedByMe,
        count: r.likeCount ?? 0,
      })
    }

    return map
  }, [reviews])

  const [likeState, setLikeState] = useState<Map<string, { liked: boolean; count: number }>>(initialLikeState)

  useEffect(() => {
    setLikeState(initialLikeState)
  }, [initialLikeState])

  const handleReviewDeletion = (reviewId: string) => {
    startDeleteTransition(async () => {
      await deleteReview(reviewId)
      router.refresh()
    })
  }

  const handleLike = (reviewId: string) => {
    if (!currentUserId) {
      router.push("/login")
      return
    }

    const prev = likeState.get(reviewId) ?? { liked: false, count: 0 }
    const optimistic = {
      liked: !prev.liked,
      count: Math.max(0, prev.count + (prev.liked ? -1 : 1)),
    }

    setLikeState((m) => {
      const next = new Map(m)
      next.set(reviewId, optimistic)
      return next
    })

    startLikeTransition(async () => {
      const result = await likeReview(reviewId)

      if (result?.error) {
        setLikeState((m) => {
          const next = new Map(m)
          next.set(reviewId, prev)
          return next
        })
        return
      }

      router.refresh()
    })
  }

  const visibleReviews = reviews.slice(0, visibleCount)
  const hasMore = visibleCount < reviews.length

  return (
    <div>
      <ul>
        {visibleReviews.map((review) => (
          <li key={review.id} className="py-4 border-b border-black/30 flex flex-col gap-y-6 text-primary">
            <div className='flex justify-between'>
              <div className="flex items-center gap-0.5">
                {Array.from({ length: review.rating }).map((_, i) => {
                  return (
                    <Star
                      key={i}
                      className={`lg:h-8 lg:w-8 h-6 w-6 fill-amber-400 text-amber-400`}
                    />
                  )
                })}
              </div>
              <span className="font-semibold">
                {typeof review.createdAt === 'string' 
                  ? new Date(review.createdAt).toLocaleDateString()
                  : review.createdAt.toLocaleDateString()}
              </span>
            </div>
            {isSettings && <Link href={`/majors/${review.majorSlug}`} className="hover:underline">{review.majorName}</Link>}

            <ul className='flex gap-2 lg:gap-8 text-black flex-wrap'>
              <li className='border rounded-2xl p-1.5 bg-zinc-50 text-sm'>
                Career Readiness: {" "}
                <span className="font-semibold text-primary">{review.careerReadiness}</span>
              </li>
              <li className='border rounded-2xl p-1.5 bg-zinc-50 text-sm'>
                Difficulty: {" "}
                <span className="font-semibold text-primary">{review.difficulty}</span>
              </li>
              <li className='border rounded-2xl p-1.5 bg-zinc-50 text-sm'>
                Satisfaction: {" "}
                <span className="font-semibold text-primary">{review.satisfaction}</span>
              </li>
            </ul>

            <p className="my-3 text-black wrap-break-word">{review.comment}</p>

            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={() => handleLike(review.id)}
                disabled={isLiking}
                className="flex items-center gap-2 cursor-pointer"
                aria-label={likeState.get(review.id)?.liked ? "Unlike review" : "Like review"}
              >
                <ThumbsUp
                  className={`h-5 w-5 transition-colors ${
                    likeState.get(review.id)?.liked ? "text-primary" : "text-black/70 hover:text-primary/80"
                  }`}
                  fill={likeState.get(review.id)?.liked ? "currentColor" : "none"}
                />
                <span className="text-sm font-semibold">
                  {likeState.get(review.id)?.count ?? 0}
                </span>
              </button>

              {review.userId === currentUserId && (
                <div className="flex gap-x-3">
                  {/* Edit review */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link href={`/edit/${review.majorSlug}/${review.id}`}>
                        <Pencil
                          className="cursor-pointer hover:text-primary/80"
                          aria-label="Edit review"
                        />
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <p>Edit review</p>
                    </TooltipContent>
                  </Tooltip>
                  {/* Delete review */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <button aria-label="Delete review">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Trash
                              className="text-red-700 h-6 w-6 transition-all duration-300 ease-in-out hover:text-destructive cursor-pointer"
                            />
                          </TooltipTrigger>
                          <TooltipContent side="bottom">
                            <p>Delete review</p>
                          </TooltipContent>
                        </Tooltip>
                      </button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle className="text-primary">Delete Review</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to delete your review? This action cannot be undone.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button className="cursor-pointer" variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button
                          className="cursor-pointer bg-red-700 transition-all duration-300 ease-in-out"
                          onClick={() => handleReviewDeletion(review.id)}
                          type="button"
                          variant="destructive"
                          disabled={isDeleting}
                          aria-label="Delete review"
                        >
                          {isDeleting ? "Deleting..." : "Delete Review"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>

      {showLoadMore && hasMore && (
        <div className="mt-8 flex justify-center">
          <Button
            size="lg"
            onClick={() => setVisibleCount((prev) => prev + REVIEWS_PER_VIEW)}
            className="px-11 py-7 rounded-full bg-primary text-primary-foreground font-semibold transition-all duration-300 ease-in-out hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 cursor-pointer"
            aria-label="Load more reviews"
          >
            Load more reviews
          </Button>
        </div>
      )}
    </div>
  )
}

