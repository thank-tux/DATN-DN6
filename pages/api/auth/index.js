import {
  updateData,
  getItem,
  addDataWithID,
  signUpWithEmailAndPassword,
} from "@/feature/firebase/firebaseAuth";

const nameDB = "users";

export default async function handle(req, res) {
  const { method } = req;

  if (method === "POST") {
    let payload = null;
    const { account, password } = req.body;
    try {
      const { result, error } = await signUpWithEmailAndPassword(
        account,
        password
      );
      if (!error) {
        await addDataWithID(nameDB, result.user.uid, { ...req.body });
        payload = result;
      } else {
        payload = result;
      }
      res.status(200).json(payload);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Something went wrong" });
    }
  }
  if (method === "PUT") {
    try {
      const data = req.body;
      await updateData(nameDB, data.id, { ...data });
      res.status(200).json({ message: "Data updated successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Something went wrong" });
    }
  }
  if (method === "GET") {
    const { name, id } = req.body;
    try {
      const data = await getItem(name, id);
      res.status(200).json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Something went wrong" });
    }
  }
}
