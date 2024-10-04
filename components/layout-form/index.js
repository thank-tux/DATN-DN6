import Image from "next/image";
export default function LayoutForm({ children }) {
  return (
    <div className="min-h-[100vh]">
      <div className="container m-auto flex">
        <div className="w-[45%]">
          <Image
            className="h-[80vh] w-[auto]"
            src={
              "https://static.vecteezy.com/system/resources/previews/015/407/636/original/read-more-inspirational-motivational-quote-cute-lettering-book-reading-meme-and-shelf-with-books-phrase-for-poster-banner-print-children-s-room-decor-illustration-vector.jpg"
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
