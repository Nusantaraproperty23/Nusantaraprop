import { Button, Form, Input, Modal, Select } from "antd"
import axios from "axios"
import React, { useEffect, useState } from "react"

const ProductItem = ({ onOrder, item, user }) => {
  return (
    <div class=" border rounded-lg">
      <img
        src={
          item.product_image_urll ||
          "https://www.southernliving.com/thmb/_Msu9OCpvE-OUTRvfYxCIJyPbhE=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/27196_AdaptiveCottage00006-2000-7702094217044ce4830a8adb0a69b6da.jpg"
        }
        alt=""
        className="h-30 w-full object-cover rounded-lg "
      />
      <div className=" p-4">
        <p className="font-bold mt-2">{item.product_name}</p>
        <ModalDetail onOrder={onOrder} item={item} user={user} />
      </div>
    </div>
  )
}

const ModalDetail = ({ onOrder, item, user }) => {
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

          <ModalPembayaran onOrder={onOrder} item={item} user={user} />
        </div>
      </Modal>
    </>
  )
}

const ModalPembayaran = ({ onOrder, item, user }) => {
  const [form] = Form.useForm()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [provinsiData, setProvinsiData] = useState([])
  const [kabupatenData, setKabupatenData] = useState([])
  const [kecamatanData, setKecamatanData] = useState([])
  const [kelurahanData, setKelurahanData] = useState([])

  const [provinsiLoading, setProvinsiLoading] = useState(false)
  const [kabupatenLoading, setKabupatenLoading] = useState(false)
  const [kecamatanLoading, setKecamatanLoading] = useState(false)
  const [kelurahanLoading, setKelurahanLoading] = useState(false)

  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleOk = (value) => {
    setIsModalOpen(false)
    onOrder(value)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  const getProvinsi = () => {
    setProvinsiLoading(true)
    axios
      .get(
        "https://propertynusantara.punyakios.com/api/address/master/provinsi"
      )
      .then((res) => {
        setProvinsiLoading(false)
        setProvinsiData(res.data.data)
      })
      .catch((err) => {
        setProvinsiLoading(false)
      })
  }

  const getKabupaten = (prov_id) => {
    setKabupatenLoading(true)
    axios
      .get(
        "https://propertynusantara.punyakios.com/api/address/master/kabupaten/" +
          prov_id
      )
      .then((res) => {
        setKabupatenLoading(false)
        setKabupatenData(res.data.data)
      })
      .catch((err) => {
        setKabupatenLoading(false)
      })
  }

  const getKecamatan = (kab_id) => {
    setKecamatanLoading(true)
    axios
      .get(
        "https://propertynusantara.punyakios.com/api/address/master/kecamatan/" +
          kab_id
      )
      .then((res) => {
        setKecamatanLoading(false)
        setKecamatanData(res.data.data)
      })
      .catch((err) => {
        setKecamatanLoading(false)
      })
  }

  const getKelurahan = (kec_id) => {
    setKelurahanLoading(true)
    axios
      .get(
        "https://propertynusantara.punyakios.com/api/address/master/kelurahan/" +
          kec_id
      )
      .then((res) => {
        setKelurahanLoading(false)
        setKelurahanData(res.data.data)
      })
      .catch((err) => {
        setKelurahanLoading(false)
      })
  }

  useEffect(() => {
    getProvinsi()
  }, [])

  useEffect(() => {
    getKabupaten(user?.provinsi_id)
    getKecamatan(user?.kabupaten_id)
    getKelurahan(user?.kecamatan_id)
  }, [user])
  return (
    <>
      <Button
        type="primary"
        className="bg-blue-600 mt-4 w-full"
        onClick={() => showModal()}
      >
        Beli Sekarang
      </Button>
      <Modal
        title={"Detail Pembelian"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        <div>
          {/* detail */}
          <div className="mt-4">
            <div className="flex items-center justify-between">
              <span>Nama Produk</span>
              <span className="font-bold">{item.product_name}</span>
            </div>

            <div className="flex items-center justify-between">
              <span>Harga</span>
              <span className="font-bold">{item.product_price} phi</span>
            </div>
          </div>

          <div className="mt-4">
            <span className="text-sm font-bold">Informasi Pengguna</span>
            <Form
              form={form}
              layout="vertical"
              initialValues={user}
              className="mt-4"
              onFinish={(value) => handleOk(value)}
            >
              <Form.Item label="Username" name={"username"}>
                <Input placeholder="Input username" readOnly />
              </Form.Item>
              <Form.Item
                label="Nama Lengkap"
                name={"name"}
                rules={[
                  {
                    required: true,
                    message: "Nama Lengkap Tidak Boleh Kosong",
                  },
                ]}
              >
                <Input placeholder="Input Nama Lengkap" />
              </Form.Item>
              <Form.Item
                label="Telepon/No. hp"
                name={"telepon"}
                rules={[
                  {
                    required: true,
                    message: "Telepon Tidak Boleh Kosong",
                  },
                ]}
              >
                <Input placeholder="Input Telepon/No. hp" />
              </Form.Item>
              <Form.Item
                label="Email"
                name={"email"}
                rules={[
                  {
                    required: true,
                    message: "Email Tidak Boleh Kosong",
                  },
                ]}
              >
                <Input placeholder="Input email" />
              </Form.Item>
              <Form.Item
                label="Alamat"
                name={"alamat"}
                rules={[
                  {
                    required: true,
                    message: "Alamat Tidak Boleh Kosong",
                  },
                ]}
              >
                <Input placeholder="Input alamat" />
              </Form.Item>
              <Form.Item
                label="Provinsi"
                name={"provinsi_id"}
                rules={[
                  {
                    required: true,
                    message: "Provinsi Tidak Boleh Kosong",
                  },
                ]}
              >
                <Select
                  placeholder="Pilih Provinsi"
                  loading={provinsiLoading}
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (option?.children?.toLowerCase() ?? "").includes(
                      input.toLowerCase()
                    )
                  }
                  onChange={(val) => getKabupaten(val)}
                >
                  {provinsiData &&
                    provinsiData.map((item) => (
                      <Select.Option key={item.pid} value={item.pid}>
                        {item.nama}
                      </Select.Option>
                    ))}
                </Select>
              </Form.Item>
              <Form.Item
                label="Kota/Kabupaten"
                name={"kabupaten_id"}
                rules={[
                  {
                    required: true,
                    message: "Kota/Kabupaten Tidak Boleh Kosong",
                  },
                ]}
              >
                <Select
                  placeholder="Pilih Kota/Kabupaten"
                  loading={kabupatenLoading}
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (option?.children?.toLowerCase() ?? "").includes(
                      input.toLowerCase()
                    )
                  }
                  onChange={(val) => getKecamatan(val)}
                >
                  {kabupatenData &&
                    kabupatenData.map((item) => (
                      <Select.Option key={item.pid} value={item.pid}>
                        {item.nama}
                      </Select.Option>
                    ))}
                </Select>
              </Form.Item>
              <Form.Item
                label="Kecamatan"
                name={"kecamatan_id"}
                rules={[
                  {
                    required: true,
                    message: "Kecamatan Tidak Boleh Kosong",
                  },
                ]}
              >
                <Select
                  placeholder="Pilih Kecamatan"
                  loading={kecamatanLoading}
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (option?.children?.toLowerCase() ?? "").includes(
                      input.toLowerCase()
                    )
                  }
                  onChange={(val) => getKelurahan(val)}
                >
                  {kecamatanData &&
                    kecamatanData.map((item) => (
                      <Select.Option key={item.pid} value={item.pid}>
                        {item.nama}
                      </Select.Option>
                    ))}
                </Select>
              </Form.Item>
              <Form.Item
                label="Kelurahan"
                name={"kelurahan_id"}
                rules={[
                  {
                    required: true,
                    message: "Kelurahan Tidak Boleh Kosong",
                  },
                ]}
              >
                <Select
                  placeholder="Pilih Kelurahan"
                  loading={kelurahanLoading}
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (option?.children?.toLowerCase() ?? "").includes(
                      input.toLowerCase()
                    )
                  }
                >
                  {kelurahanData &&
                    kelurahanData.map((item) => (
                      <Select.Option key={item.pid} value={item.pid}>
                        {item.nama}
                      </Select.Option>
                    ))}
                </Select>
              </Form.Item>
            </Form>
          </div>

          <Button
            type="primary"
            className="bg-blue-600 mt-4 w-full"
            onClick={() => form.submit()}
          >
            Bayar Sekarang
          </Button>
        </div>
      </Modal>
    </>
  )
}

export default ProductItem
