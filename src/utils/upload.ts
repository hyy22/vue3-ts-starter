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
