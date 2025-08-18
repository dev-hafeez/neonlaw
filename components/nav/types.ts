export interface NavLink { title: string; href: string; showAll?: boolean }

export interface DropdownProps {
  title: string;
  links: NavLink[];
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}