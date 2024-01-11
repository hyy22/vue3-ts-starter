/**
 * 同步iconfont
 * 根据提供的css url下载样式及字体文件
 * 添加到package.json => npm pkg set scripts.iconfont="node scripts/iconfont.mjs"
 * yarn iconfont xxxurl
 * 在main.ts中导入iconfont.css
 * tips: 为了让iconfont和ui框架（如vant）更好契合，请统一字体和图标类名
 */
import axios from 'axios';
import {
  createWriteStream,
  readFileSync,
  writeFileSync,
  existsSync,
  mkdirSync,
} from 'fs';
import { fileURLToPath } from 'url';
import { resolve } from 'path';

// 文件保存地址
const ICONFONT_DIR = fileURLToPath(
  new URL('../src/assets/iconfont', import.meta.url)
);
if (!existsSync(ICONFONT_DIR)) {
  mkdirSync(ICONFONT_DIR, { recursive: true });
}
/**
 * 下载文件
 */
async function downloadFile(url, name) {
  let res, rej;
  const p = new Promise((resolve, reject) => {
    res = resolve;
    rej = reject;
  });
  try {
    const response = await axios.get(url, { responseType: 'stream' });
    const writeable = createWriteStream(resolve(ICONFONT_DIR, name));
    response.data.pipe(writeable);
    writeable.on('finish', res);
    writeable.on('error', rej);
  } catch (e) {
    rej(e);
  }
  return p;
}
/**
 * 匹配并替换文本
 */
function matchText(text, regExp, replacer) {
  return text.replace(regExp, replacer);
}
/**
 * 入口
 */
(async () => {
  // 获取链接
  const [cssUrl] = process.argv.slice(2);
  // 下载css文件
  await downloadFile(cssUrl, 'iconfont.css');
  // 替换文本
  const p = resolve(ICONFONT_DIR, 'iconfont.css');
  const result = matchText(
    readFileSync(p, 'utf-8'),
    /'(\/\/[^']+)'/g,
    (_, t) => {
      const r = /\/([^/?#]+)(?:[?#]|$)/;
      const name = t.match(r)[1];
      // 下载文件
      downloadFile(t, name);
      // 替换文本
      return `'./${name}'`;
    }
  );
  writeFileSync(p, result, 'utf-8');
})();
