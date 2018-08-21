const http = require('http');
const url = require('url');
const artTemplate = require('art-template');
artTemplate.defaults.root = 'views';
artTemplate.defaults.extname = '.html';
const path = require('path');
const mime = require('mime');
const qs = require('querystring');
const fs = require('fs');
//自己的
const datalistcc = require('./getdata');

const server = http.createServer();
server.listen(3000,()=>{
  console.log('Start Run......');
})
server.on('request',(req,res)=>{
  let datalist = datalistcc.feedback;
  let {pathname} = url.parse(req.url);
  if(pathname === '/' || pathname === '/index')
  {
    //返回首页
    let html = artTemplate('index',datalist);
    res.end(html);
  }
  else if(pathname.startsWith('/public') || pathname.startsWith('/node_modules'))
  {
    //加载 css  js images
    let html = artTemplate(path.join(__dirname,pathname),{});
    const type = mime.getType(pathname);
    res.setHeader('Content-Type',type +';charset=utf-8');
    res.end(html);
  }
  else if(pathname === '/publish'){
    //get 请求页面
    if(req.method == 'GET')
    {
      let html = artTemplate('publish',{});
      res.end(html);
    }
    //post 提交数据 并 重定向首页
    else if(req.method == 'POST')
    { 
      let data = '';
      req.on('data',(chunk)=>{
        data += chunk;
      })
      req.on('end',()=>{
        let obj = qs.parse(data);
        if(!obj.name)
        {
          let html = artTemplate('publish',{msg:'请输入名字'});
          return res.end(html);
        }
        if(!obj.content)
        {
          let html = artTemplate('publish',{msg:'请输入内容'});
          return res.end(html);
        }
        //保存
        datalist.unshift(obj);
        fs.writeFile(path.join(__dirname,pathname),JSON.stringify(datalist),(err)=>{
          if(err) return res.end('500 server error');
          //重定向
          res.setHeader('location','/index');
          res.statusCode = 302;
          res.end();
        })
      })
    }else {
      res.end('404');
    }
  }else {
    res.end('404 not found');
  }
})