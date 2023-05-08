import { useState, useEffect } from "react";
import axios from "axios";
import CardBody from "../card-body";

export default function Footer() {
  const [type, setType] = useState(null);
  async function getType() {
    const res = await axios.get("/api/product");
    const data = await res.data;
    const newData = data.map((item) => {
      return item.type;
    });
    setType(Array.from(new Set(newData)));
  }
  useEffect(() => {
    getType();
  }, []);
  if (type !== null) {
    return (
      <div className="bg-[#202124] text-[#ababab]">
        <div className="container m-auto">
          <CardBody title={"danh mục món ăn"} data={type} />
        </div>
      </div>
    );
  }
}
