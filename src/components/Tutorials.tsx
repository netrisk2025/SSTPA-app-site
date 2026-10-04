import { useEffect, useRef, useState } from "react";
import ParticleScene from "./ParticleScene";
import "./Tutorials.css";

type Lesson = {
  slug: string;
  title: string;
  description: string;
  src: string;
  poster: string;
  captions: string;
  durationSeconds: number;
  transcript: string;
};
type Course = {
  slug: string;
  title: string;
  description: string;
  project: string;
  voice: string;
  note?: string;
  lessons: Lesson[];
};
type TutorialManifest = { version: 1; course: Course };
const number = (n: number) => String(n).padStart(2, "0");
const duration = (seconds: number) => {
  const wholeSeconds = Math.round(seconds);
  return `${Math.floor(wholeSeconds / 60)}:${number(wholeSeconds % 60)}`;
};

function isManifest(value: unknown): value is TutorialManifest {
  if (!value || typeof value !== "object") return false;
  const data = value as TutorialManifest;
  return data.version === 1 && !!data.course?.title &&
    Array.isArray(data.course.lessons) && data.course.lessons.length > 0 &&
    data.course.lessons.every((lesson) =>
      [lesson.slug, lesson.title, lesson.description, lesson.src, lesson.poster,
        lesson.captions, lesson.transcript].every((field) => typeof field === "string" && field.trim()) &&
      Number.isFinite(lesson.durationSeconds) && lesson.durationSeconds > 0 && lesson.durationSeconds <= 180);
}

function TutorialCourse({ course }: { course: Course }) {
  const [selected, setSelected] = useState(0);
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [mediaError, setMediaError] = useState(false);
  const [retry, setRetry] = useState(0);
  const video = useRef<HTMLVideoElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const lesson = course.lessons[selected];
  const total = course.lessons.reduce((sum, item) => sum + item.durationSeconds, 0);

  function selectLesson(index: number) {
    video.current?.pause();
    setSelected(index);
    setMediaError(false);
    requestAnimationFrame(() => {
      heading.current?.focus({ preventScroll: true });
      heading.current?.scrollIntoView({ block: "start", behavior: "instant" });
    });
  }

  return (
    <section className="tutorial-course shell" id="loss-tool-course" aria-labelledby="course-title">
      <div className="section-label">
        <span>THE LOSS TOOL / FIRESAT</span>
        <span>01 / SCREEN WALKTHROUGHS</span>
      </div>
      <div className="tutorial-course-intro">
        <div>
          <p className="eyebrow">A GUIDED COURSE</p>
          <h2 id="course-title">{course.title}</h2>
          <p>{course.description}</p>
        </div>
        <div className="tutorial-course-facts" aria-label="Course details">
          <span><strong>{number(course.lessons.length)}</strong> short lessons</span>
          <span><strong>{duration(total)}</strong> total runtime</span>
          <span>English captions & transcripts</span>
        </div>
      </div>
      {course.note && <p className="tutorial-course-note">{course.note}</p>}
      <div className="tutorial-learning-layout">
        <nav className="tutorial-syllabus" aria-label="Course lessons">
          <div className="tutorial-syllabus-heading">
            <span className="eyebrow">YOUR LEARNING SEQUENCE</span>
            <p>{completed.size} of {course.lessons.length} viewed this visit</p>
          </div>
          <ol>
            {course.lessons.map((item, index) => (
              <li key={item.slug}>
                <button
                  type="button"
                  onClick={() => selectLesson(index)}
                  aria-current={index === selected ? "step" : undefined}
                  aria-controls="tutorial-player"
                >
                  <span className="tutorial-lesson-number" aria-hidden="true">{number(index + 1)}</span>
                  <span className="tutorial-lesson-label">
                    <strong>{item.title}</strong>
                    <span>{duration(item.durationSeconds)}{completed.has(item.slug) ? " · Viewed" : ""}</span>
                  </span>
                  <span className="tutorial-lesson-mark" aria-hidden="true">{completed.has(item.slug) ? "✓" : index === selected ? "→" : ""}</span>
                </button>
              </li>
            ))}
          </ol>
        </nav>
        <div className="tutorial-lesson" id="tutorial-player">
          <div className="tutorial-lesson-heading">
            <p className="eyebrow">LESSON {number(selected + 1)} OF {number(course.lessons.length)} · {duration(lesson.durationSeconds)}</p>
            <h3 ref={heading} tabIndex={-1} id="lesson-title">{lesson.title}</h3>
            <p id="lesson-description">{lesson.description}</p>
          </div>
          <div className="tutorial-video-frame">
            <video
              key={`${lesson.slug}-${retry}`}
              ref={video}
              controls
              playsInline
              preload="none"
              poster={lesson.poster}
              aria-labelledby="lesson-title"
              aria-describedby="lesson-description"
              onError={() => setMediaError(true)}
              onPlay={(event) => {
                document.querySelectorAll<HTMLMediaElement>("audio, video").forEach((media) => {
                  if (media !== event.currentTarget) media.pause();
                });
              }}
              onEnded={() => setCompleted((previous) => new Set(previous).add(lesson.slug))}
            >
              <source src={lesson.src} type="video/mp4" />
              <track kind="captions" src={lesson.captions} srcLang="en" label="English" default />
              Your browser does not support this video. Read the transcript below.
            </video>
            <div className="tutorial-player-note">
              <span>{course.project} · {course.voice} narration</span>
              <span>Use the player’s full-screen control for a closer view.</span>
            </div>
          </div>
          {mediaError && (
            <div className="tutorial-media-error" role="status">
              <p>The video could not load. You can read its full transcript below.</p>
              <button type="button" onClick={() => { setMediaError(false); setRetry((value) => value + 1); }}>Retry video</button>
              <a href={lesson.src}>Open video file <span aria-hidden="true">↗</span></a>
            </div>
          )}
          <details className="tutorial-transcript" key={lesson.slug}>
            <summary>Read the lesson transcript <span aria-hidden="true">+</span></summary>
            <div>{lesson.transcript.split(/\n\s*\n/).map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div>
          </details>
          <div className="tutorial-lesson-navigation">
            <button type="button" disabled={selected === 0} onClick={() => selectLesson(selected - 1)}>
              <span aria-hidden="true">←</span> Previous lesson
            </button>
            {selected < course.lessons.length - 1 ? (
              <button type="button" onClick={() => selectLesson(selected + 1)}>
                Next lesson <span aria-hidden="true">→</span>
              </button>
            ) : (
              <a href="/tools/loss">Explore the Loss Tool <span aria-hidden="true">↗</span></a>
            )}
          </div>
          <p className="tutorial-playback-note">Choose each lesson when you’re ready. Playback starts only when you press Play.</p>
        </div>
      </div>
    </section>
  );
}

export default function Tutorials() {
  const [manifest, setManifest] = useState<TutorialManifest | null>(null);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const abort = new AbortController();
    setFailed(false);
    fetch("/media/tutorials.json", { signal: abort.signal })
      .then((response) => {
        if (!response.ok) throw new Error("Tutorials unavailable");
        return response.json();
      })
      .then((data: unknown) => {
        if (!isManifest(data)) throw new Error("Invalid tutorials manifest");
        setManifest(data);
      })
      .catch((error: Error) => { if (error.name !== "AbortError") setFailed(true); });
    return () => abort.abort();
  }, [attempt]);

  return (
    <>
      <section className="tutorial-hero shell">
        <div className="tutorial-hero-copy">
          <p className="eyebrow">SSTPA TOOLS / TUTORIALS</p>
          <h1>Watch the reasoning.<br /><em>Build the tree.</em></h1>
          <p>Learn the Loss Tool through short, narrated screen walkthroughs. Follow FireSat from a scoped protection objective to an attack tree you can inspect and refine.</p>
          <a className="button primary" href="#loss-tool-course">Experience a Tutorial <span aria-hidden="true">↓</span></a>
        </div>
        <div className="tutorial-classroom"><ParticleScene kind="classroom" /></div>
      </section>
      {manifest ? <TutorialCourse course={manifest.course} /> : (
        <section className="tutorial-load-state shell" id="loss-tool-course" aria-live="polite">
          <h2>Loss Tool: <em>Attack Trees</em></h2>
          {failed ? <>
            <p>The lessons could not load. Try again, or explore the Loss Tool guide.</p>
            <button className="button outline" type="button" onClick={() => setAttempt((value) => value + 1)}>Reload lessons</button>
            <a className="text-link" href="/docs/tool-loss.html">Read the Loss Tool guide <span aria-hidden="true">↗</span></a>
          </> : <p role="status">Loading the course…</p>}
        </section>
      )}
      <section className="tutorial-further shell">
        <div>
          <p className="eyebrow">KEEP THE CONTEXT CONNECTED</p>
          <h2>From the example<br />to <em>your analysis.</em></h2>
          <p>Review the method, clarify a term, or keep the Loss Tool guide beside you as you work.</p>
        </div>
        <div className="tutorial-resource-links">
          <a href="/docs/tool-loss.html">Loss Tool documentation <span aria-hidden="true">↗</span></a>
          <a href="/vocabulary">SSTPA vocabulary <span aria-hidden="true">↗</span></a>
          <a href="/methodology">The methodology <span aria-hidden="true">↗</span></a>
        </div>
      </section>
    </>
  );
}
