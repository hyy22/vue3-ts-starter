export interface TreeItem extends ObjectType {
  id: number | string;
  label: number | string;
  children?: TreeItem[];
}
type TreeItemWithoutChildren = Omit<TreeItem, 'children'>;
export function tree2List(
  tree: TreeItem[],
  leafOnly = false
): TreeItemWithoutChildren[] {
  const result: TreeItemWithoutChildren[] = [];
  tree.forEach(item => {
    if (!item.children) {
      result.push({ ...item });
    } else {
      if (!leafOnly) {
        result.push(excludeProperty(item, 'children'));
      }
      result.push(...tree2List(item.children, leafOnly));
    }
  });
  return result;
}

// 排除对象属性
function excludeProperty<T, K extends keyof T>(obj: T, prop: K): Omit<T, K> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { [prop]: excluded, ...rest } = obj;
  return rest as Omit<T, K>;
}

/**
 * 列表结构转成树结构
 * @param list 列表
 * @param options 配置
 * @returns
 */
interface List2TreeOptions {
  value: (row: ObjectType) => string | number; // value获取方法
  label: (row: ObjectType) => string | number; // label获取方法
  parentValue: (row: ObjectType) => string | number; // 父值获取方法
  rootValue: string | number; // 根值
}
export function list2Tree(
  list: ObjectType[],
  { value, label, parentValue, rootValue = '' }: List2TreeOptions
): TreeItem[] {
  const map = new Map();
  for (const item of list) {
    map.set(value(item), item);
  }
  return list.reduce((prev: TreeItem[], cur) => {
    const p = parentValue(cur);
    const row = Object.assign(cur, { id: value(cur), label: label(cur) });
    if (p === rootValue) {
      prev.push(row);
    } else {
      const parent = map.get(p);
      if (parent) {
        parent.children ? parent.children.push(row) : (parent.children = [row]);
      }
    }
    return prev;
  }, []);
}

/**
 * list转tree，支持层级设置
 */
interface ListToTreeOptions {
  parentId: any;
  maxDepth?: number; // 最大递归层数
  depth?: number; // 当前层数
  getLabel?: (row: ObjectType) => string; // 获取label方法
  getValue?: (row: ObjectType) => any; // 获取value方法
  getParentValue?: (row: ObjectType) => any; // 获取父级value方法
}
export function listToTree(
  list: any[],
  {
    parentId,
    maxDepth = Infinity,
    depth = 0,
    getLabel = row => row.label,
    getValue = row => row.id,
    getParentValue = row => row.parentId,
  }: ListToTreeOptions
): TreeItem[] {
  const tree: TreeItem[] = [];
  for (const item of list) {
    if (getParentValue(item) === parentId) {
      if (depth >= maxDepth) {
        break; // 如果超过最大层级，直接跳出循环
      }
      const value = getValue(item);
      const node: TreeItem = { label: getLabel(item), id: value };
      const children = listToTree(list, {
        parentId: value,
        maxDepth,
        depth: depth + 1,
        getLabel,
        getValue,
        getParentValue,
      });
      if (children.length) {
        node.children = children;
      }
      tree.push(node);
    }
  }
  return tree;
}
