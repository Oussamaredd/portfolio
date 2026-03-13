import { Icon } from "./Icons";

export default function MobileNav({ navItems, onNavigate }) {
  return (
    <nav className="fixed top-4 z-50 w-full pl-5 pr-3 sm:pl-8 sm:pr-5">
      <div className="panel mx-auto max-w-5xl px-3 py-2">
        <div className="no-scrollbar flex items-center gap-2 overflow-x-auto">
          {navItems.map((item) => (
            <a
              key={item.label}
              className="flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-[var(--color-text-secondary)] transition-all duration-200 hover:bg-white/[0.06] hover:text-[var(--color-text-primary)]"
              href={item.href}
              onClick={(event) => {
                event.preventDefault();
                onNavigate(item.href);
              }}
              title={item.label}
            >
              <Icon className="h-4 w-4" name={item.icon} />
              <span className="hidden sm:inline">{item.label}</span>
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}

