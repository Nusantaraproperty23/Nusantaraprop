import { useEffect, useState } from "react"
import ProductItem from "./components/ProductItem"
import axios from "axios"
import { Empty, Input, Spin } from "antd"
import { SearchOutlined } from "@ant-design/icons"

function App() {
  const [loading, setLoading] = useState(false)
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
      .post("https://propertynusantara.punyakios.com/api/log/create", body)
      .then((res) => {
        console.log("ok")
      })
  }

  const loginBE = (body) => {
    axios
      .post("https://propertynusantara.punyakios.com/api/auth/login", body)
      .then((res) => {
        setUserData(res.data?.data?.data?.user || {})
        localStorage.setItem(
          "userDataBe",
          JSON.stringify(res.data?.data?.data?.user || {})
        )
      })
      .catch((err) => {})
  }

  const createUserBe = (body) => {
    axios
      .post("https://propertynusantara.punyakios.com/api/auth/createUser", body)
      .then((res) => {
        // alert("success register")
      })
      .catch((err) => {
        // alert("error register" + JSON.stringify(err.response))
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
    loginBE(authResult.user)
  }

  const loadProduct = () => {
    setLoading(true)
    axios
      .get("https://propertynusantara.punyakios.com/api/product/list")
      .then((res) => {
        setLoading(false)
        setProducts(res?.data?.data || [])
      })
      .catch((err) => setLoading(false))
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
    axios
      .post(
        "https://propertynusantara.punyakios.com/api/payments/approve",
        { paymentId },
        config
      )
      .catch((err) => alert(JSON.stringify(err.response)))
  }

  const onReadyForServerCompletion = (paymentId, txid) => {
    console.log("onReadyForServerCompletion", paymentId, txid)
    createLog({
      value: "onReadyForServerCompletion",
      body: JSON.stringify({ paymentId, txid }),
    })
    // axiosClient.post('/payments/complete', {paymentId, txid}, config);
    axios.post(
      "https://propertynusantara.punyakios.com/api/payments/complete",
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
    axios.post(
      "https://propertynusantara.punyakios.com/api/payments/cancel",
      { paymentId },
      config
    )
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

  return (
    <div className="max-w-lg mx-auto border-x h-w">
      <div className=" bg-white p-4">
        <div className="flex items-center font-bold text-lg">
          <img
            src="https://i.ibb.co/ZcB9pKt/logo.jpg"
            alt=""
            className="w-10 h-10 rounded-full"
          />
          <p className="ml-3">Property Nusantara</p>
        </div>

        <div className="mt-8">
          <Input prefix={<SearchOutlined />} placeholder="cari disini" />
        </div>
      </div>
      {/* {userData && <p>{JSON.stringify(userData)}</p>} */}
      {products && products.length > 0 ? (
        <div class="grid grid-cols-2 gap-4 mt-8 p-4">
          {products &&
            products.map((item) => (
              <ProductItem
                key={item.id}
                item={item}
                onOrder={(value) => {
                  createUserBe(value)
                  orderProduct(item.product_name, 3, { productId: item.id })
                }}
                user={userData || getItem("userDataBe")}
              />
            ))}
        </div>
      ) : (
        <div className="h-[80vh] flex items-center justify-center">
          {loading ? <Spin /> : <Empty description="Tidak ada produk disini" />}
        </div>
      )}
    </div>
  )
}

const getItem = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key))
  } catch (error) {
    return localStorage.getItem(key) || {}
  }
}

export default App
