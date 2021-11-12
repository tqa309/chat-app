import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase/config";
import { Spinner } from "@chakra-ui/react";
import { useRouter } from "next/router";

export const AuthContext = React.createContext({
  user: { displayName: "", email: "", uid: "", photoURL: "", isOnline: true },
  handleSignout: () => {},
});

const initialState = {
  displayName: "",
  email: "",
  uid: "",
  photoURL: "",
  isOnline: true,
};

function AuthProvider({ children }) {
  const [user, setUser] = useState(initialState);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        const { displayName, email, uid, photoURL } = user;
        setUser({
          displayName,
          email,
          uid,
          photoURL,
          isOnline: true,
        });
        setIsLoading(false);
        router.push("/");
        return;
      }
      setIsLoading(false);
      router.push("/login");
    });

    return unsubscribe;
  }, []);

  const handleSignout = () => {
    router.push("/login");
    const usersRef = db.collection("users");
    usersRef
      .where("uid", "==", user.uid)
      .get()
      .then((snap) => {
        usersRef.doc(snap.docs[0].id).update({ isOnline: false });
      });
    auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, handleSignout }}>
      {isLoading ? <Spinner /> : children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
