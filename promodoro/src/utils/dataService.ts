// 数据服务 - 处理飞书多维表格数据获取

import APP_CONFIG from '../config.json';
import { bitable, IOpenSegment, IOpenSingleSelect } from '@lark-opdev/block-bitable-api';
import { Task, ExecutionRecord } from '../types';

/**
 * 获取"进行中"视图的任务数据
 */
export async function getTasksFromView(): Promise<Task[]> {
  try {
    const table = await bitable.base.getTableByName(APP_CONFIG.TaskTable.Name);
    const viewMetaList = await table.getViewMetaList();
    const targetView = viewMetaList.find(view => view.name === APP_CONFIG.TaskTable.View);
    if (!targetView) {
      throw new Error(`未找到"${APP_CONFIG.TaskTable.View}"视图`);
    }

    // 获取字段元数据
    const fieldMetaList = await table.getFieldMetaList();
    const fieldMap = new Map();
    fieldMetaList.forEach(field => {
      fieldMap.set(field.name, field.id);
    });

    // 获取视图对象
    const view = await table.getViewById(targetView.id);
    const recordIdList = (await view.getVisibleRecordIdList()).filter(rid => rid !== undefined);

    // 获取任务数据
    const tasks: Task[] = [];
    for (const rid of recordIdList) {
      const record = await table.getRecordById(rid);
      const fields = record.fields;
      const task: Task = {
        id: rid,
        title: fields[fieldMap.get('任务')] as IOpenSegment[] || [],
        taskType: fields[fieldMap.get('任务类型')] as IOpenSingleSelect || '',
        count: fields[fieldMap.get('次数')] as number || 0,
        quadrant: fields[fieldMap.get('任务象限')] as IOpenSingleSelect || ''
      };
      tasks.push(task);
    }
    tasks.sort((a, b) => {
      // 定义象限优先级映射
      const quadrantPriority = {
        '重要紧急': 1,
        '重要不紧急': 2,
        '不重要紧急': 3,
        '不重要不紧急': 4
      };

      const priorityA = quadrantPriority[a.quadrant.text as keyof typeof quadrantPriority] || 999;
      const priorityB = quadrantPriority[b.quadrant.text as keyof typeof quadrantPriority] || 999;

      return priorityA - priorityB;
    });
    return tasks;
  } catch (error) {
    console.error('获取任务数据失败:', error);
    throw error;
  }
}

/**
 * 获取执行记录数据
 */
export async function getExecutionRecords(): Promise<ExecutionRecord[]> {
  try {
    // 获取执行记录表格的"执行记录"视图
    const table = await bitable.base.getTableByName(APP_CONFIG.ExecutionTable.Name);
    const viewMetaList = await table.getViewMetaList();
    const targetView = viewMetaList.find(view => view.name === APP_CONFIG.ExecutionTable.View);
    if (!targetView) {
      throw new Error(`未找到"${APP_CONFIG.ExecutionTable.View}"视图`);
    }

    // 获取字段元数据
    const fieldMetaList = await table.getFieldMetaList();
    const fieldMap = new Map();
    fieldMetaList.forEach(field => {
      fieldMap.set(field.name, field.id);
    });

    // 获取可见记录ID列表
    const view = await table.getViewById(targetView.id);
    const recordIdList = (await view.getVisibleRecordIdList()).filter(rid => rid !== undefined);
    console.log("获取今天执行记录ID", recordIdList);

    // 获取执行记录数据
    const records: ExecutionRecord[] = [];
    for (const rid of recordIdList) {
      const record = await table.getRecordById(rid);
      const fields = record.fields;
      const executionRecord: ExecutionRecord = {
        id: rid,
        taskTitle: fields[fieldMap.get('任务')] as IOpenSegment[] || [],
        taskType: fields[fieldMap.get('任务类型')] as IOpenSingleSelect,
        executionTime: fields[fieldMap.get('执行时间')] as number,
      };
      records.push(executionRecord);
    }
    console.log("获取今天执行记录数据", records);
    return records;
  } catch (error) {
    console.error('获取执行记录失败:', error);
    return [];
  }
}

/**
 * 创建执行记录
 */
export async function createExecutionRecord(task: Task, executionTime: number): Promise<void> {
  try {
    // 获取执行记录表格的"执行记录"视图
    const table = await bitable.base.getTableByName(APP_CONFIG.ExecutionTable.Name);
    const viewMetaList = await table.getViewMetaList();
    const targetView = viewMetaList.find(view => view.name === APP_CONFIG.ExecutionTable.View);
    if (!targetView) {
      throw new Error(`未找到"${APP_CONFIG.ExecutionTable.View}"视图`);
    }

    // 获取字段元数据
    const fieldMetaList = await table.getFieldMetaList();
    const fieldMap = new Map();
    fieldMetaList.forEach(field => {
      fieldMap.set(field.name, field.id);
    });

    // 添加记录
    const data = {
      fields: {
        [fieldMap.get('任务')]: task.title,
        [fieldMap.get('任务类型')]: task.taskType,
        [fieldMap.get('执行时间')]: executionTime,
      }
    };
    console.log("添加执行记录数据", data);
    await table.addRecord(data);
  } catch (error) {
    console.error('创建执行记录失败:', error);
    throw error;
  }
}