// const AV = require('leancloud-storage');  // npm i leancloud-storage --save
import AV from "leancloud-storage";

// 角色管理 https://leancloud.cn/docs/acl-guide.html#hash1358716737
export default class User{
    constructor(){

    }
    async createRole(name){
        // Administrator
        var roleAcl = new AV.ACL();
        roleAcl.setPublicReadAccess(true);
        roleAcl.setPublicWriteAccess(false);
      
        // 当前用户是该角色的创建者，因此具备对该角色的写权限
        roleAcl.setWriteAccess(AV.User.current(), true);

        // 新建一个角色，并把为当前用户赋予该角色
        var administratorRole = new AV.Role(name || "Administrator",roleAcl);
       // var relation = administratorRole.getUsers();
        //为当前用户赋予该角色
        //  administratorRole.getUsers().add(AV.User.current());
        return administratorRole.save();

    }
    queryRole(name){
          // 新建针对 Role 的查询
        var roleQuery = new AV.Query(AV.Role);
          // 查询 name 等于 Administrator 的角色
        roleQuery.equalTo('name', name || 'Administrator');

        // 执行查询
        return roleQuery.first()
    }
    AddRight(name){
      // 给当前用户添加 角色
        var roleQuery = new AV.Query(AV.Role);
        // 角色名称等于 Administrator
        roleQuery.equalTo('name', name || 'Administrator');
        // 检查当前用户是否已经拥有了 Administrator 角色
        roleQuery.equalTo('users', AV.User.current());
        roleQuery.find().then( async function (results) {
          if (results.length > 0) {
            // 当前用户已经具备了 Administrator 角色，因此不需要做任何操作
            console.log("当前用户已经具备了")
            var administratorRole = results[0];
            return administratorRole;
          } else {
            console.log("当前用户不具备")
            var roleQuery = new AV.Query(AV.Role);
            // 查询 name 等于 Administrator 的角色
            roleQuery.equalTo('name', name || 'Administrator');
            var administratorRole = await roleQuery.first()
            // 执行查询
            // 当前用户不具备 Administrator，因此你需要把当前用户添加到 Role 的 Users 中
            var relation = administratorRole.getUsers();
            relation.add(AV.User.current());
            return administratorRole.save();
          }
        }).then(function (administratorRole) {
          //此时 administratorRole 已经包含了当前用户
        }).catch(function (error) {
          // 输出错误
          console.log(error);
        });
    }
    removeRight(name){
        // 构建 AV.Role 的查询
      var roleQuery = new AV.Query(AV.Role);
      roleQuery.equalTo('name', name || 'Administrator');
      roleQuery.find().then(function(results) {

        // 如果角色存在
        if (results.length > 0) {
          console.log("角色存在");
          var moderatorRole = results[0];
          roleQuery.equalTo('users', AV.User.current());
          return roleQuery.find();
        }else{
          console.log("角色不存在");
        }
      }).then(function(userForRole) {

        //该角色存在，并且也拥有该角色
        if (userForRole.length > 0) {
          console.log("该角色存在，并且也拥有该角色,剥夺角色");
          // 剥夺角色
          var relation= moderatorRole.getUsers();
          relation.remove(AV.User.current());
          return moderatorRole.save();
        }else{
          console.log("该角色存在，并且没有有该角色");
        }
      }).then(function() {
        // 保存成功
      }).catch(function(error) {
        // 输出错误
        console.log(error);
      });
    }
}