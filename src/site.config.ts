/**
 * 站名、短句、简介，以及 GitHub Pages 的根路径。
 * 改这一处即可。构建时如果设置了环境变量 VITE_BASE，以环境变量为准。
 *
 * base:
 * - 用户站或组织站（username.github.io）用 "/"
 * - 项目站（username.github.io/仓库名/）用 "/仓库名/"，本仓库是 "/xfind/"
 */
export const siteConfig = {
  name: '华语创作者榜',
  nameEn: 'Huayu Creator Board',
  tagline: '每天八点，看见谁在被阅读',
  description:
    '面向华语创作者的每日公开情报。发帖、评论、涨粉与曝光，按北京时间 08:00 截稿。眼下展示的是虚构样本。',
  base: '/xfind/',
} as const
