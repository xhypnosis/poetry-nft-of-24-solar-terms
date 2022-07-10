# 使用方法
使用 Conflux 测试网，需自行建立数据库
## 初始化
Fork 到本地以后，命令行终端分别进入 back-end 和 front-end 目录
运行 
``` shell
yarn 
``` 
命令安装依赖
完成后， 再分别运行
```shell
yarn dev 
``` 
 命令启动
## 数据库
### 后台登录验证
``` 
CREATE TABLE `admins` (
  `UserId` int NOT NULL AUTO_INCREMENT,
  `Username` varchar(100) NOT NULL,
  `Pass` varchar(100) NOT NULL,
  `Solt` varchar(100) NOT NULL,
  PRIMARY KEY (`UserId`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci
```
### 小暑诗词库
```
CREATE TABLE `xiaoshu` (
  `VerId` int NOT NULL,
  `Verse` text,
  `Occupied` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`VerId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci
```

### 用户信息
```
CREATE TABLE `Users` (
  `UserId` int NOT NULL AUTO_INCREMENT,
  `UserAddress` varchar(255) NOT NULL,
  `Verse` text,
  `IsSent` tinyint(1) DEFAULT '0',
  `TxHash` text,
  `ip` varchar(45) DEFAULT NULL,
  `VerId` int DEFAULT NULL,
  PRIMARY KEY (`UserId`),
  UNIQUE KEY `UserAddress_UNIQUE` (`UserAddress`),
  UNIQUE KEY `VerId_UNIQUE` (`VerId`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci
```


