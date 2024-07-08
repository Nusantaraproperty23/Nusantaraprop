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
        <ModalDetail onOrder={onOrder} item={item} user={user} />
      </div>
    </div>
  )
}
