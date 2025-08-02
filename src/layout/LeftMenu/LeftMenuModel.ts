export interface MenuModel {
  id: string;
  label: string;
  icon?: string;
  path: string;
  count?: number;
  isSelected: boolean;
  isPrivate: boolean;
  children?: MenuModel[];
}

export interface Section {
  id: string;
  label?: string;
  isPrivate: boolean;
  menuList: MenuModel[];
}
