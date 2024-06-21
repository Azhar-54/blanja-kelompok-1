import axios from "axios";
import Navbar from "../../components/module/Navbar";
import { useEffect, useState } from "react";
import useSnap from "../../hooks/useSnap";
import API from "../../configs/api";
import { useDispatch } from "react-redux";
import { setTokenPayment } from "../../configs/redux/features/userSlice";
import { setValue } from "../../configs/redux/features/paymentSlice";
import { formatCurrency } from "../../utils/formatCurrency";
import { Loader } from "../../components/base/button/loader";

export default function CheckoutPage() {
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(false);
  const [itemCheckout, setItemCheckout] = useState();
  const [data, setData] = useState({
    shipping_address: "Jalan kemana saja",
    status: "waiting payment",
    payment_method: "transfer",
    details: [
      {
        product_id: null,
        product_quantity: null,
      },
    ],
  });
  const { snapEmbed } = useSnap();
  const getItemCheckout = async () => {
    try {
      const res = await API.get("/cart-detail/active");
      setItemCheckout(res?.data?.data);
      if (res?.data?.data?.length <= 1) {
        setData({
          ...data,
          details: [
            {
              product_id: res?.data?.data[0]?.Product?.ID,
              product_quantity: res?.data?.data[0]?.quantity,
            },
          ],
        });
      } else {
        const updatedDetails = res?.data?.data?.map((item) => ({
          product_id: item.product_id,
          product_quantity: item.quantity,
        }));

        setData((prevData) => ({
          ...prevData,
          details: [updatedDetails],
        }));
      }
    } catch (error) {
      console.log(error);
    }
  };
  const pay = async () => {
    setLoading(true);
    try {
      const response = await API.post(`/transaction`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(response);
      // dispatch(setValue(response?.data));
      if (response?.status === 200) {
        window.snap.pay(response?.data?.token);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getItemCheckout();
  }, []);
  return (
    <main>
      <Navbar />
      <div className="px-[10%] py-8">
        <h1 className="font-bold text-3xl">Checkout</h1>
        <p className="mt-5 text-gray-700">Shipping address</p>
        <div className="flex justify-between w-full">
          <div className="flex flex-col gap-2 w-2/3">
            <div className="shadow-lg border border-gray-200 w-full h-[200px] rounded-md"></div>
            {itemCheckout?.map((item) => (
              <div key={item?.ID}>
                <div className="shadow-lg border border-gray-200 w-full h-[150px] px-10 py-5 rounded-md ">
                  <div className="flex justify-between items-center h-full">
                    <div className="flex gap-x-3 items-center">
                      <img
                        src={item?.Product?.product_image[0]?.image}
                        alt=""
                        className="w-20 h-20 rounded-lg"
                      />
                      <div>
                        <h1 className="text-lg font-semibold">
                          {item?.Product?.name}
                        </h1>
                        <p className="text-gray-500 text-sm">
                          {item?.Product?.Store?.name}
                        </p>
                        <p className="text-gray-500 text-xs">
                          {item?.quantity} x{" "}
                          {formatCurrency(item?.Product?.price)}
                        </p>
                      </div>
                    </div>
                    <h1 className="font-bold text-lg">
                      {formatCurrency(item?.total_price)}
                    </h1>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-2 w-1/4">
            <div className="border border-gray-200 rounded-md shadow-lg w-full h-[250px] py-2 px-3">
              <h1 className="font-semibold mb-5">Shopping summary</h1>
              <div className="flex justify-between">
                <div>
                  <p className="text-gray-500 mb-3">Price</p>
                  <p className="text-gray-500 mb-3">Quantity</p>
                </div>
                <div className="text-end font-semibold">
                  <p className="mb-3">
                    {formatCurrency(
                      itemCheckout?.reduce((accumulator, { total_price }) => {
                        return accumulator + total_price;
                      }, 0)
                    )}
                  </p>
                  <p className="mb-3">
                    {itemCheckout?.reduce((accumulator, { quantity }) => {
                      return accumulator + quantity;
                    }, 0)}
                  </p>
                </div>
              </div>

              <div className="border-t border-gray-300 mt-5">
                <div className="flex justify-between mt-2">
                  <h1>Shopping summary</h1>
                  <p className="text-main-red font-semibold">
                    {formatCurrency(
                      itemCheckout?.reduce((accumulator, { total_price }) => {
                        return accumulator + total_price;
                      }, 0)
                    )}
                  </p>
                </div>
                <button
                  disabled={loading}
                  className="bg-main-red rounded-full w-full text-white py-1 mt-7"
                  onClick={pay}
                >
                  {loading ? <Loader /> : "Select payment"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
