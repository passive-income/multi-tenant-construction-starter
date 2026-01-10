export interface SubItem {
  title: string;
  description?: string;
  href: string;
}

export interface MenuItem {
  label: string;
  href: string;
  subItems?: SubItem[];
}

export interface MenuData {
  menuItems: MenuItem[];
}

export default MenuData;
