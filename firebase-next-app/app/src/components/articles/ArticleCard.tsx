import { NextPage } from "next";
import { Article, initUser, User } from "../../interface";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";

interface ArticleCardProps {
  article: Article;
}

const ArticleCard: NextPage<ArticleCardProps> = ({ article }) => {
  const articleDate: Date = article.createdAt.toDate();
  const [articleUser, setArticleUser] = useState<User>(initUser);

  // function.ts へ移行
  const formatDate =
    articleDate.getFullYear() +
    "年" +
    (articleDate.getMonth() + 1) +
    "月" +
    articleDate.getDate() +
    "日";

  //TODO 子供のコンポーネントの方で取得しているので親側で取得してuseContextなどで渡せるようにするのが理想
  useEffect(() => {
    onSnapshot(doc(db, "users", article.userUid), (doc) => {
      const d = doc.data() as User;
      setArticleUser(d);
    });
  });

  return (
    <div className="mx-auto px-4 py-8 max-w-xl ">
      <Link href={`/articles/${article.id}?uid=${article.userUid}`}>
        <a>
          <div className="bg-white shadow-2xl rounded-lg mb-6 tracking-wide">
            <div className="md:flex-shrink-0">
              <Image
                src="/click.svg"
                height={256}
                width={400}
                className="rounded-lg rounded-b-none"
              />
            </div>
            <div className="px-4 py-2 mt-2">
              <h2 className="font-bold text-2xl text-gray-800 tracking-normal">
                {article.title}
              </h2>
              <p className="text-right text-md underline text-gray-500 mt-5">
                投稿日時：　{formatDate}
              </p>
              <div className="author flex items-center -ml-3 my-3">
                <div className="user-logo">
                  {/* 画像の方は複数のものの可能性があるためtypeOfで弾こうとも思ったがnullが残ってしまうためとりあえずは無視しておく */}
                  {articleUser?.photoURL ? (
                    <Image
                      src={articleUser?.photoURL}
                      width={48}
                      height={48}
                      className="rounded-full"
                    />
                  ) : (
                    <Image
                      src="/click.svg"
                      width={48}
                      height={48}
                      className="rounded-full"
                    />
                  )}
                </div>
                <h2 className="ml-5 text-sm tracking-tighter text-gray-900">
                  <a href="#">By {articleUser.displayName}</a>{" "}
                </h2>
              </div>
            </div>
          </div>
        </a>
      </Link>
    </div>
  );
};

export default ArticleCard;
