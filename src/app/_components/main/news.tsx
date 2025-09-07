"use client";

import { Card, CardContent } from "~/app/ui/card";

export type NewsItem = {
  id: string;
  title: string;
  summary: string;
  date: string; // ISO дата
  image?: string;
};

export type NewsProps = {
  news: NewsItem[];
};

export default function News({ news }: NewsProps) {





  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="flex flex-col items-center gap-8 p-8 bg-gray-900 text-white">
      <h2 className="text-3xl font-bold mb-4 text-center">Новости</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl">
        {news.map((item) => (
          <Card
            key={item.id}
            className="!bg-gray-800 border border-gray-700 hover:scale-105 transition-transform duration-300"
          >
            <CardContent className="flex flex-col gap-3">
              {item.image && (
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-40 object-cover rounded-lg"
                />
              )}
              <h3 className="text-lg font-semibold text-white">{item.title}</h3>
              <p className="text-gray-300 text-sm">{item.summary}</p>
              <p className="text-gray-500 text-xs">{formatDate(item.date)}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}