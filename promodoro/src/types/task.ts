// 任务相关类型定义

import { IOpenSegment, IOpenSingleSelect } from "@lark-opdev/block-bitable-api";

export interface Task {
  id: string;
  title: IOpenSegment[];            // 任务标题
  taskType: IOpenSingleSelect;        // 任务类型（单选）
  count: number;                      // 总次数
  quadrant: IOpenSingleSelect;        // 任务象限（中文值，用于排序）
}

export interface ExecutionRecord {
  id: string;
  taskTitle: IOpenSegment[];       // 任务标题
  taskType: IOpenSingleSelect;       // 任务类型
  executionTime: number;   // 执行时间（分钟）
}

export interface TaskStorage {
  taskName: string;
  accumulatedTime: number; // 已积累时间（分钟）
  date: string;           // 日期（YYYY-MM-DD）
}

export interface UserSettings {
  timerDuration: number;   // 倒计时时长（分钟），需要持久化保存
}