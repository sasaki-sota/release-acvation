import type { NextPage } from "next";
import AboutPage from "../components/rootPage/AboutPage";
import { useContext, useEffect, useState } from "react";
import LandingPage from "../components/rootPage/LandingPage";
import ContactPage from "../components/rootPage/ContactPage";
import QuestionPage from "../components/rootPage/QuestionPage";
import { AuthContext } from "../auth/AuthProvider";
import { query, collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { User } from "../interface";

const Home: NextPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  useEffect(() => {
    let tmpUsers: User[] = [];
    const q = query(collection(db, "users"));
    onSnapshot(q, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const data = doc.data() as User;
        tmpUsers.push(data);
      });
      setUsers(tmpUsers);
    });
  }, []);

  const [headerFlag, setHeaderFlag] = useState<
    "landing" | "about" | "contact" | "question"
  >("landing");
  return (
    <main className="bg-white font-open-sans">
      <header className="h-24 sm:h-32 flex items-center">
        <div className="container mx-auto pl-8 flex items-center justify-between">
          <button onClick={() => setHeaderFlag("landing")}>
            <div className="uppercase text-blue-700 flex flex-col items-center">
              <div className="text-2xl">
                Acne<strong className="font-bold">Com</strong>
              </div>
              <small className="tracking-widest">
                A platform for skin concerns
              </small>
            </div>
          </button>
          <div className="flex items-center">
            <nav className="text-gray-900 tracking-widest text-sm font-bold lg:flex items-center hidden uppercase">
              <button
                onClick={() => setHeaderFlag("landing")}
                className="py-2 px-8 hover:underline"
              >
                HOME
              </button>
              <button
                className="py-2 px-8 hover:underline"
                onClick={() => setHeaderFlag("about")}
              >
                About
              </button>
              <button
                className="py-2 px-8 hover:underline"
                onClick={() => setHeaderFlag("contact")}
              >
                CONTACT
              </button>
              <button
                className="py-2 px-8 hover:underline"
                onClick={() => setHeaderFlag("question")}
              >
                FAQ
              </button>
            </nav>
            <button className="ml-4 w-6 h-6 flex flex-col lg:hidden mr-8">
              <span className="w-6 h-px bg-gray-900 mb-1 rounded"></span>
              <span className="w-6 h-px bg-gray-900 mb-1 rounded"></span>
              <span className="w-6 h-px bg-gray-900 mb-1 rounded"></span>
            </button>
          </div>
        </div>
      </header>
      {headerFlag === "landing" && <LandingPage users={users} />}
      {headerFlag === "about" && <AboutPage />}
      {headerFlag === "contact" && <ContactPage />}
      {headerFlag === "question" && <QuestionPage />}
    </main>
  );
};

export default Home;
