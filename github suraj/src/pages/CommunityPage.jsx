import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabase';

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
  const [posts, setPosts] = useState([]);
  const [likedPostIds, setLikedPostIds] = useState(new Set());
  const [commentsMap, setCommentsMap] = useState({});
  const [loading, setLoading] = useState(true);
  
  const [composer, setComposer] = useState({
    title: '',
    content: '',
    category: 'Discussions',
    location: '',
    photoUrl: '',
  });
  const [commentDrafts, setCommentDrafts] = useState({});

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
      if (session?.user) fetchUserLikes(session.user.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      if (session?.user) fetchUserLikes(session.user.id);
    });

    fetchPosts();
    return () => subscription.unsubscribe();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('community_posts')
      .select('*, community_comments(count)')
      .order('created_at', { ascending: false });

    if (error) console.error('Error fetching posts:', error);
    else setPosts(data || []);
    setLoading(false);
  };

  const fetchUserLikes = async (userId) => {
    const { data, error } = await supabase
      .from('community_likes')
      .select('post_id')
      .eq('user_id', userId);

    if (error) console.error('Error fetching likes:', error);
    else setLikedPostIds(new Set(data.map(l => l.post_id)));
  };

  const fetchComments = async (postId) => {
    const { data, error } = await supabase
      .from('community_comments')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: true });

    if (error) console.error('Error fetching comments:', error);
    else setCommentsMap(prev => ({ ...prev, [postId]: data }));
  };

  useEffect(() => {
    if (expandedPostId && !commentsMap[expandedPostId]) {
      fetchComments(expandedPostId);
    }
  }, [expandedPostId]);

  const addPost = async (e) => {
    e.preventDefault();
    if (!user) return alert('Authenticated mission required. Please login.');
    
    const title = composer.title.trim();
    const content = composer.content.trim();
    if (!title || !content) return;

    const { data, error } = await supabase
      .from('community_posts')
      .insert({
        title,
        content,
        category: composer.category,
        location: composer.location.trim() || null,
        photo_url: composer.photoUrl.trim() || null,
        author_id: user.id,
        author_name: user.email.split('@')[0],
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding post:', error);
    } else {
      setPosts(prev => [data, ...prev]);
      setComposer({ title: '', content: '', category: composer.category, location: '', photoUrl: '' });
      setExpandedPostId(data.id);
    }
  };

  const toggleLike = async (postId) => {
    if (!user) return alert('Login to sync tactical likes.');

    const isLiked = likedPostIds.has(postId);
    
    if (isLiked) {
      const { error } = await supabase
        .from('community_likes')
        .delete()
        .match({ post_id: postId, user_id: user.id });

      if (!error) {
        setLikedPostIds(prev => {
          const next = new Set(prev);
          next.delete(postId);
          return next;
        });
        updatePostLikeCount(postId, -1);
      }
    } else {
      const { error } = await supabase
        .from('community_likes')
        .insert({ post_id: postId, user_id: user.id });

      if (!error) {
        setLikedPostIds(prev => {
          const next = new Set(prev);
          next.add(postId);
          return next;
        });
        updatePostLikeCount(postId, 1);
      }
    }
  };

  const updatePostLikeCount = (postId, delta) => {
    setPosts(prev => prev.map(p => {
      if (p.id !== postId) return p;
      return { ...p, likes_count: (p.likes_count || 0) + delta };
    }));
  };

  const submitComment = async (postId) => {
    if (!user) return alert('Login to reply.');
    const text = (commentDrafts[postId] || '').trim();
    if (!text) return;

    const { data, error } = await supabase
      .from('community_comments')
      .insert({
        post_id: postId,
        author_id: user.id,
        author_name: user.email.split('@')[0],
        text,
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding comment:', error);
    } else {
      setCommentsMap(prev => ({
        ...prev,
        [postId]: [...(prev[postId] || []), data]
      }));
      setCommentDrafts(prev => ({ ...prev, [postId]: '' }));
      
      // Update local comment count
      setPosts(prev => prev.map(p => {
        if (p.id !== postId) return p;
        const countObj = p.community_comments?.[0] || { count: 0 };
        return { ...p, community_comments: [{ count: countObj.count + 1 }] };
      }));
    }
  };

  const filteredPosts = useMemo(() => {
    if (activeCategory === 'All') return posts;
    return posts.filter((p) => p.category === activeCategory);
  }, [activeCategory, posts]);

  return (
    <div className="pt-32 pb-44 px-4 md:px-6 max-w-7xl mx-auto space-y-10 font-body">
      <section className="relative overflow-hidden bg-surface-container-low border border-white/5 rounded-[3rem] p-8 md:p-12">
        <div className="absolute top-0 left-0 w-72 h-72 bg-primary/10 blur-[110px]" />
        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="text-primary font-bold text-[10px] uppercase tracking-[0.4em] font-label">Community Basecamp</span>
              <div className="flex items-center gap-4">
                 <img src="/logo.png" alt="Community Logo" className="w-10 h-10 md:w-16 md:h-16" />
                 <h1 className="text-4xl md:text-7xl font-black text-white font-headline tracking-tighter uppercase italic">Connect</h1>
              </div>
              <p className="text-white/30 text-sm md:text-base max-w-2xl">
                Real-time tactical discussions. Ask questions, share reports, and plan with the community.
              </p>
            </div>
            {user && (
              <div className="glass-card px-6 py-4 rounded-[1.75rem] flex items-center gap-4">
                <span className="material-symbols-outlined text-primary text-2xl">groups</span>
                <div className="space-y-0.5">
                  <div className="text-[10px] text-white/30 uppercase tracking-widest font-label font-bold">Posting As</div>
                  <div className="text-white font-black uppercase tracking-widest text-[11px] font-label">{user.email.split('@')[0]}</div>
                </div>
              </div>
            )}
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
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-card p-8 rounded-[2.5rem] border border-white/10 space-y-6 sticky top-32">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white font-headline uppercase italic">Start A Thread</h2>
              <p className="text-white/30 text-xs">Share current conditions or ask for trailhead intelligence.</p>
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
                    <option key={c} value={c} className="bg-[#0f1412]">{c}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest font-label ml-1">Title</label>
                <input
                  value={composer.title}
                  onChange={(e) => setComposer((p) => ({ ...p, title: e.target.value }))}
                  placeholder="Subject line..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-primary/40 focus:bg-white/[0.08] transition-all text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest font-label ml-1">Content</label>
                <textarea
                  value={composer.content}
                  onChange={(e) => setComposer((p) => ({ ...p, content: e.target.value }))}
                  placeholder="Intelligence details..."
                  rows={4}
                  className="w-full resize-none bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-primary/40 focus:bg-white/[0.08] transition-all text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={!user}
                className={`w-full px-6 py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.25em] transition-all shadow-xl font-label ${
                  user ? 'bg-primary text-black hover:scale-[1.01]' : 'bg-white/5 text-white/20 border border-white/5 cursor-not-allowed'
                }`}
              >
                {user ? 'Broadcase Post' : 'Login to Post'}
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-6">
          {loading ? (
             <div className="flex flex-col items-center justify-center p-20 space-y-4">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                <span className="text-[10px] font-black text-primary uppercase tracking-widest">Syncing with Grid...</span>
             </div>
          ) : filteredPosts.length === 0 ? (
            <div className="glass-card p-10 rounded-[2.5rem] border border-white/10 text-center space-y-2">
              <div className="text-white font-black uppercase tracking-widest text-sm font-label">No Posts Yet</div>
              <div className="text-white/30 text-sm">Be the first to initialize a thread.</div>
            </div>
          ) : (
            filteredPosts.map((post) => {
              const isExpanded = expandedPostId === post.id;
              const isLiked = likedPostIds.has(post.id);
              const comments = commentsMap[post.id] || [];
              const commentCount = post.community_comments?.[0]?.count || 0;

              return (
                <article key={post.id} className="glass-card p-8 rounded-[2.5rem] border border-white/10 space-y-5 animate-in fade-in slide-in-from-bottom-5 duration-500">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest font-label">
                          {post.category}
                        </span>
                        {post.location && (
                          <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/60 text-[10px] font-black uppercase tracking-widest font-label italic">
                            {post.location}
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl md:text-3xl font-black text-white uppercase italic tracking-tighter leading-tight">{post.title}</h3>
                      <div className="text-[10px] text-white/30 uppercase tracking-[0.25em] font-label font-bold">
                        {post.author_name} • {formatTime(post.created_at)}
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
                        {post.likes_count || 0}
                      </button>
                      <button
                        type="button"
                        onClick={() => setExpandedPostId((prev) => (prev === post.id ? null : post.id))}
                        className={`px-4 py-2 rounded-full border text-[10px] font-black uppercase tracking-widest transition-all font-label flex items-center gap-2 ${
                          isExpanded ? 'bg-white text-black border-white' : 'bg-white/5 text-white/60 border-white/10 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <span className="material-symbols-outlined text-base">chat_bubble</span>
                        {commentCount}
                      </button>
                    </div>
                  </div>

                  <p className="text-white/70 leading-relaxed text-sm md:text-base whitespace-pre-wrap selection:bg-primary/30">{post.content}</p>

                  {post.photo_url && (
                    <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-black/40">
                      <img src={post.photo_url} alt={post.title} className="w-full h-auto max-h-[400px] object-cover hover:scale-105 transition-transform duration-1000" />
                    </div>
                  )}

                  {isExpanded && (
                    <div className="space-y-6 pt-4 animate-in fade-in slide-in-from-top-4 duration-300">
                      <div className="h-px bg-white/10" />

                      <div className="space-y-4">
                        {comments.length === 0 ? (
                          <div className="text-white/20 text-[10px] uppercase font-bold tracking-widest text-center py-4">No tactical replies yet.</div>
                        ) : (
                          comments.map((c) => (
                            <div key={c.id} className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] text-primary font-black uppercase tracking-widest">{c.author_name}</span>
                                <span className="text-[9px] text-white/20 font-bold uppercase tracking-widest">{formatTime(c.created_at)}</span>
                              </div>
                              <p className="text-white/80 text-sm leading-relaxed">{c.text}</p>
                            </div>
                          ))
                        )}
                      </div>

                      <div className="flex gap-3">
                        <input
                          value={commentDrafts[post.id] || ''}
                          onChange={(e) => setCommentDrafts((prev) => ({ ...prev, [post.id]: e.target.value }))}
                          placeholder="Send reply..."
                          className="flex-grow bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-xs text-white outline-none focus:border-primary/40 focus:bg-white/[0.08] transition-all"
                        />
                        <button
                          onClick={() => submitComment(post.id)}
                          className="bg-primary text-black px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all"
                        >
                          Reply
                        </button>
                      </div>
                    </div>
                  )}
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
