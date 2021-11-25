import { Timestamp } from "firebase/firestore";

export type User = {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string | null;
  affiliation?: string; // 所属
  content?: string; //自己紹介
  isWorry?: "worry" | "littleWorry" | "notWorry"; //悩んでいるか
  whenWorry?: Date; //いつから悩んでいるか
  firstName?: string; //苗字
  lastName?: string; //名前
  gender?: "female" | "male"; //性別
  phoneNumber?: string; //電話番号
  currentAddress?: string; //住所
  favoriteEats?: string; //好きな食べ物
  birthday?: Date; //誕生日
};

export const initUser: User = {
  uid: "",
  displayName: "",
  email: "",
  photoURL: "",
  affiliation: "",
  content: "",
  isWorry: undefined,
  whenWorry: undefined,
  firstName: "",
  lastName: "",
  gender: undefined,
  phoneNumber: "",
  currentAddress: "",
  favoriteEats: "",
  birthday: undefined,
};

// https://tedate.jp/firebase/format-the-time-obtained-using-timestamp
export type Article = {
  id: string; // ユニークな記事のID
  userUid: string; // 投稿者のID
  title: string; // 記事のタイトル
  content: string; //記事の内容
  genre: "acne"; // 順次ジャンルができたら追加していく
  createdAt: Timestamp; //作成日時
  updatedAt: Timestamp; //更新日時
};

export const initArticle: Article = {
  id: "",
  userUid: "",
  title: "",
  content: "",
  genre: "acne",
  createdAt: Timestamp.now(),
  updatedAt: Timestamp.now(),
};
