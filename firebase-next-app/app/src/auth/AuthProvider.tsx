import { createContext, FC, useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, onSnapshot } from "@firebase/firestore";
import { User } from "../interface";

type AuthContextProps = {
  currentUser: User | null | undefined;
  signInFlag: boolean;
};

// 初期値
const AuthContext = createContext<AuthContextProps>({
  currentUser: undefined,
  signInFlag: false,
});

interface AuthProviderProps {
  children: any;
}

const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null | undefined>(
    undefined
  );
  // ログインしているかどうか
  const [signInFlag, setSignInFlag] = useState<boolean>(false);

  useEffect(() => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        onSnapshot(doc(db, "users", user.uid), (doc) => {
          const d = doc.data() as User;
          setCurrentUser(d);
          setSignInFlag(true);
        });
      } else {
        setSignInFlag(true);
      }
    });
  }, []);

  if (signInFlag) {
    return (
      <AuthContext.Provider value={{ currentUser, signInFlag }}>
        {children}
      </AuthContext.Provider>
    );
  } else {
    //TODO ロードのコンポーネントを作っておしゃれに
    return <p>loading...</p>;
  }
};

export { AuthContext, AuthProvider };
