export interface ChannelInfo {
  channel_check_type: "check"
  channel_code: string;
  channel_creator_id: number;
  channel_id: number;
  channel_name: string;
  channel_user_count:  number;
  created_at: string; // "2024-05-26T09:09:40"
  updated_at: string; // "2024-05-26T09:09:40"
}

export interface getCheckPeriodList {
  checks: string[]; // 체크한 사람 이름 배열
  date: string;
}

export interface getMyCheckList {
  check: string; // O or X
  date: string;
}