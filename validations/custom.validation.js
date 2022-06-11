const objectId = (value, helpers) => {
  if (!value.match(/^[0-9a-fA-F]{24}$/)) {
    return helpers.message(`{#key} 不是正確的 MongoID 格式`);
  }
  return value;
};

const password = (value, helpers) => {
  if (value.length < 8 || value.length > 20) {
    return helpers.message(`{#key} 長度限制為 8 ~ 20 字元`);
  }
  if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
    return helpers.message(`{#key} 需要包含英文及數字`);
  }
  return value;
};

const gender = (value, helpers) => {
  if (!['male', 'female', 'others'].includes(value)) {
    return helpers.message(`{#key} 只接受 male、female、others 三種內容`);
  }
  return value;
};

const postSortType = (value, helpers) => {
  if (!['hot', 'new', 'old'].includes(value)) {
    return helpers.message(`{#key} 只接受 hot、new、old 三種內容`);
  }
  return value;
};

module.exports = {
  objectId,
  password,
  gender,
  postSortType,
};
