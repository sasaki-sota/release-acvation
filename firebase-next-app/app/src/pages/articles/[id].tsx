import { doc, onSnapshot } from "firebase/firestore";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import { useEffect } from "react";
import Header from "../../components/layout/Header";
import { db } from "../../firebase";
import { Article, initArticle, initUser, User } from "../../interface";
import "github-markdown-css/github-markdown-light.css";
import ArticleFormPreview from "../../components/articles/ArticleFormPreview";
import ArticlePreview from "../../components/articles/ArticlePreview";
import { AiOutlineTags } from "react-icons/ai";
import { FaBeer } from "react-icons/fa";
import Link from "next/link";
import CopyIcon from "../../components/layout/CopyIcon";

interface ArticlePageProps {}

const ArticlePage: NextPage<ArticlePageProps> = () => {
  const [article, setArticle] = useState<Article>(initArticle);
  // 記事の投稿者
  const [articleUser, setArticleUser] = useState<User>(initUser);
  // TODO 後でライブテンプレートへ格納
  // これで詳細ページのクエリを取得できる
  // https://nextjs.org/docs/routing/dynamic-routes
  const router = useRouter();
  const { id } = router.query;
  const { uid } = router.query;

  useEffect(() => {
    const unsubArticle =
      // @ts-ignore
      // TOD　ここも後でなんとかする　現状：　Next.jsの帰ってくる型がstring or string[] or undefinedのため合致しない
      onSnapshot(doc(db, "articles", id), (doc) => {
        const d = doc.data() as Article;
        setArticle(d);
      });

    const unsubArticleuser =
      // @ts-ignore
      //クエリパラメータで受け取る
      onSnapshot(doc(db, "users", uid), (doc) => {
        const d = doc.data() as User;
        setArticleUser(d);
      });

    return () => {
      unsubArticle();
      unsubArticleuser();
    };
  }, []);

  const createdDate: Date = article.createdAt.toDate();
  // https://itsakura.com/js-createdDate
  // Dateフォーマットから作成できる
  // TODO function.tsへ移行する
  const formatDate =
    createdDate.getFullYear() +
    "年" +
    (createdDate.getMonth() + 1) +
    "月" +
    createdDate.getDate() +
    "日";

  return (
    <div>
      <Header />
      <div className="flex justify-center h-full bg-green-200">
        <div className="container bg-white">
          <h1 className="text-5xl text-gray-500 text-center mt-20">
            {article.title}
          </h1>
          <div className="text-center mx-auto">
            <span
              className="inline-block rounded-full text-white 
            bg-blue-400 hover:bg-blue-500 duration-300 
            text-xl font-bold 
            md:mr-2 mb-2 px-2 md:px-4 py-1 
            opacity-90 hover:opacity-100 text-center mt-5"
            >
              {article.genre === "acne" && <p>ニキビ</p>}
            </span>
          </div>
          <div className="text-right mr-10">
            <h3 className="underline text-2xl text-gray-500 mb-10">
              投稿者：　
              <Link href={`/users/${articleUser.uid}`}>
                {articleUser.displayName}
              </Link>{" "}
              <br />
              投稿日：　{formatDate}
            </h3>
          </div>
          <div className="mx-32 border">
            <ArticlePreview content={article.content} />
          </div>
          <div className="m-14 text-center">
            <CopyIcon />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticlePage;
