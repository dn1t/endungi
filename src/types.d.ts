interface ResultSuccess<T> {
  success: true;
  data: T;
}

interface ResultError {
  success: false;
  error: any;
}

export type Result<T> = ResultSuccess<T> | ResultError;

export interface RecommendedUser {
  id: string;
  keywords: string[];
  userId: string;
  nickname: string;
  username: string;
  profileImage: string;
  description: string;
}

export interface ProjectInfo {
  id: string;
  name: string;
  thumb: string;
  category:
    | '게임'
    | '생활과 도구'
    | '스토리텔링'
    | '예술'
    | '지식 공유'
    | '기타';
  created: string;
  updated: string;
  staffPicked: string | null;
  ranked: string | null;
  visits: number;
  likes: number;
  comments: number;
}

export interface UserInfo {
  id: string;
  nickname: string;
  username: string;
  description: string;
  shortUrl: string;
  profileImage: string | null;
  coverImage: string | null;
  role: 'member' | 'teacher' | 'admin';
  status: {
    study: number;
    community: any;
    following: number;
    follower: number;
    bookmark: any;
    userStatus: 'USE';
  };
  projects: ProjectInfo[];
  created: string;
}
