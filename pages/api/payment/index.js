import { addDataWithID } from "@/feature/firebase/firebaseAuth";

export default async function handle(req, res) {
  const { method } = req;
  if (method === "POST") {
    try {
      const { id_user, list_item, date, total } = req.body;

      await addDataWithID("previous-order", id_user, {
        item: { list_item, date, total },
      });
      res.status(200).json({ message: "successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Something went wrong" });
    }
  }
}
