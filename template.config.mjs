export default {
  prompts: [
    {
      type: 'input',
      name: 'name',
      message: '输入项目名称，如vue3-ts-starter',
      default: process.env.DEFAULT_PROJECT_NAME,
    },
    { type: 'input', name: 'title', message: '输入项目标题，如后台管理系统' },
  ],
  files: ['package.json', 'index.html'],
};
