---
title: SQL索引优化
date: 2023-02-17 10:46:09
sidebar: 'auto'
tags:
categories: 
 - MySql
---
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;今天遇到一个SQL耗时的问题,在解决的过程中发现别人写的不错的东西,进行整理学习学习.

![图片](https://img-blog.csdnimg.cn/img_convert/db163319e059f5779038400bd0945864.png)

>参考: https://blog.csdn.net/qq_17231297/article/details/128510044?spm=1001.2014.3001.5502


# 避免全部查询
## 分页查询导致查询性能慢
表的数据量很大的话,加了索引也会导致查询耗时,如下
``` sql
SELECT *
FROM   operation
WHERE  type = 'SQLStats'
       AND name = 'SlowLog'
ORDER  BY create_time
LIMIT  10000, 10;
```
*原因分析*：
分页查询时数据库并不知道10000条数据在哪里,即使有索引也要从头开始计算一次。    

*优化*：
可以采用分批查询，可以将上页最大的值当做查询条件进行查询。

```sql
SELECT   *
FROM     operation
WHERE    type = 'SQLStats'
AND      name = 'SlowLog'
AND      create_time > '2017-03-16 14:00:00'
ORDER BY create_time limit 10;
```

## 混合排序

``` sql
SELECT *
FROM   my_order o
       INNER JOIN my_appraise a ON a.orderid = o.id
ORDER  BY a.is_reply ASC,
          a.appraise_time DESC
LIMIT  0, 20
```
*原因分析*：
my_appraise会进行全表扫描    

*优化*：
先根据状态查询筛选对应数据然后再进行排序分页。

``` sql
SELECT *
FROM   ((SELECT *
         FROM   my_order o
                INNER JOIN my_appraise a
                        ON a.orderid = o.id
                           AND is_reply = 0
         ORDER  BY appraise_time DESC
         LIMIT  0, 20)
        UNION ALL
        (SELECT *
         FROM   my_order o
                INNER JOIN my_appraise a
                        ON a.orderid = o.id
                           AND is_reply = 1
         ORDER  BY appraise_time DESC
         LIMIT  0, 20)) t
ORDER  BY  is_reply ASC,
          appraisetime DESC
LIMIT  20;
```

## EXISTS语句
``` sql
SELECT *
FROM   my_neighbor n
       LEFT JOIN my_neighbor_apply sra
              ON n.id = sra.neighbor_id
                 AND sra.user_id = 'xxx'
WHERE  n.topic_status < 4
       AND EXISTS(SELECT 1
                  FROM   message_info m
                  WHERE  n.id = m.neighbor_id
                         AND m.inuser = 'xxx')
       AND n.topic_type <> 5
```
*原因分析*：
嵌套子查询导致效率慢.

*优化*：
去除Exists,改为join能够避免嵌套子查询。

``` sql
SELECT *
FROM   my_neighbor n
       INNER JOIN message_info m
               ON n.id = m.neighbor_id
                  AND m.inuser = 'xxx'
       LEFT JOIN my_neighbor_apply sra
              ON n.id = sra.neighbor_id
                 AND sra.user_id = 'xxx'
WHERE  n.topic_status < 4
       AND n.topic_type <> 5
```

## 条件下推
条件作用于聚合子查询之后,需要下推.
* 聚合子查询；
* 含有 LIMIT 的子查询；
* UNION 或 UNION ALL 子查询；
* 输出字段中的子查询；
``` sql 
SELECT *
FROM   (SELECT target,
               Count(*)
        FROM   operation
        GROUP  BY target) t
WHERE  target = 'rm-xxxx'
```
优化为
``` sql
SELECT target,
       Count(*)
FROM   operation
WHERE  target = 'rm-xxxx'
GROUP  BY target
```

## 提前缩小范围
``` sql
SELECT *
FROM   my_order o
       LEFT JOIN my_userinfo u
              ON o.uid = u.uid
       LEFT JOIN my_productinfo p
              ON o.pid = p.pid
WHERE  ( o.display = 0 )
       AND ( o.ostaus = 1 )
ORDER  BY o.selltime DESC
LIMIT  0, 15
```

优化为: 先查询主结果,然后再进行join补全字段

``` sql
SELECT *
FROM (
    SELECT *
    FROM   my_order o
    WHERE  ( o.display = 0 )
        AND ( o.ostaus = 1 )
    ORDER  BY o.selltime DESC
    LIMIT  0, 15
) o
    LEFT JOIN my_userinfo u
            ON o.uid = u.uid
    LEFT JOIN my_productinfo p
            ON o.pid = p.pid
ORDER BY  o.selltime DESC
limit 0, 15
```





# 索引失效的情况
## 隐式转换
查询变量和字段定义类型不匹配
``` sql
select * 
from  operation
where build_no = 10002101
and `type` is null
```
*原因分析*：
build_no 是 varchar(20), Mysql会把build_no列转为数值后再进行比较,导致索引失效。    

*优化*：
注意查询类型要和数据库字段类型一直。

``` sql
select * 
from  operation
where build_no = '10002101'
and `type` is null
```




