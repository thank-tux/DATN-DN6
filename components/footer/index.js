import { useState, useEffect } from "react";
import axios from "axios";
import CardBody from "../card-body";
import DownloadApp from "../download-app";
import Image from "next/image";

export default function Footer() {
  const [type, setType] = useState(null);
  async function getType() {
    const res = await axios.get("/api/favourite");
    const data = await res.data;
    setType(data);
  }
  useEffect(() => {
    getType();
  }, []);
  if (type !== null) {
    return (
      <div className="bg-[#202124] text-[#ababab]">
        <div className="container m-auto">
          <div className="flex justify-between pt-10">
            <CardBody title={"danh mục sản phẩm"} data={type} />
            <div className="p-4">
              <h2 className="capitalize text-white font-semibold tracking-wide text-lg">
                Về chúng tôi
              </h2>
              <ul>
                <li className="text-sm capitalize">
                  <span className="hover:text-white cursor-pointer">
                    Giới thiệu
                  </span>
                </li>
                <li className="text-sm capitalize">
                  <span className="hover:text-white cursor-pointer">
                    Tin tức
                  </span>
                </li>
              </ul>
            </div>
            <div className="p-4">
              <h2 className="capitalize text-white font-semibold tracking-wide text-lg">
                Liên hệ chúng tôi
              </h2>
              <ul>
                <li className="text-sm capitalize">
                  <span className="hover:text-white cursor-pointer">
                    nhasachthienly@gmail.com
                  </span>
                </li>
              </ul>
            </div>
            <div className="p-4">
              <h2 className="capitalize text-white font-semibold tracking-wide text-lg">
                Chính sách hoạt động
              </h2>
              <ul>
                <li className="text-sm capitalize">
                  <span className="hover:text-white cursor-pointer">
                    chính sách hoạt động
                  </span>
                </li>
                <li className="text-sm capitalize">
                  <span className="hover:text-white cursor-pointer">
                    chính sách quy định
                  </span>
                </li>
                <li className="text-sm capitalize">
                  <span className="hover:text-white cursor-pointer">
                    chính sách bảo mật thông tin
                  </span>
                </li>
              </ul>
            </div>
            <DownloadApp />
          </div>
          <span className="text-xs text-center block py-10">
            Copyright © 2024 D6 Vietnam
          </span>
          <hr />
          <div className="flex justify-between py-10">
            <div className="p-4">
              <h2 className="capitalize text-white font-semibold tracking-wide text-lg">
                NHÀ SÁCH THIÊN LÝ
              </h2>
              <ul>
                <li className="text-sm capitalize">
                  <span className="hover:text-white cursor-pointer">
                    Số 235 Hòa Khánh, Liên Chiểu,TP.Đà Nẵng
                  </span>
                </li>
                <li className="text-sm capitalize">
                  <span className="hover:text-white cursor-pointer">
                    Điện thoại: 0362272070
                  </span>
                </li>
                <li className="text-sm capitalize">
                  <span className="hover:text-white cursor-pointer">
                    Email: nhasachthienly@gmail.com
                  </span>
                </li>
              </ul>
            </div>
            {/* <Image
              width={205}
              height={77}
              alt=""
              src=""
            /> */}
          </div>
        </div>
      </div>
    );
  }
}
