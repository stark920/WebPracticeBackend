const FormData = require('form-data');
const axios = require('axios');
const Image = require('../models/images.model');

const imgur = {
  upload: {
    async single(file) {
      if (!file) return;

      const form = new FormData();
      form.append('image', Buffer.from(file.buffer), file.originalname);
      form.append('album', process.env.IMGUR_ALBUM);

      const options = {
        method: 'post',
        url: 'https://api.imgur.com/3/image/',
        headers: {
          Authorization: `Bearer ${process.env.IMGUR_TOKEN}`,
        },
        mimeType: 'multipart/form-data',
      };
      const uploadToImgur = await axios({ ...options, data: form });
      const result = uploadToImgur.data.data;
      await Image.create({
        url: result.link,
        deleteHash: result.deletehash,
      });

      return result.link;
    },
    async array(files) {
      if (files.length === 0 || !files) return;

      const uploads = [];
      const result = [];
      const imagesDetail = [];
      const options = {
        method: 'post',
        url: 'https://api.imgur.com/3/image/',
        headers: {
          Authorization: `Bearer ${process.env.IMGUR_TOKEN}`,
        },
        mimeType: 'multipart/form-data',
      };

      files.forEach((file) => {
        const form = new FormData();
        form.append('image', Buffer.from(file.buffer), file.originalname);
        form.append('album', process.env.IMGUR_ALBUM);

        uploads.push(axios({ ...options, data: form }));
      });

      const imgurResponses = await Promise.all(uploads);
      imgurResponses.forEach((res) => {
        if (res.status === 200) {
          result.push(res.data.data.link);
          imagesDetail.push({
            url: res.data.data.link,
            deleteHash: res.data.data.deletehash,
          });
        }
      });

      await Image.insertMany(imagesDetail);

      return result;
    },
  },
  delete: async (url) => {
    const imageInfo = await Image.findOne({ url });

    if (!imageInfo) return;

    await Image.findByIdAndRemove(imageInfo._id);
    const options = {
      method: 'delete',
      url: `https://api.imgur.com/3/image/${imageInfo.deleteHash}`,
      headers: {
        Authorization: `Bearer ${process.env.IMGUR_TOKEN}`,
      },
      mimeType: 'multipart/form-data',
    };

    await axios(options);
  },
};

module.exports = imgur;
