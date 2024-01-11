/**
 * 构造文件上传控件
 * @param param0 配置
 */
interface BuildFileInputOptions {
  // 是否支持多选
  multiple?: boolean;
  // 接收类型
  accept?: string;
  // 响应变更
  onChange: (e: Event) => void;
}
export function buildFileInput({
  multiple = false,
  accept = '',
  onChange,
}: BuildFileInputOptions) {
  // 构造elem
  let input = document.createElement('input');
  input.type = 'file';
  input.style.display = 'none';
  input.style.opacity = '0';
  input.style.width = '0';
  input.style.height = '0';
  input.multiple = multiple;
  input.accept = accept;
  input.addEventListener('change', e => {
    onChange(e);
    // @ts-ignore
    input = null;
  });
  document.body.appendChild(input);
  input.click();
  document.body.removeChild(input);
}

/**
 * 图片压缩
 * @param param0 配置
 * @returns
 */
interface ImgOptimizateOptions {
  img: File;
  size?: number;
  quality?: number;
}
export function imgOptimizate({
  img,
  size,
  quality = 0.9,
}: ImgOptimizateOptions): Promise<File> {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.addEventListener('load', e => {
      const result = e.target!.result as string;
      const image = new Image();
      image.addEventListener('load', () => {
        const { width: originalWidth, height: originalHeight } = image;
        if (!size || originalWidth <= size) {
          // return resolve(img);
          size = originalWidth;
        }
        let canvas = document.createElement('canvas');
        const targetWidth = size;
        const targetHeight = (originalHeight * size) / originalWidth;
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
        ctx.drawImage(
          image,
          0,
          0,
          originalWidth,
          originalHeight,
          0,
          0,
          targetWidth,
          targetHeight
        );
        canvas.toBlob(
          b => {
            resolve(new File([b!], img.name, { type: img.type }));
            // @ts-ignore
            canvas = null;
          },
          img.type,
          quality
        );
      });
      image.addEventListener('error', e => reject(e));
      image.src = result;
    });
    fileReader.addEventListener('error', e => reject(e));
    fileReader.readAsDataURL(img);
  });
}
