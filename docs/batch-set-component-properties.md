# 批量设置组件属性 (set_component_properties)

## 概述

`set_component_properties` 是一个批量操作工具，允许一次性设置组件的多个属性。相比逐个调用 `set_component_property`，它可以显著减少网络请求次数，提高操作效率。

## 适用场景

- 🚀 **初始化组件**：创建组件后一次性设置所有初始属性
- 📝 **批量更新**：同时修改组件的多个配置项
- ⚡ **性能优化**：减少多次 API 调用的开销
- 🎨 **主题切换**：快速应用一组样式相关的属性

## API 定义

### 工具名称
```
component_set_component_properties
```

### 参数说明

| 参数 | 类型 | 必需 | 说明 |
|------|------|------|------|
| `nodeUuid` | string | ✅ | 节点的唯一标识符 |
| `componentType` | string | ✅ | 组件类型（如 "cc.Label", "cc.Sprite"） |
| `properties` | array | ✅ | 属性设置数组，每个元素包含 property、propertyType（可选）、value |

### properties 数组元素结构

| 字段 | 类型 | 必需 | 说明 |
|------|------|------|------|
| `property` | string | ✅ | 属性名称 |
| `propertyType` | string | ❌ | 属性类型（不指定则自动推断） |
| `value` | any | ✅ | 属性值，格式取决于 propertyType |

### 支持的 propertyType

```
基础类型:
- string        字符串
- number        数字
- boolean       布尔值
- integer       整数
- float         浮点数

复合类型:
- color         颜色 {r, g, b, a}
- vec2          二维向量 {x, y}
- vec3          三维向量 {x, y, z}
- size          尺寸 {width, height}

引用类型:
- node          节点引用（UUID 字符串）
- component     组件引用（节点 UUID 字符串）
- spriteFrame   精灵帧资源（UUID 字符串）
- prefab        预制体资源（UUID 字符串）
- asset         通用资源（UUID 字符串）

数组类型:
- nodeArray     节点数组 ["uuid1", "uuid2"]
- colorArray    颜色数组 [{r,g,b,a}, ...]
- numberArray   数字数组 [1, 2, 3]
- stringArray   字符串数组 ["a", "b"]
```

## 使用示例

### 示例 1：设置 Label 组件的多个属性

```json
{
  "nodeUuid": "9aG2g/0LVKo77i9nVk9CEV",
  "componentType": "cc.Label",
  "properties": [
    {
      "property": "string",
      "propertyType": "string",
      "value": "Hello World"
    },
    {
      "property": "fontSize",
      "propertyType": "number",
      "value": 24
    },
    {
      "property": "color",
      "propertyType": "color",
      "value": {"r": 255, "g": 0, "b": 0, "a": 255}
    },
    {
      "property": "horizontalAlign",
      "propertyType": "number",
      "value": 1
    }
  ]
}
```

### 示例 2：设置 Sprite 组件（自动推断类型）

```json
{
  "nodeUuid": "abc123def456",
  "componentType": "cc.Sprite",
  "properties": [
    {
      "property": "spriteFrame",
      "value": "sprite-frame-uuid-here"
    },
    {
      "property": "type",
      "value": 1
    },
    {
      "property": "sizeMode",
      "value": 2
    }
  ]
}
```

### 示例 3：设置 UITransform 的尺寸和锚点

```json
{
  "nodeUuid": "xyz789uvw012",
  "componentType": "cc.UITransform",
  "properties": [
    {
      "property": "contentSize",
      "propertyType": "size",
      "value": {"width": 200, "height": 100}
    },
    {
      "property": "anchorPoint",
      "propertyType": "vec2",
      "value": {"x": 0.5, "y": 0.5}
    }
  ]
}
```

### 示例 4：混合类型批量设置

```json
{
  "nodeUuid": "node-uuid-123",
  "componentType": "cc.Button",
  "properties": [
    {
      "property": "interactable",
      "propertyType": "boolean",
      "value": true
    },
    {
      "property": "transition",
      "propertyType": "number",
      "value": 1
    },
    {
      "property": "target",
      "propertyType": "node",
      "value": "target-node-uuid"
    }
  ]
}
```

## 返回结果

### 成功响应（全部成功）

```json
{
  "success": true,
  "message": "Batch property update completed: 4 succeeded, 0 failed",
  "data": {
    "nodeUuid": "9aG2g/0LVKo77i9nVk9CEV",
    "componentType": "cc.Label",
    "totalProperties": 4,
    "successCount": 4,
    "failCount": 0,
    "results": [
      {
        "property": "string",
        "success": true
      },
      {
        "property": "fontSize",
        "success": true
      },
      {
        "property": "color",
        "success": true
      },
      {
        "property": "horizontalAlign",
        "success": true
      }
    ]
  }
}
```

### 部分失败响应

```json
{
  "success": false,
  "message": "Batch property update completed: 2 succeeded, 1 failed",
  "data": {
    "nodeUuid": "9aG2g/0LVKo77i9nVk9CEV",
    "componentType": "cc.Label",
    "totalProperties": 3,
    "successCount": 2,
    "failCount": 1,
    "results": [
      {
        "property": "string",
        "success": true
      },
      {
        "property": "invalidProperty",
        "success": false,
        "error": "Property 'invalidProperty' not found on component 'cc.Label'. Available properties: string, fontSize, color..."
      },
      {
        "property": "color",
        "success": true
      }
    ]
  }
}
```

### 错误响应（参数验证失败）

```json
{
  "success": false,
  "error": "nodeUuid is required"
}
```

或

```json
{
  "success": false,
  "error": "Component 'cc.InvalidComponent' not found on node. Available components: cc.Label, cc.Sprite, cc.UITransform",
  "instruction": "\n\n🔍 Found similar components: cc.Label\n💡 Suggestion: Perhaps you meant to set the 'cc.Label' component?"
}
```

## 最佳实践

### ✅ 推荐做法

1. **批量设置相关属性**
   ```json
   // 好的做法：将相关的样式属性一起设置
   {
     "properties": [
       {"property": "color", "value": {"r": 255, "g": 0, "b": 0}},
       {"property": "fontSize", "value": 24},
       {"property": "fontFamily", "value": "Arial"}
     ]
   }
   ```

2. **检查返回结果**
   - 始终检查 `success` 字段
   - 查看 `results` 数组了解每个属性的设置状态
   - 对于失败的属性，查看 `error` 信息进行调试

3. **利用类型自动推断**
   ```json
   // 如果不指定 propertyType，系统会自动推断
   {
     "property": "color",
     "value": {"r": 255, "g": 0, "b": 0}
     // propertyType 会被自动推断为 "color"
   }
   ```

### ❌ 避免的做法

1. **不要混合不相关的组件**
   ```json
   // 错误：一次只能设置一个组件的属性
   {
     "componentType": "cc.Label",
     "properties": [
       {"property": "string", "value": "text"},  // Label 的属性
       {"property": "spriteFrame", "value": "..."} // Sprite 的属性 - 会失败
     ]
   }
   ```

2. **不要在批量操作中依赖执行顺序**
   - 虽然属性是按顺序处理的，但不应该依赖某个属性必须在另一个之前设置
   - 如果有依赖关系，考虑分开调用或使用单属性设置

3. **不要设置过大的批量**
   - 建议每次批量设置 5-10 个属性
   - 过多的属性可能导致超时或难以调试

## 与单属性设置的对比

| 特性 | set_component_property | set_component_properties |
|------|----------------------|-------------------------|
| 设置数量 | 单个属性 | 多个属性 |
| 网络请求 | 每次一个 | 一次多个 |
| 适用场景 | 动态更新单个值 | 初始化或批量更新 |
| 错误处理 | 立即返回错误 | 继续处理其他属性 |
| 返回信息 | 单一结果 | 详细的结果数组 |
| 性能 | 多次调用开销大 | 批量操作效率高 |

## 常见问题

### Q1: 如果某个属性设置失败，其他属性会回滚吗？

**A:** 不会。批量操作采用"尽力而为"策略，失败的属性不会影响已成功设置的属性。如果需要原子性操作，请使用事务机制或手动回滚。

### Q2: propertyType 是必需的吗？

**A:** 不是必需的。如果不指定，系统会从组件元数据中自动推断类型。但在某些情况下，显式指定可以提高准确性和性能。

### Q3: 如何知道哪些属性可用？

**A:** 先调用 `get_component_info` 获取组件的详细信息，包括所有可用属性及其类型。

### Q4: 批量操作有性能优势吗？

**A:** 是的。相比多次调用单属性设置，批量操作可以：
- 减少网络往返次数
- 降低服务器负载
- 提高客户端响应速度
- 简化错误处理逻辑

### Q5: 最大支持多少个属性？

**A:** 理论上没有硬性限制，但建议：
- 常规场景：5-10 个属性
- 复杂初始化：最多 20-30 个属性
- 超过 30 个属性时，考虑分批处理

## 相关工具

- [`set_component_property`](./component-tools.md#set_component_property) - 设置单个属性
- [`get_component_info`](./component-tools.md#get_component_info) - 获取组件信息和可用属性
- [`get_components`](./component-tools.md#get_components) - 获取节点上的所有组件
- [`add_component`](./component-tools.md#add_component) - 添加新组件

## 版本历史

- **v1.0.0** (2024-XX-XX) - 初始版本，支持批量设置组件属性

---

**提示**: 对于复杂的属性设置场景，建议先使用 `get_component_info` 了解组件的完整属性列表和类型信息，然后再进行批量设置。
