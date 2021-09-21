/**
 * @idemon: 创建于 2021/5/24
 * @function: 根据sql语句生成响应的模板文件
 * 使用方法，在下方 【主函数 - 传入表明】区域
 * main('数据库表名');
 */

const pg = require('pg');
import { orm } from '../config/config.dev';
import { camelCase, firstUpperCase } from './beanUtils';
import {
  createDirectoryRelative,
  readFile,
  createFile,
  isFileExisted,
} from './fileUtils';
const env = process.env.NODE_ENV;

const conStr = `postgres://${orm.default.username}:${orm.default.password}@${orm.default.host}:${orm.default.port}/${orm.default.database}`;
const config = {
  // 执行一条sql语句
  pgSqlOne: function (client: any, sql: string) {
    return new Promise((resolve, reject) => {
      client.connect(err => {
        if (err) {
          return console.error('could not connect to postgres', err);
        }
        client.query(sql, [], (isErr, rst) => {
          // console.info('当前指定sql语句为：', sql);
          if (isErr) {
            // console.error('sql执行失败:' + isErr.message);
            resolve(isErr);
          } else {
            // console.info('sql执行成功, data is: ' + rst);
            resolve(rst.rows);
          }
          client.end();
        });
      });
    });
  },
  // 生成models文件
  async createFileModels(
    path: string,
    templeConfig: any,
    res: any[],
    des: string
  ) {
    if (isFileExisted(`${path}${templeConfig.fileName}.ts`)) return;
    // 创建文件夹
    await createDirectoryRelative(path);
    // 读取模板文件
    let fileContent: any = await readFile(
      '/utils/templateFile',
      'templateEntity.txt'
    );
    fileContent = fileContent.replace(
      /\$\{(\w+)\}/g,
      (match, $1) => templeConfig[$1]
    );
    // 创建文件
    const createFileBool = await createFile(
      path,
      `${templeConfig.fileName}.ts`,
      fileContent
    );
    res.push({
      createFileBool,
      path: `${path}${templeConfig.fileName}.ts`,
      des,
    });
  },
  // 替换通用的参数
  async createFileCommon(
    path: string,
    templeFileName: string,
    templeConfig: any,
    res: object[],
    des: string
  ) {
    if (isFileExisted(`${path}${templeConfig.fileName}.ts`)) return;
    // 创建文件夹
    await createDirectoryRelative(path);
    // 读取模板文件
    let fileContent: any = await readFile(
      '/utils/templateFile',
      templeFileName
    );
    fileContent = fileContent.replace(
      /\$\{(\w+)\}/g,
      (match, $1) => templeConfig[$1]
    );
    // 创建文件
    const createFileBool = await createFile(
      path,
      `${templeConfig.fileName}.ts`,
      fileContent
    );
    res.push({
      createFileBool,
      path: `${path}${templeConfig.fileName}.ts`,
      des,
    });
  },
  // 打印结果
  console(res: any): void {
    console.log(
      '\x1B[32m%s\x1B[0m',
      '---------------------CREATE END-------------------------'
    );
    res.forEach(({ path, createFileBool, des }) => {
      console.log(
        ` \x1B[33m${des}\x1B[0m ${path} %s`,
        `${createFileBool ? '\x1B[32mSUCCESS\x1B[0m' : '\x1B[31mERROR\x1B[0m'}`
      );
    });
    if (res.length === 0) {
      console.log('  \x1B[33m%s\x1B[0m', 'Nothing to do');
    }
    console.log(
      '\x1B[32m%s\x1B[0m',
      '--------------------------------------------------------'
    );
  },
  // 获取JS类型
  getType(pgType: string): string {
    let _type_;
    switch (true) {
      case pgType.includes('int'):
        _type_ = 'number';
        break;
      case pgType.includes('jsonb'):
        _type_ = 'any';
        break;
      case pgType.includes('json'):
        _type_ = 'any';
        break;
      case pgType.includes('time'):
        _type_ = 'Date';
        break;
      case pgType.includes('date'):
        _type_ = 'Date';
        break;
      default:
        _type_ = 'string';
        break;
    }
    return _type_;
  },
  // 获取PG的默认值
  getDefaultVal({
    columnDefault,
    udtName,
  }: {
    columnDefault: string;
    udtName: string;
  }): string {
    let _defaultVal_;
    switch (true) {
      case udtName.includes('date'):
        _defaultVal_ = "() => 'CURRENT_DATE()'";
        break;
      case udtName.includes('time'):
        _defaultVal_ = "() => 'NOW()'";
        break;
      default:
        _defaultVal_ = columnDefault;
        break;
    }
    return _defaultVal_;
  },
  // PG内type中转
  getUdtName(udtName: string): string {
    let _udtName_;
    switch (true) {
      case udtName.includes('_int'):
        _udtName_ = udtName.replace('_int', 'int');
        break;
      default:
        _udtName_ = udtName;
        break;
    }
    return _udtName_;
  },
  // 解析表结构的数组语句
  handelTableColumn(tableConfig: any, templeConfig: any): void {
    // 获取每一行的数据
    let entitys = '';
    tableConfig.attributes.forEach(attr => {
      // 获取类型
      const entity = {
        nullable: true,
        isPrimaryKey: false,
      };

      if (attr.columnDefault && attr.columnDefault.includes('id_seq')) {
        // 表示为主键
        entity.isPrimaryKey = true;
      }

      if (attr.isNullable === 'NO') {
        entity.nullable = false;
      }

      const _flag_ = attr.columnName.split('_').length > 1;
      const _columnName_ = _flag_
        ? camelCase(attr.columnName)
        : attr.columnName;
      if (entity.isPrimaryKey) {
        entitys += `@PrimaryGeneratedColumn()\n  ${_columnName_}: ${config.getType(
          attr.udtName
        )};`;
      } else {
        entitys += `\n
  @Column({
    type: '${config.getUdtName(attr.udtName)}',${
          entity.nullable ? '\n    nullable: ' + entity.nullable + ',' : ''
        }${
          attr.columnDefault
            ? '\n    default: ' + config.getDefaultVal(attr) + ','
            : ''
        }${_flag_ ? "\n    name: '" + attr.columnName + "'," : ''}
  })
  ${_columnName_}: ${config.getType(attr.udtName)};`;
      }
    });
    templeConfig.entitys = entitys;
    templeConfig.tableName = tableConfig.tableName;
    templeConfig.fileName = camelCase(tableConfig.tableName);
    templeConfig.objectName = camelCase(tableConfig.tableName);
    templeConfig.className = firstUpperCase(camelCase(tableConfig.tableName));
    templeConfig.routerName = camelCase(tableConfig.tableName);
  },
};

/**
 * 根据数据库中的表名获取表借口
 * @param tableName
 * @returns {Promise<void>}
 */
export async function main(tableName: string): Promise<void> {
  if (env !== 'init') return;
  const client = new pg.Client(conStr);
  const showTable = `
    with col as (
      SELECT table_name as "tableName", column_name as "columnName", column_default as "columnDefault",
        is_nullable as "isNullable", udt_name as "udtName"
      FROM information_schema.columns
      WHERE table_schema = 'public' and table_name='${tableName}'
    )
    select a."tableName", COALESCE(json_agg(a.*), '[]') as attributes
    from col a
    group by a."tableName"
  `;
  let tableConfig = await config.pgSqlOne(client, showTable);
  tableConfig = tableConfig[0] || null;
  if (!tableConfig) {
    throw '请建表后执行';
  }
  const templeConfig = {};
  const res = [];
  // 解析表结构
  config.handelTableColumn(tableConfig, templeConfig);
  // 异步生成文件
  // 生成models文件
  await config.createFileModels('/entity/', templeConfig, res, 'Model层：');
  // 生成service文件
  await config.createFileCommon(
    '/service/',
    'templateService.txt',
    templeConfig,
    res,
    'Service层：'
  );
  // 生成controller文件
  await config.createFileCommon(
    '/controller/',
    'templateController.txt',
    templeConfig,
    res,
    'Controller层：'
  );
  config.console(res);
}

async function allTable() {
  if (env !== 'init') return;
  const client = new pg.Client(conStr);
  const showAllTable = `select tablename from pg_tables where schemaname = 'public'`;
  const tableArr: any = await config.pgSqlOne(client, showAllTable);
  tableArr.forEach(x => {
    main(x.tablename);
  });
}
allTable();
