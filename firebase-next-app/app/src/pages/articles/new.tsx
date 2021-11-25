import { NextPage } from "next";
import Header from "../../components/layout/Header"
import ArticleForm from "../../components/articles/ArticleForm"

interface ArticleNewProps {}

const ArticleNew: NextPage<ArticleNewProps> = () => {
  return (
    <div>
        <Header/>
      <ArticleForm/>
    </div>
  );
};

export default ArticleNew;
