import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabase';

const POSTS_STORAGE_KEY = 'waypoint.community.posts.v1';
const LIKES_STORAGE_KEY = 'waypoint.community.likes.v1';

const canUseStorage = () => typeof window !== 'undefined' && Boolean(window.localStorage);

const safeParse = (value, fallback) => {
  if (!value) return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

const createId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const displayNameForUser = (user) => {
  const email = user?.email || '';
  const name = email.split('@')[0]?.trim();
  return name || 'Anonymous';
};

const seedPosts = () => ([
  {
    id: createId(),
    title: 'Best monsoon fort trek near Pune?',
    content: 'Looking for a safe monsoon fort trek with good views. Prefer something beginner-friendly with less exposure. Any route tips and trailhead details?',
    category: 'Discussions',
    location: 'Sahyadri',
    photoUrl: '',
    author: 'Waypoint Scout',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    likes: 12,
    comments: [
      {
        id: createId(),
        author: 'Trail Mapper',
        text: 'Try Rajmachi via Lonavala. Start early, carry a rain jacket, and avoid slippery exposed ridges. If it’s pouring, stick to well-marked trails.',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
      },
    ],
  },
  {
    id: createId(),
    title: 'Hampta Pass gear checklist (first time)',
    content: 'Planning Hampta Pass next month. What are the must-haves beyond the basics? Any mistakes to avoid with layering and footwear?',
    category: 'Gear',
    location: 'Himachal Pradesh',
    photoUrl: '',
    author: 'Peak Seeker',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString(),
    likes: 8,
    comments: [],
  },
  {
    id: createId(),
    title: 'Trip report: sunrise at Kedarkantha',
    content: 'The summit push was cold but the sunrise was unreal. Start around 2–3 AM, keep your water insulated, and pace yourself on the final ridge.',
    category: 'Trip Reports',
    location: 'Uttarakhand',
    photoUrl: '',
    author: 'Summit Journal',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 52).toISOString(),
    likes: 21,
    comments: [
      {
        id: createId(),
        author: 'Altitude Rookie',
        text: 'Did you feel any altitude symptoms? Trying to decide if I should do an extra acclimatization day.',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 40).toISOString(),
      },
    ],
  },
]);

const formatTime = (iso) => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleString(undefined, { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
};

const CATEGORIES = ['All', 'Discussions', 'Trip Reports', 'Gear', 'Safety'];

const CommunityPage = () => {
  const [user, setUser] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [expandedPostId, setExpandedPostId] = useState(null);
  const [composer, setComposer] = useState({
    title: '',
    content: '',
    category: 'Discussions',
    location: '',
    photoUrl: '',
  });
  const [commentDrafts, setCommentDrafts] = useState({});

  const [posts, setPosts] = useState(() => {
    if (!canUseStorage()) return seedPosts();
    const stored = safeParse(window.localStorage.getItem(POSTS_STORAGE_KEY), null);
    if (Array.isArray(stored) && stored.length) return stored;
    return seedPosts();
  });

  const [likedPostIds, setLikedPostIds] = useState(() => {
    if (!canUseStorage()) return new Set();
    const stored = safeParse(window.localStorage.getItem(LIKES_STORAGE_KEY), []);
    if (!Array.isArray(stored)) return new Set();
    return new Set(stored.filter((v) => typeof v === 'string'));
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!canUseStorage()) return;
    window.localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    if (!canUseStorage()) return;
    window.localStorage.setItem(LIKES_STORAGE_KEY, JSON.stringify(Array.from(likedPostIds)));
  }, [likedPostIds]);

  const filteredPosts = useMemo(() => {
    if (activeCategory === 'All') return posts;
    return posts.filter((p) => p.category === activeCategory);
  }, [activeCategory, posts]);

  const addPost = (e) => {
    e.preventDefault();
    const title = composer.title.trim();
    const content = composer.content.trim();
    if (!title || !content) return;

    const post = {
      id: createId(),
      title,
      content,
      category: composer.category,
      location: composer.location.trim(),
      photoUrl: composer.photoUrl.trim(),
      author: displayNameForUser(user),
      createdAt: new Date().toISOString(),
      likes: 0,
      comments: [],
    };

    setPosts((prev) => [post, ...prev]);
    setComposer({ title: '', content: '', category: composer.category, location: '', photoUrl: '' });
    setExpandedPostId(post.id);
  };

  const toggleLike = (postId) => {
    setLikedPostIds((prev) => {
      const next = new Set(prev);
      const isLiked = next.has(postId);
      if (isLiked) next.delete(postId);
      else next.add(postId);
      return next;
    });

    setPosts((prev) => prev.map((p) => {
      if (p.id !== postId) return p;
      const isLiked = likedPostIds.has(postId);
      const nextLikes = Math.max(0, (Number(p.likes) || 0) + (isLiked ? -1 : 1));
      return { ...p, likes: nextLikes };
    }));
  };

  const submitComment = (postId) => {
    const text = String(commentDrafts[postId] || '').trim();
    if (!text) return;

    const comment = {
      id: createId(),
      author: displayNameForUser(user),
      text,
      createdAt: new Date().toISOString(),
    };

    setPosts((prev) => prev.map((p) => {
      if (p.id !== postId) return p;
      const existing = Array.isArray(p.comments) ? p.comments : [];
      return { ...p, comments: [...existing, comment] };
    }));
    setCommentDrafts((prev) => ({ ...prev, [postId]: '' }));
    setExpandedPostId(postId);
  };

  return (
    <div className="pt-32 pb-44 px-4 md:px-6 max-w-7xl mx-auto space-y-10">
      <section className="relative overflow-hidden bg-surface-container-low border border-white/5 rounded-[3rem] p-8 md:p-12">
        <div className="absolute top-0 left-0 w-72 h-72 bg-primary/10 blur-[110px]" />
        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="text-primary font-bold text-[10px] uppercase tracking-[0.4em] font-label">Community Basecamp</span>
              <h1 className="text-4xl md:text-7xl font-black text-white font-headline tracking-tighter uppercase italic">Connect</h1>
              <p className="text-white/30 text-sm md:text-base max-w-2xl">
                Ask questions, share trip reports, swap gear tips, and help fellow trekkers plan safer routes.
              </p>
            </div>
            <div className="glass-card px-6 py-4 rounded-[1.75rem] flex items-center gap-4">
              <span className="material-symbols-outlined text-primary text-2xl">groups</span>
              <div className="space-y-0.5">
                <div className="text-[10px] text-white/30 uppercase tracking-widest font-label font-bold">Posting As</div>
                <div className="text-white font-black uppercase tracking-widest text-[11px] font-label">{displayNameForUser(user)}</div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-3">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setActiveCategory(c)}
                className={`px-5 py-2 rounded-full border text-[10px] font-black uppercase tracking-widest font-label transition-all ${
                  activeCategory === c
                    ? 'bg-primary text-black border-primary'
                    : 'bg-white/5 text-white/50 border-white/10 hover:bg-white/10 hover:text-white'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-card p-8 rounded-[2.5rem] border border-white/10 space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white font-headline uppercase italic">Start A Thread</h2>
              <p className="text-white/30 text-sm">Keep it specific: route, season, safety, permits, gear, or conditions.</p>
            </div>

            <form onSubmit={addPost} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest font-label ml-1">Category</label>
                <select
                  value={composer.category}
                  onChange={(e) => setComposer((p) => ({ ...p, category: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-primary/40 focus:bg-white/[0.08] transition-all text-sm"
                >
                  {CATEGORIES.filter((c) => c !== 'All').map((c) => (
                    <option key={c} value={c} className="bg-[#0f1412]">
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest font-label ml-1">Title</label>
                <input
                  value={composer.title}
                  onChange={(e) => setComposer((p) => ({ ...p, title: e.target.value }))}
                  placeholder="e.g. Best route for Kalsubai in monsoon?"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-primary/40 focus:bg-white/[0.08] transition-all text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest font-label ml-1">Details</label>
                <textarea
                  value={composer.content}
                  onChange={(e) => setComposer((p) => ({ ...p, content: e.target.value }))}
                  placeholder="Share context: experience level, season, distance, what you’re unsure about…"
                  rows={5}
                  className="w-full resize-none bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-primary/40 focus:bg-white/[0.08] transition-all text-sm"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest font-label ml-1">Location (Optional)</label>
                  <input
                    value={composer.location}
                    onChange={(e) => setComposer((p) => ({ ...p, location: e.target.value }))}
                    placeholder="e.g. Sahyadri / Uttarakhand"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-primary/40 focus:bg-white/[0.08] transition-all text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest font-label ml-1">Photo URL (Optional)</label>
                  <input
                    value={composer.photoUrl}
                    onChange={(e) => setComposer((p) => ({ ...p, photoUrl: e.target.value }))}
                    placeholder="https://…"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-primary/40 focus:bg-white/[0.08] transition-all text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-primary text-black px-6 py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.25em] hover:scale-[1.01] active:scale-[0.99] transition-all shadow-xl font-label"
              >
                Post To Community
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-6">
          {filteredPosts.length === 0 ? (
            <div className="glass-card p-10 rounded-[2.5rem] border border-white/10 text-center space-y-2">
              <div className="text-white font-black uppercase tracking-widest text-sm font-label">No Posts Yet</div>
              <div className="text-white/30 text-sm">Be the first to start a thread in this category.</div>
            </div>
          ) : (
            filteredPosts.map((post) => {
              const isExpanded = expandedPostId === post.id;
              const isLiked = likedPostIds.has(post.id);
              const comments = Array.isArray(post.comments) ? post.comments : [];

              return (
                <article key={post.id} className="glass-card p-8 rounded-[2.5rem] border border-white/10 space-y-5">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest font-label">
                          {post.category}
                        </span>
                        {post.location ? (
                          <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/60 text-[10px] font-black uppercase tracking-widest font-label">
                            {post.location}
                          </span>
                        ) : null}
                      </div>
                      <h3 className="text-xl md:text-2xl font-bold text-white font-headline tracking-tight">{post.title}</h3>
                      <div className="text-[10px] text-white/30 uppercase tracking-[0.25em] font-label font-bold">
                        {post.author} • {formatTime(post.createdAt)}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => toggleLike(post.id)}
                        className={`px-4 py-2 rounded-full border text-[10px] font-black uppercase tracking-widest font-label transition-all flex items-center gap-2 ${
                          isLiked
                            ? 'bg-primary text-black border-primary'
                            : 'bg-white/5 text-white/60 border-white/10 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: isLiked ? "'FILL' 1" : "'FILL' 0" }}>
                          favorite
                        </span>
                        {post.likes || 0}
                      </button>
                      <button
                        type="button"
                        onClick={() => setExpandedPostId((prev) => (prev === post.id ? null : post.id))}
                        className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/60 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all font-label flex items-center gap-2"
                      >
                        <span className="material-symbols-outlined text-base">chat_bubble</span>
                        {comments.length}
                      </button>
                    </div>
                  </div>

                  <p className="text-white/70 leading-relaxed text-sm md:text-base whitespace-pre-wrap">{post.content}</p>

                  {post.photoUrl ? (
                    <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/5">
                      <img src={post.photoUrl} alt={post.title} className="w-full h-64 object-cover" loading="lazy" />
                    </div>
                  ) : null}

                  {isExpanded ? (
                    <div className="space-y-4 pt-2">
                      <div className="h-px bg-white/10" />

                      <div className="space-y-3">
                        {comments.length === 0 ? (
                          <div className="text-white/30 text-sm">No comments yet. Add the first reply.</div>
                        ) : (
                          comments.map((c) => (
                            <div key={c.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-1">
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <div className="text-[10px] text-white/40 uppercase tracking-widest font-label font-bold">{c.author}</div>
                                <div className="text-[10px] text-white/20 uppercase tracking-widest font-label font-bold">{formatTime(c.createdAt)}</div>
                              </div>
                              <div className="text-white/80 text-sm whitespace-pre-wrap">{c.text}</div>
                            </div>
                          ))
                        )}
                      </div>

                      <div className="flex flex-col md:flex-row gap-3">
                        <input
                          value={commentDrafts[post.id] || ''}
                          onChange={(e) => setCommentDrafts((prev) => ({ ...prev, [post.id]: e.target.value }))}
                          placeholder="Write a reply…"
                          className="flex-grow bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-primary/40 focus:bg-white/[0.08] transition-all text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => submitComment(post.id)}
                          className="bg-primary/10 border border-primary/20 text-primary px-6 py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.25em] hover:bg-primary hover:text-black transition-all font-label"
                        >
                          Reply
                        </button>
                      </div>
                    </div>
                  ) : null}
                </article>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;
