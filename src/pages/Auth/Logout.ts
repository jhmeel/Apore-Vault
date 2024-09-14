import { signOut } from "firebase/auth";
import { auth } from "../../firebase";

const Logout = async () => {
  try {
    await signOut(auth);
    console.info("Logged out");
  } catch (error) {
    console.error("Logout failed:", error);
  }
};

export default Logout;
