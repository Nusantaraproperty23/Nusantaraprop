import { useEffect, useState } from "react"
import ProductItem from "../components/ProductItem"
import axios from "axios"

function App() {
  const [userData, setUserData] = useState(null)
  const [products, setProducts] = useState([])
  const config = {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  }

  const createLog = (body) => {
    axios
      .post("https://propertynusantara.stagging.my.id/api/log/create", body)
      .then((res) => {
        console.log("ok")
      })
  }

  const signIn = async () => {
    const scopes = ["username", "payments", "wallet_address"]
    const authResult = await window.Pi.authenticate(
      scopes,
      onIncompletePaymentFound
    )
    setUserData(authResult)
    localStorage.setItem("userData", JSON.stringify(authResult))
    createLog({ value: "Log Signin", body: JSON.stringify(authResult) })
  }

  const loadProduct = () => {
    axios
      .get("https://propertynusantara.stagging.my.id/api/product/list")
      .then((res) => {
        setProducts(res?.data?.data || [])
      })
  }

  // order
  const orderProduct = async (memo, amount, paymentMetadata) => {
    if (!userData) {
      return signIn()
    }
    const paymentData = { amount, memo, metadata: paymentMetadata }
    const callbacks = {
      onReadyForServerApproval,
      onReadyForServerCompletion,
      onCancel,
      onError,
    }
    const payment = await window.Pi.createPayment(paymentData, callbacks)
    console.log(payment)
    createLog({ value: "Create Order Payment", body: JSON.stringify(payment) })
  }

  const onIncompletePaymentFound = (payment) => {
    console.log("onIncompletePaymentFound", payment)
    createLog({
      value: "onIncompletePaymentFound",
      body: JSON.stringify(payment),
    })
    // return axiosClient.post('/payments/incomplete', {payment});
  }

  const onReadyForServerApproval = (paymentId) => {
    console.log("onReadyForServerApproval", paymentId)
    createLog({
      value: "onReadyForServerApproval",
      body: JSON.stringify({ paymentId }),
    })
    axios.post(
      "https://propertynusantara.stagging.my.id/api/payments/approve",
      { paymentId },
      config
    )
  }

  const onReadyForServerCompletion = (paymentId, txid) => {
    console.log("onReadyForServerCompletion", paymentId, txid)
    createLog({
      value: "onReadyForServerCompletion",
      body: JSON.stringify({ paymentId, txid }),
    })
    // axiosClient.post('/payments/complete', {paymentId, txid}, config);
    axios.post(
      "https://propertynusantara.stagging.my.id/api/payments/complete",
      { paymentId, txid },
      config
    )
  }

  const onCancel = (paymentId) => {
    console.log("onCancel", paymentId)
    createLog({
      value: "onCancel",
      body: JSON.stringify({ paymentId }),
    })
    // return axiosClient.post("/payments/cancelled_payment", { paymentId })
  }

  const onError = (error, payment = null) => {
    console.log("onError", error)
    if (payment) {
      console.log(payment)
      createLog({
        value: "onError",
        body: JSON.stringify(payment),
      })
      // handle the error accordingly
    }
  }

  useEffect(() => {
    signIn()
    loadProduct()
  }, [])

  console.log(userData, "userData")
  return (
    <div className="max-w-lg mx-auto border-x">
      <div className=" bg-white p-4">
        <img
          src="https://i.ibb.co/ZcB9pKt/logo.jpg"
          alt=""
          className="w-14 h-14 rounded-full mx-auto"
        />
      </div>
      {userData && <p>{JSON.stringify(userData)}</p>}
      <div class="grid grid-cols-2 gap-4 mt-8 p-4">
        {products &&
          products.map((item) => (
            <ProductItem
              key={item.id}
              item={item}
              onOrder={() =>
                orderProduct(item.product_name, 3, { productId: item.id })
              }
            />
          ))}
      </div>
    </div>
  )
}

export default App
