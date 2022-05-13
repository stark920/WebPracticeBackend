const FormData = require('form-data');
const axios = require('axios');

const options = {
  method: 'post',
  url: 'https://api.imgur.com/3/image/',
  headers: {
    Authorization: `Bearer ${process.env.IMGUR_TOKEN}`,
  },
  mimeType: 'multipart/form-data',
};

const MyImgur = {
  uploadImage: async (files) => {
    if (!files) return;
    
    const result = [];

    for (const file of files) {
      const form = new FormData();
      form.append('image', Buffer.from(file.buffer), file.originalname);
      form.append('album', process.env.IMGUR_ALBUM);

      await axios({ ...options, data: form })
        .then((res) => {
          result.push({
            deleteHash: res.data.data.deletehash,
            url: res.data.data.link,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }

    return result;
  },
  deleteImage: async (hash) => {
    axios
      .delete(`${options.url}${hash}`, { headers: options.headers })
      .then((res) => {
        if (res.data.success) {
          return '刪除成功';
        }
      })
      .catch(() => {
        return '刪除失敗，請稍後再試';
      });
  },
};

module.exports = MyImgur;
