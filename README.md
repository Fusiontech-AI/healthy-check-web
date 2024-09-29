## 平台简介

* 本仓库为前端技术栈 [Vue3](https://v3.cn.vuejs.org) + [TS](https://www.typescriptlang.org/) + [Element Plus](https://element-plus.org/zh-CN) + [Vite](https://cn.vitejs.dev) 版本。
* 配套后端代码仓库地址
* [RuoYi-Vue-Plus 5.X(注意版本号)](https://gitee.com/dromara/RuoYi-Vue-Plus)
* [RuoYi-Cloud-Plus 2.X(注意版本号)](https://gitee.com/dromara/RuoYi-Cloud-Plus)

## 前端运行

```bash
# 克隆项目
git clone https://gitee.com/JavaLionLi/plus-ui.git

# 安装依赖
npm install --registry=https://registry.npmmirror.com

# 启动服务
npm run dev

# 构建生产环境 
npm run build:prod

# 前端访问地址 http://localhost:80
```

## 本框架与RuoYi的业务差异

| 业务     | 功能说明                                    | 本框架 | RuoYi            |
|--------|-----------------------------------------|-----|------------------|
| 租户管理   | 系统内租户的管理 如:租户套餐、过期时间、用户数量、企业信息等         | 支持  | 无                |
| 租户套餐管理 | 系统内租户所能使用的套餐管理 如:套餐内所包含的菜单等             | 支持  | 无                |
| 用户管理   | 用户的管理配置 如:新增用户、分配用户所属部门、角色、岗位等          | 支持  | 支持               |
| 部门管理   | 配置系统组织机构（公司、部门、小组） 树结构展现支持数据权限          | 支持  | 支持               |
| 岗位管理   | 配置系统用户所属担任职务                            | 支持  | 支持               |
| 菜单管理   | 配置系统菜单、操作权限、按钮权限标识等                     | 支持  | 支持               |
| 角色管理   | 角色菜单权限分配、设置角色按机构进行数据范围权限划分              | 支持  | 支持               |
| 字典管理   | 对系统中经常使用的一些较为固定的数据进行维护                  | 支持  | 支持               |
| 参数管理   | 对系统动态配置常用参数                             | 支持  | 支持               |
| 通知公告   | 系统通知公告信息发布维护                            | 支持  | 支持               |
| 操作日志   | 系统正常操作日志记录和查询 系统异常信息日志记录和查询             | 支持  | 支持               |
| 登录日志   | 系统登录日志记录查询包含登录异常                        | 支持  | 支持               |
| 文件管理   | 系统文件展示、上传、下载、删除等管理                      | 支持  | 无                |
| 文件配置管理 | 系统文件上传、下载所需要的配置信息动态添加、修改、删除等管理          | 支持  | 无                |
| 在线用户管理 | 已登录系统的在线用户信息监控与强制踢出操作                   | 支持  | 支持               |
| 定时任务   | 运行报表、任务管理(添加、修改、删除)、日志管理、执行器管理等         | 支持  | 仅支持任务与日志管理       |
| 代码生成   | 多数据源前后端代码的生成（java、html、xml、sql）支持CRUD下载 | 支持  | 仅支持单数据源          |
| 系统接口   | 根据业务代码自动生成相关的api接口文档                    | 支持  | 支持               |
| 服务监控   | 监视集群系统CPU、内存、磁盘、堆栈、在线日志、Spring相关配置等     | 支持  | 仅支持单机CPU、内存、磁盘监控 |
| 缓存监控   | 对系统的缓存信息查询，命令统计等。                       | 支持  | 支持               |
| 在线构建器  | 拖动表单元素生成相应的HTML代码。                      | 支持  | 支持               |
| 使用案例   | 系统的一些功能案例                               | 支持  | 不支持              |

## 演示图例

|                                                                                            |                                                                                            |
|--------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------|
| ![输入图片说明](https://foruda.gitee.com/images/1680077524361362822/270bb429_1766278.png "屏幕截图") | ![输入图片说明](https://foruda.gitee.com/images/1680077619939771291/989bf9b6_1766278.png "屏幕截图") |
| ![输入图片说明](https://foruda.gitee.com/images/1680077681751513929/1c27c5bd_1766278.png "屏幕截图") | ![输入图片说明](https://foruda.gitee.com/images/1680077721559267315/74d63e23_1766278.png "屏幕截图") |
| ![输入图片说明](https://foruda.gitee.com/images/1680077765638904515/1b75d4a6_1766278.png "屏幕截图") | ![输入图片说明](https://foruda.gitee.com/images/1680078026375951297/eded7a4b_1766278.png "屏幕截图") |
| ![输入图片说明](https://foruda.gitee.com/images/1680078237104531207/0eb1b6a7_1766278.png "屏幕截图") | ![输入图片说明](https://foruda.gitee.com/images/1680078254306078709/5931e22f_1766278.png "屏幕截图") |
| ![输入图片说明](https://foruda.gitee.com/images/1680078287971528493/0b9af60a_1766278.png "屏幕截图") | ![输入图片说明](https://foruda.gitee.com/images/1680078308138770249/8d3b6696_1766278.png "屏幕截图") |
| ![输入图片说明](https://foruda.gitee.com/images/1680078352553634393/db5ef880_1766278.png "屏幕截图") | ![输入图片说明](https://foruda.gitee.com/images/1680078378238393374/601e4357_1766278.png "屏幕截图") |
| ![输入图片说明](https://foruda.gitee.com/images/1680078414983206024/2aae27c1_1766278.png "屏幕截图") | ![输入图片说明](https://foruda.gitee.com/images/1680078446738419874/ecce7d59_1766278.png "屏幕截图") |
| ![输入图片说明](https://foruda.gitee.com/images/1680078475971341775/149e8634_1766278.png "屏幕截图") | ![输入图片说明](https://foruda.gitee.com/images/1680078491666717143/3fadece7_1766278.png "屏幕截图") |
| ![输入图片说明](https://foruda.gitee.com/images/1680078558863188826/fb8ced2a_1766278.png "屏幕截图") | ![输入图片说明](https://foruda.gitee.com/images/1680078574561685461/ae68a0b2_1766278.png "屏幕截图") |
| ![输入图片说明](https://foruda.gitee.com/images/1680078594932772013/9d8bfec6_1766278.png "屏幕截图") | ![输入图片说明](https://foruda.gitee.com/images/1680078626493093532/fcfe4ff6_1766278.png "屏幕截图") |
| ![输入图片说明](https://foruda.gitee.com/images/1680078643608812515/0295bd4f_1766278.png "屏幕截图") | ![输入图片说明](https://foruda.gitee.com/images/1680078685196286463/d7612c81_1766278.png "屏幕截图") |
| ![输入图片说明](https://foruda.gitee.com/images/1680078703877318597/56fce0bc_1766278.png "屏幕截图") | ![输入图片说明](https://foruda.gitee.com/images/1680078716586545643/b6dbd68f_1766278.png "屏幕截图") |
| ![输入图片说明](https://foruda.gitee.com/images/1680078734103217688/eb1e6aa6_1766278.png "屏幕截图") | ![输入图片说明](https://foruda.gitee.com/images/1680078759131415480/73c525d8_1766278.png "屏幕截图") |
| ![输入图片说明](https://foruda.gitee.com/images/1680078779416197879/75e3ed02_1766278.png "屏幕截图") | ![输入图片说明](https://foruda.gitee.com/images/1680078802329118061/77e10915_1766278.png "屏幕截图") |
| ![输入图片说明](https://foruda.gitee.com/images/1680078893627848351/34a1c342_1766278.png "屏幕截图") | ![输入图片说明](https://foruda.gitee.com/images/1680078928175016986/f126ec4a_1766278.png "屏幕截图") |
| ![输入图片说明](https://foruda.gitee.com/images/1680078941718318363/b68a0f72_1766278.png "屏幕截图") | ![输入图片说明](https://foruda.gitee.com/images/1680078963175518631/3bb769a1_1766278.png "屏幕截图") |
| ![输入图片说明](https://foruda.gitee.com/images/1680078982294090567/b31c343d_1766278.png "屏幕截图") | ![输入图片说明](https://foruda.gitee.com/images/1680079000642440444/77ca82a9_1766278.png "屏幕截图") |
| ![输入图片说明](https://foruda.gitee.com/images/1680079020995074177/03b7d52e_1766278.png "屏幕截图") | ![输入图片说明](https://foruda.gitee.com/images/1680079039367822173/76811806_1766278.png "屏幕截图") |
| ![输入图片说明](https://foruda.gitee.com/images/1680079274333484664/4dfdc7c0_1766278.png "屏幕截图") | ![输入图片说明](https://foruda.gitee.com/images/1680079290467458224/d6715fcf_1766278.png "屏幕截图") |
### 商业合作

- 如果您想使用功能更完善的体检系统，请联系电话：15927241173或者微信15927241173

- 如果您想基于体检系统进行定制开发，我们提供有偿定制服务支持

- 其他合作模式不限，欢迎来撩！

- 联系我们（商务请联系电话：15927241173 或者 微信15927241173）
### 关于我们

公司名称：湖北福鑫科创信息技术有限公司
地址：湖北省武汉市东湖新技术开发区关山大道泛悦城T2写字楼14层
电话：027-87705383（固话）   15927241173（移动电话）
业务合作：heyuyu@fuiontech.cn
公司主页：www.fusiontech.cn


### 交流咨询群

部署安装遇到问题或者想加入社区交流学习、或者是对社区有其他的想法参与等等，扫描下方二维码联系福小鑫获取帮助 
https://github.com/Fusiontech-AI/healthy-check-web/blob/fa29f39ee3948ba100fc7dc7f375805f707e6bd7/%E5%9B%BE%E7%89%871.png
微信联系方式：15927241173
若群满，则可添加个人微信进群
https://github.com/Fusiontech-AI/healthy-check-web/blob/fa29f39ee3948ba100fc7dc7f375805f707e6bd7/%E5%9B%BE%E7%89%872.png

