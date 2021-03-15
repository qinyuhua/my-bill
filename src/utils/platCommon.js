import Taro from '@tarojs/taro';

export const AGENTID = '1086284502';
// export const AGENTID = 'dinga85adde7f7f1d2a924f2f5cc6abecb85';
export const ISALIPAYDD = process.env.TARO_ENV === 'alipay' || process.env.TARO_ENV === 'dd';
export const ISH5PLAT = process.env.TARO_ENV === 'h5';
export const ISWEAPP = process.env.TARO_ENV === 'weapp';


export const setTitle = (title = '香溢贷') => {
  if (ISALIPAYDD) {
    // eslint-disable-next-line no-undef
    dd.setNavigationBar({
      title,
    });
  } else {
    console.log(10, title);
    Taro.setNavigationBarTitle({
      title,
    });
  }
};

export const setModal = (option) => {
  const {
    title = '温馨提示',
    content,
    cancelText = '取消',
    confirmText = '确定',
    success = () => {},
    showCancel,
  } = option;
  if (ISALIPAYDD) {
    // eslint-disable-next-line no-undef
    dd.confirm({
      title,
      content,
      showCancel,
      cancelButtonText: cancelText,
      confirmButtonText: confirmText,
      success: (res) => success(res),
    });
  } else {
    Taro.showModal({
      title,
      content,
      cancelText,
      confirmText,
      showCancel,
      success: (res) => success(res),
    });
  }
};

export const getBase64byUrl = (file) => {
  let url = typeof file === 'string' ? file : file.url || file.path;
  let base64 = '';
  let type = typeof file === 'string' ? undefined : file.type || file.file.type;

  return new Promise((resolve) => {
    if (ISALIPAYDD) {
      // eslint-disable-next-line no-undef
      const ctx = dd.createCanvasContext('canvas');
      ctx.drawImage(file, 0, 0);
      ctx.draw(false, () => {
        ctx.toDataURL({}).then((dataURL) => {
          base64 = dataURL;
          resolve(base64);
        });
      });
      return;
    }
    if (ISWEAPP) {
      base64 = Taro.getFileSystemManager().readFileSync(url, 'base64');
      base64 = `data:image/jpeg;base64,${base64}`;
      resolve(base64);
      return;
    }
    if (ISH5PLAT) {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const imgUpload = new Image();
      imgUpload.src = url;
      imgUpload.onload = function () {
        const width = imgUpload.width;
        const height = imgUpload.height;
        canvas.width = width;
        canvas.height = height;

        ctx.drawImage(imgUpload, 0, 0, width, height);
        const dataURL = canvas.toDataURL(type);
        resolve(dataURL);
        return;
      };
    }
  });
};

