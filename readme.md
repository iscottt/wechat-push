## admin template server

#### 功能清单 🎄

- 登录注册
- 用户管理
- 角色管理
- jwt验证
- 菜单管理
- ...

#### 数据库设计
- 用户模型

```javascript
/**
 * 用户模型
 * @author yupi
 */
const UserModel = sequelize.define(
    "User",
    {
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true,
        },
        roleId: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
        // Model attributes are defined here
        username: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
        },
        status: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        createTime: {
            type: DataTypes.DATE,
        },
        updateTime: {
            type: DataTypes.DATE,
        },
    },
    {
        tableName: "user",
        paranoid: true,
        deletedAt: "isDelete",
        timestamps: false,
    });
```

- 角色模型

```javascript
/**
 * 角色模型
 * @author yupi
 */
const RoleModel = sequelize.define(
  "Role",
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    // Model attributes are defined here
    roleName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    menuIds: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    createTime: {
      type: DataTypes.DATE,
    },
    updateTime: {
      type: DataTypes.DATE,
    },
  },
  {
    tableName: "user",
    paranoid: true,
    deletedAt: "isDelete",
    timestamps: false,
  }
);
```
    
- 菜单模型

```javascript
const MenuModule = sequelize.define('Menu', 
    {
        id: {
            type: DateType.BIGINT,
            autoIncrement: true,
            primaryKey: true
        },
        parentId: {
            type: DateType.BIGINT,
            allowNull: false,
        },
        // Model attributes are defined here
        menuName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        menuIcon: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        menuSort: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        menuUrl: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        status: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        createTime: {
            type: DataTypes.DATE,
        },
        updateTime: {
            type: DataTypes.DATE,
        },
    },
    {
        tableName: "menu",
        paranoid: true,
        deletedAt: "isDelete",
        timestamps: false,
    })
```

