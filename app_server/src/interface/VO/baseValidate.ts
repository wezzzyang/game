import { Rule, RuleType } from '@midwayjs/decorator';

// RuleType.number().required();               // 数字，必填
// RuleType.number().max(10).min(1);           // 数字，最大值和最小值
// RuleType.number().greater(10).less(50);     // 数字，大于 10，小于 50

// RuleType.string().max(10).min(5);           // 字符串，长度最大 10，最小 5
// RuleType.string().length(20);               // 字符串，长度 20
// RuleType.string().pattern(/^[abc]+$/);      // 字符串，匹配正则格式

// RuleType.object().length(5);                // 对象，key 数量等于 5

// RuleType.array().items(RuleType.string());    // 数组，每个元素是字符串
// RuleType.array().max(10);                   // 数组，最大长度为 10
// RuleType.array().min(10);                   // 数组，最小长度为 10
// RuleType.array().length(10);                // 数组，长度为 10

// 实例
export class IExample {
  @Rule(RuleType.number().required())
  id: number;
}
