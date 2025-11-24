# Tailwind CSS 使用指南

## ✅ 已完成配置

Tailwind CSS 已成功配置到项目中！

### 配置文件

```
react-client/
├── tailwind.config.js    # Tailwind 配置
├── postcss.config.js     # PostCSS 配置
└── src/
    ├── index.css         # Tailwind 指令
    └── main.tsx          # 导入 CSS
```

## 🎨 使用方式

### 方式 1：直接在 JSX 中使用 Tailwind 类名

```tsx
function Button() {
  return (
    <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
      点击我
    </button>
  );
}
```

### 方式 2：查看 AppTailwind.tsx 示例

我已经创建了一个完整的 Tailwind 版本：

```tsx
// src/components/AppTailwind.tsx
import { AppTailwind } from './components/AppTailwind';

// 使用
<AppTailwind />
```

## 📚 常用 Tailwind 类名

### 1. 布局

```tsx
// Flexbox
<div className="flex items-center justify-between">

// Grid
<div className="grid grid-cols-3 gap-4">

// 容器
<div className="container mx-auto px-4">

// 间距
<div className="m-4 p-6">     // margin padding
<div className="mt-2 mb-4">   // margin-top margin-bottom
<div className="space-y-4">   // 子元素垂直间距
```

### 2. 颜色

```tsx
// 背景色
<div className="bg-blue-500">
<div className="bg-gray-100">
<div className="bg-green-600">

// 文字颜色
<p className="text-red-500">
<p className="text-gray-700">

// Hover 状态
<button className="bg-blue-500 hover:bg-blue-600">
```

### 3. 文字

```tsx
// 大小
<h1 className="text-4xl">
<p className="text-sm">
<p className="text-base">

// 粗细
<p className="font-bold">
<p className="font-medium">
<p className="font-light">

// 对齐
<p className="text-center">
<p className="text-left">
<p className="text-right">
```

### 4. 尺寸

```tsx
// 宽度
<div className="w-full">      // 100%
<div className="w-1/2">       // 50%
<div className="w-64">        // 16rem

// 高度
<div className="h-screen">    // 100vh
<div className="h-32">        // 8rem
<div className="min-h-screen"> // 最小高度
```

### 5. 边框和圆角

```tsx
// 边框
<div className="border border-gray-300">
<div className="border-2 border-blue-500">

// 圆角
<div className="rounded">      // 4px
<div className="rounded-lg">   // 8px
<div className="rounded-full"> // 完全圆形
```

### 6. 阴影

```tsx
<div className="shadow">      // 小阴影
<div className="shadow-md">   // 中等阴影
<div className="shadow-lg">   // 大阴影
<div className="shadow-xl">   // 超大阴影
```

### 7. 响应式

```tsx
// 移动端优先
<div className="text-sm md:text-base lg:text-lg">
//               ↑ 默认   ↑ 768px+    ↑ 1024px+

// 断点
sm:  640px
md:  768px
lg:  1024px
xl:  1280px
2xl: 1536px
```

### 8. 状态

```tsx
// Hover
<button className="hover:bg-blue-600">

// Focus
<input className="focus:ring-2 focus:ring-blue-500">

// Disabled
<button className="disabled:opacity-50 disabled:cursor-not-allowed">

// Active
<button className="active:scale-95">
```

## 🎯 实战示例

### 示例 1：美化按钮

```tsx
// 之前（普通 CSS）
<button className="button">提交</button>

// 之后（Tailwind）
<button className="px-6 py-2 bg-green-500 text-white font-medium rounded-lg shadow hover:bg-green-600 hover:shadow-lg transition-all duration-200 active:scale-95">
  提交
</button>
```

### 示例 2：卡片组件

```tsx
function Card({ title, content }: { title: string; content: string }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow">
      <h3 className="text-xl font-bold text-gray-800 mb-3">
        {title}
      </h3>
      <p className="text-gray-600">
        {content}
      </p>
    </div>
  );
}
```

### 示例 3：表单输入

```tsx
<div className="space-y-4">
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      用户名
    </label>
    <input
      type="text"
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      placeholder="请输入用户名"
    />
  </div>
</div>
```

### 示例 4：加载状态

```tsx
function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      <p className="ml-4 text-gray-600">加载中...</p>
    </div>
  );
}
```

### 示例 5：响应式网格

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <div className="bg-white p-6 rounded-lg shadow">卡片 1</div>
  <div className="bg-white p-6 rounded-lg shadow">卡片 2</div>
  <div className="bg-white p-6 rounded-lg shadow">卡片 3</div>
</div>
```

## 🔧 切换到 Tailwind 版本

### 方式 1：修改 main.tsx

```tsx
// src/main.tsx
import { AppTailwind } from './components/AppTailwind';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppTailwind />  {/* 使用 Tailwind 版本 */}
  </React.StrictMode>
);
```

### 方式 2：重写现有组件

参考 `AppTailwind.tsx`，将自定义 CSS 改为 Tailwind 类名。

## 💡 Tailwind CSS 优势

### ✅ 优点

1. **快速开发**：不需要写 CSS 文件
2. **一致性**：设计系统内置
3. **响应式**：内置断点系统
4. **性能好**：生产环境自动清除未使用的样式
5. **可维护**：样式和结构在一起

### ❌ 缺点

1. **类名长**：HTML 可能看起来很复杂
2. **学习曲线**：需要记住类名
3. **定制化**：高度定制可能需要配置

## 📖 学习资源

- [Tailwind CSS 官方文档](https://tailwindcss.com/docs)
- [Tailwind UI 组件](https://tailwindui.com/)
- [Headless UI](https://headlessui.com/) - 无样式组件库
- [在线 Playground](https://play.tailwindcss.com/)

## 🎨 VS Code 扩展

推荐安装以下扩展提升开发体验：

1. **Tailwind CSS IntelliSense**
   - 自动补全 Tailwind 类名
   - 悬停预览样式

2. **Prettier Plugin for Tailwind**
   - 自动排序 Tailwind 类名

## 🚀 下一步

1. ✅ 配置完成
2. 📝 查看 `AppTailwind.tsx` 示例
3. 🎨 用 Tailwind 重写你的组件
4. 🔧 自定义 `tailwind.config.js` 配置

开始使用 Tailwind CSS 吧！🎉
