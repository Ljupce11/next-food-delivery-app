import { StarIcon } from "@heroicons/react/24/solid";

const STARS = [1, 2, 3, 4, 5];

type Props = {
  rating: number | string;
};

export default function RatingStars({ rating }: Props) {
  const value = Number(rating);
  return (
    <div
      role="img"
      aria-label={`Rated ${value} out of 5`}
      className="flex items-center"
    >
      {STARS.map((star) => {
        const fill = Math.min(Math.max(value - star + 1, 0), 1);
        return (
          <span key={star} className="relative size-4">
            <StarIcon className="size-4 text-default-300" />
            <span
              className="absolute top-0 left-0 h-full overflow-hidden"
              style={{ width: `${fill * 100}%` }}
            >
              <StarIcon className="size-4 max-w-none text-yellow-400" />
            </span>
          </span>
        );
      })}
    </div>
  );
}
