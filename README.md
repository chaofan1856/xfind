# 华语创作者榜

华语创作者的每日公开情报。首页是发帖、评论、涨粉、曝光四张冠军榜，旁边有近七日冠军和纪录殿堂；账号榜、推文榜、话题榜、长文榜和账号页都用同一份样本。

现在的名字、数字和帖子都是虚构的，用来把产品结构跑通。概念上，「一日」在北京时间 08:00 截稿。

线上地址：[https://chaofan1856.github.io/xfind/](https://chaofan1856.github.io/xfind/)

## 本地运行

```bash
npm i
npm run dev
```

开发服务器在 [http://localhost:43123/xfind/](http://localhost:43123/xfind/)。根路径会转到 `/xfind/`，因为这是一个 GitHub Pages 项目站。

```bash
npm run build
npm run preview
```

`npm run build` 会先做类型检查和样本校验，再把静态站点输出到 `dist/`。预览地址是 [http://localhost:43124/xfind/](http://localhost:43124/xfind/)。

## 部署到 GitHub Pages

这个仓库按项目站发布，公开地址是：

**https://chaofan1856.github.io/xfind/**

构建根路径写在 `src/site.config.ts` 的 `base`，当前是 `"/xfind/"`。工作流在 `.github/workflows/pages.yml`：推送到 `main` 后安装依赖、执行 `npm run build`，再用 GitHub Pages 官方 Action 发布 `dist/`。

一次性设置：

1. 打开仓库 **Settings → Pages**。
2. **Build and deployment** 的 **Source** 选 **GitHub Actions**。
3. 推送到 `main`，或在 Actions 里手动跑 “Deploy to GitHub Pages”。

如果工作流提示 Pages 还没打开，做完上面的 Source 选择再重跑一次即可。只需要做这一次。

换一种站点时改 `base`：

| 站点 | `base` | 例子 |
| --- | --- | --- |
| 用户站 / 组织站 | `"/"` | `https://username.github.io/` |
| 项目站 | `"/仓库名/"` | `https://username.github.io/xfind/` |

也可以不改文件，在构建时设置环境变量 `VITE_BASE`（要带首尾斜线，例如 `/xfind/`）。工作流会读取同名的仓库变量；变量为空时仍用配置文件。改完需要重新构建。

深链接靠 `dist/404.html`。GitHub Pages 对不存在的路径返回这个文件，它再把地址改写成 `/?/路径`，`index.html` 用 `history.replaceState` 还原，React Router 就能打开 `/account/某句柄` 这类地址。

## 改名字

站名、英文短标、标语、简介和 Pages 根路径都在 `src/site.config.ts`。页面标题和页眉读的是这份配置。

## 换成真实数据

页面不直接读样本文件，只调用 `src/data/api.ts` 里的函数，例如 `getDailyBoards()`、`listAccounts()`、`getAccount()`。返回形状在 `src/types.ts`。

样本本身在 `src/data/`：

- `accounts.ts` 账号
- `posts.ts` 二十四小时热帖
- `topics.ts` 话题
- `articles.ts` 长文
- `records.ts` 纪录殿堂
- `weekly.ts` 近七日冠军
- `meta.ts` 样本日、统计窗和七日区间

接上接口时，保持这些函数的入参和返回值，把函数体换成请求即可。样本日现在是固定的 `2026-11-21`，真实数据可以改 `meta.ts`，或让接口返回同样的字段。收藏和复制链接只用浏览器的 `localStorage`，没有后端。
