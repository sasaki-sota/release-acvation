import { query, collection, onSnapshot } from "firebase/firestore";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { Article } from "../../interface";
import ArticleCard from "./ArticleCard";

interface ArticleListsProps {}

const ArticleLists: NextPage<ArticleListsProps> = () => {
  const [articles, setArticles] = useState<Article[]>([]);

  // TODO index.tsxに移す方がいいかもしれない
  useEffect(() => {
    let tmpArticles: Article[] = [];
    const q = query(collection(db, "articles"));
    onSnapshot(q, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const data = doc.data() as Article;
        tmpArticles.push(data);
      });
      setArticles(tmpArticles);
    });
  }, []);

  return (
    <section className="blog text-gray-700 body-font">
      <div className="px-5 py-24 mx-auto">
        <div className="flex flex-wrap w-full mb-20 flex-col items-center text-center">
          <h1 className="sm:text-3xl text-2xl font-medium title-font mb-2 text-gray-900">
            {" "}
            Blog
          </h1>
          <p className="lg:w-1/2 w-full leading-relaxed text-base">
            J'aime bien partager mes connaissances et des recherche
            intéressantes, pour le faire j'ai mis en place un blog personnel.
            Nous abordons plusieurs sujets intéressants et je donne quelques
            astuces et conseils aux jeunes développeurs pour mieux s'en sortir.{" "}
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {articles.map((article: Article, index) => (
            <div key={index}>
              <ArticleCard article={article} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ArticleLists;
