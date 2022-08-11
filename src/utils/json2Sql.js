/*
    把data.json文件中的数据拼接成insert语句
*/
const path = require("path");
const fs = require("fs");

fs.readFile(path.join(__dirname, "./", "data.json"), "utf8", (err, content) => {
  // 读取当前文件夹下的json文件，指定utf8编码格式
  if (err) return;
  let list = JSON.parse(content); // 解析json数据
  let arr = [];
  list.forEach((stu) => {
    let sql = `insert into menu (menu_name,menu_url,menu_icon,menu_sort,id,parent_id,status,menu_component) values ('${stu.menu_name}','${stu.menu_url}','${stu.menu_icon}','${stu.menu_sort}','${stu.id}','${stu.parent_id}','${stu.status}','${stu.menu_component}');`;
    arr.push(sql);
  });
  fs.writeFile(path.join(__dirname, "data.sql"), arr.join(""), "utf8", () => {
    console.log("init json data finished!");
  });
});
