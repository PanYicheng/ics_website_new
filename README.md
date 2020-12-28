# ics.pku.edu.cn setup

Official Website for Intelligent Computing and Sensing Laboratory, Peking University.

## Install

`ics.pku.edu.cn` is built on Node.js and powered by [Brick.JS][brick.js].
`redis-server`, `mongodb`, and `gulp` are need:

Download and install Redis-Server:

<http://redis.io/>

Download and install MongoDB:

<https://www.mongodb.com/download-center#community>

First install node v8.0.0. Then install [gulp][gulp]:

```bash
npm install gulp -g
```

## Build and Run

Clone and build:

```bash
git clone git@github.com:smart-sensing-lab/ics.pku.edu.cn.git
cd ics.pku.edu.cn && npm install
gulp build
```

Create `config.json`, and do your configuration:

```bash
cp config.example.json config.json
vim config.json   # make configurations as needed
```

Run ics with mongoDB and Redis:

```bash
mongod &
redis-server &
npm start
```

## Development

Build and Serve:

```bash
gulp
```

## Admin Users

Update admin users:

1. Update `config.admin` (make sure `config.mongodb` is valid)
2. Run MongoDB
3. `node ./bin/update-admin.js`

## 上传和下载文件
1. 登录 http://ics.pku.edu.cn: 
    username: ics
    password: ics1800
2. 下载文件或数据集：主页导航栏->资源下载->学术文章->下载文件; 数据下载->下载数据集
3. 上传文件或数据集：主页顶层导航->用户名—>管理页面->内容管理: 文件管理->上传文件(文件命名格式如下)

> 注意:
> * PPT或者word需要转换成 PDF格式，文件中需要给出参考文献。
> * 文件命名： 方向_详细的文章名称_YYYYMMDD_姓名.pdf

> 示例：
>* 复杂事件处理_XXXXXX_20180101_姓名.pdf
>* 物联网中间件_XXXXXX_20180101_姓名.pdf
>* 智能交通_XXXXXX_20180101_姓名.pdf
>* 智慧医疗_XXXXXX_20180101_姓名.pdf
>* 自言语言处理_XXXXXX_20180101_姓名.pdf
>* 图像视频处理_XXXXXX_20180101_姓名.pdf
>* 网络安全_XXXXXX_20180101_姓名.pdf


## 网站架构
网站使用node编写，也使用node运行，见runWeb.sh和package.json。node的http服务默认监听在3008端口，如果要修改可以修改config.json的express项下的内容；同时网站需要redis server作为数据支持，默认端口在6379上，也在config.json中配置。 
## 运行
采用systemctl的service运行网站，这样就可以支持自动重启服务。
## 修改网页
网页的内容全部放在bricks文件夹内，页面按照一个个模块的放在每个子的目录内，由js组织在一起呈现。

上传公开文件的话在public/upload目录内，建议按照时间标记命名上传的文件方便迭代。在html上访问公开文件的链接格式为"/upload/xxx.txt"

# Mongoose schema
mongoose scheme是一个在mongodb数据库中组织js对象的方式，可以轻松的实现任意对象的添加、查询、修改和删除。

* 添加：具体操作就是创建这样的一个具有具体值的对象并调用它的save函数
* 查询：调用schema文件的find(obj, selcs, handler)函数，其中obj限定了查询的结果应满足的条件，可以为空;selcs以字符串给出了要提取的属性;handler是处理返回值的函数，参数为(err, docs)
[gulp]: http://gulpjs.com/
[brick.js]: https://github.com/brick-js/brick.js
