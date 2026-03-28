// Format relative time
export function formatRelativeTime(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now - date;

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 60) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 30) return `${days}d ago`;
  if (months < 12) return `${months}mo ago`;
  return `${years}y ago`;
}

// Format date
export function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// Build post tree (nested replies)
export function buildPostTree(posts) {
  const map = {};
  const roots = [];

  posts.forEach((p) => {
    map[p.id] = { ...p, children: [] };
  });

  posts.forEach((p) => {
    if (p.parentId && map[p.parentId]) {
      map[p.parentId].children.push(map[p.id]);
    } else {
      roots.push(map[p.id]);
    }
  });

  // Sort by date
  const sortByDate = (items) => {
    items.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    items.forEach((item) => sortByDate(item.children));
    return items;
  };

  return sortByDate(roots);
}

// Generate avatar color from initials
export function getAvatarColor(initials) {
  const colors = [
    'bg-rust-400',
    'bg-sage-500',
    'bg-blue-500',
    'bg-purple-500',
    'bg-amber-500',
    'bg-teal-500',
    'bg-pink-500',
    'bg-indigo-500',
  ];
  const index = initials.charCodeAt(0) % colors.length;
  return colors[index];
}

// Truncate text
export function truncate(text, maxLength = 150) {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '…';
}

// Format number (e.g. 1200 → 1.2k)
export function formatCount(n) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

// Generate unique ID
export function generateId(prefix = '') {
  return `${prefix}${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

// Parse tags from comma-separated string
export function parseTags(str) {
  return str
    .split(',')
    .map((t) => t.trim().toLowerCase().replace(/\s+/g, '-'))
    .filter(Boolean)
    .slice(0, 5);
}
