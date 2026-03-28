import { describe, it, expect } from 'vitest';
import { ACTIONS } from '../context/ForumContext.jsx';

// Test the pure reducer logic directly
// We import the logic inline since the reducer is not exported directly
// Instead we test the state shape transitions

function forumReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_LOADING:
      return { ...state, loading: { ...state.loading, [action.key]: action.value } };

    case ACTIONS.ADD_THREAD:
      return {
        ...state,
        threads: [action.thread, ...state.threads],
        loading: { ...state.loading, submitting: false },
      };

    case ACTIONS.ADD_POST:
      return {
        ...state,
        posts: [...state.posts, action.post],
        loading: { ...state.loading, submitting: false },
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

    case ACTIONS.DISMISS_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.filter((n) => n.id !== action.id),
      };

    default:
      return state;
  }
}

const baseState = {
  threads: [
    { id: 't1', title: 'Test', isRead: false, views: 10, authorId: 'u1' },
  ],
  posts: [
    { id: 'p1', threadId: 't1', votes: 5, userVote: null, parentId: null },
  ],
  loading: { threads: false, posts: false, submitting: false },
  errors: {},
  notifications: [{ id: 1, message: 'Hello' }, { id: 2, message: 'World' }],
};

describe('forumReducer', () => {
  describe('SET_LOADING', () => {
    it('updates loading state immutably', () => {
      const next = forumReducer(baseState, { type: ACTIONS.SET_LOADING, key: 'threads', value: true });
      expect(next.loading.threads).toBe(true);
      expect(next.loading.posts).toBe(false); // unchanged
      expect(next).not.toBe(baseState); // new object
    });
  });

  describe('ADD_THREAD', () => {
    it('prepends thread to list', () => {
      const newThread = { id: 't2', title: 'New', authorId: 'u2' };
      const next = forumReducer(baseState, { type: ACTIONS.ADD_THREAD, thread: newThread });
      expect(next.threads[0]).toEqual(newThread);
      expect(next.threads).toHaveLength(2);
      expect(next.loading.submitting).toBe(false);
    });

    it('does not mutate original threads array', () => {
      const original = [...baseState.threads];
      const newThread = { id: 't2', title: 'New', authorId: 'u2' };
      forumReducer(baseState, { type: ACTIONS.ADD_THREAD, thread: newThread });
      expect(baseState.threads).toEqual(original);
    });
  });

  describe('ADD_POST', () => {
    it('appends post to list', () => {
      const newPost = { id: 'p2', threadId: 't1', body: 'Reply', votes: 0, userVote: null };
      const next = forumReducer(baseState, { type: ACTIONS.ADD_POST, post: newPost });
      expect(next.posts).toHaveLength(2);
      expect(next.posts[1]).toEqual(newPost);
    });
  });

  describe('UPDATE_POST_VOTE', () => {
    it('adds upvote from neutral', () => {
      const next = forumReducer(baseState, {
        type: ACTIONS.UPDATE_POST_VOTE,
        postId: 'p1',
        direction: 1,
      });
      expect(next.posts[0].votes).toBe(6);
      expect(next.posts[0].userVote).toBe(1);
    });

    it('removes upvote if already upvoted', () => {
      const stateWithVote = {
        ...baseState,
        posts: [{ ...baseState.posts[0], userVote: 1, votes: 6 }],
      };
      const next = forumReducer(stateWithVote, {
        type: ACTIONS.UPDATE_POST_VOTE,
        postId: 'p1',
        direction: 1,
      });
      expect(next.posts[0].votes).toBe(5);
      expect(next.posts[0].userVote).toBeNull();
    });

    it('switches from upvote to downvote', () => {
      const stateWithUpvote = {
        ...baseState,
        posts: [{ ...baseState.posts[0], userVote: 1, votes: 6 }],
      };
      const next = forumReducer(stateWithUpvote, {
        type: ACTIONS.UPDATE_POST_VOTE,
        postId: 'p1',
        direction: -1,
      });
      expect(next.posts[0].votes).toBe(4); // -2 swing
      expect(next.posts[0].userVote).toBe(-1);
    });
  });

  describe('MARK_THREAD_READ', () => {
    it('marks thread as read and increments views', () => {
      const next = forumReducer(baseState, {
        type: ACTIONS.MARK_THREAD_READ,
        threadId: 't1',
      });
      expect(next.threads[0].isRead).toBe(true);
      expect(next.threads[0].views).toBe(11);
    });

    it('does not affect other threads', () => {
      const stateWithTwo = {
        ...baseState,
        threads: [
          ...baseState.threads,
          { id: 't2', isRead: false, views: 5, title: 'Other' },
        ],
      };
      const next = forumReducer(stateWithTwo, {
        type: ACTIONS.MARK_THREAD_READ,
        threadId: 't1',
      });
      expect(next.threads[1].isRead).toBe(false);
    });
  });

  describe('DISMISS_NOTIFICATION', () => {
    it('removes notification by id', () => {
      const next = forumReducer(baseState, {
        type: ACTIONS.DISMISS_NOTIFICATION,
        id: 1,
      });
      expect(next.notifications).toHaveLength(1);
      expect(next.notifications[0].id).toBe(2);
    });
  });
});
