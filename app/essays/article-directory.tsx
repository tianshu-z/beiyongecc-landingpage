"use client";

import { useMemo, useState } from "react";
import { articleThemes, editorial } from "../content";

export function ArticleDirectory() {
  const [activeTheme, setActiveTheme] = useState<string | null>(null);

  const visibleArticles = useMemo(
    () =>
      editorial
        .filter((article) => !activeTheme || article.category === activeTheme)
        .toSorted(
          (articleA, articleB) =>
            Date.parse(articleB.publishedAt) - Date.parse(articleA.publishedAt),
        ),
    [activeTheme],
  );

  return (
    <div className="article-directory">
      <div className="article-filters" aria-label="按主题筛选文章">
        {articleThemes.map((theme) => {
          const isActive = activeTheme === theme;

          return (
            <button
              aria-pressed={isActive}
              className={isActive ? "is-active" : undefined}
              key={theme}
              onClick={() => setActiveTheme(isActive ? null : theme)}
              type="button"
            >
              {theme}
            </button>
          );
        })}
      </div>

      <div className="article-list" aria-live="polite">
        {visibleArticles.map((article) => (
          <article
            className={`article-card article-list-card ${article.className}`}
            key={article.title}
          >
            <div className="article-cover" aria-hidden="true">
              <span>{article.category}</span>
            </div>
            <div className="article-body">
              <div>
                <span className="article-category">{article.category}</span>
                <time className="article-date" dateTime={article.publishedAt}>
                  {article.publishedAt.replaceAll("-", ".")}
                </time>
              </div>
              <h3>{article.title}</h3>
              <p>{article.excerpt}</p>
              <button type="button" aria-label={`${article.title}，链接待接入`}>
                阅读文章 <span>↗</span>
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
