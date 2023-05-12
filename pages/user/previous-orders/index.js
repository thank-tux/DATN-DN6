import EmptyCart from "@/components/empty-cart";
import UserBody from "@/components/user-body";

export default function PreviousOrders() {
  return (
    <UserBody>
      <div>
        <h2 className="oswald uppercase text-4xl my-4">các đơn hàng đã đặt</h2>
        <EmptyCart />
      </div>
    </UserBody>
  );
}
