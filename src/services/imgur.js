function imgurUpload(formData) {
  const access_token = "2ef25152135baec89da8c87fa336651d827f04d2";

  // 返回 fetch 的 Promise
  return fetch("https://api.imgur.com/3/image", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    body: formData,
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      if (data.success) {
        const imageURL = data.data.link;
        const id = data.data.id;

        return { id: id, url: imageURL };
      } else {
        throw new Error(
          `error code: ${data.data.error.code}, ${data.data.error.message}`
        );
      }
    })
    .catch((error) => {
      throw error;
    });
}

export { imgurUpload };
