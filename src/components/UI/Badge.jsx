import clsx from 'clsx';

export default function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'bg-parchment-200 text-ink-700 dark:bg-ink-700 dark:text-parchment-200',
    pinned: 'bg-rust-100 text-rust-700 dark:bg-rust-900/30 dark:text-rust-300',
    unread: 'bg-sage-100 text-sage-700 dark:bg-sage-900/30 dark:text-sage-300',
    tag: 'bg-parchment-100 text-ink-600 dark:bg-ink-700 dark:text-parchment-300 hover:bg-parchment-200 dark:hover:bg-ink-600 cursor-default',
  };

  return (
    <span className={clsx('badge', variants[variant], className)}>
      {children}
    </span>
  );
}
