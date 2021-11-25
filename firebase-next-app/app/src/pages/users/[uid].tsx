import { NextPage } from "next";
import Header from "../../components/layout/Header";
import { Link } from "@material-ui/core";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../auth/AuthProvider";
import Image from "next/image";
import { useRouter } from "next/router";
import { collection, doc, onSnapshot, query } from "firebase/firestore";
import { Article, initUser, User } from "../../interface";
import { db } from "../../firebase";

interface UserPageProps {}

const UserPage: NextPage<UserPageProps> = () => {
  const { currentUser } = useContext(AuthContext);
  const [user, setUser] = useState<User>(initUser);
  const [userArticles, setUserArticles] = useState<Article[]>([]);
  const router = useRouter();
  const { uid } = router.query;
  useEffect(() => {
    // @ts-ignore
    onSnapshot(doc(db, "users", uid), (doc) => {
      const d = doc.data() as User;
      setUser(d);
    });
  }, [uid]);

  useEffect(() => {
    let tmpUserArticles: Article[] = [];
    const q = query(collection(db, "articles"));
    onSnapshot(q, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const data = doc.data() as Article;
        if (data.userUid === user.uid) {
          tmpUserArticles.push(data);
        }
      });
      setUserArticles(tmpUserArticles);
    });
  }, [user]);
  return (
    <div>
      <Header />
      <div className="container mx-auto my-5 p-5 bg-gray-300 h-screen">
        <div className="md:flex no-wrap md:-mx-2 ">
          <div className="w-full md:w-3/12 md:mx-2">
            <div className="bg-white p-3 border-t-4 border-green-400">
              <div className="image overflow-hidden">
                {user.photoURL ? (
                  <Image src={user.photoURL} width={400} height={400} />
                ) : (
                  <Image src="/click.svg" width={400} height={400} />
                )}
              </div>
              <h1 className="text-gray-900 font-bold text-xl leading-8 my-1">
                {user.displayName}
              </h1>
              <h3 className="text-gray-600 font-lg text-semibold leading-6">
                {user.affiliation}
              </h3>
              <p className="text-sm text-gray-500 hover:text-gray-600 leading-6">
                {user.content}
              </p>
              <ul className="bg-gray-100 text-gray-600 hover:text-gray-700 hover:shadow py-2 px-3 mt-3 divide-y rounded shadow-sm">
                <li className="flex items-center py-3">
                  <span>現在の状況</span>
                  <span className="ml-auto">
                    {user.isWorry === "worry" && (
                      <span className="bg-red-500 py-1 px-2 rounded text-white text-sm">
                        悩んでいる
                      </span>
                    )}
                    {user.isWorry === "littleWorry" && (
                      <span className="bg-yellow-500 py-1 px-2 rounded text-white text-sm">
                        少し悩んでいる
                      </span>
                    )}
                    {user.isWorry === "notWorry" && (
                      <span className="bg-green-500 py-1 px-2 rounded text-white text-sm">
                        悩んでいない
                      </span>
                    )}
                  </span>
                </li>
                <li className="flex items-center py-3">
                  <span>いつからか</span>
                  <span className="ml-auto">{user.whenWorry}</span>
                </li>
              </ul>
              <div className="mx-auto text-center mt-7">
                {currentUser?.uid === user.uid && (
                  <Link href={`/users/${user.uid}/edit`}>
                    <button className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded">
                      編集ページへ
                    </button>
                  </Link>
                )}
              </div>
            </div>
          </div>
          <div className="w-full md:w-9/12 mx-2 h-64">
            <div className="bg-white p-3 shadow-sm rounded-sm">
              <div className="flex items-center space-x-2 font-semibold text-gray-900 leading-8">
                <span className="text-green-500">
                  <svg
                    className="h-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </span>
                <span className="tracking-wide">概要</span>
              </div>
              <div className="text-gray-700">
                <div className="grid md:grid-cols-2 text-sm">
                  <div className="grid grid-cols-2">
                    <div className="px-4 py-2 font-semibold">苗字</div>
                    <div className="px-4 py-2">{user.firstName}</div>
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="px-4 py-2 font-semibold">名前</div>
                    <div className="px-4 py-2">{user.lastName}</div>
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="px-4 py-2 font-semibold">性別</div>
                    {user.gender === "male" && (
                      <div className="px-4 py-2">男性</div>
                    )}
                    {user.gender === "female" && (
                      <div className="px-4 py-2">女性</div>
                    )}
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="px-4 py-2 font-semibold">電話番号</div>
                    <div className="px-4 py-2">{user.phoneNumber}</div>
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="px-4 py-2 font-semibold">住所</div>
                    <div className="px-4 py-2">{user.currentAddress}</div>
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="px-4 py-2 font-semibold">好きな食べ物</div>
                    <div className="px-4 py-2">{user.favoriteEats}</div>
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="px-4 py-2 font-semibold">
                      メールアドレス
                    </div>
                    <div className="px-4 py-2">{user.email}</div>
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="px-4 py-2 font-semibold">誕生日</div>
                    <div className="px-4 py-2">{user.birthday}</div>
                  </div>
                </div>
              </div>
            </div>
            <h3 className="my-7 text-3xl text-red-800 underline font-bold text-center">
              {user.displayName}さんが投稿した記事一覧
            </h3>
            <div className="text-cetenr mx-auto mt-10 ">
              {userArticles.map((userArticle: Article, index) => (
                <article
                  className="sm:grid grid-cols-5 ml-44 bg-white shadow-sm p-7 lg:max-w-2xl sm:p-4 rounded-lg mt-5"
                  key={index}
                >
                  <Image
                    src={"/click.svg"}
                    width={128}
                    height={128}
                    alt="ジャンルごとに写真の表示を変更するように設定"
                    className="w-full rounded-lg"
                  />
                  <div className="pt-5 self-center sm:pt-0 sm:pl-10 col-span-3">
                    <h2 className="text-gray-800 capitalize text-xl font-bold mb-7">
                      {userArticle.title}
                    </h2>
                    by {user.displayName}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPage;
