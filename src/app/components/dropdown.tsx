import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDownIcon } from "lucide-react";
import { ReactNode } from "react";

export interface DropdownItem {
  label: string;
  onClick?: () => void;
  href?: string;
  type?: 'link' | 'button';
  disabled?: boolean;
}

export interface DropdownProps {
  buttonText: string;
  items?: DropdownItem[];
  children?: ReactNode;
  buttonClassName?: string;
  menuClassName?: string;
  itemClassName?: string;
  position?: 'left' | 'right';
}

export default function Dropdown({
  buttonText,
  items = [],
  children,
  buttonClassName,
  menuClassName,
  itemClassName,
  position = 'right'
}: DropdownProps) {
  const defaultButtonClassName = "inline-flex w-full justify-center gap-x-1.5 rounded-md bg-[var(--color-card)] px-3 py-2 text-sm font-semibold text-[var(--color-foreground)] ring-1 ring-inset ring-[var(--color-border)] hover:bg-[var(--color-muted)] transition-colors duration-200";
  const defaultMenuClassName = `absolute ${position === 'right' ? 'right-0' : 'left-0'} z-100 mt-2 w-56 origin-top-${position} rounded-md bg-[var(--color-card)] outline-1 -outline-offset-1 outline-[var(--color-border)] transition data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in`;


  const renderMenuItem = (item: DropdownItem, index: number) => (
    <MenuItem key={index} disabled={item.disabled}>
      {item.type === 'button' || item.onClick ? (
        <button
          onClick={item.onClick}
          disabled={item.disabled}
          className={`block w-full px-4 py-2 text-left text-sm hover:cursor-pointer ${item.disabled ? 'opacity-50 cursor-not-allowed' : 'text-[var(--color-foreground)] hover:bg-[var(--color-muted)] transition-colors duration-150'}`}
        >
          {item.label}
        </button>
      ) : (
        <a
          href={item.href || "#"}
          className={`block px-4 py-2 text-sm hover:cursor-pointer ${item.disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'text-[var(--color-foreground)] hover:bg-[var(--color-muted)] transition-colors duration-150'}`}
        >
          {item.label}
        </a>
      )}
    </MenuItem>
  );

  return (
    <Menu as="div" className={`relative inline-block  ${menuClassName}`}>
      <MenuButton className={defaultButtonClassName}>
        {buttonText}
        <ChevronDownIcon
          aria-hidden="true"
          className="-mr-1 size-5 text-[var(--color-muted-foreground)]"
        />
      </MenuButton>

      <MenuItems
        transition
        className={defaultMenuClassName}
      >
        <div className="py-1">
          {items.map(renderMenuItem)}
        </div>
      </MenuItems>
    </Menu>
  );
}
