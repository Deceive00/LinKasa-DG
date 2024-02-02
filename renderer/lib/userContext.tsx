import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../../firebase/firebase-config";
import { getDoc, doc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const UserContext = createContext<
  | {
      user: User;
      loading: boolean;
      setUser: React.Dispatch<any>;
      logout: () => void;
    }
  | undefined
>(undefined);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState<User>(null);
  const logout = () => {
    setUser(null);
  };
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log(user)
    const fetchUser = async () => {
      try {
        if (auth.currentUser) {
          const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
          const userCredential = userDoc.data();
          setUser({
            id: auth.currentUser.uid,
            name: userCredential?.name,
            email: userCredential?.email,
            role: userCredential?.role,
          });
        }
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await fetchUser();
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, logout, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
