/**
 * 驼峰转横线
 */
export const camel2Line = (str: string) => {
  return str.replace(/([A-Z])/g, '-$1').toLowerCase();
};

/**
 * 横线转驼峰
 */
export const line2Camel = (str: string) => {
  return str.replace(/-(\w)/g, (_, $1) => $1.toUpperCase());
};
