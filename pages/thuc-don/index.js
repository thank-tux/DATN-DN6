import axios from "axios";
import { useEffect, useState } from "react";
import ListBody from "@/components/list-body";
import Loader from "@/components/loader";
import CardFood from "@/components/card-food";
import { upserCase, getType, removeAccents } from "@/utils";
import NavScroll from "@/components/nav-scroll";

export default function ThucDon() {
  const [products, setProducts] = useState(null);
  const [types, setTypes] = useState(null);
  const [loading, setLoading] = useState(false);

  async function fecthData() {
    const res = await axios.get("/api/product");
    const data = await res.data;
    setProducts(data);
    setTypes(getType(data));
    setLoading(true);
  }
  useEffect(() => {
    fecthData();
  }, []);
  if (!loading) {
    return <Loader />;
  }
  return (
    <div className="container m-auto">
      <NavScroll type={types} />
      {types.map((item, index) => {
        return (
          <div key={index} className="container m-auto" id={item}>
            <h2 className="text-[28px] font-bold uppercase p-4">{item}</h2>
            <ListBody>
              {products.map(
                (_item, _index) =>
                  upserCase(_item.type) === upserCase(item) && (
                    <CardFood key={_index} {..._item} />
                  )
              )}
            </ListBody>
          </div>
        );
      })}
    </div>
  );
}
