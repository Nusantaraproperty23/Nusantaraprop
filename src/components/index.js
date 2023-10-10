import { Button, Modal } from "antd"
import React { useState } from "react"

const ProductItem = ({ onOrder, item }) => {
  return (
    <div class=" border rounded-lg">
      <img
        src={
          item.product_image_url ||
          "https://www.southernliving.com/thmb/_Msu9OCpvE-OUTRvfYxCIJyPbhE=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/27196_AdaptiveCottage00006-2000-7702094217044ce4830a8adb0a69b6da.jpg"
        }
        alt=""
        className="h-50 w-full object-cover rounded-lg "
      />
      <div className=" p-4">
        <p className="font-bold mt-2">{item.product_name}</p>
        <ModalDetail onOrder={onOrder} item={item} />
      </div>
    </div>
  )
}

const ModalDetail = ({ onOrder, item }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleOk = () => {
    setIsModalOpen(false)
    onOrder()
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }
  return (
    <>
      <Button
        type="primary"
        className="bg-blue-600 mt-4 w-full"
        onClick={() => showModal()}
      >
        {item.product_price} phi
      </Button>
      <Modal
        title={item.product_name}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        <div>
          <img
            src={
              item.product_image_url ||
              "https://www.southernliving.com/thmb/_Msu9OCpvE-OUTRvfYxCIJyPbhE=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/27196_AdaptiveCottage00006-2000-7702094217044ce4830a8adb0a69b6da.jpg"
            }
            alt=""
            className="h-50 w-full object-cover rounded-lg "
          />

          {/* detail */}
          <div className="mt-4">
            <span className="text-lg font-bold">Deskripsi</span>

            <div className="flex items-center justify-between">
              <span>Lokasi</span>
              <span className="font-bold">
                <a href={item.product_location_url}>Lihat Lokasi</a>
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span>Luas Tanah</span>
              <span className="font-bold">{item.product_lt} m2</span>
            </div>

            <div className="flex items-center justify-between">
              <span>Luas Bangunan</span>
              <span className="font-bold">{item.product_lb} m2</span>
            </div>
          </div>

          <Button
            type="primary"
            className="bg-blue-600 mt-4 w-full"
            onClick={() => handleOk()}
          >
            Beli Sekarang
          </Button>
        </div>
      </Modal>
    </>
  )
}

export default ProductItem

