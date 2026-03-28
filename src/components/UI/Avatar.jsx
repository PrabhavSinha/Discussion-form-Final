import { getAvatarColor } from '../../utils/index.js';

const sizeMap = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-12 h-12 text-lg',
};

export default function Avatar({ user, size = 'sm' }) {
  if (!user) return null;
  const colorClass = getAvatarColor(user.avatar || user.name);

  return (
    <div
      className={`${sizeMap[size]} ${colorClass} rounded-full flex items-center justify-center text-white font-semibold font-mono flex-shrink-0 select-none`}
      aria-label={`Avatar for ${user.name}`}
      role="img"
    >
      {(user.avatar || user.name).slice(0, 2).toUpperCase()}
    </div>
  );
}
