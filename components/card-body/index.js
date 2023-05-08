export default function CardBody({ title, data }) {
  return (
    <div className="p-4 pt-10">
      <h2 className="capitalize text-white font-semibold tracking-wide text-lg">
        {title}
      </h2>
      <ul>
        {data.map((item, index) => (
          <li key={index} className="text-sm capitalize">
            <span className="hover:text-white cursor-pointer">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
