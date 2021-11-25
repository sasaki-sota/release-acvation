import { NextPage } from "next";
import { NextRouter, useRouter } from "next/router";
import { signOut } from "@firebase/auth";
import { auth } from "../../firebase";
import { useContext } from "react";
import { AuthContext } from "../../auth/AuthProvider";
import Link from "next/link";

interface HeaderProps {}

const Header: NextPage<HeaderProps> = () => {
  const { currentUser } = useContext(AuthContext);
  const router: NextRouter = useRouter();
  const signOutWithGoogle = () => {
    signOut(auth)
      .then(() => {
        console.log("Sign-out successful.");
      })
      .catch((error) => {
        console.log("error-code:", error.code);
        console.log("error-message:", error.message);
      });
    router.push("/");
  };
  return (
    <header className="h-24 sm:h-32 bg-black flex items-center">
      <div className="container mx-auto pl-8 flex items-center justify-between">
        <div className="uppercase text-white flex flex-col items-center">
          <div className="text-2xl">
            Acne<strong className="font-bold">Com</strong>
          </div>
          <small className="tracking-widest">
            A platform for skin concerns
          </small>
        </div>
        <div className="flex items-center">
          <nav className="text-white tracking-widest text-xl font-bold lg:flex items-center hidden uppercase">
            <Link href={`/users/${currentUser?.uid}`}>
              <button className="py-2 px-8 hover:underline">マイページ</button>
            </Link>
            <Link href={`/articles`}>
              <button className="py-2 px-8 hover:underline">記事の一覧</button>
            </Link>
            <Link href={`/articles/new`}>
              <button className="py-2 px-8 hover:underline">記事を投稿</button>
            </Link>
            <button
              className="py-2 px-8 hover:underline"
              onClick={signOutWithGoogle}
            >
              ログアウト
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
