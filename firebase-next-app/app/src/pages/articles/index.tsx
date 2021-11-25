import { NextPage } from "next";
import Header from "../../components/layout/Header";
import { useContext } from "react";
import { AuthContext } from "../../auth/AuthProvider";
import ArticleLists from "../../components/articles/ArticleLists";

interface ArticlesProps {}

const Articles: NextPage<ArticlesProps> = () => {
  const { currentUser } = useContext(AuthContext);
  return (
    <div>
      <Header />
      <ArticleLists />
    </div>
  );
};
//
export default Articles;
