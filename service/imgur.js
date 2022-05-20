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

const imgur = {
  upload: {
    single: async (file) => {
      if (!file) return;

      const form = new FormData();
      form.append('image', Buffer.from(file.buffer), file.originalname);
      form.append('album', process.env.IMGUR_ALBUM);

      const result = await axios({ ...options, data: form }).then(
        (res) => res.data.data
      );

      return {
        url: result.link,
        deleteHash: result.deletehash,
      };
    },
    array: async (files) => {
      if (!files) return;

      const result = [];

      for (const file of files) {
        const form = new FormData();
        form.append('image', Buffer.from(file.buffer), file.originalname);
        form.append('album', process.env.IMGUR_ALBUM);

        await axios({ ...options, data: form }).then((res) => {
          result.push({
            deleteHash: res.data.data.deletehash,
            url: res.data.data.link,
          });
        });
      }

      return result;
    },
  },
  delete: async (hash) => {
    axios
      .delete(`${options.url}${hash}`, { headers: options.headers })
      .then((res) => {
        if (res.data.success) {
          return '刪除成功';
        }
      });
  },
};

module.exports = imgur;
