export function copyText(text: string) {
  try {
    navigator.clipboard.writeText(text);
  } catch (e) {
    let textarea;
    try {
      textarea = document.createElement('textarea');
      textarea.setAttribute('readonly', 'true');
      textarea.setAttribute('contenteditable', 'true');
      textarea.style.position = 'fixed'; // prevent scroll from jumping to the bottom when focus is set.
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      const range = document.createRange();
      range.selectNodeContents(textarea);
      const sel = window.getSelection();
      sel!.removeAllRanges();
      sel!.addRange(range);
      textarea.setSelectionRange(0, textarea.value.length);
      document.execCommand('copy');
    } catch (err) {
      console.error(err);
    } finally {
      document.body.removeChild(textarea!);
    }
  }
}

export function readText() {
  try {
    return navigator.clipboard.readText();
  } catch (e) {
    // 安全问题，无法通过其它方式获取
    return '';
  }
}
