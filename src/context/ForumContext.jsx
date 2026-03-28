import { createContext, useContext, useReducer, useCallback } from 'react';
import { CATEGORIES, USERS, THREADS, POSTS } from '../data/seed.js';

// ─── State Shape ───────────────────────────────────────────────────────────
const initialState = {
  categories: CATEGORIES,
  users: USERS,
  threads: THREADS,
  posts: POSTS,
  currentUserId: 'currentUser',
  loading: {
    threads: false,
    posts: false,
    submitting: false,
  },
  errors: {
    threads: null,
    posts: null,
    submit: null,
  },
  notifications: [],
};

// ─── Action Types ─────────────────────────────────────────────────────────
export const ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  ADD_THREAD: 'ADD_THREAD',
  ADD_POST: 'ADD_POST',
  UPDATE_POST_VOTE: 'UPDATE_POST_VOTE',
  MARK_THREAD_READ: 'MARK_THREAD_READ',
  MARK_POST_READ: 'MARK_POST_READ',
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  DISMISS_NOTIFICATION: 'DISMISS_NOTIFICATION',
};

// ─── Reducer (pure, immutable updates) ───────────────────────────────────
function forumReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: { ...state.loading, [action.key]: action.value },
      };

    case ACTIONS.SET_ERROR:
      return {
        ...state,
        errors: { ...state.errors, [action.key]: action.value },
        loading: { ...state.loading, [action.key]: false },
      };

    case ACTIONS.ADD_THREAD:
      return {
        ...state,
        threads: [action.thread, ...state.threads],
        loading: { ...state.loading, submitting: false },
        errors: { ...state.errors, submit: null },
      };

    case ACTIONS.ADD_POST:
      return {
        ...state,
        posts: [...state.posts, action.post],
        loading: { ...state.loading, submitting: false },
        errors: { ...state.errors, submit: null },
      };

    case ACTIONS.UPDATE_POST_VOTE: {
      const { postId, direction } = action;
      return {
        ...state,
        posts: state.posts.map((p) => {
          if (p.id !== postId) return p;
          const prevVote = p.userVote;
          const newVote = prevVote === direction ? null : direction;
          const delta = newVote === null ? -direction : prevVote === null ? direction : direction * 2;
          return { ...p, votes: p.votes + delta, userVote: newVote };
        }),
      };
    }

    case ACTIONS.MARK_THREAD_READ:
      return {
        ...state,
        threads: state.threads.map((t) =>
          t.id === action.threadId ? { ...t, isRead: true, views: t.views + 1 } : t
        ),
      };

    case ACTIONS.MARK_POST_READ:
      return {
        ...state,
        posts: state.posts.map((p) =>
          p.id === action.postId ? { ...p, isRead: true } : p
        ),
      };

    case ACTIONS.ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [
          ...state.notifications,
          { id: Date.now(), ...action.notification },
        ],
      };

    case ACTIONS.DISMISS_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.filter((n) => n.id !== action.id),
      };

    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────
const ForumContext = createContext(null);

// ─── Provider ─────────────────────────────────────────────────────────────
export function ForumProvider({ children }) {
  const [state, dispatch] = useReducer(forumReducer, initialState);

  // ── Derived state (computed, not stored) ────────────────────────────
  const getThreadsByCategory = useCallback(
    (categoryId) =>
      state.threads
        .filter((t) => t.categoryId === categoryId)
        .sort((a, b) => {
          if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
          return new Date(b.createdAt) - new Date(a.createdAt);
        }),
    [state.threads]
  );

  const getPostsByThread = useCallback(
    (threadId) => state.posts.filter((p) => p.threadId === threadId),
    [state.posts]
  );

  const getUser = useCallback(
    (userId) => state.users.find((u) => u.id === userId),
    [state.users]
  );

  const getThread = useCallback(
    (threadId) => state.threads.find((t) => t.id === threadId),
    [state.threads]
  );

  const getCategory = useCallback(
    (categoryId) => state.categories.find((c) => c.id === categoryId),
    [state.categories]
  );

  const unreadCount = state.threads.filter((t) => !t.isRead).length;

  // ── Async actions ────────────────────────────────────────────────────
  const submitThread = useCallback(async ({ title, body, categoryId, tags }) => {
    dispatch({ type: ACTIONS.SET_LOADING, key: 'submitting', value: true });
    dispatch({ type: ACTIONS.SET_ERROR, key: 'submit', value: null });

    // Simulate network request
    await new Promise((res) => setTimeout(res, 1200));

    // Simulate occasional error (uncomment to test error state)
    // if (Math.random() < 0.2) throw new Error('Network error');

    const newThread = {
      id: `t${Date.now()}`,
      categoryId,
      title: title.trim(),
      body: body.trim(),
      authorId: state.currentUserId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      views: 0,
      isRead: false,
      isPinned: false,
      tags: tags.filter(Boolean),
    };

    dispatch({ type: ACTIONS.ADD_THREAD, thread: newThread });
    dispatch({
      type: ACTIONS.ADD_NOTIFICATION,
      notification: { type: 'success', message: 'Thread posted successfully!' },
    });

    return newThread;
  }, [state.currentUserId]);

  const submitPost = useCallback(async ({ threadId, parentId, body }) => {
    dispatch({ type: ACTIONS.SET_LOADING, key: 'submitting', value: true });
    dispatch({ type: ACTIONS.SET_ERROR, key: 'submit', value: null });

    await new Promise((res) => setTimeout(res, 900));

    const parentPost = state.posts.find((p) => p.id === parentId);
    const depth = parentId ? Math.min((parentPost?.depth ?? 0) + 1, 4) : 0;

    const newPost = {
      id: `p${Date.now()}`,
      threadId,
      parentId,
      authorId: state.currentUserId,
      body: body.trim(),
      createdAt: new Date().toISOString(),
      votes: 0,
      userVote: null,
      isRead: true,
      depth,
    };

    dispatch({ type: ACTIONS.ADD_POST, post: newPost });
    dispatch({
      type: ACTIONS.ADD_NOTIFICATION,
      notification: { type: 'success', message: 'Reply posted!' },
    });

    return newPost;
  }, [state.posts, state.currentUserId]);

  const votePost = useCallback((postId, direction) => {
    dispatch({ type: ACTIONS.UPDATE_POST_VOTE, postId, direction });
  }, []);

  const markThreadRead = useCallback((threadId) => {
    dispatch({ type: ACTIONS.MARK_THREAD_READ, threadId });
  }, []);

  const dismissNotification = useCallback((id) => {
    dispatch({ type: ACTIONS.DISMISS_NOTIFICATION, id });
  }, []);

  const value = {
    // State
    ...state,
    // Derived
    getThreadsByCategory,
    getPostsByThread,
    getUser,
    getThread,
    getCategory,
    unreadCount,
    // Actions
    submitThread,
    submitPost,
    votePost,
    markThreadRead,
    dismissNotification,
  };

  return <ForumContext.Provider value={value}>{children}</ForumContext.Provider>;
}

// ─── Hook ─────────────────────────────────────────────────────────────────
export function useForum() {
  const ctx = useContext(ForumContext);
  if (!ctx) throw new Error('useForum must be used within ForumProvider');
  return ctx;
}
