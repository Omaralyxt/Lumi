"use client";

import { Star, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Product as ProductType, Review } from "@/types/product";

interface ProductReviewsProps {
  reviews: Review[];
  rating: number;
  reviewCount: number;
}

export function ProductReviews({ reviews, rating, reviewCount }: ProductReviewsProps) {
  // Mock de distribuição de avaliações (em um app real, isso viria da API)
  const ratingDistribution = [
    { stars: 5, percentage: 78 },
    { stars: 4, percentage: 15 },
    { stars: 3, percentage: 4 },
    { stars: 2, percentage: 2 },
    { stars: 1, percentage: 1 },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm dark:border dark:border-gray-700">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Avaliações dos Clientes</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Rating Summary */}
        <div className="text-center">
          <div className="text-5xl text-gray-900 dark:text-white mb-2">{rating.toFixed(1)}</div>
          <div className="flex items-center justify-center gap-1 mb-2 text-yellow-500">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 ${
                  i < Math.round(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Baseado em {reviewCount.toLocaleString('pt-MZ')} avaliações</p>
          <Button variant="outline" className="mt-4 dark:border-gray-700 dark:hover:bg-gray-700">
            Escrever uma avaliação
          </Button>
        </div>

        {/* Rating Distribution */}
        <div className="lg:col-span-2 space-y-3">
          {ratingDistribution.map((item) => (
            <div key={item.stars} className="flex items-center gap-3">
              <div className="flex items-center gap-1 w-20 text-gray-600 dark:text-gray-400">
                <span className="text-sm">{item.stars}</span>
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              </div>
              <Progress value={item.percentage} className="flex-1" />
              <span className="text-sm text-gray-600 dark:text-gray-400 w-12 text-right">{item.percentage}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-6 border-t pt-6 dark:border-gray-700">
        {reviews.length > 0 ? (
          reviews.slice(0, 3).map((review) => (
            <div key={review.id} className="border-b pb-6 last:border-b-0 dark:border-gray-700">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-gray-900 dark:text-white font-medium">{review.author}</span>
                    <span className="text-sm text-gray-500">{review.date}</span>
                  </div>
                  <div className="flex items-center gap-1 text-yellow-500">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-2">{review.comment}</h4>
              <button className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors">
                <ThumbsUp className="w-4 h-4" />
                <span>Útil (0)</span> {/* Mocked helpful count */}
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-center">Seja o primeiro a avaliar este produto!</p>
        )}
      </div>

      {reviews.length > 3 && (
        <div className="text-center mt-6">
          <Button variant="outline" className="dark:border-gray-700 dark:hover:bg-gray-700">Ver todas as avaliações</Button>
        </div>
      )}
    </div>
  );
}