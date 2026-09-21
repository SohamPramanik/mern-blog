import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  Check,
  Heart,
  MessageCircle,
  PenLine,
  Play,
  Search,
  Sparkles,
  Image as ImageIcon,
} from "lucide-react";
import "./Home.css";

/* =========================================================
   DATA
   Every moment carries a "mood". A mood is a colour, and a
   journey is the thread those colours make over time.
   ========================================================= */

const MOODS = {
  joyful: {
    label: "Joyful",
    color: "#E3A008",
    tint: "#FBF1D3",
    ink: "#6B4A00",
  },
  proud: { label: "Proud", color: "#2A9461", tint: "#D9F0E3", ink: "#14583A" },
  calm: { label: "Calm", color: "#3B82B4", tint: "#DCEAF5", ink: "#1D4C70" },
  wistful: {
    label: "Wistful",
    color: "#7E62B5",
    tint: "#E7DFF3",
    ink: "#4A3577",
  },
  heavy: { label: "Heavy", color: "#C4503A", tint: "#F8E0DA", ink: "#84301F" },
};

const moodVars = (key) => ({
  "--mood": MOODS[key].color,
  "--mood-tint": MOODS[key].tint,
  "--mood-ink": MOODS[key].ink,
});

const DEMO_MOMENTS = [
  {
    date: "08 May 2024",
    title: "The day everything changed.",
    body: "The phone rang at 6 a.m. I sat on the kitchen floor for ten minutes, laughing at nothing.",
    mood: "joyful",
    journey: "A Year of Firsts",
  },
  {
    date: "17 Aug 2025",
    title: "A journey worth remembering.",
    body: "Eleven hours on the trail. My knees hate me, but the view from the top paid for every step.",
    mood: "proud",
    journey: "Trail Notes",
  },
  {
    date: "Today",
    title: "Still writing the story\u2026",
    body: "Nothing big happened. Tea, rain on the window, and the feeling that I'm somewhere I'm meant to be.",
    mood: "calm",
    journey: null,
  },
];

const STORY = [
  {
    id: "first-day",
    date: "12 Aug 2023",
    title: "The first day didn\u2019t feel real.",
    mood: "wistful",
    photo: false,
    likes: 86,
    comments: 12,
    body: [
      "New campus. New people. A completely different chapter of life was beginning, and I kept waiting for someone to tell me I\u2019d walked into the wrong building.",
      "I called home from the hostel stairwell that night and said everything was fine. It mostly was.",
    ],
  },
  {
    id: "lunch",
    date: "03 Nov 2023",
    title: "Someone saved me a seat at lunch.",
    mood: "joyful",
    photo: false,
    likes: 132,
    comments: 19,
    body: [
      "It wasn\u2019t a big thing. Three people I\u2019d met a week earlier waved me over, and I realised I had stopped counting the days until the holidays.",
      "Funny how belonging arrives quietly.",
    ],
  },
  {
    id: "build",
    date: "27 Jan 2024",
    title: "I finally built something I was proud of.",
    mood: "proud",
    photo: true,
    likes: 214,
    comments: 31,
    body: [
      "Months of learning, breaking things and trying again. Somehow, it started making sense.",
      "When the last test turned green I didn\u2019t cheer. I just sat there grinning at the screen.",
    ],
  },
  {
    id: "almost-quit",
    date: "09 Jun 2025",
    title: "The semester I almost quit.",
    mood: "heavy",
    photo: false,
    likes: 301,
    comments: 64,
    body: [
      "I failed two exams in a row and told nobody. For a month I walked to class like it was someone else\u2019s life.",
      "Writing this down is the first time I\u2019ve said it out loud.",
    ],
  },
  {
    id: "today",
    date: "18 Sep 2026",
    title: "I\u2019m still figuring it all out.",
    mood: "calm",
    photo: false,
    likes: 178,
    comments: 27,
    body: [
      "Maybe that\u2019s the point. The story isn\u2019t finished yet.",
      "Reading the first entry again, I barely recognise that kid. I\u2019d like to tell him it works out. Mostly.",
    ],
  },
];

const STORY_GRADIENT = `linear-gradient(90deg, ${STORY.map(
  (s) => MOODS[s.mood].color,
).join(", ")})`;

const EXPLORE = [
  {
    id: "titles",
    label: "Titles",
    rows: [
      {
        primary: "Learning to cook after moving abroad",
        secondary: "Sana, 6 min read",
        mood: "joyful",
      },
      {
        primary: "The first day didn\u2019t feel real",
        secondary: "Arjun, in My College Journey",
        mood: "wistful",
      },
      {
        primary: "What my father\u2019s workshop taught me",
        secondary: "Ravi, 4 min read",
        mood: "calm",
      },
    ],
  },
  {
    id: "content",
    label: "Content",
    rows: [
      {
        primary:
          "\u201CThe rain hadn\u2019t stopped for three days, and I finally understood why she loved this town.\u201D",
        secondary: "Monsoon in Kochi, by Nisha",
        mood: "calm",
      },
      {
        primary:
          "\u201CI ran four kilometres and cried at the end of the road.\u201D",
        secondary: "Twelve Months of Running, by Meera",
        mood: "proud",
      },
    ],
  },
  {
    id: "people",
    label: "People",
    rows: [
      {
        primary: "Sana Iyer",
        secondary: "3 journeys, 41 moments",
        mood: "joyful",
        avatar: true,
      },
      {
        primary: "Ravi Menon",
        secondary: "2 journeys, 27 moments",
        mood: "calm",
        avatar: true,
      },
      {
        primary: "Meera Das",
        secondary: "1 journey, 12 moments",
        mood: "proud",
        avatar: true,
      },
    ],
  },
  {
    id: "journeys",
    label: "Journeys",
    rows: [
      {
        primary: "My College Journey",
        secondary: "5 moments, by Arjun",
        mood: "wistful",
      },
      {
        primary: "Twelve Months of Running",
        secondary: "12 moments, by Meera",
        mood: "proud",
      },
      { primary: "The Move", secondary: "8 moments, by Sana", mood: "heavy" },
    ],
  },
];

/* =========================================================
   SMALL PIECES
   ========================================================= */

function usePrefersReducedMotion() {
  const query = "(prefers-reduced-motion: reduce)";
  const [reduced, setReduced] = useState(
    () => typeof window !== "undefined" && !!window.matchMedia?.(query).matches,
  );

  useEffect(() => {
    if (!window.matchMedia) return undefined;
    const mq = window.matchMedia(query);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  return reduced;
}

function Mood({ id, label, icon }) {
  return (
    <span className="hm-mood" style={moodVars(id)}>
      {icon ?? <i aria-hidden="true" />}
      {label ?? MOODS[id].label}
    </span>
  );
}

/* =========================================================
   HERO: a live "write a moment" demo
   ========================================================= */

function HeroComposer() {
  const reduced = usePrefersReducedMotion();
  const [index, setIndex] = useState(0);
  const [typed, setTyped] = useState(0);
  const [manual, setManual] = useState(false);

  const m = DEMO_MOMENTS[index];
  const still = manual || reduced;
  const shown = still ? m.body : m.body.slice(0, typed);
  const understood = still || typed >= m.body.length;

  useEffect(() => {
    if (still) return undefined;

    if (typed < m.body.length) {
      const id = setTimeout(() => setTyped((n) => n + 1), 32);
      return () => clearTimeout(id);
    }

    const id = setTimeout(() => {
      setIndex((i) => (i + 1) % DEMO_MOMENTS.length);
      setTyped(0);
    }, 3600);
    return () => clearTimeout(id);
  }, [typed, index, still, m.body.length]);

  const pick = (i) => {
    setIndex(i);
    setManual(true);
  };

  return (
    <div
      className="hm-composer"
      style={moodVars(m.mood)}
      role="group"
      aria-label="Preview of writing a moment"
    >
      <div className="hm-composer-bar">
        <span className="hm-composer-status">
          <PenLine size={14} aria-hidden="true" />
          New moment
        </span>
        <span className="hm-composer-where">
          {m.journey ? (
            <>
              <BookOpen size={13} aria-hidden="true" />
              {m.journey}
            </>
          ) : (
            "Standalone moment"
          )}
        </span>
      </div>

      <div className="hm-composer-main">
        <p className="hm-composer-date">{m.date}</p>
        <p className="hm-composer-title">{m.title}</p>

        <p className="hm-composer-text">
          <span className="hm-sr-only">{m.body}</span>
          <span aria-hidden="true">{shown}</span>
          {!understood && <span className="hm-caret" aria-hidden="true" />}
        </p>

        <div
          className={`hm-composer-read${understood ? " is-on" : ""}`}
          aria-hidden={!understood}
        >
          <Mood
            id={m.mood}
            label={`Feels ${MOODS[m.mood].label.toLowerCase()}`}
            icon={<Sparkles size={13} aria-hidden="true" />}
          />
          <span className="hm-composer-safe">
            <Check size={13} aria-hidden="true" />
            Your words, untouched
          </span>
        </div>
      </div>

      <ol className="hm-thread" aria-label="Moments in this preview">
        {DEMO_MOMENTS.map((d, i) => {
          const next = DEMO_MOMENTS[i + 1];
          return (
            <li
              key={d.date}
              className={i < index ? "is-past" : undefined}
              style={{
                ...moodVars(d.mood),
                "--next": MOODS[(next ?? d).mood].color,
              }}
            >
              <button
                type="button"
                className={`hm-thread-node${i === index ? " is-active" : ""}`}
                onClick={() => pick(i)}
                aria-label={`Show the moment from ${d.date}`}
                aria-current={i === index ? "true" : undefined}
              >
                <span className="hm-thread-dot" />
                <span className="hm-thread-date">{d.date}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/* =========================================================
   STORY: an interactive journey reader
   ========================================================= */

function StoryReader() {
  const [active, setActive] = useState(0);
  const s = STORY[active];

  return (
    <div className="hm-story-grid">
      <ol className="hm-tl" aria-label="Moments in My College Journey">
        {STORY.map((item, i) => {
          const next = STORY[i + 1] ?? item;
          return (
            <li
              key={item.id}
              className={`hm-tl-item${i === active ? " is-active" : ""}`}
              style={{
                ...moodVars(item.mood),
                "--next": MOODS[next.mood].color,
              }}
            >
              <span className="hm-tl-dot" aria-hidden="true" />
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-current={i === active ? "true" : undefined}
              >
                <span className="hm-tl-body">
                  <span className="hm-tl-date">{item.date}</span>
                  <span className="hm-tl-title">{item.title}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      <div className="hm-reader-wrap" aria-live="polite">
        <article key={s.id} className="hm-reader" style={moodVars(s.mood)}>
          <div className="hm-reader-meta">
            <Mood id={s.mood} />
            <span>
              Moment {active + 1} of {STORY.length}
            </span>
          </div>

          <h3>{s.title}</h3>
          <p className="hm-reader-date">{s.date}</p>

          {s.photo && (
            <div
              className="hm-scene hm-reader-photo"
              role="img"
              aria-label="Sample photo attached to this moment"
            />
          )}

          <div className="hm-reader-text">
            {s.body.map((para) => (
              <p key={para}>{para}</p>
            ))}
          </div>

          <div className="hm-reader-foot">
            <span>
              <Heart size={15} aria-hidden="true" />
              {s.likes}
            </span>
            <span>
              <MessageCircle size={15} aria-hidden="true" />
              {s.comments}
            </span>
            <Link to="/blogs">
              Explore more journeys
              <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>
        </article>
      </div>
    </div>
  );
}

/* =========================================================
   EXPLORE: search demo
   ========================================================= */

function ExplorePanel() {
  const [tab, setTab] = useState("titles");
  const current = EXPLORE.find((t) => t.id === tab);

  return (
    <div className="hm-explore">
      <Link to="/blogs" className="hm-explore-search">
        <Search size={18} aria-hidden="true" />
        <span>Search stories, people or journeys</span>
      </Link>

      <div className="hm-explore-tabs" role="group" aria-label="Search by">
        <span className="hm-explore-label">Search by</span>
        {EXPLORE.map((t) => (
          <button
            key={t.id}
            type="button"
            aria-pressed={t.id === tab}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <ul className="hm-explore-rows" aria-live="polite">
        {current.rows.map((r) => (
          <li key={r.primary}>
            <Link to="/blogs">
              {r.avatar ? (
                <span
                  className="hm-avatar"
                  style={moodVars(r.mood)}
                  aria-hidden="true"
                >
                  {r.primary[0]}
                </span>
              ) : (
                <span
                  className="hm-row-dot"
                  style={moodVars(r.mood)}
                  aria-hidden="true"
                />
              )}
              <span className="hm-row-text">
                <span className="hm-row-primary">{r.primary}</span>
                <span className="hm-row-secondary">{r.secondary}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* =========================================================
   CLOSING THREAD (decorative)
   ========================================================= */

const THREAD_DOTS_Y = [26, 90, 30, 84, 34];

function ThreadArt() {
  return (
    <svg
      className="hm-cta-thread"
      viewBox="0 0 1200 120"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient
          id="hm-thread-grad"
          gradientUnits="userSpaceOnUse"
          x1="200"
          y1="0"
          x2="1000"
          y2="0"
        >
          {STORY.map((s, i) => (
            <stop
              key={s.id}
              offset={`${(i / (STORY.length - 1)) * 100}%`}
              stopColor={MOODS[s.mood].color}
            />
          ))}
        </linearGradient>
      </defs>
      <path
        d="M0 60 C70 60 130 26 200 26 S330 90 400 90 S530 30 600 30 S730 84 800 84 S930 34 1000 34 S1130 62 1200 56"
        fill="none"
        stroke="url(#hm-thread-grad)"
        strokeWidth="2.5"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
      {STORY.map((s, i) => (
        <circle
          key={s.id}
          cx={200 + i * 200}
          cy={THREAD_DOTS_Y[i]}
          r="9"
          fill={MOODS[s.mood].color}
          style={{ stroke: "var(--paper)", strokeWidth: 5 }}
        />
      ))}
    </svg>
  );
}

/* =========================================================
   PAGE
   ========================================================= */

function Home() {
  return (
    <main className="home">
      {/* ================= HERO ================= */}
      <section className="hm-hero">
        <div className="hm-wrap hm-hero-grid">
          <div className="hm-hero-copy">
            <h1>
              Life isn&rsquo;t a single story.
              <br />
              It&rsquo;s a collection of moments.
            </h1>

            <p className="hm-hero-lede">
              Memoire is a place to write the moments that matter, build
              journeys from them, and discover the stories that make people who
              they are.
            </p>

            <div className="hm-hero-actions">
              <Link to="/register" className="hm-btn hm-btn-solid">
                Start your story
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
              <Link to="/blogs" className="hm-btn hm-btn-line">
                Explore stories
              </Link>
            </div>

            <p className="hm-hero-note">
              Write it. Organize it. Come back to it years later.
            </p>
          </div>

          <HeroComposer />
        </div>
      </section>

      {/* ================= IDEA ================= */}
      <section className="hm-idea" aria-labelledby="hm-idea-title">
        <div className="hm-wrap hm-idea-grid">
          <div className="hm-idea-lead">
            <h2 id="hm-idea-title">
              A feed forgets.
              <br />A journey remembers.
            </h2>
            <p>
              Posts scroll away in a day. On Memoire, every thought, milestone,
              failure and quiet afternoon can become part of something bigger,
              and you can reread it for years.
            </p>
          </div>

          <div className="hm-terms">
            <article className="hm-term">
              <svg
                className="hm-glyph"
                viewBox="0 0 72 72"
                aria-hidden="true"
                focusable="false"
              >
                <circle
                  cx="36"
                  cy="36"
                  r="9"
                  style={{ fill: MOODS.joyful.color }}
                />
              </svg>
              <div>
                <h3>Moment</h3>
                <p>
                  One piece of writing: something that happened, something you
                  felt, something you learned. It can stand on its own, with
                  photos or video.
                </p>
              </div>
            </article>

            <article className="hm-term">
              <svg
                className="hm-glyph"
                viewBox="0 0 72 72"
                aria-hidden="true"
                focusable="false"
              >
                <path
                  d="M14 48 L36 24 L58 42"
                  fill="none"
                  style={{ stroke: "var(--line-2)", strokeWidth: 2 }}
                />
                <circle
                  cx="14"
                  cy="48"
                  r="7"
                  style={{ fill: MOODS.wistful.color }}
                />
                <circle
                  cx="36"
                  cy="24"
                  r="7"
                  style={{ fill: MOODS.proud.color }}
                />
                <circle
                  cx="58"
                  cy="42"
                  r="7"
                  style={{ fill: MOODS.calm.color }}
                />
              </svg>
              <div>
                <h3>Journey</h3>
                <p>
                  A set of moments in order. A degree, a move abroad, a year of
                  training. Read it from the first day to today.
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="hm-features" aria-labelledby="hm-features-title">
        <div className="hm-wrap">
          <div className="hm-section-head">
            <h2 id="hm-features-title">
              Write freely. Organize when you&rsquo;re ready.
            </h2>
            <p>
              Your life doesn&rsquo;t happen in categories. It happens moment by
              moment, and Memoire follows along.
            </p>
          </div>

          <div className="hm-bento">
            {/* Write */}
            <article className="hm-tile hm-tile-write">
              <div className="hm-tile-copy">
                <h3>Write a moment</h3>
                <p>
                  Capture something that happened, something you felt, or
                  something you simply want to remember. Add photos and video to
                  make it yours.
                </p>
              </div>

              <div className="hm-tile-visual">
                <div className="hm-editor">
                  <div className="hm-editor-bar">
                    <span>Draft</span>
                    <Mood id="wistful" />
                  </div>
                  <p className="hm-editor-title">
                    The first day didn&rsquo;t feel real
                  </p>
                  <p className="hm-editor-text">
                    New campus. New people. A completely different chapter of
                    life was beginning&hellip;
                  </p>
                  <div className="hm-media-row">
                    <div
                      className="hm-media hm-media-photo hm-scene"
                      style={{ ...moodVars("proud"), "--sun": "20px" }}
                    >
                      <ImageIcon size={13} aria-hidden="true" />
                      campus.jpg
                    </div>
                    <div className="hm-media hm-media-video">
                      <span className="hm-play">
                        <Play
                          size={13}
                          fill="currentColor"
                          aria-hidden="true"
                        />
                      </span>
                      <span className="hm-media-time">0:24</span>
                    </div>
                    <div className="hm-media hm-media-add">+ Add</div>
                  </div>
                </div>
              </div>
            </article>

            {/* Journeys */}
            <article className="hm-tile hm-tile-journey">
              <div className="hm-tile-copy">
                <h3>Connect moments into a journey</h3>
                <p>
                  Group related moments into chapters of your life, and keep
                  adding as the story goes on.
                </p>
              </div>

              <div className="hm-tile-visual">
                <div className="hm-jcard">
                  <div className="hm-jhead">
                    <strong>My College Journey</strong>
                    <span>5 moments</span>
                  </div>
                  <ul className="hm-jlist">
                    {STORY.slice(0, 3).map((s) => (
                      <li key={s.id} style={moodVars(s.mood)}>
                        <span className="hm-jdot" />
                        <span className="hm-jtitle">{s.title}</span>
                        <time>{s.date.slice(3, 6)}</time>
                      </li>
                    ))}
                  </ul>
                  <div className="hm-jadd">+ Add a moment</div>
                </div>
              </div>
            </article>

            {/* Timeline */}
            <article className="hm-tile hm-tile-timeline">
              <div className="hm-tile-copy">
                <h3>Follow the timeline</h3>
                <p>
                  Open a journey and read from its first entry forward, watching
                  the story change over time.
                </p>
              </div>

              <div className="hm-tile-visual">
                <div className="hm-axis" style={{ "--thread": STORY_GRADIENT }}>
                  {[2, 9, 17, 60, 98].map((left, i) => (
                    <span
                      key={left}
                      className="hm-axis-dot"
                      style={{ left: `${left}%`, ...moodVars(STORY[i].mood) }}
                    />
                  ))}
                  <div className="hm-axis-labels">
                    <span>Aug 2023</span>
                    <span>Today</span>
                  </div>
                </div>
              </div>
            </article>

            {/* AI */}
            <article className="hm-tile hm-tile-ai">
              <div className="hm-tile-copy">
                <h3>AI that understands, never rewrites</h3>
                <p>
                  Memoire reads the emotions, themes and connections in your
                  writing. Your words are never changed.
                </p>
              </div>

              <div className="hm-tile-visual">
                <div className="hm-ai-quote">
                  I finally built something I was proud of.
                </div>
                <div className="hm-ai-tags">
                  <Mood id="proud" />
                  <Mood id="calm" label="Persistence" />
                  <Mood id="joyful" label="Learning" />
                </div>
                <p className="hm-ai-safe">
                  <Sparkles size={14} aria-hidden="true" />
                  Your story stays yours
                </p>
              </div>
            </article>

            {/* Connect */}
            <article className="hm-tile hm-tile-connect">
              <div className="hm-tile-copy">
                <h3>Connect through stories</h3>
                <p>
                  Like moments, leave thoughtful comments, and get to know
                  people through what they write.
                </p>
              </div>

              <div className="hm-tile-visual">
                <div className="hm-comment">
                  <span
                    className="hm-avatar"
                    style={moodVars("joyful")}
                    aria-hidden="true"
                  >
                    S
                  </span>
                  <div>
                    <strong>Sana</strong>
                    <p>
                      I needed to read this today. Thank you for writing it.
                    </p>
                  </div>
                </div>
                <div className="hm-react">
                  <span>
                    <Heart
                      size={15}
                      fill={MOODS.heavy.color}
                      stroke={MOODS.heavy.color}
                      aria-hidden="true"
                    />
                    128
                  </span>
                  <span>
                    <MessageCircle size={15} aria-hidden="true" />
                    19
                  </span>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* ================= STORY ================= */}
      <section className="hm-story" aria-labelledby="hm-story-title">
        <div className="hm-wrap">
          <div className="hm-story-head">
            <div>
              <p className="hm-story-by">A journey by Arjun</p>
              <h2 id="hm-story-title">My College Journey</h2>
            </div>
            <p>
              Five moments. Five different versions of the same person. Pick one
              to read it, and watch the thread change colour with how it felt.
            </p>
          </div>

          <StoryReader />
        </div>
      </section>

      {/* ================= COMMUNITY ================= */}
      <section
        className="hm-community hm-dark"
        aria-labelledby="hm-community-title"
      >
        <div className="hm-wrap hm-community-grid">
          <div>
            <h2 id="hm-community-title">
              Every person has a story worth reading.
            </h2>
            <p className="hm-community-text">
              Somewhere between the big milestones are the small moments that
              make us who we are. Search by title, content, person or journey,
              and start reading.
            </p>
            <Link to="/blogs" className="hm-btn hm-btn-light">
              Explore stories
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>

          <ExplorePanel />
        </div>
      </section>

      {/* ================= FINAL CTA ================= */}
      <section className="hm-cta" aria-labelledby="hm-cta-title">
        <div className="hm-wrap">
          <ThreadArt />
          <h2 id="hm-cta-title">Start with one moment.</h2>
          <p>
            You don&rsquo;t need a plan or a perfect draft. Write what happened
            today and let the journey take shape later.
          </p>
          <div className="hm-cta-actions">
            <Link to="/register" className="hm-btn hm-btn-solid">
              Start your story
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link to="/blogs" className="hm-btn hm-btn-line">
              Explore stories
            </Link>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="hm-footer">
        <div className="hm-wrap">
          <div className="hm-footer-main">
            <div className="hm-footer-brand">
              <span className="hm-wordmark">Memoire</span>
              <p>Your story, one moment at a time.</p>
              <span className="hm-footer-note">
                Keep the moments. Remember the journey.
              </span>
            </div>

            <div className="hm-footer-links">
              <div className="hm-footer-column">
                <span className="hm-footer-label">Discover</span>
                <Link to="/blogs">Explore stories</Link>
                <Link to="/register">Start writing</Link>
              </div>

              <div className="hm-footer-column">
                <span className="hm-footer-label">Memoire</span>
                <Link to="/blogs">Moments</Link>
                <Link to="/register">Create your story</Link>
              </div>

              <div className="hm-footer-column">
                <span className="hm-footer-label">Connect</span>
                <div className="hm-footer-socials">
                  <a
                    href="https://www.instagram.com/iam_sohxm/"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Instagram"
                  >
                    Instagram
                  </a>
                  <a
                    href="https://www.linkedin.com/in/soham-pramanik/"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="LinkedIn"
                  >
                    LinkedIn
                  </a>
                  <a
                    href="https://github.com/SohamPramanik"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="GitHub"
                  >
                    GitHub
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="hm-footer-bottom">
            <p>&copy; 2026 Memoire. Built to remember what matters.</p>
            <span>Made with <Heart size={13} fill="currentColor" aria-hidden="true" /> by Soham</span>
          </div>
        </div>
      </footer>
    </main>
  );
}

export default Home;
