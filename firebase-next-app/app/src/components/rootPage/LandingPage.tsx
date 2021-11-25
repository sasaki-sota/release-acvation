import { NextPage } from "next";
import Image from "next/image";
import { signInWithPopup } from "@firebase/auth";
import { auth, db, provider } from "../../firebase";
import { NextRouter, useRouter } from "next/router";
import { FcGoogle } from "react-icons/fc";
import CopyIcon from "../layout/CopyIcon";
import { doc, setDoc } from "@firebase/firestore";
import { User } from "../../interface";

interface LandingPageProps {
    users: User[]
}

const LandingPage: NextPage<LandingPageProps> = ({users}) => {
  const router: NextRouter = useRouter();
  const signInWithGoogle = () => {
    signInWithPopup(auth, provider)
      .then(async (result) => {
          // ユーザーが既に存在するかどうかを確認する
          let userFlag: boolean = false
        const user = result.user;
        users.map((registerUser) => {
            if (registerUser.uid == user.uid) {
                // 既にいたらフラグをtrueにする
                userFlag = true
            }
        })
          // 存在しない場合
        if (userFlag === false) {
            // TODO クラス作って初期化するのもいいかもしれない
            const userRef = doc(db, "users", user.uid);
            setDoc(
                userRef,
                {
                    uid: user.uid,
                    displayName: user.displayName,
                    email: user.email,
                    photoURL: user.photoURL,
                    affiliation: null, // 所属
                    content: null, //自己紹介
                    isWorry: null, //悩んでいるか
                    whenWorry: null, //いつから悩んでいるか
                    firstName: null, //苗字
                    lastName: null, //名前
                    gender: null, //性別
                    phoneNumber: null, //電話番号
                    currentAddress: null, //住所
                    favoriteEats: null, //好きな食べ物
                    birthday: null, //誕生日
                },
                { merge: true }
            );
        }
        router.push(`/articles`);
      })
      .catch((error) => {
        console.log("error-code:", error.code);
        console.log("error-message:", error.message);
      });
  };

  return (
    <div className="container mx-auto px-8 py-8 lg:py-40 relative flex flex-col lg:flex-row items-center">
      <div className="lg:w-1/2 flex flex-col items-center lg:items-start">
        <h1 className="text-center lg:text-left text-3xl sm:text-5xl font-light text-blue-700 leading-tight mb-4">
          Our recruiting strategy{" "}
          <strong className="font-black text-3xl sm:text-4xl block">
            hit your hiring plan
          </strong>
        </h1>
        <p className="text-center lg:text-left sm:text-lg text-gray-500 lg:pr-40 leading-relaxed">
          You must be able to convey information via phone, email, and in
          person. You want to make sure your tone is always professional but
          friendly.
        </p>
        <button
          className="bg-gray-300 hover:bg-blue-100 text-white font-bold py-2 px-4 rounded mt-10"
          onClick={signInWithGoogle}
        >
          <h3 className="text-3xl text-black">
            <FcGoogle color="white" size={50} />
            Sign in or Login with Google
          </h3>
        </button>
        <div className="mt-16 lg:mt-24 flex">
          <CopyIcon />
        </div>
      </div>
      <div className="w-full sm:w-2/3 lg:absolute top-0 right-0 bottom-0 mt-16 lg:mr-8">
        <Image src="/exploring.svg" layout="fill" />
      </div>
    </div>
  );
};

export default LandingPage;
