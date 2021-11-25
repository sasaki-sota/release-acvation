import { NextPage } from "next";
import Header from "../../../components/layout/Header";
import { useForm } from "react-hook-form";
import { User } from "../../../interface";
import { useContext, useState } from "react";
import { AuthContext } from "../../../auth/AuthProvider";
import { doc, setDoc } from "@firebase/firestore";
import { db, storage } from "../../../firebase";
import { useRouter } from "next/router";
import "cropperjs/dist/cropper.css";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { getDownloadURL, ref, uploadBytesResumable } from "@firebase/storage";
import Image from "next/image";
import {
  Backdrop,
  Box,
  Button,
  LinearProgress,
  Modal,
  Typography,
} from "@material-ui/core";
import { Cropper } from "react-cropper";

interface UserEditPageProps {}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    modal: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    paper: {
      backgroundColor: theme.palette.background.paper,
      border: "2px solid #000",
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
  })
);

const UserEditPage: NextPage<UserEditPageProps> = () => {
  const { currentUser } = useContext(AuthContext);
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<User>();
  const router = useRouter();
  const onSubmit = handleSubmit((data) => {
    // @ts-ignore
    const userRef = doc(db, "users", currentUser.uid);
    setDoc(
      userRef,
      {
        uid: currentUser?.uid,
        displayName: data.displayName,
        email: data.email,
        affiliation: data.affiliation, // 所属
        content: data.content, //自己紹介
        isWorry: data.isWorry, //悩んでいるか
        whenWorry: data.whenWorry, //いつから悩んでいるか
        firstName: data.firstName, //苗字
        lastName: data.lastName, //名前
        gender: data.gender, //性別
        phoneNumber: data.phoneNumber, //電話番号
        currentAddress: data.currentAddress, //住所
        favoriteEats: data.favoriteEats, //好きな食べ物
        birthday: data.birthday, //誕生日
      },
      { merge: true }
    );
    router.push(`/users/${currentUser?.uid}`);
  });

  // -------------------------Storage state---------------------
  const [image, setImage] = useState<any>("");
  const [error, setError] = useState<string>("");
  const [progress, setProgress] = useState<number>(100);
  const [imageName, setImageName] = useState<string>("");
  const classes = useStyles(); //Material-ui
  const [cropper, setCropper] = useState<any>();
  const [open, setOpen] = useState<boolean>(false);
  const [openCircularProgress, setOpenCircularProgress] =
    useState<boolean>(false); //処理中みたいモーダル

  const handleImage = (e: any) => {
    setError("");
    try {
      const image = e.target.files[0];
      setImageName(image.name); //アップロード時のファイル名で使用
      e.preventDefault();
      let files;
      if (e.dataTransfer) {
        files = e.dataTransfer.files;
      } else if (e.target) {
        files = e.target.files;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(files[0]);
      setOpen(true);
      e.target.value = null; //ファイル選択された内容をクリアする（クリアしないと同じファイルが編集できない）
    } catch (e) {
      // @ts-ignore
      e.target.value = null;
      setError("画像の切り取りをキャンセルまたは失敗しました");
      setOpen(false);
    }
  };

  const getCropData = async (e: any) => {
    e.preventDefault();
    if (typeof cropper !== "undefined") {
      //デフォルトのPNGはファイルサイズが大きいのでjpegにする
      let imagedata = await cropper.getCroppedCanvas().toDataURL("image/jpeg");

      // アップロード処理
      console.log("アップロード処理");
      const storageRef = storage.ref("profile-images/"); //どのフォルダの配下に入れるかを設定
      const imagesRef = storageRef.child(imageName); //ファイル名

      console.log("ファイルをアップする行為");
      const upLoadTask = imagesRef.putString(imagedata, "data_url");

      console.log("タスク実行前");
      setOpenCircularProgress(true);

      upLoadTask.on(
        "state_changed",
        (snapshot) => {
          console.log("snapshot", snapshot);
          const percent =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(percent + "% done");
          setProgress(percent);
        },
        (error) => {
          console.log("err", error);
          setError("ファイルアップに失敗しました。" + error);
          setProgress(100); //実行中のバーを消す
          setOpen(false);
          setOpenCircularProgress(false);
        },
        () => {
          upLoadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            // TODO　ts-ignore使わなくてもいい方法を考える
            // @ts-ignore
            const userRef = doc(db, "users", currentUser.uid);
            setDoc(
              userRef,
              {
                photoURL: downloadURL,
              },
              { merge: true }
            );

            console.log("File available at", downloadURL);
            setOpen(false);
            setOpenCircularProgress(false);
          });
        }
      );
    }
    return;
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleCircularProgressClose = () => {
    setOpenCircularProgress(false);
  };

  function LinearProgressWithLabel(props: any) {
    return (
      <Box display="flex" alignItems="center">
        <Box width="100%" mr={1}>
          <LinearProgress variant="determinate" {...props} />
        </Box>
        <Box minWidth={35}>
          <Typography variant="body2" color="textSecondary">{`${Math.round(
            props.value
          )}%`}</Typography>
        </Box>
      </Box>
    );
  }

  return (
    <div>
      <Header />
      <form onSubmit={onSubmit}>
        <div className="container mx-auto my-5 p-5 bg-gray-300">
          <div className="md:flex no-wrap md:-mx-2 ">
            <div className="w-full md:w-3/12 md:mx-2">
              <div className="bg-white p-3 border-t-4 border-green-400">
                <div className="image overflow-hidden">
                  <form>
                    <div className="text-center mx-auto mt-5">
                      <label>写真を変更する</label>
                      <input type="file" onChange={handleImage} />
                    </div>
                  </form>
                  {currentUser?.photoURL ? (
                    <Image
                      src={currentUser?.photoURL}
                      width={400}
                      height={400}
                    />
                  ) : (
                    <Image src="/click.svg" width={400} height={400} />
                  )}
                  <Modal
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    className={classes.modal}
                    open={open}
                    onClose={handleClose}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                      timeout: 500,
                    }}
                  >
                    <div className={classes.paper}>
                      <h2
                        id="transition-modal-title"
                        style={{ textAlign: "center" }}
                      >
                        画像の切り抜き
                      </h2>
                      <Cropper
                        style={{ height: 400, width: "100%" }}
                        initialAspectRatio={1}
                        aspectRatio={1}
                        preview=".img-preview"
                        src={image}
                        viewMode={1}
                        guides={true}
                        minCropBoxHeight={10}
                        minCropBoxWidth={10}
                        background={false}
                        responsive={true}
                        autoCropArea={1}
                        checkOrientation={false}
                        onInitialized={(instance: any) => {
                          setCropper(instance);
                        }}
                      />
                      <Button
                        variant="contained"
                        size="large"
                        fullWidth
                        color="primary"
                        onClick={getCropData}
                      >
                        選択範囲で反映
                      </Button>
                      <Button
                        variant="contained"
                        size="large"
                        fullWidth
                        onClick={handleClose}
                      >
                        キャンセル
                      </Button>
                    </div>
                  </Modal>
                  <Modal
                    className={classes.modal}
                    open={openCircularProgress}
                    onClose={handleCircularProgressClose}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                      timeout: 500,
                    }}
                  >
                    <div
                      className={classes.paper}
                      style={{ textAlign: "center" }}
                    >
                      <div>現在処理中です。</div>
                      {progress !== 100 && (
                        <LinearProgressWithLabel value={progress} />
                      )}
                    </div>
                  </Modal>
                </div>
                <div className="mt-3">
                  <input
                    defaultValue={currentUser?.displayName}
                    {...register("displayName", { required: true })}
                    className="px-5 block mx-auto w-4/5 rounded-lg border h-14 text-xl
                             font-bold focus:outline-none mb-3 shadow-lg"
                    placeholder="表示名を入力"
                  />
                  {errors.displayName && (
                    <p className="text-red-500 text-xs italic">
                      表示名を入力してください！
                    </p>
                  )}
                </div>
                <div>
                  <input
                    defaultValue={currentUser?.affiliation}
                    {...register("affiliation")}
                    className="block mx-auto w-4/5 rounded-lg border focus:outline-none shadow-lg"
                    placeholder="所属先を入力"
                  />
                </div>
                <p className="text-sm text-gray-500 hover:text-gray-600 leading-6">
                  <textarea
                    {...register("content")}
                    defaultValue={currentUser?.content}
                    placeholder="自己紹介を入力"
                    className="w-full h-full border shadow-xl mb-5 h- rounded-xl focus:outline-none py-4 mt-3"
                  />
                </p>
                <ul className="bg-gray-100 text-gray-600 hover:text-gray-700 hover:shadow py-2 px-3 divide-y rounded shadow-sm">
                  <li className="flex items-center py-3">
                    <span>現在の状況</span>
                    <span className="ml-auto">
                      <select {...register("isWorry")}>
                        <option value="worry">悩んでいる</option>
                        <option value="littleWorry">少し悩んでいる</option>
                        <option value="notWorry">悩んでいない</option>
                      </select>
                    </span>
                  </li>
                  <li className="flex items-center py-3">
                    <span>いつからか</span>
                    <span className="ml-auto">
                      <input
                        type="month"
                        placeholder="whenWorry"
                        {...register("whenWorry")}
                      />
                    </span>
                  </li>
                </ul>
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
                      {/* @ts-ignore */}
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
                      <div className="px-4 py-2">
                        <input
                          defaultValue={currentUser?.firstName}
                          {...register("firstName")}
                          className="block mx-auto w-4/5 rounded-lg border focus:outline-none shadow-lg"
                          placeholder="山田"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2">
                      <div className="px-4 py-2 font-semibold">名前</div>
                      <div className="px-4 py-2">
                        <input
                          defaultValue={currentUser?.lastName}
                          {...register("lastName")}
                          className="block mx-auto w-4/5 rounded-lg border focus:outline-none shadow-lg"
                          placeholder="太郎"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2">
                      <div className="px-4 py-2 font-semibold">性別</div>
                      <div className="px-4 py-2">
                        <select {...register("gender")}>
                          <option value="male">男性</option>
                          <option value="female">女性</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2">
                      <div className="px-4 py-2 font-semibold">電話番号</div>
                      <div className="px-4 py-2">
                        <input
                          defaultValue={currentUser?.phoneNumber}
                          {...register("phoneNumber")}
                          className="block mx-auto w-4/5 rounded-lg border focus:outline-none shadow-lg"
                          placeholder="+81 123456789"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2">
                      <div className="px-4 py-2 font-semibold">現在の住所</div>
                      <div className="px-4 py-2">
                        <input
                          defaultValue={currentUser?.currentAddress}
                          {...register("currentAddress")}
                          className="block mx-auto w-4/5 rounded-lg border focus:outline-none shadow-lg"
                          placeholder="群馬県桐生市"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2">
                      <div className="px-4 py-2 font-semibold">
                        好きな食べ物
                      </div>
                      <div className="px-4 py-2">
                        <input
                          defaultValue={currentUser?.favoriteEats}
                          {...register("favoriteEats")}
                          className="block mx-auto w-4/5 rounded-lg border focus:outline-none shadow-lg"
                          placeholder="ホタテ"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2">
                      <div className="px-4 py-2 font-semibold">
                        メールアドレス
                      </div>
                      <div className="px-4 py-2">
                        <input
                          defaultValue={currentUser?.email}
                          {...register("email")}
                          className="block mx-auto w-4/5 rounded-lg border focus:outline-none shadow-lg"
                          readOnly={true}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2">
                      <div className="px-4 py-2 font-semibold">誕生日</div>
                      <div className="px-4 py-2">
                        <input type="month" {...register("birthday")} />
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  type={"submit"}
                  className="block w-full text-blue-800 text-sm font-semibold rounded-lg hover:bg-gray-100 focus:outline-none focus:shadow-outline focus:bg-gray-100 hover:shadow-xs p-3 my-4"
                >
                  保存する
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default UserEditPage;
