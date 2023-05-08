import { signOut } from "@/feature/firebase/firebaseAuth";
import { useRouter } from "next/router";

export default function User() {
  const router = useRouter();
  const handleSignOut = async () => {
    await signOut();
    router.back("/thuc-don");
  };
  return (
    <div>
      <button onClick={handleSignOut}> signout </button>
    </div>
  );
}
