export interface HeaderModel {
  logo: {
    img?: string;
    text?: string;
  };
  showSearch: boolean;
  showAlarm: boolean;
  profile: ProfileSectionModel[];
  notifications: NotificationModel[];
}

export enum PROFILE_CLICK {
  NEW_TAB = "new_tab",
  SAME_TAB = "same_tab",
  LOG_OUT = "logout",
}

export interface ProfileSectionModel {
  id: string;
  list: ProfileModel[];
}

export interface ProfileModel {
  id: string;
  text: string;
  subText?: string;
  path?: string;
  icon?: string;
  click?: PROFILE_CLICK;
}
export interface NotificationModel {
  id: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}
