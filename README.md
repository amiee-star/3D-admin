# 文件规范

- components 类 (方便 react-devtool 调试时获取具体虚拟 dom 的组件名,尽早定位 bug)
  - [小写目录名].[小写文件名].tsx
    - export default [目录名][文件名] (注意首字母大写)
- pages 类 (方便 react-devtool 调试时获取具体虚拟 dom 的名称,尽早定位 bug)

  - [小写目录名]
    - [小文件名].tsx
      - export default [目录名][文件名] (注意首字母大写)

- services 类 (方便 TS 调用并进行代码提示)
  - service.[小写服务名].ts
- utils 类 (方便 TS 调用并进行代码提示)
  - [小写组件名].func.ts
  - [小写组件名].util.ts
  - [小写组件名].other.ts
