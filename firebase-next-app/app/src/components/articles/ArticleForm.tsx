import { addDoc, collection, doc, setDoc, Timestamp } from "firebase/firestore";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useContext } from "react";
import { useForm } from "react-hook-form";
import { AuthContext } from "../../auth/AuthProvider";
import { db } from "../../firebase";
import { Article } from "../../interface";
import ArticleFormPreview from "./ArticleFormPreview";
import { getUniqueStr } from "../../function";

interface ArticleFormProps {}

const ArticleForm: NextPage<ArticleFormProps> = () => {
  const { currentUser } = useContext(AuthContext);
  const {
    handleSubmit,
    register,
    formState: { errors },
    watch,
  } = useForm();
  const router = useRouter();

  const onSubmit = async (data: Article) => {
    const uniqueId: string = getUniqueStr();
    // こうすることによってIDを参照すれば削除できるようになる（ユーザー側と同じ構成
    // 参考サイト：　https://firebase.google.com/docs/firestore/manage-data/delete-data?hl=ja
    await setDoc(doc(db, "articles", uniqueId), {
      id: uniqueId, //　ランダムなユニークID
      userUid: currentUser?.uid, // 投稿者のID
      title: data.title, // 記事のタイトル
      content: data.content, //記事の内容
      genre: data.genre,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    // https://nextjs-ja-translation-docs.vercel.app/docs/routing/dynamic-routes
    //　資料に従ってuidと記事のidを渡して詳細画面の方でデータ取得できるようにする
    router.push(`/articles/${uniqueId}?uid=${currentUser?.uid}`);
  };

  return (
    <div className="h-screen flex flex-col">
      <div className="pl-9 pt-9">
        <h1 className="text-center text-4xl font-bold text-gray-600 py-10">
          新しく記事を投稿
        </h1>
        <label className="block text-center">
          <span className="text-gray-700 text-2xl underline mb-5">
            ジャンルを選択
          </span>
          <select
            className="form-select block w-64 my-5 mx-auto border text-xl"
            {...register("genre", { required: true })}
          >
            {/*順次新しいジャンルを追加していく*/}
            <option value="acne">ニキビ</option>
          </select>
        </label>
        <div className="flex-grow flex-shrink">
          {/* @ts-ignore */}
          <form onSubmit={handleSubmit(onSubmit)} className="h-full">
            <input
              {...register("title", { required: true })}
              className="px-5 block mx-auto w-4/5 rounded-lg border h-14 text-2xl
                             font-bold focus:outline-none mb-8 shadow-lg mt-5"
              placeholder="タイトルを入力"
            />
            {errors.title && (
              <p className="text-red-500 text-xs italic">
                タイトルを入力してください！
              </p>
            )}
            <div className="flex justify-between h-3/5">
              <div className="w-1/2 ml-10">
                <textarea
                  {...register("content", { required: true })}
                  placeholder="マークダウン記法で記述"
                  className="markdown-form resize-none w-full h-full
                                    border shadow-xl mb-5 rounded-xl focus:outline-none py-4 px-2"
                />
                <a
                  href="https://gist.github.com/mignonstyle/083c9e1651d7734f84c99b8cf49d57fa"
                  className="text-xl"
                >
                  マークダウン参考サイトはこちら
                </a>
                {errors.content && (
                  <p className="text-red-500 text-xs italic">
                    本文がないと寂しいです！
                  </p>
                )}
              </div>
              <div className="w-1/2 mr-10">
                <ArticleFormPreview watchData={watch("content")} />
              </div>
            </div>
            <div className="text-center">
              <button
                className="text-center shadow mx-auto bg-green-500 hover:bg-green-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded mt-16"
                type="submit"
              >
                記事を投稿する
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ArticleForm;
