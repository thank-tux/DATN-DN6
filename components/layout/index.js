import Header from "../header";

export default function Layout({ children }) {
  return (
    <div>
      <Header />
      {children}
    </div>
  );
}
