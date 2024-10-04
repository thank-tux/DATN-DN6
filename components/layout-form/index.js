import Image from "next/image";
export default function LayoutForm({ children }) {
  return (
    <div className="min-h-[100vh]">
      <div className="container m-auto flex">
        <div className="w-[45%]">
          <Image
            className="h-[100vh] w-[auto]"
            src={
              "https://i.pinimg.com/236x/34/5c/54/345c546b583a65c52fab5dc3b1cceb19.jpg"
            }
            width={1000}
            height={1000}
            alt=""
          />
        </div>
        <div className="w-[55%] px-14">{children}</div>
      </div>
    </div>
  );
}
