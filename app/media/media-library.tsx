"use client";

import { useMemo, useState } from "react";
import { mediaPodcasts, mediaVideos } from "../content";

const DEFAULT_VIDEO_COUNT = 3;
const DEFAULT_PODCAST_COUNT = 3;

export function MediaLibrary() {
  const [showAllVideos, setShowAllVideos] = useState(false);
  const [showAllPodcasts, setShowAllPodcasts] = useState(false);

  const sortedVideos = useMemo(
    () =>
      mediaVideos.toSorted(
        (videoA, videoB) =>
          Date.parse(videoB.publishedAt) - Date.parse(videoA.publishedAt),
      ),
    [],
  );
  const sortedPodcasts = useMemo(
    () =>
      mediaPodcasts.toSorted(
        (podcastA, podcastB) =>
          Date.parse(podcastB.publishedAt) - Date.parse(podcastA.publishedAt),
      ),
    [],
  );

  const visibleVideos = showAllVideos
    ? sortedVideos
    : sortedVideos.slice(0, DEFAULT_VIDEO_COUNT);
  const visiblePodcasts = showAllPodcasts
    ? sortedPodcasts
    : sortedPodcasts.slice(0, DEFAULT_PODCAST_COUNT);

  return (
    <div className="media-library">
      <section className="media-library-section" aria-labelledby="video-heading">
        <header className="media-library-heading">
          <div>
            <p className="eyebrow">VIDEOS</p>
            <h2 id="video-heading">视频</h2>
          </div>
        </header>

        <div className="media-video-grid">
          {visibleVideos.map((video) => (
            <article className="media-video-card" key={video.title}>
              <div
                className={`media-video-cover media-video-cover-${video.visual}`}
                aria-hidden="true"
              >
                <span>BILIBILI</span>
                <i>▶</i>
              </div>
              <div className="media-video-copy">
                <div>
                  <span>{video.series}</span>
                  <time dateTime={video.publishedAt}>
                    {video.publishedAt.replaceAll("-", ".")}
                  </time>
                </div>
                <h3>{video.title}</h3>
                {video.href ? (
                  <a href={video.href} rel="noreferrer" target="_blank">
                    前往 B 站观看 ↗
                  </a>
                ) : (
                  <span className="media-link-pending">B 站链接待接入</span>
                )}
              </div>
            </article>
          ))}
        </div>

        {sortedVideos.length > DEFAULT_VIDEO_COUNT ? (
          <button
            aria-expanded={showAllVideos}
            className="media-expand-button"
            onClick={() => setShowAllVideos((isExpanded) => !isExpanded)}
            type="button"
          >
            {showAllVideos ? "向上收起 ↑" : "更多视频内容 ↓"}
          </button>
        ) : null}
      </section>

      <section className="media-library-section" aria-labelledby="podcast-heading">
        <header className="media-library-heading">
          <div>
            <p className="eyebrow">PODCAST</p>
            <h2 id="podcast-heading">播客</h2>
          </div>
        </header>

        <div className="media-podcast-list">
          {visiblePodcasts.map((podcast) => (
            <article className="media-podcast-card" key={podcast.episode}>
              <div className="media-podcast-index">
                <span>XIAOYUZHOU</span>
                <strong>{podcast.episode}</strong>
              </div>
              <div className="media-podcast-copy">
                <div>
                  <span>北雍声场</span>
                  <time dateTime={podcast.publishedAt}>
                    {podcast.publishedAt.replaceAll("-", ".")}
                  </time>
                </div>
                <h3>{podcast.title}</h3>
                <p>{podcast.summary}</p>
              </div>
              <div className="media-podcast-action">
                {podcast.href ? (
                  <a href={podcast.href} rel="noreferrer" target="_blank">
                    前往小宇宙收听 ↗
                  </a>
                ) : (
                  <span className="media-link-pending">小宇宙链接待接入</span>
                )}
              </div>
            </article>
          ))}
        </div>

        {sortedPodcasts.length > DEFAULT_PODCAST_COUNT ? (
          <button
            aria-expanded={showAllPodcasts}
            className="media-expand-button"
            onClick={() => setShowAllPodcasts((isExpanded) => !isExpanded)}
            type="button"
          >
            {showAllPodcasts ? "向上收起 ↑" : "更多播客内容 ↓"}
          </button>
        ) : null}
      </section>
    </div>
  );
}
