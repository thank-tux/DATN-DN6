import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { addDataWithID } from "@/feature/firebase/firebaseAuth";

const nameDB = "users";

export default async function handle(req, res) {
  const { method } = req;

  if (method === "POST") {
    const { account, password, phone, name, role, lock } = req.body;

    try {
      // Create a new user with email and password using Firebase Authentication
      const auth = getAuth();
      const { user } = await createUserWithEmailAndPassword(
        auth,
        account,
        password
      );

      // Add user data to the Firestore (or Realtime Database)
      await addDataWithID(nameDB, user.uid, {
        account,
        phone,
        name,
        role,
        lock,
      });

      res.status(200).json({ login: true }); // Response after successful registration
    } catch (error) {
      console.error("Error creating account:", error);
      res.status(500).json({ message: "Something went wrong" });
    }
  }

  if (method === "PUT") {
    try {
      const { newPassword, uid } = req.body;
      const auth = getAuth();
      const user = auth.currentUser;

      if (user && user.uid === uid) {
        await user.updatePassword(newPassword); // Update user password securely
        res.status(200).json({ success: true });
      } else {
        res.status(400).json({
          success: false,
          message: "User not authenticated or not found",
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Something went wrong" });
    }
  }

  if (method === "GET") {
    const { id } = req.query;
    try {
      // Fetch user data by ID (assuming `getItem` retrieves from Firestore)
      const data = await getItem(nameDB, id);
      res.status(200).json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Something went wrong" });
    }
  }
}
