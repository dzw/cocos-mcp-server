"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComponentTools = void 0;
class ComponentTools {
    getTools() {
        return [
            {
                name: 'add_component',
                description: 'Add a component to a specific node. IMPORTANT: You must provide the nodeUuid parameter to specify which node to add the component to.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        nodeUuid: {
                            type: 'string',
                            description: 'Target node UUID. REQUIRED: You must specify the exact node to add the component to. Use get_all_nodes or find_node_by_name to get the UUID of the desired node.'
                        },
                        componentType: {
                            type: 'string',
                            description: 'Component type (e.g., cc.Sprite, cc.Label, cc.Button)'
                        }
                    },
                    required: ['nodeUuid', 'componentType']
                }
            },
            {
                name: 'remove_component',
                description: 'Remove a component from a node. componentType must be the component\'s classId (cid, i.e. the type field from getComponents), not the script name or class name. Use getComponents to get the correct cid.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        nodeUuid: {
                            type: 'string',
                            description: 'Node UUID'
                        },
                        componentType: {
                            type: 'string',
                            description: 'Component cid (type field from getComponents). Do NOT use script name or class name. Example: "cc.Sprite" or "9b4a7ueT9xD6aRE+AlOusy1"'
                        }
                    },
                    required: ['nodeUuid', 'componentType']
                }
            },
            {
                name: 'get_components',
                description: 'Get all components of a node',
                inputSchema: {
                    type: 'object',
                    properties: {
                        nodeUuid: {
                            type: 'string',
                            description: 'Node UUID'
                        }
                    },
                    required: ['nodeUuid']
                }
            },
            {
                name: 'get_component_info',
                description: 'Get specific component information',
                inputSchema: {
                    type: 'object',
                    properties: {
                        nodeUuid: {
                            type: 'string',
                            description: 'Node UUID'
                        },
                        componentType: {
                            type: 'string',
                            description: 'Component type to get info for'
                        }
                    },
                    required: ['nodeUuid', 'componentType']
                }
            },
            {
                name: 'set_component_property',
                description: 'Set component property values for UI components or custom script components. Supports setting properties of built-in UI components (e.g., cc.Label, cc.Sprite) and custom script components. Note: For node basic properties (name, active, layer, etc.), use set_node_property. For node transform properties (position, rotation, scale, etc.), use set_node_transform.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        nodeUuid: {
                            type: 'string',
                            description: 'Target node UUID - Must specify the node to operate on'
                        },
                        componentType: {
                            type: 'string',
                            description: 'Component type - Can be built-in components (e.g., cc.Label) or custom script components (e.g., MyScript). If unsure about component type, use get_components first to retrieve all components on the node.',
                            // 移除enum限制，允许任意组件类型包括自定义脚本
                        },
                        property: {
                            type: 'string',
                            description: 'Property name - The property to set. Common properties include:\n' +
                                '• cc.Label: string (text content), fontSize (font size), color (text color)\n' +
                                '• cc.Sprite: spriteFrame (sprite frame), color (tint color), sizeMode (size mode)\n' +
                                '• cc.Button: normalColor (normal color), pressedColor (pressed color), target (target node)\n' +
                                '• cc.UITransform: contentSize (content size), anchorPoint (anchor point)\n' +
                                '• Custom Scripts: Based on properties defined in the script'
                        },
                        propertyType: {
                            type: 'string',
                            description: 'Property type - Must explicitly specify the property data type for correct value conversion and validation',
                            enum: [
                                'string', 'number', 'boolean', 'integer', 'float',
                                'color', 'vec2', 'vec3', 'size',
                                'node', 'component', 'spriteFrame', 'prefab', 'asset',
                                'nodeArray', 'colorArray', 'numberArray', 'stringArray'
                            ]
                        },
                        value: {
                            description: 'Property value - Use the corresponding data format based on propertyType:\n\n' +
                                '📝 Basic Data Types:\n' +
                                '• string: "Hello World" (text string)\n' +
                                '• number/integer/float: 42 or 3.14 (numeric value)\n' +
                                '• boolean: true or false (boolean value)\n\n' +
                                '🎨 Color Type:\n' +
                                '• color: {"r":255,"g":0,"b":0,"a":255} (RGBA values, range 0-255)\n' +
                                '  - Alternative: "#FF0000" (hexadecimal format)\n' +
                                '  - Transparency: a value controls opacity, 255 = fully opaque, 0 = fully transparent\n\n' +
                                '📐 Vector and Size Types:\n' +
                                '• vec2: {"x":100,"y":50} (2D vector)\n' +
                                '• vec3: {"x":1,"y":2,"z":3} (3D vector)\n' +
                                '• size: {"width":100,"height":50} (size dimensions)\n\n' +
                                '🔗 Reference Types (using UUID strings):\n' +
                                '• node: "target-node-uuid" (node reference)\n' +
                                '  How to get: Use get_all_nodes or find_node_by_name to get node UUIDs\n' +
                                '• component: "target-node-uuid" (component reference)\n' +
                                '  How it works: \n' +
                                '    1. Provide the UUID of the NODE that contains the target component\n' +
                                '    2. System auto-detects required component type from property metadata\n' +
                                '    3. Finds the component on target node and gets its scene __id__\n' +
                                '    4. Sets reference using the scene __id__ (not node UUID)\n' +
                                '  Example: value="label-node-uuid" will find cc.Label and use its scene ID\n' +
                                '• spriteFrame: "spriteframe-uuid" (sprite frame asset)\n' +
                                '  How to get: Check asset database or use asset browser\n' +
                                '• prefab: "prefab-uuid" (prefab asset)\n' +
                                '  How to get: Check asset database or use asset browser\n' +
                                '• asset: "asset-uuid" (generic asset reference)\n' +
                                '  How to get: Check asset database or use asset browser\n\n' +
                                '📋 Array Types:\n' +
                                '• nodeArray: ["uuid1","uuid2"] (array of node UUIDs)\n' +
                                '• colorArray: [{"r":255,"g":0,"b":0,"a":255}] (array of colors)\n' +
                                '• numberArray: [1,2,3,4,5] (array of numbers)\n' +
                                '• stringArray: ["item1","item2"] (array of strings)'
                        }
                    },
                    required: ['nodeUuid', 'componentType', 'property', 'propertyType', 'value']
                }
            },
            {
                name: 'set_component_properties',
                description: 'Set multiple properties on a component at once (batch operation)',
                inputSchema: {
                    type: 'object',
                    properties: {
                        nodeUuid: {
                            type: 'string',
                            description: 'Node UUID'
                        },
                        componentType: {
                            type: 'string',
                            description: 'Component type (e.g., "cc.Label", "cc.Sprite")'
                        },
                        properties: {
                            type: 'array',
                            description: 'Array of property settings to apply',
                            items: {
                                type: 'object',
                                properties: {
                                    property: {
                                        type: 'string',
                                        description: 'Property name'
                                    },
                                    propertyType: {
                                        type: 'string',
                                        description: 'Property type - Must explicitly specify the property data type',
                                        enum: [
                                            'string', 'number', 'boolean', 'integer', 'float',
                                            'color', 'vec2', 'vec3', 'size',
                                            'node', 'component', 'spriteFrame', 'prefab', 'asset',
                                            'nodeArray', 'colorArray', 'numberArray', 'stringArray'
                                        ]
                                    },
                                    value: {
                                        description: 'Property value - Same format as set_component_property'
                                    }
                                },
                                required: ['property', 'value']
                            }
                        }
                    },
                    required: ['nodeUuid', 'componentType', 'properties']
                }
            },
            {
                name: 'attach_script',
                description: 'Attach a script component to a node',
                inputSchema: {
                    type: 'object',
                    properties: {
                        nodeUuid: {
                            type: 'string',
                            description: 'Node UUID'
                        },
                        scriptPath: {
                            type: 'string',
                            description: 'Script asset path (e.g., db://assets/scripts/MyScript.ts)'
                        }
                    },
                    required: ['nodeUuid', 'scriptPath']
                }
            },
            {
                name: 'get_available_components',
                description: 'Get list of available component types',
                inputSchema: {
                    type: 'object',
                    properties: {
                        category: {
                            type: 'string',
                            description: 'Component category filter',
                            enum: ['all', 'renderer', 'ui', 'physics', 'animation', 'audio'],
                            default: 'all'
                        }
                    }
                }
            },
            {
                name: 'set_shapedrawer_properties',
                description: 'Set ShapeDrawer component properties by node name. This is a convenient tool to configure ShapeDrawer components on specific nodes.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        nodeName: {
                            type: 'string',
                            description: 'Node name to find the ShapeDrawer component (e.g., "HintButton", "CompleteButton")'
                        },
                        fillColor: {
                            type: 'string',
                            description: 'Fill color in hex format (e.g., "#F6ECDB", "#B9782D")'
                        },
                        radius: {
                            type: 'number',
                            description: 'Border radius (0 for sharp corners)'
                        },
                        enableStroke: {
                            type: 'boolean',
                            description: 'Enable stroke/border'
                        },
                        shapeType: {
                            type: 'integer',
                            description: 'Shape type: 0=RECTANGLE, 1=ROUNDED_RECT, 2=CIRCLE',
                            enum: [0, 1, 2]
                        },
                        strokeWidth: {
                            type: 'number',
                            description: 'Stroke width (only used when enableStroke is true)'
                        },
                        strokeColor: {
                            type: 'string',
                            description: 'Stroke color in hex format (e.g., "#000000")'
                        },
                        redraw: {
                            type: 'boolean',
                            description: 'Whether to call redraw() after setting properties (default: true)',
                            default: true
                        }
                    },
                    required: ['nodeName']
                }
            }
        ];
    }
    async execute(toolName, args) {
        switch (toolName) {
            case 'add_component':
                return await this.addComponent(args.nodeUuid, args.componentType);
            case 'remove_component':
                return await this.removeComponent(args.nodeUuid, args.componentType);
            case 'get_components':
                return await this.getComponents(args.nodeUuid);
            case 'get_component_info':
                return await this.getComponentInfo(args.nodeUuid, args.componentType);
            case 'set_component_property':
                return await this.setComponentProperty(args);
            case 'set_component_properties':
                return await this.setComponentProperties(args);
            case 'attach_script':
                return await this.attachScript(args.nodeUuid, args.scriptPath);
            case 'get_available_components':
                return await this.getAvailableComponents(args.category);
            case 'set_shapedrawer_properties':
                return await this.setShapeDrawerProperties(args);
            default:
                throw new Error(`Unknown tool: ${toolName}`);
        }
    }
    async addComponent(nodeUuid, componentType) {
        return new Promise(async (resolve) => {
            var _a, _b;
            // 先查找节点上是否已存在该组件
            const allComponentsInfo = await this.getComponents(nodeUuid);
            if (allComponentsInfo.success && ((_a = allComponentsInfo.data) === null || _a === void 0 ? void 0 : _a.components)) {
                const existingComponent = allComponentsInfo.data.components.find((comp) => comp.type === componentType);
                if (existingComponent) {
                    resolve({
                        success: true,
                        message: `Component '${componentType}' already exists on node`,
                        data: {
                            nodeUuid: nodeUuid,
                            componentType: componentType,
                            componentVerified: true,
                            existing: true
                        }
                    });
                    return;
                }
            }
            // 尝试直接使用 Editor API 添加组件
            try {
                await Editor.Message.request('scene', 'create-component', {
                    uuid: nodeUuid,
                    component: componentType
                });
                // 等待一段时间让Editor完成组件添加
                await new Promise(resolve => setTimeout(resolve, 100));
                // 重新查询节点信息验证组件是否真的添加成功
                const allComponentsInfo2 = await this.getComponents(nodeUuid);
                if (allComponentsInfo2.success && ((_b = allComponentsInfo2.data) === null || _b === void 0 ? void 0 : _b.components)) {
                    const addedComponent = allComponentsInfo2.data.components.find((comp) => comp.type === componentType);
                    if (addedComponent) {
                        resolve({
                            success: true,
                            message: `Component '${componentType}' added successfully`,
                            data: {
                                nodeUuid: nodeUuid,
                                componentType: componentType,
                                componentVerified: true,
                                existing: false
                            }
                        });
                    }
                    else {
                        resolve({
                            success: false,
                            error: `Component '${componentType}' was not found on node after addition. Available components: ${allComponentsInfo2.data.components.map((c) => c.type).join(', ')}`
                        });
                    }
                }
                else {
                    resolve({
                        success: false,
                        error: `Failed to verify component addition: ${allComponentsInfo2.error || 'Unable to get node components'}`
                    });
                }
            }
            catch (err) {
                // 备用方案：使用场景脚本
                console.warn(`[ComponentTools] Direct API failed, trying scene script: ${err.message}`);
                try {
                    const options = {
                        name: 'cocos-mcp-server',
                        method: 'addComponentToNode',
                        args: [nodeUuid, componentType]
                    };
                    const result = await Editor.Message.request('scene', 'execute-scene-script', options);
                    resolve(result);
                }
                catch (err2) {
                    resolve({
                        success: false,
                        error: `Direct API failed: ${err.message}, Scene script failed: ${err2.message}`
                    });
                }
            }
        });
    }
    async removeComponent(nodeUuid, componentType) {
        return new Promise(async (resolve) => {
            var _a, _b, _c;
            // 1. 查找节点上的所有组件
            const allComponentsInfo = await this.getComponents(nodeUuid);
            if (!allComponentsInfo.success || !((_a = allComponentsInfo.data) === null || _a === void 0 ? void 0 : _a.components)) {
                resolve({ success: false, error: `Failed to get components for node '${nodeUuid}': ${allComponentsInfo.error}` });
                return;
            }
            // 2. 只查找type字段等于componentType的组件（即cid）
            const exists = allComponentsInfo.data.components.some((comp) => comp.type === componentType);
            if (!exists) {
                resolve({ success: false, error: `Component cid '${componentType}' not found on node '${nodeUuid}'. 请用getComponents获取type字段（cid）作为componentType。` });
                return;
            }
            // 3. 官方API直接移除
            try {
                await Editor.Message.request('scene', 'remove-component', {
                    uuid: nodeUuid,
                    component: componentType
                });
                // 4. 再查一次确认是否移除
                const afterRemoveInfo = await this.getComponents(nodeUuid);
                const stillExists = afterRemoveInfo.success && ((_c = (_b = afterRemoveInfo.data) === null || _b === void 0 ? void 0 : _b.components) === null || _c === void 0 ? void 0 : _c.some((comp) => comp.type === componentType));
                if (stillExists) {
                    resolve({ success: false, error: `Component cid '${componentType}' was not removed from node '${nodeUuid}'.` });
                }
                else {
                    resolve({
                        success: true,
                        message: `Component cid '${componentType}' removed successfully from node '${nodeUuid}'`,
                        data: { nodeUuid, componentType }
                    });
                }
            }
            catch (err) {
                resolve({ success: false, error: `Failed to remove component: ${err.message}` });
            }
        });
    }
    async getComponents(nodeUuid) {
        return new Promise((resolve) => {
            // 优先尝试直接使用 Editor API 查询节点信息
            Editor.Message.request('scene', 'query-node', nodeUuid).then((nodeData) => {
                if (nodeData && nodeData.__comps__) {
                    const components = nodeData.__comps__.map((comp) => {
                        var _a;
                        return ({
                            type: comp.__type__ || comp.cid || comp.type || 'Unknown',
                            uuid: ((_a = comp.uuid) === null || _a === void 0 ? void 0 : _a.value) || comp.uuid || null,
                            enabled: comp.enabled !== undefined ? comp.enabled : true,
                            properties: this.extractComponentProperties(comp)
                        });
                    });
                    resolve({
                        success: true,
                        data: {
                            nodeUuid: nodeUuid,
                            components: components
                        }
                    });
                }
                else {
                    resolve({ success: false, error: 'Node not found or no components data' });
                }
            }).catch((err) => {
                // 备用方案：使用场景脚本
                const options = {
                    name: 'cocos-mcp-server',
                    method: 'getNodeInfo',
                    args: [nodeUuid]
                };
                Editor.Message.request('scene', 'execute-scene-script', options).then((result) => {
                    if (result.success) {
                        resolve({
                            success: true,
                            data: result.data.components
                        });
                    }
                    else {
                        resolve(result);
                    }
                }).catch((err2) => {
                    resolve({ success: false, error: `Direct API failed: ${err.message}, Scene script failed: ${err2.message}` });
                });
            });
        });
    }
    async getComponentInfo(nodeUuid, componentType) {
        return new Promise((resolve) => {
            // 优先尝试直接使用 Editor API 查询节点信息
            Editor.Message.request('scene', 'query-node', nodeUuid).then((nodeData) => {
                if (nodeData && nodeData.__comps__) {
                    const component = nodeData.__comps__.find((comp) => {
                        const compType = comp.__type__ || comp.cid || comp.type;
                        return compType === componentType;
                    });
                    if (component) {
                        resolve({
                            success: true,
                            data: {
                                nodeUuid: nodeUuid,
                                componentType: componentType,
                                enabled: component.enabled !== undefined ? component.enabled : true,
                                properties: this.extractComponentProperties(component)
                            }
                        });
                    }
                    else {
                        resolve({ success: false, error: `Component '${componentType}' not found on node` });
                    }
                }
                else {
                    resolve({ success: false, error: 'Node not found or no components data' });
                }
            }).catch((err) => {
                // 备用方案：使用场景脚本
                const options = {
                    name: 'cocos-mcp-server',
                    method: 'getNodeInfo',
                    args: [nodeUuid]
                };
                Editor.Message.request('scene', 'execute-scene-script', options).then((result) => {
                    if (result.success && result.data.components) {
                        const component = result.data.components.find((comp) => comp.type === componentType);
                        if (component) {
                            resolve({
                                success: true,
                                data: Object.assign({ nodeUuid: nodeUuid, componentType: componentType }, component)
                            });
                        }
                        else {
                            resolve({ success: false, error: `Component '${componentType}' not found on node` });
                        }
                    }
                    else {
                        resolve({ success: false, error: result.error || 'Failed to get component info' });
                    }
                }).catch((err2) => {
                    resolve({ success: false, error: `Direct API failed: ${err.message}, Scene script failed: ${err2.message}` });
                });
            });
        });
    }
    extractComponentProperties(component) {
        console.log(`[extractComponentProperties] Processing component:`, Object.keys(component).join(', '));
        // 检查组件是否有 value 属性，这通常包含实际的组件属性
        if (component.value && typeof component.value === 'object') {
            console.log(`[extractComponentProperties] Found component.value with properties:`, Object.keys(component.value).join(', '));
            return component.value; // 直接返回 value 对象，它包含所有组件属性
        }
        // 备用方案：从组件对象中直接提取属性
        const properties = {};
        const excludeKeys = ['__type__', 'enabled', 'node', '_id', '__scriptAsset', 'uuid', 'name', '_name', '_objFlags', '_enabled', 'type', 'readonly', 'visible', 'cid', 'editor', 'extends'];
        for (const key in component) {
            if (!excludeKeys.includes(key) && !key.startsWith('_')) {
                console.log(`[extractComponentProperties] Found direct property '${key}':`, typeof component[key]);
                properties[key] = component[key];
            }
        }
        console.log(`[extractComponentProperties] Final extracted properties:`, Object.keys(properties).join(', '));
        return properties;
    }
    async findComponentTypeByUuid(componentUuid) {
        var _a;
        console.log(`[findComponentTypeByUuid] Searching for component type with UUID: ${componentUuid}`);
        if (!componentUuid) {
            return null;
        }
        try {
            const nodeTree = await Editor.Message.request('scene', 'query-node-tree');
            if (!nodeTree) {
                console.warn('[findComponentTypeByUuid] Failed to query node tree.');
                return null;
            }
            const queue = [nodeTree];
            while (queue.length > 0) {
                const currentNodeInfo = queue.shift();
                if (!currentNodeInfo || !currentNodeInfo.uuid) {
                    continue;
                }
                try {
                    const fullNodeData = await Editor.Message.request('scene', 'query-node', currentNodeInfo.uuid);
                    if (fullNodeData && fullNodeData.__comps__) {
                        for (const comp of fullNodeData.__comps__) {
                            const compAny = comp; // Cast to any to access dynamic properties
                            // The component UUID is nested in the 'value' property
                            if (compAny.uuid && compAny.uuid.value === componentUuid) {
                                const componentType = compAny.__type__;
                                console.log(`[findComponentTypeByUuid] Found component type '${componentType}' for UUID ${componentUuid} on node ${(_a = fullNodeData.name) === null || _a === void 0 ? void 0 : _a.value}`);
                                return componentType;
                            }
                        }
                    }
                }
                catch (e) {
                    console.warn(`[findComponentTypeByUuid] Could not query node ${currentNodeInfo.uuid}:`, e);
                }
                if (currentNodeInfo.children) {
                    for (const child of currentNodeInfo.children) {
                        queue.push(child);
                    }
                }
            }
            console.warn(`[findComponentTypeByUuid] Component with UUID ${componentUuid} not found in scene tree.`);
            return null;
        }
        catch (error) {
            console.error(`[findComponentTypeByUuid] Error while searching for component type:`, error);
            return null;
        }
    }
    async setComponentProperty(args) {
        const { nodeUuid, componentType, property, propertyType, value } = args;
        return new Promise(async (resolve) => {
            var _a, _b;
            try {
                // 验证必要参数
                if (!nodeUuid) {
                    resolve({ success: false, error: 'nodeUuid is required' });
                    return;
                }
                if (!componentType) {
                    resolve({ success: false, error: 'componentType is required' });
                    return;
                }
                if (!property) {
                    resolve({ success: false, error: 'property is required' });
                    return;
                }
                if (!propertyType) {
                    resolve({ success: false, error: 'propertyType is required' });
                    return;
                }
                if (value === undefined || value === null) {
                    resolve({ success: false, error: 'value is required' });
                    return;
                }
                console.log(`[ComponentTools] Setting ${componentType}.${property} (type: ${propertyType}) = ${JSON.stringify(value)} on node ${nodeUuid}`);
                // Step 0: 检测是否为节点属性，如果是则重定向到对应的节点方法
                const nodeRedirectResult = await this.checkAndRedirectNodeProperties(args);
                if (nodeRedirectResult) {
                    resolve(nodeRedirectResult);
                    return;
                }
                // Step 1: 获取组件信息，使用与getComponents相同的方法
                const componentsResponse = await this.getComponents(nodeUuid);
                if (!componentsResponse.success || !componentsResponse.data) {
                    resolve({
                        success: false,
                        error: `Failed to get components for node '${nodeUuid}': ${componentsResponse.error}`,
                        instruction: `Please verify that node UUID '${nodeUuid}' is correct. Use get_all_nodes or find_node_by_name to get the correct node UUID.`
                    });
                    return;
                }
                const allComponents = componentsResponse.data.components;
                // Step 2: 查找目标组件
                let targetComponent = null;
                const availableTypes = [];
                for (let i = 0; i < allComponents.length; i++) {
                    const comp = allComponents[i];
                    availableTypes.push(comp.type);
                    if (comp.type === componentType) {
                        targetComponent = comp;
                        break;
                    }
                }
                if (!targetComponent) {
                    // 提供更详细的错误信息和建议
                    const instruction = this.generateComponentSuggestion(componentType, availableTypes, property);
                    resolve({
                        success: false,
                        error: `Component '${componentType}' not found on node. Available components: ${availableTypes.join(', ')}`,
                        instruction: instruction
                    });
                    return;
                }
                // Step 3: 自动检测和转换属性值
                let propertyInfo;
                try {
                    console.log(`[ComponentTools] Analyzing property: ${property}`);
                    propertyInfo = this.analyzeProperty(targetComponent, property);
                }
                catch (analyzeError) {
                    console.error(`[ComponentTools] Error in analyzeProperty:`, analyzeError);
                    resolve({
                        success: false,
                        error: `Failed to analyze property '${property}': ${analyzeError.message}`
                    });
                    return;
                }
                if (!propertyInfo.exists) {
                    resolve({
                        success: false,
                        error: `Property '${property}' not found on component '${componentType}'. Available properties: ${propertyInfo.availableProperties.join(', ')}`
                    });
                    return;
                }
                // Step 4: 处理属性值和设置
                const originalValue = propertyInfo.originalValue;
                let processedValue;
                // 如果未提供 propertyType，使用 analyzeProperty 检测的类型
                let actualPropertyType = propertyType || propertyInfo.type;
                // 标准化类型名称：将 cc.Node, cc.Component 等转换为 node, component
                if (actualPropertyType === 'cc.Node' || actualPropertyType === 'cc.Node[]') {
                    actualPropertyType = actualPropertyType === 'cc.Node[]' ? 'nodeArray' : 'node';
                }
                else if (actualPropertyType && actualPropertyType.startsWith('cc.') && !['cc.Sprite', 'cc.Label', 'cc.Button'].includes(actualPropertyType)) {
                    // 检查是否是组件引用类型（非内置组件）
                    if (actualPropertyType.includes('Component') || actualPropertyType === 'cc.AudioSource') {
                        actualPropertyType = 'component';
                    }
                }
                console.log(`[ComponentTools] Using propertyType: ${propertyType} -> actualPropertyType: ${actualPropertyType}`);
                // 根据明确的propertyType处理属性值
                switch (actualPropertyType) {
                    case 'string':
                        processedValue = String(value);
                        break;
                    case 'number':
                    case 'integer':
                    case 'float':
                        processedValue = Number(value);
                        break;
                    case 'boolean':
                        processedValue = Boolean(value);
                        break;
                    case 'color':
                        if (typeof value === 'string') {
                            // 字符串格式：支持十六进制、颜色名称、rgb()/rgba()
                            processedValue = this.parseColorString(value);
                        }
                        else if (typeof value === 'object' && value !== null) {
                            // 对象格式：验证并转换RGBA值
                            processedValue = {
                                r: Math.min(255, Math.max(0, Number(value.r) || 0)),
                                g: Math.min(255, Math.max(0, Number(value.g) || 0)),
                                b: Math.min(255, Math.max(0, Number(value.b) || 0)),
                                a: value.a !== undefined ? Math.min(255, Math.max(0, Number(value.a))) : 255
                            };
                        }
                        else {
                            throw new Error('Color value must be an object with r, g, b properties or a hexadecimal string (e.g., "#FF0000")');
                        }
                        break;
                    case 'vec2':
                        if (typeof value === 'object' && value !== null) {
                            processedValue = {
                                x: Number(value.x) || 0,
                                y: Number(value.y) || 0
                            };
                        }
                        else {
                            throw new Error('Vec2 value must be an object with x, y properties');
                        }
                        break;
                    case 'vec3':
                        if (typeof value === 'object' && value !== null) {
                            processedValue = {
                                x: Number(value.x) || 0,
                                y: Number(value.y) || 0,
                                z: Number(value.z) || 0
                            };
                        }
                        else {
                            throw new Error('Vec3 value must be an object with x, y, z properties');
                        }
                        break;
                    case 'size':
                        if (typeof value === 'object' && value !== null) {
                            processedValue = {
                                width: Number(value.width) || 0,
                                height: Number(value.height) || 0
                            };
                        }
                        else {
                            throw new Error('Size value must be an object with width, height properties');
                        }
                        break;
                    case 'node':
                        if (typeof value === 'string') {
                            processedValue = { uuid: value };
                        }
                        else {
                            throw new Error('Node reference value must be a string UUID');
                        }
                        break;
                    case 'component':
                        if (typeof value === 'string') {
                            // 组件引用需要特殊处理：通过节点UUID找到组件的__id__
                            processedValue = value; // 先保存节点UUID，后续会转换为__id__
                        }
                        else {
                            throw new Error('Component reference value must be a string (node UUID containing the target component)');
                        }
                        break;
                    case 'spriteFrame':
                    case 'prefab':
                    case 'asset':
                        if (typeof value === 'string') {
                            processedValue = { uuid: value };
                        }
                        else {
                            throw new Error(`${propertyType} value must be a string UUID`);
                        }
                        break;
                    case 'nodeArray':
                        if (Array.isArray(value)) {
                            processedValue = value.map((item) => {
                                if (typeof item === 'string') {
                                    return { uuid: item };
                                }
                                else {
                                    throw new Error('NodeArray items must be string UUIDs');
                                }
                            });
                        }
                        else {
                            throw new Error('NodeArray value must be an array');
                        }
                        break;
                    case 'colorArray':
                        if (Array.isArray(value)) {
                            processedValue = value.map((item) => {
                                if (typeof item === 'object' && item !== null && 'r' in item) {
                                    return {
                                        r: Math.min(255, Math.max(0, Number(item.r) || 0)),
                                        g: Math.min(255, Math.max(0, Number(item.g) || 0)),
                                        b: Math.min(255, Math.max(0, Number(item.b) || 0)),
                                        a: item.a !== undefined ? Math.min(255, Math.max(0, Number(item.a))) : 255
                                    };
                                }
                                else {
                                    return { r: 255, g: 255, b: 255, a: 255 };
                                }
                            });
                        }
                        else {
                            throw new Error('ColorArray value must be an array');
                        }
                        break;
                    case 'numberArray':
                        if (Array.isArray(value)) {
                            processedValue = value.map((item) => Number(item));
                        }
                        else {
                            throw new Error('NumberArray value must be an array');
                        }
                        break;
                    case 'stringArray':
                        if (Array.isArray(value)) {
                            processedValue = value.map((item) => String(item));
                        }
                        else {
                            throw new Error('StringArray value must be an array');
                        }
                        break;
                    default:
                        throw new Error(`Unsupported property type: ${propertyType}`);
                }
                console.log(`[ComponentTools] Converting value: ${JSON.stringify(value)} -> ${JSON.stringify(processedValue)} (type: ${actualPropertyType})`);
                console.log(`[ComponentTools] Property analysis result: propertyInfo.type="${propertyInfo.type}", actualPropertyType="${actualPropertyType}"`);
                console.log(`[ComponentTools] Will use color special handling: ${actualPropertyType === 'color' && processedValue && typeof processedValue === 'object'}`);
                // 用于验证的实际期望值（对于组件引用需要特殊处理）
                let actualExpectedValue = processedValue;
                // Step 5: 获取原始节点数据来构建正确的路径
                const rawNodeData = await Editor.Message.request('scene', 'query-node', nodeUuid);
                if (!rawNodeData || !rawNodeData.__comps__) {
                    resolve({
                        success: false,
                        error: `Failed to get raw node data for property setting`
                    });
                    return;
                }
                // 找到原始组件的索引
                let rawComponentIndex = -1;
                for (let i = 0; i < rawNodeData.__comps__.length; i++) {
                    const comp = rawNodeData.__comps__[i];
                    const compType = comp.__type__ || comp.cid || comp.type || 'Unknown';
                    if (compType === componentType) {
                        rawComponentIndex = i;
                        break;
                    }
                }
                if (rawComponentIndex === -1) {
                    resolve({
                        success: false,
                        error: `Could not find component index for setting property`
                    });
                    return;
                }
                // 构建正确的属性路径
                let propertyPath = `__comps__.${rawComponentIndex}.${property}`;
                // 特殊处理资源类属性
                if (actualPropertyType === 'asset' || actualPropertyType === 'spriteFrame' || actualPropertyType === 'prefab' ||
                    (propertyInfo.type === 'asset' && actualPropertyType === 'string')) {
                    console.log(`[ComponentTools] Setting asset reference:`, {
                        value: processedValue,
                        property: property,
                        actualPropertyType: actualPropertyType,
                        path: propertyPath
                    });
                    // Determine asset type based on property name
                    let assetType = 'cc.SpriteFrame'; // default
                    if (property.toLowerCase().includes('texture')) {
                        assetType = 'cc.Texture2D';
                    }
                    else if (property.toLowerCase().includes('material')) {
                        assetType = 'cc.Material';
                    }
                    else if (property.toLowerCase().includes('font')) {
                        assetType = 'cc.Font';
                    }
                    else if (property.toLowerCase().includes('clip')) {
                        assetType = 'cc.AudioClip';
                    }
                    else if (actualPropertyType === 'prefab') {
                        assetType = 'cc.Prefab';
                    }
                    await Editor.Message.request('scene', 'set-property', {
                        uuid: nodeUuid,
                        path: propertyPath,
                        dump: {
                            value: processedValue,
                            type: assetType
                        }
                    });
                }
                else if (componentType === 'cc.UITransform' && (property === '_contentSize' || property === 'contentSize')) {
                    // Special handling for UITransform contentSize - set width and height separately
                    const width = Number(value.width) || 100;
                    const height = Number(value.height) || 100;
                    // Set width first
                    await Editor.Message.request('scene', 'set-property', {
                        uuid: nodeUuid,
                        path: `__comps__.${rawComponentIndex}.width`,
                        dump: { value: width }
                    });
                    // Then set height
                    await Editor.Message.request('scene', 'set-property', {
                        uuid: nodeUuid,
                        path: `__comps__.${rawComponentIndex}.height`,
                        dump: { value: height }
                    });
                }
                else if (componentType === 'cc.UITransform' && (property === '_anchorPoint' || property === 'anchorPoint')) {
                    // Special handling for UITransform anchorPoint - set anchorX and anchorY separately
                    const anchorX = Number(value.x) || 0.5;
                    const anchorY = Number(value.y) || 0.5;
                    // Set anchorX first
                    await Editor.Message.request('scene', 'set-property', {
                        uuid: nodeUuid,
                        path: `__comps__.${rawComponentIndex}.anchorX`,
                        dump: { value: anchorX }
                    });
                    // Then set anchorY  
                    await Editor.Message.request('scene', 'set-property', {
                        uuid: nodeUuid,
                        path: `__comps__.${rawComponentIndex}.anchorY`,
                        dump: { value: anchorY }
                    });
                }
                else if (actualPropertyType === 'color' && processedValue && typeof processedValue === 'object') {
                    // 特殊处理颜色属性，确保RGBA值正确
                    // Cocos Creator颜色值范围是0-255
                    const colorValue = {
                        r: Math.min(255, Math.max(0, Number(processedValue.r) || 0)),
                        g: Math.min(255, Math.max(0, Number(processedValue.g) || 0)),
                        b: Math.min(255, Math.max(0, Number(processedValue.b) || 0)),
                        a: processedValue.a !== undefined ? Math.min(255, Math.max(0, Number(processedValue.a))) : 255
                    };
                    console.log(`[ComponentTools] Setting color value:`, colorValue);
                    await Editor.Message.request('scene', 'set-property', {
                        uuid: nodeUuid,
                        path: propertyPath,
                        dump: {
                            value: colorValue,
                            type: 'cc.Color'
                        }
                    });
                }
                else if (actualPropertyType === 'vec3' && processedValue && typeof processedValue === 'object') {
                    // 特殊处理Vec3属性
                    const vec3Value = {
                        x: Number(processedValue.x) || 0,
                        y: Number(processedValue.y) || 0,
                        z: Number(processedValue.z) || 0
                    };
                    await Editor.Message.request('scene', 'set-property', {
                        uuid: nodeUuid,
                        path: propertyPath,
                        dump: {
                            value: vec3Value,
                            type: 'cc.Vec3'
                        }
                    });
                }
                else if (actualPropertyType === 'vec2' && processedValue && typeof processedValue === 'object') {
                    // 特殊处理Vec2属性
                    const vec2Value = {
                        x: Number(processedValue.x) || 0,
                        y: Number(processedValue.y) || 0
                    };
                    await Editor.Message.request('scene', 'set-property', {
                        uuid: nodeUuid,
                        path: propertyPath,
                        dump: {
                            value: vec2Value,
                            type: 'cc.Vec2'
                        }
                    });
                }
                else if (actualPropertyType === 'size' && processedValue && typeof processedValue === 'object') {
                    // 特殊处理Size属性
                    const sizeValue = {
                        width: Number(processedValue.width) || 0,
                        height: Number(processedValue.height) || 0
                    };
                    await Editor.Message.request('scene', 'set-property', {
                        uuid: nodeUuid,
                        path: propertyPath,
                        dump: {
                            value: sizeValue,
                            type: 'cc.Size'
                        }
                    });
                }
                else if (actualPropertyType === 'node' && processedValue && typeof processedValue === 'object' && 'uuid' in processedValue) {
                    // 特殊处理节点引用
                    console.log(`[ComponentTools] Setting node reference with UUID: ${processedValue.uuid}`);
                    await Editor.Message.request('scene', 'set-property', {
                        uuid: nodeUuid,
                        path: propertyPath,
                        dump: {
                            value: processedValue,
                            type: 'cc.Node'
                        }
                    });
                }
                else if (actualPropertyType === 'component' && typeof processedValue === 'string') {
                    // 特殊处理组件引用：通过节点UUID找到组件的__id__
                    const targetNodeUuid = processedValue;
                    console.log(`[ComponentTools] Setting component reference - finding component on node: ${targetNodeUuid}`);
                    // 从当前组件的属性元数据中获取期望的组件类型
                    let expectedComponentType = '';
                    // 获取当前组件的详细信息，包括属性元数据
                    const currentComponentInfo = await this.getComponentInfo(nodeUuid, componentType);
                    if (currentComponentInfo.success && ((_b = (_a = currentComponentInfo.data) === null || _a === void 0 ? void 0 : _a.properties) === null || _b === void 0 ? void 0 : _b[property])) {
                        const propertyMeta = currentComponentInfo.data.properties[property];
                        // 从属性元数据中提取组件类型信息
                        if (propertyMeta && typeof propertyMeta === 'object') {
                            // 检查是否有type字段指示组件类型
                            if (propertyMeta.type) {
                                expectedComponentType = propertyMeta.type;
                            }
                            else if (propertyMeta.ctor) {
                                // 有些属性可能使用ctor字段
                                expectedComponentType = propertyMeta.ctor;
                            }
                            else if (propertyMeta.extends && Array.isArray(propertyMeta.extends)) {
                                // 检查extends数组，通常第一个是最具体的类型
                                for (const extendType of propertyMeta.extends) {
                                    if (extendType.startsWith('cc.') && extendType !== 'cc.Component' && extendType !== 'cc.Object') {
                                        expectedComponentType = extendType;
                                        break;
                                    }
                                }
                            }
                        }
                    }
                    if (!expectedComponentType) {
                        throw new Error(`Unable to determine required component type for property '${property}' on component '${componentType}'. Property metadata may not contain type information.`);
                    }
                    console.log(`[ComponentTools] Detected required component type: ${expectedComponentType} for property: ${property}`);
                    try {
                        // 获取目标节点的组件信息
                        const targetNodeData = await Editor.Message.request('scene', 'query-node', targetNodeUuid);
                        if (!targetNodeData || !targetNodeData.__comps__) {
                            throw new Error(`Target node ${targetNodeUuid} not found or has no components`);
                        }
                        // 打印目标节点的组件概览
                        console.log(`[ComponentTools] Target node ${targetNodeUuid} has ${targetNodeData.__comps__.length} components:`);
                        targetNodeData.__comps__.forEach((comp, index) => {
                            const sceneId = comp.value && comp.value.uuid && comp.value.uuid.value ? comp.value.uuid.value : 'unknown';
                            console.log(`[ComponentTools] Component ${index}: ${comp.type} (scene_id: ${sceneId})`);
                        });
                        // 查找对应的组件
                        let targetComponent = null;
                        let componentId = null;
                        // 在目标节点的_components数组中查找指定类型的组件
                        // 注意：__comps__和_components的索引是对应的
                        console.log(`[ComponentTools] Searching for component type: ${expectedComponentType}`);
                        for (let i = 0; i < targetNodeData.__comps__.length; i++) {
                            const comp = targetNodeData.__comps__[i];
                            console.log(`[ComponentTools] Checking component ${i}: type=${comp.type}, target=${expectedComponentType}`);
                            if (comp.type === expectedComponentType) {
                                targetComponent = comp;
                                console.log(`[ComponentTools] Found matching component at index ${i}: ${comp.type}`);
                                // 从组件的value.uuid.value中获取组件在场景中的ID
                                if (comp.value && comp.value.uuid && comp.value.uuid.value) {
                                    componentId = comp.value.uuid.value;
                                    console.log(`[ComponentTools] Got componentId from comp.value.uuid.value: ${componentId}`);
                                }
                                else {
                                    console.log(`[ComponentTools] Component structure:`, {
                                        hasValue: !!comp.value,
                                        hasUuid: !!(comp.value && comp.value.uuid),
                                        hasUuidValue: !!(comp.value && comp.value.uuid && comp.value.uuid.value),
                                        uuidStructure: comp.value ? comp.value.uuid : 'No value'
                                    });
                                    throw new Error(`Unable to extract component ID from component structure`);
                                }
                                break;
                            }
                        }
                        if (!targetComponent) {
                            // 如果没找到，列出可用组件让用户了解，显示场景中的真实ID
                            const availableComponents = targetNodeData.__comps__.map((comp, index) => {
                                let sceneId = 'unknown';
                                // 从组件的value.uuid.value获取场景ID
                                if (comp.value && comp.value.uuid && comp.value.uuid.value) {
                                    sceneId = comp.value.uuid.value;
                                }
                                return `${comp.type}(scene_id:${sceneId})`;
                            });
                            throw new Error(`Component type '${expectedComponentType}' not found on node ${targetNodeUuid}. Available components: ${availableComponents.join(', ')}`);
                        }
                        console.log(`[ComponentTools] Found component ${expectedComponentType} with scene ID: ${componentId} on node ${targetNodeUuid}`);
                        // 更新期望值为实际的组件ID对象格式，用于后续验证
                        if (componentId) {
                            actualExpectedValue = { uuid: componentId };
                        }
                        // 尝试使用与节点/资源引用相同的格式：{uuid: componentId}
                        // 测试看是否能正确设置组件引用
                        await Editor.Message.request('scene', 'set-property', {
                            uuid: nodeUuid,
                            path: propertyPath,
                            dump: {
                                value: { uuid: componentId }, // 使用对象格式，像节点/资源引用一样
                                type: expectedComponentType
                            }
                        });
                    }
                    catch (error) {
                        console.error(`[ComponentTools] Error setting component reference:`, error);
                        throw error;
                    }
                }
                else if (actualPropertyType === 'nodeArray' && Array.isArray(processedValue)) {
                    // 特殊处理节点数组 - 保持预处理的格式
                    console.log(`[ComponentTools] Setting node array:`, processedValue);
                    await Editor.Message.request('scene', 'set-property', {
                        uuid: nodeUuid,
                        path: propertyPath,
                        dump: {
                            value: processedValue // 保持 [{uuid: "..."}, {uuid: "..."}] 格式
                        }
                    });
                }
                else if (actualPropertyType === 'colorArray' && Array.isArray(processedValue)) {
                    // 特殊处理颜色数组
                    const colorArrayValue = processedValue.map((item) => {
                        if (item && typeof item === 'object' && 'r' in item) {
                            return {
                                r: Math.min(255, Math.max(0, Number(item.r) || 0)),
                                g: Math.min(255, Math.max(0, Number(item.g) || 0)),
                                b: Math.min(255, Math.max(0, Number(item.b) || 0)),
                                a: item.a !== undefined ? Math.min(255, Math.max(0, Number(item.a))) : 255
                            };
                        }
                        else {
                            return { r: 255, g: 255, b: 255, a: 255 };
                        }
                    });
                    await Editor.Message.request('scene', 'set-property', {
                        uuid: nodeUuid,
                        path: propertyPath,
                        dump: {
                            value: colorArrayValue,
                            type: 'cc.Color'
                        }
                    });
                }
                else {
                    // Normal property setting for non-asset properties
                    await Editor.Message.request('scene', 'set-property', {
                        uuid: nodeUuid,
                        path: propertyPath,
                        dump: { value: processedValue }
                    });
                }
                // Step 5: 等待Editor完成更新，然后验证设置结果
                await new Promise(resolve => setTimeout(resolve, 200)); // 等待200ms让Editor完成更新
                const verification = await this.verifyPropertyChange(nodeUuid, componentType, property, originalValue, actualExpectedValue);
                resolve({
                    success: true,
                    message: `Successfully set ${componentType}.${property}`,
                    data: {
                        nodeUuid,
                        componentType,
                        property,
                        actualValue: verification.actualValue,
                        changeVerified: verification.verified
                    }
                });
            }
            catch (error) {
                console.error(`[ComponentTools] Error setting property:`, error);
                resolve({
                    success: false,
                    error: `Failed to set property: ${error.message}`
                });
            }
        });
    }
    /**
     * 批量设置组件的多个属性
     * @param args 包含 nodeUuid, componentType, properties 数组
     */
    async setComponentProperties(args) {
        const { nodeUuid, componentType, properties } = args;
        return new Promise(async (resolve) => {
            var _a;
            try {
                // 验证必要参数
                if (!nodeUuid) {
                    resolve({ success: false, error: 'nodeUuid is required' });
                    return;
                }
                if (!componentType) {
                    resolve({ success: false, error: 'componentType is required' });
                    return;
                }
                if (!properties || !Array.isArray(properties) || properties.length === 0) {
                    resolve({ success: false, error: 'properties array is required and must not be empty' });
                    return;
                }
                console.log(`[ComponentTools] Batch setting ${properties.length} properties on ${componentType} for node ${nodeUuid}`);
                // 先检查组件是否存在
                const componentsResponse = await this.getComponents(nodeUuid);
                if (!componentsResponse.success || !((_a = componentsResponse.data) === null || _a === void 0 ? void 0 : _a.components)) {
                    resolve({
                        success: false,
                        error: `Failed to get components: ${componentsResponse.error}`
                    });
                    return;
                }
                const availableTypes = componentsResponse.data.components.map((c) => c.type);
                const targetComponent = componentsResponse.data.components.find((comp) => comp.type === componentType);
                if (!targetComponent) {
                    const instruction = this.generateComponentSuggestion(componentType, availableTypes, '');
                    resolve({
                        success: false,
                        error: `Component '${componentType}' not found on node. Available components: ${availableTypes.join(', ')}`,
                        instruction: instruction
                    });
                    return;
                }
                // 逐个设置属性
                const results = [];
                let hasError = false;
                for (let i = 0; i < properties.length; i++) {
                    const propSetting = properties[i];
                    // 验证每个属性设置的必需字段
                    if (!propSetting.property) {
                        results.push({
                            property: `index_${i}`,
                            success: false,
                            error: 'property name is required'
                        });
                        hasError = true;
                        continue;
                    }
                    if (propSetting.value === undefined || propSetting.value === null) {
                        results.push({
                            property: propSetting.property,
                            success: false,
                            error: 'value is required'
                        });
                        hasError = true;
                        continue;
                    }
                    try {
                        // 构造单个属性设置的参数
                        const singlePropArgs = {
                            nodeUuid,
                            componentType,
                            property: propSetting.property,
                            propertyType: propSetting.propertyType,
                            value: propSetting.value
                        };
                        // 调用现有的单属性设置方法
                        const result = await this.setComponentProperty(singlePropArgs);
                        results.push({
                            property: propSetting.property,
                            success: result.success,
                            error: result.error
                        });
                        if (!result.success) {
                            hasError = true;
                            console.warn(`[ComponentTools] Failed to set property '${propSetting.property}': ${result.error}`);
                        }
                    }
                    catch (error) {
                        results.push({
                            property: propSetting.property,
                            success: false,
                            error: error.message
                        });
                        hasError = true;
                        console.error(`[ComponentTools] Error setting property '${propSetting.property}':`, error);
                    }
                }
                // 返回批量操作结果
                const successCount = results.filter(r => r.success).length;
                const failCount = results.filter(r => !r.success).length;
                resolve({
                    success: !hasError,
                    message: `Batch property update completed: ${successCount} succeeded, ${failCount} failed`,
                    data: {
                        nodeUuid,
                        componentType,
                        totalProperties: properties.length,
                        successCount,
                        failCount,
                        results
                    }
                });
            }
            catch (error) {
                console.error(`[ComponentTools] Error in batch property update:`, error);
                resolve({
                    success: false,
                    error: `Batch property update failed: ${error.message}`
                });
            }
        });
    }
    async attachScript(nodeUuid, scriptPath) {
        return new Promise(async (resolve) => {
            var _a, _b, _c;
            // 验证必要参数
            if (!nodeUuid) {
                resolve({ success: false, error: 'nodeUuid is required' });
                return;
            }
            if (!scriptPath) {
                resolve({ success: false, error: 'scriptPath is required' });
                return;
            }
            // 从脚本路径提取组件类名
            const scriptName = (_a = scriptPath.split('/').pop()) === null || _a === void 0 ? void 0 : _a.replace('.ts', '').replace('.js', '');
            if (!scriptName) {
                resolve({ success: false, error: 'Invalid script path' });
                return;
            }
            // 先查找节点上是否已存在该脚本组件
            const allComponentsInfo = await this.getComponents(nodeUuid);
            if (allComponentsInfo.success && ((_b = allComponentsInfo.data) === null || _b === void 0 ? void 0 : _b.components)) {
                const existingScript = allComponentsInfo.data.components.find((comp) => comp.type === scriptName);
                if (existingScript) {
                    resolve({
                        success: true,
                        message: `Script '${scriptName}' already exists on node`,
                        data: {
                            nodeUuid: nodeUuid,
                            componentName: scriptName,
                            existing: true
                        }
                    });
                    return;
                }
            }
            // 首先尝试直接使用脚本名称作为组件类型
            try {
                await Editor.Message.request('scene', 'create-component', {
                    uuid: nodeUuid,
                    component: scriptName // 使用脚本名称而非UUID
                });
                // 等待一段时间让Editor完成组件添加
                await new Promise(resolve => setTimeout(resolve, 100));
                // 重新查询节点信息验证脚本是否真的添加成功
                const allComponentsInfo2 = await this.getComponents(nodeUuid);
                if (allComponentsInfo2.success && ((_c = allComponentsInfo2.data) === null || _c === void 0 ? void 0 : _c.components)) {
                    const addedScript = allComponentsInfo2.data.components.find((comp) => comp.type === scriptName);
                    if (addedScript) {
                        resolve({
                            success: true,
                            message: `Script '${scriptName}' attached successfully`,
                            data: {
                                nodeUuid: nodeUuid,
                                componentName: scriptName,
                                existing: false
                            }
                        });
                    }
                    else {
                        resolve({
                            success: false,
                            error: `Script '${scriptName}' was not found on node after addition. Available components: ${allComponentsInfo2.data.components.map((c) => c.type).join(', ')}`
                        });
                    }
                }
                else {
                    resolve({
                        success: false,
                        error: `Failed to verify script addition: ${allComponentsInfo2.error || 'Unable to get node components'}`
                    });
                }
            }
            catch (err) {
                // 备用方案：使用场景脚本
                console.warn(`[ComponentTools] Direct API failed for script attachment, trying scene script: ${err.message}`);
                try {
                    const options = {
                        name: 'cocos-mcp-server',
                        method: 'attachScript',
                        args: [nodeUuid, scriptPath]
                    };
                    const result = await Editor.Message.request('scene', 'execute-scene-script', options);
                    resolve(result);
                }
                catch (err2) {
                    resolve({
                        success: false,
                        error: `Failed to attach script '${scriptName}': ${err.message}`,
                        instruction: 'Please ensure the script is properly compiled and exported as a Component class. You can also manually attach the script through the Properties panel in the editor.'
                    });
                }
            }
        });
    }
    async getAvailableComponents(category = 'all') {
        const componentCategories = {
            renderer: ['cc.Sprite', 'cc.Label', 'cc.RichText', 'cc.Mask', 'cc.Graphics'],
            ui: ['cc.Button', 'cc.Toggle', 'cc.Slider', 'cc.ScrollView', 'cc.EditBox', 'cc.ProgressBar'],
            physics: ['cc.RigidBody2D', 'cc.BoxCollider2D', 'cc.CircleCollider2D', 'cc.PolygonCollider2D'],
            animation: ['cc.Animation', 'cc.AnimationClip', 'cc.SkeletalAnimation'],
            audio: ['cc.AudioSource'],
            layout: ['cc.Layout', 'cc.Widget', 'cc.PageView', 'cc.PageViewIndicator'],
            effects: ['cc.MotionStreak', 'cc.ParticleSystem2D'],
            camera: ['cc.Camera'],
            light: ['cc.Light', 'cc.DirectionalLight', 'cc.PointLight', 'cc.SpotLight']
        };
        let components = [];
        if (category === 'all') {
            for (const cat in componentCategories) {
                components = components.concat(componentCategories[cat]);
            }
        }
        else if (componentCategories[category]) {
            components = componentCategories[category];
        }
        return {
            success: true,
            data: {
                category: category,
                components: components
            }
        };
    }
    isValidPropertyDescriptor(propData) {
        // 检查是否是有效的属性描述对象
        if (typeof propData !== 'object' || propData === null) {
            return false;
        }
        try {
            const keys = Object.keys(propData);
            // 避免遍历简单的数值对象（如 {width: 200, height: 150}）
            const isSimpleValueObject = keys.every(key => {
                const value = propData[key];
                return typeof value === 'number' || typeof value === 'string' || typeof value === 'boolean';
            });
            if (isSimpleValueObject) {
                return false;
            }
            // 检查是否包含属性描述符的特征字段，不使用'in'操作符
            const hasName = keys.includes('name');
            const hasValue = keys.includes('value');
            const hasType = keys.includes('type');
            const hasDisplayName = keys.includes('displayName');
            const hasReadonly = keys.includes('readonly');
            // 必须包含name或value字段，且通常还有type字段
            const hasValidStructure = (hasName || hasValue) && (hasType || hasDisplayName || hasReadonly);
            // 额外检查：如果有default字段且结构复杂，避免深度遍历
            if (keys.includes('default') && propData.default && typeof propData.default === 'object') {
                const defaultKeys = Object.keys(propData.default);
                if (defaultKeys.includes('value') && typeof propData.default.value === 'object') {
                    // 这种情况下，我们只返回顶层属性，不深入遍历default.value
                    return hasValidStructure;
                }
            }
            return hasValidStructure;
        }
        catch (error) {
            console.warn(`[isValidPropertyDescriptor] Error checking property descriptor:`, error);
            return false;
        }
    }
    analyzeProperty(component, propertyName) {
        // 从复杂的组件结构中提取可用属性
        const availableProperties = [];
        let propertyValue = undefined;
        let propertyExists = false;
        // 尝试多种方式查找属性：
        // 1. 直接属性访问
        if (Object.prototype.hasOwnProperty.call(component, propertyName)) {
            propertyValue = component[propertyName];
            propertyExists = true;
        }
        // 2. 从嵌套结构中查找 (如从测试数据看到的复杂结构)
        if (!propertyExists && component.properties && typeof component.properties === 'object') {
            // 首先检查properties.value是否存在（这是我们在getComponents中看到的结构）
            if (component.properties.value && typeof component.properties.value === 'object') {
                const valueObj = component.properties.value;
                for (const [key, propData] of Object.entries(valueObj)) {
                    // 检查propData是否是一个有效的属性描述对象
                    // 确保propData是对象且包含预期的属性结构
                    if (this.isValidPropertyDescriptor(propData)) {
                        const propInfo = propData;
                        availableProperties.push(key);
                        if (key === propertyName) {
                            // 优先使用value属性，如果没有则使用propData本身
                            try {
                                const propKeys = Object.keys(propInfo);
                                propertyValue = propKeys.includes('value') ? propInfo.value : propInfo;
                            }
                            catch (error) {
                                // 如果检查失败，直接使用propInfo
                                propertyValue = propInfo;
                            }
                            propertyExists = true;
                        }
                    }
                }
            }
            else {
                // 备用方案：直接从properties查找
                for (const [key, propData] of Object.entries(component.properties)) {
                    if (this.isValidPropertyDescriptor(propData)) {
                        const propInfo = propData;
                        availableProperties.push(key);
                        if (key === propertyName) {
                            // 优先使用value属性，如果没有则使用propData本身
                            try {
                                const propKeys = Object.keys(propInfo);
                                propertyValue = propKeys.includes('value') ? propInfo.value : propInfo;
                            }
                            catch (error) {
                                // 如果检查失败，直接使用propInfo
                                propertyValue = propInfo;
                            }
                            propertyExists = true;
                        }
                    }
                }
            }
        }
        // 3. 从直接属性中提取简单属性名
        if (availableProperties.length === 0) {
            for (const key of Object.keys(component)) {
                if (!key.startsWith('_') && !['__type__', 'cid', 'node', 'uuid', 'name', 'enabled', 'type', 'readonly', 'visible'].includes(key)) {
                    availableProperties.push(key);
                }
            }
        }
        if (!propertyExists) {
            return {
                exists: false,
                type: 'unknown',
                availableProperties,
                originalValue: undefined
            };
        }
        let type = 'unknown';
        // 首先检查属性描述符中的 type 字段（这是最准确的类型信息）
        if (propertyValue && typeof propertyValue === 'object' && propertyValue.type) {
            const declaredType = propertyValue.type;
            console.log(`[analyzeProperty] Found declared type: ${declaredType} for property ${propertyName}`);
            // 根据声明的类型确定处理方式
            if (declaredType === 'cc.Node' || declaredType === 'cc.Node[]') {
                type = declaredType === 'cc.Node[]' ? 'nodeArray' : 'node';
                return {
                    exists: true,
                    type,
                    availableProperties,
                    originalValue: propertyValue.value !== undefined ? propertyValue.value : propertyValue
                };
            }
            else if (declaredType === 'cc.Component' || declaredType.includes('Component') ||
                declaredType === 'cc.AudioSource' || declaredType === 'cc.Label' ||
                declaredType === 'cc.Sprite' || declaredType === 'cc.Button') {
                // 组件引用类型
                type = 'component';
                return {
                    exists: true,
                    type,
                    availableProperties,
                    originalValue: propertyValue.value !== undefined ? propertyValue.value : propertyValue
                };
            }
            else if (declaredType === 'cc.SpriteFrame' || declaredType === 'cc.Prefab' ||
                declaredType === 'cc.Material' || declaredType === 'cc.Font' ||
                declaredType === 'cc.Texture' || declaredType === 'cc.AudioClip') {
                type = 'asset';
                return {
                    exists: true,
                    type,
                    availableProperties,
                    originalValue: propertyValue.value !== undefined ? propertyValue.value : propertyValue
                };
            }
            else if (declaredType === 'cc.Color') {
                type = 'color';
                return {
                    exists: true,
                    type,
                    availableProperties,
                    originalValue: propertyValue.value !== undefined ? propertyValue.value : propertyValue
                };
            }
            else if (declaredType === 'cc.Vec2') {
                type = 'vec2';
                return {
                    exists: true,
                    type,
                    availableProperties,
                    originalValue: propertyValue.value !== undefined ? propertyValue.value : propertyValue
                };
            }
            else if (declaredType === 'cc.Vec3') {
                type = 'vec3';
                return {
                    exists: true,
                    type,
                    availableProperties,
                    originalValue: propertyValue.value !== undefined ? propertyValue.value : propertyValue
                };
            }
            else if (declaredType === 'cc.Size') {
                type = 'size';
                return {
                    exists: true,
                    type,
                    availableProperties,
                    originalValue: propertyValue.value !== undefined ? propertyValue.value : propertyValue
                };
            }
            else if (declaredType === 'String') {
                type = 'string';
                return {
                    exists: true,
                    type,
                    availableProperties,
                    originalValue: propertyValue.value !== undefined ? propertyValue.value : propertyValue
                };
            }
            else if (declaredType === 'Number' || declaredType === 'Integer' || declaredType === 'Float') {
                type = 'number';
                return {
                    exists: true,
                    type,
                    availableProperties,
                    originalValue: propertyValue.value !== undefined ? propertyValue.value : propertyValue
                };
            }
            else if (declaredType === 'Boolean') {
                type = 'boolean';
                return {
                    exists: true,
                    type,
                    availableProperties,
                    originalValue: propertyValue.value !== undefined ? propertyValue.value : propertyValue
                };
            }
        }
        // 如果属性有 value 字段，提取实际值进行类型检测
        const actualValue = (propertyValue && typeof propertyValue === 'object' && 'value' in propertyValue)
            ? propertyValue.value
            : propertyValue;
        // 智能类型检测
        if (Array.isArray(actualValue)) {
            // 数组类型检测
            if (propertyName.toLowerCase().includes('node')) {
                type = 'nodeArray';
            }
            else if (propertyName.toLowerCase().includes('color')) {
                type = 'colorArray';
            }
            else {
                type = 'array';
            }
        }
        else if (typeof actualValue === 'string') {
            // Check if property name suggests it's an asset
            if (['spriteFrame', 'texture', 'material', 'font', 'clip', 'prefab'].includes(propertyName.toLowerCase())) {
                type = 'asset';
            }
            else {
                type = 'string';
            }
        }
        else if (typeof actualValue === 'number') {
            type = 'number';
        }
        else if (typeof actualValue === 'boolean') {
            type = 'boolean';
        }
        else if (actualValue && typeof actualValue === 'object') {
            try {
                const keys = Object.keys(actualValue);
                if (keys.includes('r') && keys.includes('g') && keys.includes('b')) {
                    type = 'color';
                }
                else if (keys.includes('x') && keys.includes('y')) {
                    type = actualValue.z !== undefined ? 'vec3' : 'vec2';
                }
                else if (keys.includes('width') && keys.includes('height')) {
                    type = 'size';
                }
                else if (keys.includes('uuid') || keys.includes('__uuid__')) {
                    // 检查是否是节点引用（通过属性名或__id__属性判断）
                    if (propertyName.toLowerCase().includes('node') ||
                        propertyName.toLowerCase().includes('target') ||
                        keys.includes('__id__')) {
                        type = 'node';
                    }
                    else {
                        type = 'asset';
                    }
                }
                else if (keys.includes('__id__')) {
                    // 节点引用特征
                    type = 'node';
                }
                else {
                    type = 'object';
                }
            }
            catch (error) {
                console.warn(`[analyzeProperty] Error checking property type for: ${JSON.stringify(actualValue)}`);
                type = 'object';
            }
        }
        else if (actualValue === null || actualValue === undefined) {
            // For null/undefined values, check property name to determine type
            if (['spriteFrame', 'texture', 'material', 'font', 'clip', 'prefab'].includes(propertyName.toLowerCase())) {
                type = 'asset';
            }
            else if (propertyName.toLowerCase().includes('node') ||
                propertyName.toLowerCase().includes('target')) {
                type = 'node';
            }
            else if (propertyName.toLowerCase().includes('component')) {
                type = 'component';
            }
            else {
                type = 'unknown';
            }
        }
        return {
            exists: true,
            type,
            availableProperties,
            originalValue: actualValue
        };
    }
    smartConvertValue(inputValue, propertyInfo) {
        const { type, originalValue } = propertyInfo;
        console.log(`[smartConvertValue] Converting ${JSON.stringify(inputValue)} to type: ${type}`);
        switch (type) {
            case 'string':
                return String(inputValue);
            case 'number':
                return Number(inputValue);
            case 'boolean':
                if (typeof inputValue === 'boolean')
                    return inputValue;
                if (typeof inputValue === 'string') {
                    return inputValue.toLowerCase() === 'true' || inputValue === '1';
                }
                return Boolean(inputValue);
            case 'color':
                // 优化的颜色处理，支持多种输入格式
                if (typeof inputValue === 'string') {
                    // 字符串格式：十六进制、颜色名称、rgb()/rgba()
                    return this.parseColorString(inputValue);
                }
                else if (typeof inputValue === 'object' && inputValue !== null) {
                    try {
                        const inputKeys = Object.keys(inputValue);
                        // 如果输入是颜色对象，验证并转换
                        if (inputKeys.includes('r') || inputKeys.includes('g') || inputKeys.includes('b')) {
                            return {
                                r: Math.min(255, Math.max(0, Number(inputValue.r) || 0)),
                                g: Math.min(255, Math.max(0, Number(inputValue.g) || 0)),
                                b: Math.min(255, Math.max(0, Number(inputValue.b) || 0)),
                                a: inputValue.a !== undefined ? Math.min(255, Math.max(0, Number(inputValue.a))) : 255
                            };
                        }
                    }
                    catch (error) {
                        console.warn(`[smartConvertValue] Invalid color object: ${JSON.stringify(inputValue)}`);
                    }
                }
                // 如果有原值，保持原值结构并更新提供的值
                if (originalValue && typeof originalValue === 'object') {
                    try {
                        const inputKeys = typeof inputValue === 'object' && inputValue ? Object.keys(inputValue) : [];
                        return {
                            r: inputKeys.includes('r') ? Math.min(255, Math.max(0, Number(inputValue.r))) : (originalValue.r || 255),
                            g: inputKeys.includes('g') ? Math.min(255, Math.max(0, Number(inputValue.g))) : (originalValue.g || 255),
                            b: inputKeys.includes('b') ? Math.min(255, Math.max(0, Number(inputValue.b))) : (originalValue.b || 255),
                            a: inputKeys.includes('a') ? Math.min(255, Math.max(0, Number(inputValue.a))) : (originalValue.a || 255)
                        };
                    }
                    catch (error) {
                        console.warn(`[smartConvertValue] Error processing color with original value: ${error}`);
                    }
                }
                // 默认返回白色
                console.warn(`[smartConvertValue] Using default white color for invalid input: ${JSON.stringify(inputValue)}`);
                return { r: 255, g: 255, b: 255, a: 255 };
            case 'vec2':
                if (typeof inputValue === 'object' && inputValue !== null) {
                    return {
                        x: Number(inputValue.x) || originalValue.x || 0,
                        y: Number(inputValue.y) || originalValue.y || 0
                    };
                }
                return originalValue;
            case 'vec3':
                if (typeof inputValue === 'object' && inputValue !== null) {
                    return {
                        x: Number(inputValue.x) || originalValue.x || 0,
                        y: Number(inputValue.y) || originalValue.y || 0,
                        z: Number(inputValue.z) || originalValue.z || 0
                    };
                }
                return originalValue;
            case 'size':
                if (typeof inputValue === 'object' && inputValue !== null) {
                    return {
                        width: Number(inputValue.width) || originalValue.width || 100,
                        height: Number(inputValue.height) || originalValue.height || 100
                    };
                }
                return originalValue;
            case 'node':
                if (typeof inputValue === 'string') {
                    // 节点引用需要特殊处理
                    return inputValue;
                }
                else if (typeof inputValue === 'object' && inputValue !== null) {
                    // 如果已经是对象形式，返回UUID或完整对象
                    return inputValue.uuid || inputValue;
                }
                return originalValue;
            case 'asset':
                if (typeof inputValue === 'string') {
                    // 如果输入是字符串路径，转换为asset对象
                    return { uuid: inputValue };
                }
                else if (typeof inputValue === 'object' && inputValue !== null) {
                    return inputValue;
                }
                return originalValue;
            default:
                // 对于未知类型，尽量保持原有结构
                if (typeof inputValue === typeof originalValue) {
                    return inputValue;
                }
                return originalValue;
        }
    }
    parseColorString(colorStr) {
        const str = colorStr.trim();
        // 只支持十六进制格式 #RRGGBB 或 #RRGGBBAA
        if (str.startsWith('#')) {
            if (str.length === 7) { // #RRGGBB
                const r = parseInt(str.substring(1, 3), 16);
                const g = parseInt(str.substring(3, 5), 16);
                const b = parseInt(str.substring(5, 7), 16);
                return { r, g, b, a: 255 };
            }
            else if (str.length === 9) { // #RRGGBBAA
                const r = parseInt(str.substring(1, 3), 16);
                const g = parseInt(str.substring(3, 5), 16);
                const b = parseInt(str.substring(5, 7), 16);
                const a = parseInt(str.substring(7, 9), 16);
                return { r, g, b, a };
            }
        }
        // 如果不是有效的十六进制格式，返回错误提示
        throw new Error(`Invalid color format: "${colorStr}". Only hexadecimal format is supported (e.g., "#FF0000" or "#FF0000FF")`);
    }
    async verifyPropertyChange(nodeUuid, componentType, property, originalValue, expectedValue) {
        var _a, _b;
        console.log(`[verifyPropertyChange] Starting verification for ${componentType}.${property}`);
        console.log(`[verifyPropertyChange] Expected value:`, JSON.stringify(expectedValue));
        console.log(`[verifyPropertyChange] Original value:`, JSON.stringify(originalValue));
        try {
            // 重新获取组件信息进行验证
            console.log(`[verifyPropertyChange] Calling getComponentInfo...`);
            const componentInfo = await this.getComponentInfo(nodeUuid, componentType);
            console.log(`[verifyPropertyChange] getComponentInfo success:`, componentInfo.success);
            const allComponents = await this.getComponents(nodeUuid);
            console.log(`[verifyPropertyChange] getComponents success:`, allComponents.success);
            if (componentInfo.success && componentInfo.data) {
                console.log(`[verifyPropertyChange] Component data available, extracting property '${property}'`);
                const allPropertyNames = Object.keys(componentInfo.data.properties || {});
                console.log(`[verifyPropertyChange] Available properties:`, allPropertyNames);
                const propertyData = (_a = componentInfo.data.properties) === null || _a === void 0 ? void 0 : _a[property];
                console.log(`[verifyPropertyChange] Raw property data for '${property}':`, JSON.stringify(propertyData));
                // 从属性数据中提取实际值
                let actualValue = propertyData;
                console.log(`[verifyPropertyChange] Initial actualValue:`, JSON.stringify(actualValue));
                if (propertyData && typeof propertyData === 'object' && 'value' in propertyData) {
                    actualValue = propertyData.value;
                    console.log(`[verifyPropertyChange] Extracted actualValue from .value:`, JSON.stringify(actualValue));
                }
                else {
                    console.log(`[verifyPropertyChange] No .value property found, using raw data`);
                }
                // 修复验证逻辑：检查实际值是否匹配期望值
                let verified = false;
                if (typeof expectedValue === 'object' && expectedValue !== null && 'uuid' in expectedValue) {
                    // 对于引用类型（节点/组件/资源），比较UUID
                    const actualUuid = actualValue && typeof actualValue === 'object' && 'uuid' in actualValue ? actualValue.uuid : '';
                    const expectedUuid = expectedValue.uuid || '';
                    verified = actualUuid === expectedUuid && expectedUuid !== '';
                    console.log(`[verifyPropertyChange] Reference comparison:`);
                    console.log(`  - Expected UUID: "${expectedUuid}"`);
                    console.log(`  - Actual UUID: "${actualUuid}"`);
                    console.log(`  - UUID match: ${actualUuid === expectedUuid}`);
                    console.log(`  - UUID not empty: ${expectedUuid !== ''}`);
                    console.log(`  - Final verified: ${verified}`);
                }
                else {
                    // 对于其他类型，直接比较值
                    console.log(`[verifyPropertyChange] Value comparison:`);
                    console.log(`  - Expected type: ${typeof expectedValue}`);
                    console.log(`  - Actual type: ${typeof actualValue}`);
                    if (typeof actualValue === typeof expectedValue) {
                        if (typeof actualValue === 'object' && actualValue !== null && expectedValue !== null) {
                            // 对象类型的深度比较
                            verified = JSON.stringify(actualValue) === JSON.stringify(expectedValue);
                            console.log(`  - Object comparison (JSON): ${verified}`);
                        }
                        else {
                            // 基本类型的直接比较
                            verified = actualValue === expectedValue;
                            console.log(`  - Direct comparison: ${verified}`);
                        }
                    }
                    else {
                        // 类型不匹配时的特殊处理（如数字和字符串）
                        const stringMatch = String(actualValue) === String(expectedValue);
                        const numberMatch = Number(actualValue) === Number(expectedValue);
                        verified = stringMatch || numberMatch;
                        console.log(`  - String match: ${stringMatch}`);
                        console.log(`  - Number match: ${numberMatch}`);
                        console.log(`  - Type mismatch verified: ${verified}`);
                    }
                }
                console.log(`[verifyPropertyChange] Final verification result: ${verified}`);
                console.log(`[verifyPropertyChange] Final actualValue:`, JSON.stringify(actualValue));
                const result = {
                    verified,
                    actualValue,
                    fullData: {
                        // 只返回修改的属性信息，不返回完整组件数据
                        modifiedProperty: {
                            name: property,
                            before: originalValue,
                            expected: expectedValue,
                            actual: actualValue,
                            verified,
                            propertyMetadata: propertyData // 只包含这个属性的元数据
                        },
                        // 简化的组件信息
                        componentSummary: {
                            nodeUuid,
                            componentType,
                            totalProperties: Object.keys(((_b = componentInfo.data) === null || _b === void 0 ? void 0 : _b.properties) || {}).length
                        }
                    }
                };
                console.log(`[verifyPropertyChange] Returning result:`, JSON.stringify(result, null, 2));
                return result;
            }
            else {
                console.log(`[verifyPropertyChange] ComponentInfo failed or no data:`, componentInfo);
            }
        }
        catch (error) {
            console.error('[verifyPropertyChange] Verification failed with error:', error);
            console.error('[verifyPropertyChange] Error stack:', error instanceof Error ? error.stack : 'No stack trace');
        }
        console.log(`[verifyPropertyChange] Returning fallback result`);
        return {
            verified: false,
            actualValue: undefined,
            fullData: null
        };
    }
    /**
     * 检测是否为节点属性，如果是则重定向到对应的节点方法
     */
    async checkAndRedirectNodeProperties(args) {
        const { nodeUuid, componentType, property, propertyType, value } = args;
        // 检测是否为节点基础属性（应该使用 set_node_property）
        const nodeBasicProperties = [
            'name', 'active', 'layer', 'mobility', 'parent', 'children', 'hideFlags'
        ];
        // 检测是否为节点变换属性（应该使用 set_node_transform）
        const nodeTransformProperties = [
            'position', 'rotation', 'scale', 'eulerAngles', 'angle'
        ];
        // Detect attempts to set cc.Node properties (common mistake)
        if (componentType === 'cc.Node' || componentType === 'Node') {
            if (nodeBasicProperties.includes(property)) {
                return {
                    success: false,
                    error: `Property '${property}' is a node basic property, not a component property`,
                    instruction: `Please use set_node_property method to set node properties: set_node_property(uuid="${nodeUuid}", property="${property}", value=${JSON.stringify(value)})`
                };
            }
            else if (nodeTransformProperties.includes(property)) {
                return {
                    success: false,
                    error: `Property '${property}' is a node transform property, not a component property`,
                    instruction: `Please use set_node_transform method to set transform properties: set_node_transform(uuid="${nodeUuid}", ${property}=${JSON.stringify(value)})`
                };
            }
        }
        // Detect common incorrect usage
        if (nodeBasicProperties.includes(property) || nodeTransformProperties.includes(property)) {
            const methodName = nodeTransformProperties.includes(property) ? 'set_node_transform' : 'set_node_property';
            return {
                success: false,
                error: `Property '${property}' is a node property, not a component property`,
                instruction: `Property '${property}' should be set using ${methodName} method, not set_component_property. Please use: ${methodName}(uuid="${nodeUuid}", ${nodeTransformProperties.includes(property) ? property : `property="${property}"`}=${JSON.stringify(value)})`
            };
        }
        return null; // 不是节点属性，继续正常处理
    }
    /**
     * 生成组件建议信息
     */
    generateComponentSuggestion(requestedType, availableTypes, property) {
        // 验证参数
        if (!requestedType) {
            return '\n\n⚠️ Component type is not specified. Please provide a valid componentType parameter.';
        }
        if (!availableTypes || availableTypes.length === 0) {
            return '\n\n⚠️ No available components found on the node.';
        }
        // 检查是否存在相似的组件类型
        const similarTypes = availableTypes.filter(type => type && type.toLowerCase().includes(requestedType.toLowerCase()) ||
            requestedType.toLowerCase().includes(type ? type.toLowerCase() : ''));
        let instruction = '';
        if (similarTypes.length > 0) {
            instruction += `\n\n🔍 Found similar components: ${similarTypes.join(', ')}`;
            instruction += `\n💡 Suggestion: Perhaps you meant to set the '${similarTypes[0]}' component?`;
        }
        // Recommend possible components based on property name
        const propertyToComponentMap = {
            'string': ['cc.Label', 'cc.RichText', 'cc.EditBox'],
            'text': ['cc.Label', 'cc.RichText'],
            'fontSize': ['cc.Label', 'cc.RichText'],
            'spriteFrame': ['cc.Sprite'],
            'color': ['cc.Label', 'cc.Sprite', 'cc.Graphics'],
            'normalColor': ['cc.Button'],
            'pressedColor': ['cc.Button'],
            'target': ['cc.Button'],
            'contentSize': ['cc.UITransform'],
            'anchorPoint': ['cc.UITransform']
        };
        const recommendedComponents = propertyToComponentMap[property] || [];
        const availableRecommended = recommendedComponents.filter(comp => availableTypes.includes(comp));
        if (availableRecommended.length > 0) {
            instruction += `\n\n🎯 Based on property '${property}', recommended components: ${availableRecommended.join(', ')}`;
        }
        // Provide operation suggestions
        instruction += `\n\n📋 Suggested Actions:`;
        instruction += `\n1. Use get_components(nodeUuid="${requestedType.includes('uuid') ? 'YOUR_NODE_UUID' : 'nodeUuid'}") to view all components on the node`;
        instruction += `\n2. If you need to add a component, use add_component(nodeUuid="...", componentType="${requestedType}")`;
        instruction += `\n3. Verify that the component type name is correct (case-sensitive)`;
        return instruction;
    }
    /**
     * 快速验证资源设置结果
     */
    async quickVerifyAsset(nodeUuid, componentType, property) {
        try {
            const rawNodeData = await Editor.Message.request('scene', 'query-node', nodeUuid);
            if (!rawNodeData || !rawNodeData.__comps__) {
                return null;
            }
            // 找到组件
            const component = rawNodeData.__comps__.find((comp) => {
                const compType = comp.__type__ || comp.cid || comp.type;
                return compType === componentType;
            });
            if (!component) {
                return null;
            }
            // 提取属性值
            const properties = this.extractComponentProperties(component);
            const propertyData = properties[property];
            if (propertyData && typeof propertyData === 'object' && 'value' in propertyData) {
                return propertyData.value;
            }
            else {
                return propertyData;
            }
        }
        catch (error) {
            console.error(`[quickVerifyAsset] Error:`, error);
            return null;
        }
    }
    /**
     * 通过节点名称设置 ShapeDrawer 组件属性
     */
    async setShapeDrawerProperties(args) {
        var _a, _b;
        const { nodeName, fillColor, radius, enableStroke, shapeType, strokeWidth, strokeColor, redraw = true } = args;
        if (!nodeName) {
            return { success: false, error: 'nodeName is required' };
        }
        try {
            // 1. 查找节点
            const findResult = await this.findNodeByName(nodeName);
            if (!findResult.success || !((_a = findResult.data) === null || _a === void 0 ? void 0 : _a.nodeUuid)) {
                return {
                    success: false,
                    error: `Node '${nodeName}' not found: ${findResult.error}`
                };
            }
            const nodeUuid = findResult.data.nodeUuid;
            // 2. 获取节点上的 ShapeDrawer 组件
            const componentsResult = await this.getComponents(nodeUuid);
            if (!componentsResult.success || !((_b = componentsResult.data) === null || _b === void 0 ? void 0 : _b.components)) {
                return {
                    success: false,
                    error: `Failed to get components for node '${nodeName}': ${componentsResult.error}`
                };
            }
            // 查找 ShapeDrawer 组件（可能是 "ShapeDrawer" 或脚本的 cid）
            const shapeDrawerComp = componentsResult.data.components.find((comp) => comp.type === 'ShapeDrawer' ||
                (comp.properties && Object.keys(comp.properties).some(key => key.includes('fillColor') || key.includes('radius') || key.includes('shapeType'))));
            if (!shapeDrawerComp) {
                return {
                    success: false,
                    error: `ShapeDrawer component not found on node '${nodeName}'. Available components: ${componentsResult.data.components.map((c) => c.type).join(', ')}`
                };
            }
            console.log(`[ComponentTools] Found ShapeDrawer on node '${nodeName}', setting properties...`);
            // 3. 设置属性
            const propertiesToSet = [];
            if (fillColor !== undefined) {
                propertiesToSet.push({ property: 'fillColor', value: fillColor, propertyType: 'color' });
            }
            if (radius !== undefined) {
                propertiesToSet.push({ property: 'radius', value: radius, propertyType: 'number' });
            }
            if (enableStroke !== undefined) {
                propertiesToSet.push({ property: 'enableStroke', value: enableStroke, propertyType: 'boolean' });
            }
            if (shapeType !== undefined) {
                propertiesToSet.push({ property: 'shapeType', value: shapeType, propertyType: 'integer' });
            }
            if (strokeWidth !== undefined) {
                propertiesToSet.push({ property: 'strokeWidth', value: strokeWidth, propertyType: 'number' });
            }
            if (strokeColor !== undefined) {
                propertiesToSet.push({ property: 'strokeColor', value: strokeColor, propertyType: 'color' });
            }
            if (propertiesToSet.length === 0) {
                return {
                    success: false,
                    error: 'No properties to set. Provide at least one of: fillColor, radius, enableStroke, shapeType, strokeWidth, strokeColor'
                };
            }
            // 4. 批量设置属性
            const setResult = await this.setComponentProperties({
                nodeUuid,
                componentType: shapeDrawerComp.type,
                properties: propertiesToSet
            });
            if (!setResult.success) {
                return setResult;
            }
            // 5. 如果需要，调用 redraw()
            if (redraw) {
                try {
                    await Editor.Message.request('scene', 'execute-component-method', {
                        uuid: nodeUuid,
                        class: shapeDrawerComp.type,
                        method: 'redraw',
                        args: []
                    });
                    console.log(`[ComponentTools] Called redraw() on ShapeDrawer`);
                }
                catch (err) {
                    console.warn(`[ComponentTools] Failed to call redraw(): ${err.message}`);
                }
            }
            return {
                success: true,
                message: `ShapeDrawer properties set successfully on node '${nodeName}'`,
                data: {
                    nodeName,
                    nodeUuid,
                    componentType: shapeDrawerComp.type,
                    propertiesSet: propertiesToSet.map(p => p.property),
                    redrawCalled: redraw
                }
            };
        }
        catch (error) {
            console.error('[ComponentTools] setShapeDrawerProperties error:', error);
            return {
                success: false,
                error: `Failed to set ShapeDrawer properties: ${error.message}`
            };
        }
    }
    /**
     * 通过名称查找节点
     */
    async findNodeByName(name) {
        return new Promise((resolve) => {
            Editor.Message.request('scene', 'query-node-by-name', name).then((nodeUuid) => {
                if (nodeUuid) {
                    resolve({
                        success: true,
                        data: { nodeUuid }
                    });
                }
                else {
                    resolve({ success: false, error: `Node '${name}' not found` });
                }
            }).catch((err) => {
                resolve({ success: false, error: `Failed to find node: ${err.message}` });
            });
        });
    }
}
exports.ComponentTools = ComponentTools;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcG9uZW50LXRvb2xzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc291cmNlL3Rvb2xzL2NvbXBvbmVudC10b29scy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFFQSxNQUFhLGNBQWM7SUFDdkIsUUFBUTtRQUNKLE9BQU87WUFDSDtnQkFDSSxJQUFJLEVBQUUsZUFBZTtnQkFDckIsV0FBVyxFQUFFLHVJQUF1STtnQkFDcEosV0FBVyxFQUFFO29CQUNULElBQUksRUFBRSxRQUFRO29CQUNkLFVBQVUsRUFBRTt3QkFDUixRQUFRLEVBQUU7NEJBQ04sSUFBSSxFQUFFLFFBQVE7NEJBQ2QsV0FBVyxFQUFFLGtLQUFrSzt5QkFDbEw7d0JBQ0QsYUFBYSxFQUFFOzRCQUNYLElBQUksRUFBRSxRQUFROzRCQUNkLFdBQVcsRUFBRSx1REFBdUQ7eUJBQ3ZFO3FCQUNKO29CQUNELFFBQVEsRUFBRSxDQUFDLFVBQVUsRUFBRSxlQUFlLENBQUM7aUJBQzFDO2FBQ0o7WUFDRDtnQkFDSSxJQUFJLEVBQUUsa0JBQWtCO2dCQUN4QixXQUFXLEVBQUUsNE1BQTRNO2dCQUN6TixXQUFXLEVBQUU7b0JBQ1QsSUFBSSxFQUFFLFFBQVE7b0JBQ2QsVUFBVSxFQUFFO3dCQUNSLFFBQVEsRUFBRTs0QkFDTixJQUFJLEVBQUUsUUFBUTs0QkFDZCxXQUFXLEVBQUUsV0FBVzt5QkFDM0I7d0JBQ0QsYUFBYSxFQUFFOzRCQUNYLElBQUksRUFBRSxRQUFROzRCQUNkLFdBQVcsRUFBRSx3SUFBd0k7eUJBQ3hKO3FCQUNKO29CQUNELFFBQVEsRUFBRSxDQUFDLFVBQVUsRUFBRSxlQUFlLENBQUM7aUJBQzFDO2FBQ0o7WUFDRDtnQkFDSSxJQUFJLEVBQUUsZ0JBQWdCO2dCQUN0QixXQUFXLEVBQUUsOEJBQThCO2dCQUMzQyxXQUFXLEVBQUU7b0JBQ1QsSUFBSSxFQUFFLFFBQVE7b0JBQ2QsVUFBVSxFQUFFO3dCQUNSLFFBQVEsRUFBRTs0QkFDTixJQUFJLEVBQUUsUUFBUTs0QkFDZCxXQUFXLEVBQUUsV0FBVzt5QkFDM0I7cUJBQ0o7b0JBQ0QsUUFBUSxFQUFFLENBQUMsVUFBVSxDQUFDO2lCQUN6QjthQUNKO1lBQ0Q7Z0JBQ0ksSUFBSSxFQUFFLG9CQUFvQjtnQkFDMUIsV0FBVyxFQUFFLG9DQUFvQztnQkFDakQsV0FBVyxFQUFFO29CQUNULElBQUksRUFBRSxRQUFRO29CQUNkLFVBQVUsRUFBRTt3QkFDUixRQUFRLEVBQUU7NEJBQ04sSUFBSSxFQUFFLFFBQVE7NEJBQ2QsV0FBVyxFQUFFLFdBQVc7eUJBQzNCO3dCQUNELGFBQWEsRUFBRTs0QkFDWCxJQUFJLEVBQUUsUUFBUTs0QkFDZCxXQUFXLEVBQUUsZ0NBQWdDO3lCQUNoRDtxQkFDSjtvQkFDRCxRQUFRLEVBQUUsQ0FBQyxVQUFVLEVBQUUsZUFBZSxDQUFDO2lCQUMxQzthQUNKO1lBQ0Q7Z0JBQ0ksSUFBSSxFQUFFLHdCQUF3QjtnQkFDOUIsV0FBVyxFQUFFLDJXQUEyVztnQkFDeFgsV0FBVyxFQUFFO29CQUNULElBQUksRUFBRSxRQUFRO29CQUNkLFVBQVUsRUFBRTt3QkFDUixRQUFRLEVBQUU7NEJBQ04sSUFBSSxFQUFFLFFBQVE7NEJBQ2QsV0FBVyxFQUFFLHdEQUF3RDt5QkFDeEU7d0JBQ0QsYUFBYSxFQUFFOzRCQUNYLElBQUksRUFBRSxRQUFROzRCQUNkLFdBQVcsRUFBRSw2TUFBNk07NEJBQzFOLDJCQUEyQjt5QkFDOUI7d0JBQ0QsUUFBUSxFQUFFOzRCQUNOLElBQUksRUFBRSxRQUFROzRCQUNkLFdBQVcsRUFBRSxtRUFBbUU7Z0NBQzVFLCtFQUErRTtnQ0FDL0UscUZBQXFGO2dDQUNyRiwrRkFBK0Y7Z0NBQy9GLDRFQUE0RTtnQ0FDNUUsNkRBQTZEO3lCQUNwRTt3QkFDRCxZQUFZLEVBQUU7NEJBQ1YsSUFBSSxFQUFFLFFBQVE7NEJBQ2QsV0FBVyxFQUFFLDRHQUE0Rzs0QkFDekgsSUFBSSxFQUFFO2dDQUNGLFFBQVEsRUFBRSxRQUFRLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxPQUFPO2dDQUNqRCxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxNQUFNO2dDQUMvQixNQUFNLEVBQUUsV0FBVyxFQUFFLGFBQWEsRUFBRSxRQUFRLEVBQUUsT0FBTztnQ0FDckQsV0FBVyxFQUFFLFlBQVksRUFBRSxhQUFhLEVBQUUsYUFBYTs2QkFDMUQ7eUJBQ29CO3dCQUV6QixLQUFLLEVBQUU7NEJBQ0gsV0FBVyxFQUFFLCtFQUErRTtnQ0FDeEYsd0JBQXdCO2dDQUN4Qix5Q0FBeUM7Z0NBQ3pDLHNEQUFzRDtnQ0FDdEQsOENBQThDO2dDQUM5QyxrQkFBa0I7Z0NBQ2xCLHFFQUFxRTtnQ0FDckUsbURBQW1EO2dDQUNuRCwyRkFBMkY7Z0NBQzNGLDZCQUE2QjtnQ0FDN0Isd0NBQXdDO2dDQUN4QywyQ0FBMkM7Z0NBQzNDLHlEQUF5RDtnQ0FDekQsNENBQTRDO2dDQUM1QywrQ0FBK0M7Z0NBQy9DLDBFQUEwRTtnQ0FDMUUseURBQXlEO2dDQUN6RCxvQkFBb0I7Z0NBQ3BCLDBFQUEwRTtnQ0FDMUUsNkVBQTZFO2dDQUM3RSx1RUFBdUU7Z0NBQ3ZFLGdFQUFnRTtnQ0FDaEUsOEVBQThFO2dDQUM5RSwwREFBMEQ7Z0NBQzFELDJEQUEyRDtnQ0FDM0QsMENBQTBDO2dDQUMxQywyREFBMkQ7Z0NBQzNELG1EQUFtRDtnQ0FDbkQsNkRBQTZEO2dDQUM3RCxtQkFBbUI7Z0NBQ25CLHdEQUF3RDtnQ0FDeEQsbUVBQW1FO2dDQUNuRSxpREFBaUQ7Z0NBQ2pELHFEQUFxRDt5QkFDNUQ7cUJBQ0o7b0JBQ0QsUUFBUSxFQUFFLENBQUMsVUFBVSxFQUFFLGVBQWUsRUFBRSxVQUFVLEVBQUUsY0FBYyxFQUFFLE9BQU8sQ0FBQztpQkFDL0U7YUFDSjtZQUNEO2dCQUNJLElBQUksRUFBRSwwQkFBMEI7Z0JBQ2hDLFdBQVcsRUFBRSxrRUFBa0U7Z0JBQy9FLFdBQVcsRUFBRTtvQkFDVCxJQUFJLEVBQUUsUUFBUTtvQkFDZCxVQUFVLEVBQUU7d0JBQ1IsUUFBUSxFQUFFOzRCQUNOLElBQUksRUFBRSxRQUFROzRCQUNkLFdBQVcsRUFBRSxXQUFXO3lCQUMzQjt3QkFDRCxhQUFhLEVBQUU7NEJBQ1gsSUFBSSxFQUFFLFFBQVE7NEJBQ2QsV0FBVyxFQUFFLGdEQUFnRDt5QkFDaEU7d0JBQ0QsVUFBVSxFQUFFOzRCQUNSLElBQUksRUFBRSxPQUFPOzRCQUNiLFdBQVcsRUFBRSxxQ0FBcUM7NEJBQ2xELEtBQUssRUFBRTtnQ0FDSCxJQUFJLEVBQUUsUUFBUTtnQ0FDZCxVQUFVLEVBQUU7b0NBQ1IsUUFBUSxFQUFFO3dDQUNOLElBQUksRUFBRSxRQUFRO3dDQUNkLFdBQVcsRUFBRSxlQUFlO3FDQUMvQjtvQ0FDRCxZQUFZLEVBQUU7d0NBQ1YsSUFBSSxFQUFFLFFBQVE7d0NBQ2QsV0FBVyxFQUFFLGdFQUFnRTt3Q0FDN0UsSUFBSSxFQUFFOzRDQUNGLFFBQVEsRUFBRSxRQUFRLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxPQUFPOzRDQUNqRCxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxNQUFNOzRDQUMvQixNQUFNLEVBQUUsV0FBVyxFQUFFLGFBQWEsRUFBRSxRQUFRLEVBQUUsT0FBTzs0Q0FDckQsV0FBVyxFQUFFLFlBQVksRUFBRSxhQUFhLEVBQUUsYUFBYTt5Q0FDMUQ7cUNBQ0o7b0NBQ0QsS0FBSyxFQUFFO3dDQUNILFdBQVcsRUFBRSx3REFBd0Q7cUNBQ3hFO2lDQUNKO2dDQUNELFFBQVEsRUFBRSxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUM7NkJBQ2xDO3lCQUNKO3FCQUNKO29CQUNELFFBQVEsRUFBRSxDQUFDLFVBQVUsRUFBRSxlQUFlLEVBQUUsWUFBWSxDQUFDO2lCQUN4RDthQUNKO1lBQ0Q7Z0JBQ0ksSUFBSSxFQUFFLGVBQWU7Z0JBQ3JCLFdBQVcsRUFBRSxxQ0FBcUM7Z0JBQ2xELFdBQVcsRUFBRTtvQkFDVCxJQUFJLEVBQUUsUUFBUTtvQkFDZCxVQUFVLEVBQUU7d0JBQ1IsUUFBUSxFQUFFOzRCQUNOLElBQUksRUFBRSxRQUFROzRCQUNkLFdBQVcsRUFBRSxXQUFXO3lCQUMzQjt3QkFDRCxVQUFVLEVBQUU7NEJBQ1IsSUFBSSxFQUFFLFFBQVE7NEJBQ2QsV0FBVyxFQUFFLDJEQUEyRDt5QkFDM0U7cUJBQ0o7b0JBQ0QsUUFBUSxFQUFFLENBQUMsVUFBVSxFQUFFLFlBQVksQ0FBQztpQkFDdkM7YUFDSjtZQUNEO2dCQUNJLElBQUksRUFBRSwwQkFBMEI7Z0JBQ2hDLFdBQVcsRUFBRSx1Q0FBdUM7Z0JBQ3BELFdBQVcsRUFBRTtvQkFDVCxJQUFJLEVBQUUsUUFBUTtvQkFDZCxVQUFVLEVBQUU7d0JBQ1IsUUFBUSxFQUFFOzRCQUNOLElBQUksRUFBRSxRQUFROzRCQUNkLFdBQVcsRUFBRSwyQkFBMkI7NEJBQ3hDLElBQUksRUFBRSxDQUFDLEtBQUssRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxXQUFXLEVBQUUsT0FBTyxDQUFDOzRCQUNoRSxPQUFPLEVBQUUsS0FBSzt5QkFDakI7cUJBQ0o7aUJBQ0o7YUFDSjtZQUNEO2dCQUNJLElBQUksRUFBRSw0QkFBNEI7Z0JBQ2xDLFdBQVcsRUFBRSxxSUFBcUk7Z0JBQ2xKLFdBQVcsRUFBRTtvQkFDVCxJQUFJLEVBQUUsUUFBUTtvQkFDZCxVQUFVLEVBQUU7d0JBQ1IsUUFBUSxFQUFFOzRCQUNOLElBQUksRUFBRSxRQUFROzRCQUNkLFdBQVcsRUFBRSxvRkFBb0Y7eUJBQ3BHO3dCQUNELFNBQVMsRUFBRTs0QkFDUCxJQUFJLEVBQUUsUUFBUTs0QkFDZCxXQUFXLEVBQUUsdURBQXVEO3lCQUN2RTt3QkFDRCxNQUFNLEVBQUU7NEJBQ0osSUFBSSxFQUFFLFFBQVE7NEJBQ2QsV0FBVyxFQUFFLHFDQUFxQzt5QkFDckQ7d0JBQ0QsWUFBWSxFQUFFOzRCQUNWLElBQUksRUFBRSxTQUFTOzRCQUNmLFdBQVcsRUFBRSxzQkFBc0I7eUJBQ3RDO3dCQUNELFNBQVMsRUFBRTs0QkFDUCxJQUFJLEVBQUUsU0FBUzs0QkFDZixXQUFXLEVBQUUsbURBQW1EOzRCQUNoRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQzt5QkFDbEI7d0JBQ0QsV0FBVyxFQUFFOzRCQUNULElBQUksRUFBRSxRQUFROzRCQUNkLFdBQVcsRUFBRSxvREFBb0Q7eUJBQ3BFO3dCQUNELFdBQVcsRUFBRTs0QkFDVCxJQUFJLEVBQUUsUUFBUTs0QkFDZCxXQUFXLEVBQUUsOENBQThDO3lCQUM5RDt3QkFDRCxNQUFNLEVBQUU7NEJBQ0osSUFBSSxFQUFFLFNBQVM7NEJBQ2YsV0FBVyxFQUFFLG1FQUFtRTs0QkFDaEYsT0FBTyxFQUFFLElBQUk7eUJBQ2hCO3FCQUNKO29CQUNELFFBQVEsRUFBRSxDQUFDLFVBQVUsQ0FBQztpQkFDekI7YUFDSjtTQUNKLENBQUM7SUFDTixDQUFDO0lBRUQsS0FBSyxDQUFDLE9BQU8sQ0FBQyxRQUFnQixFQUFFLElBQVM7UUFDckMsUUFBUSxRQUFRLEVBQUUsQ0FBQztZQUNmLEtBQUssZUFBZTtnQkFDaEIsT0FBTyxNQUFNLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7WUFDdEUsS0FBSyxrQkFBa0I7Z0JBQ25CLE9BQU8sTUFBTSxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBQ3pFLEtBQUssZ0JBQWdCO2dCQUNqQixPQUFPLE1BQU0sSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDbkQsS0FBSyxvQkFBb0I7Z0JBQ3JCLE9BQU8sTUFBTSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7WUFDMUUsS0FBSyx3QkFBd0I7Z0JBQ3pCLE9BQU8sTUFBTSxJQUFJLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDakQsS0FBSywwQkFBMEI7Z0JBQzNCLE9BQU8sTUFBTSxJQUFJLENBQUMsc0JBQXNCLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDbkQsS0FBSyxlQUFlO2dCQUNoQixPQUFPLE1BQU0sSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUNuRSxLQUFLLDBCQUEwQjtnQkFDM0IsT0FBTyxNQUFNLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDNUQsS0FBSyw0QkFBNEI7Z0JBQzdCLE9BQU8sTUFBTSxJQUFJLENBQUMsd0JBQXdCLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDckQ7Z0JBQ0ksTUFBTSxJQUFJLEtBQUssQ0FBQyxpQkFBaUIsUUFBUSxFQUFFLENBQUMsQ0FBQztRQUNyRCxDQUFDO0lBQ0wsQ0FBQztJQUVPLEtBQUssQ0FBQyxZQUFZLENBQUMsUUFBZ0IsRUFBRSxhQUFxQjtRQUM5RCxPQUFPLElBQUksT0FBTyxDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUUsRUFBRTs7WUFDakMsaUJBQWlCO1lBQ2pCLE1BQU0saUJBQWlCLEdBQUcsTUFBTSxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQzdELElBQUksaUJBQWlCLENBQUMsT0FBTyxLQUFJLE1BQUEsaUJBQWlCLENBQUMsSUFBSSwwQ0FBRSxVQUFVLENBQUEsRUFBRSxDQUFDO2dCQUNsRSxNQUFNLGlCQUFpQixHQUFHLGlCQUFpQixDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBUyxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLGFBQWEsQ0FBQyxDQUFDO2dCQUM3RyxJQUFJLGlCQUFpQixFQUFFLENBQUM7b0JBQ3BCLE9BQU8sQ0FBQzt3QkFDSixPQUFPLEVBQUUsSUFBSTt3QkFDYixPQUFPLEVBQUUsY0FBYyxhQUFhLDBCQUEwQjt3QkFDOUQsSUFBSSxFQUFFOzRCQUNGLFFBQVEsRUFBRSxRQUFROzRCQUNsQixhQUFhLEVBQUUsYUFBYTs0QkFDNUIsaUJBQWlCLEVBQUUsSUFBSTs0QkFDdkIsUUFBUSxFQUFFLElBQUk7eUJBQ2pCO3FCQUNKLENBQUMsQ0FBQztvQkFDSCxPQUFPO2dCQUNYLENBQUM7WUFDTCxDQUFDO1lBQ0QseUJBQXlCO1lBQ3pCLElBQUksQ0FBQztnQkFDRCxNQUFNLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxrQkFBa0IsRUFBRTtvQkFDdEQsSUFBSSxFQUFFLFFBQVE7b0JBQ2QsU0FBUyxFQUFFLGFBQWE7aUJBQzNCLENBQUMsQ0FBQztnQkFFSCxzQkFBc0I7Z0JBQ3RCLE1BQU0sSUFBSSxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBRXZELHVCQUF1QjtnQkFDdkIsTUFBTSxrQkFBa0IsR0FBRyxNQUFNLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBQzlELElBQUksa0JBQWtCLENBQUMsT0FBTyxLQUFJLE1BQUEsa0JBQWtCLENBQUMsSUFBSSwwQ0FBRSxVQUFVLENBQUEsRUFBRSxDQUFDO29CQUNwRSxNQUFNLGNBQWMsR0FBRyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQVMsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksS0FBSyxhQUFhLENBQUMsQ0FBQztvQkFDM0csSUFBSSxjQUFjLEVBQUUsQ0FBQzt3QkFDakIsT0FBTyxDQUFDOzRCQUNKLE9BQU8sRUFBRSxJQUFJOzRCQUNiLE9BQU8sRUFBRSxjQUFjLGFBQWEsc0JBQXNCOzRCQUMxRCxJQUFJLEVBQUU7Z0NBQ0YsUUFBUSxFQUFFLFFBQVE7Z0NBQ2xCLGFBQWEsRUFBRSxhQUFhO2dDQUM1QixpQkFBaUIsRUFBRSxJQUFJO2dDQUN2QixRQUFRLEVBQUUsS0FBSzs2QkFDbEI7eUJBQ0osQ0FBQyxDQUFDO29CQUNQLENBQUM7eUJBQU0sQ0FBQzt3QkFDSixPQUFPLENBQUM7NEJBQ0osT0FBTyxFQUFFLEtBQUs7NEJBQ2QsS0FBSyxFQUFFLGNBQWMsYUFBYSxpRUFBaUUsa0JBQWtCLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFNLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUU7eUJBQzdLLENBQUMsQ0FBQztvQkFDUCxDQUFDO2dCQUNMLENBQUM7cUJBQU0sQ0FBQztvQkFDSixPQUFPLENBQUM7d0JBQ0osT0FBTyxFQUFFLEtBQUs7d0JBQ2QsS0FBSyxFQUFFLHdDQUF3QyxrQkFBa0IsQ0FBQyxLQUFLLElBQUksK0JBQStCLEVBQUU7cUJBQy9HLENBQUMsQ0FBQztnQkFDUCxDQUFDO1lBQ0wsQ0FBQztZQUFDLE9BQU8sR0FBUSxFQUFFLENBQUM7Z0JBQ2hCLGNBQWM7Z0JBQ2QsT0FBTyxDQUFDLElBQUksQ0FBQyw0REFBNEQsR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7Z0JBQ3hGLElBQUksQ0FBQztvQkFDRCxNQUFNLE9BQU8sR0FBRzt3QkFDWixJQUFJLEVBQUUsa0JBQWtCO3dCQUN4QixNQUFNLEVBQUUsb0JBQW9CO3dCQUM1QixJQUFJLEVBQUUsQ0FBQyxRQUFRLEVBQUUsYUFBYSxDQUFDO3FCQUNsQyxDQUFDO29CQUNGLE1BQU0sTUFBTSxHQUFHLE1BQU0sTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE9BQU8sQ0FBQyxDQUFDO29CQUN0RixPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQ3BCLENBQUM7Z0JBQUMsT0FBTyxJQUFTLEVBQUUsQ0FBQztvQkFDakIsT0FBTyxDQUFDO3dCQUNKLE9BQU8sRUFBRSxLQUFLO3dCQUNkLEtBQUssRUFBRSxzQkFBc0IsR0FBRyxDQUFDLE9BQU8sMEJBQTBCLElBQUksQ0FBQyxPQUFPLEVBQUU7cUJBQ25GLENBQUMsQ0FBQztnQkFDUCxDQUFDO1lBQ0wsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVPLEtBQUssQ0FBQyxlQUFlLENBQUMsUUFBZ0IsRUFBRSxhQUFxQjtRQUNqRSxPQUFPLElBQUksT0FBTyxDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUUsRUFBRTs7WUFDakMsZ0JBQWdCO1lBQ2hCLE1BQU0saUJBQWlCLEdBQUcsTUFBTSxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQzdELElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLElBQUksQ0FBQyxDQUFBLE1BQUEsaUJBQWlCLENBQUMsSUFBSSwwQ0FBRSxVQUFVLENBQUEsRUFBRSxDQUFDO2dCQUNwRSxPQUFPLENBQUMsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxzQ0FBc0MsUUFBUSxNQUFNLGlCQUFpQixDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztnQkFDbEgsT0FBTztZQUNYLENBQUM7WUFDRCx1Q0FBdUM7WUFDdkMsTUFBTSxNQUFNLEdBQUcsaUJBQWlCLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFTLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssYUFBYSxDQUFDLENBQUM7WUFDbEcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO2dCQUNWLE9BQU8sQ0FBQyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLGtCQUFrQixhQUFhLHdCQUF3QixRQUFRLGlEQUFpRCxFQUFFLENBQUMsQ0FBQztnQkFDckosT0FBTztZQUNYLENBQUM7WUFDRCxlQUFlO1lBQ2YsSUFBSSxDQUFDO2dCQUNELE1BQU0sTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLGtCQUFrQixFQUFFO29CQUN0RCxJQUFJLEVBQUUsUUFBUTtvQkFDZCxTQUFTLEVBQUUsYUFBYTtpQkFDM0IsQ0FBQyxDQUFDO2dCQUNILGdCQUFnQjtnQkFDaEIsTUFBTSxlQUFlLEdBQUcsTUFBTSxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUMzRCxNQUFNLFdBQVcsR0FBRyxlQUFlLENBQUMsT0FBTyxLQUFJLE1BQUEsTUFBQSxlQUFlLENBQUMsSUFBSSwwQ0FBRSxVQUFVLDBDQUFFLElBQUksQ0FBQyxDQUFDLElBQVMsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksS0FBSyxhQUFhLENBQUMsQ0FBQSxDQUFDO2dCQUNsSSxJQUFJLFdBQVcsRUFBRSxDQUFDO29CQUNkLE9BQU8sQ0FBQyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLGtCQUFrQixhQUFhLGdDQUFnQyxRQUFRLElBQUksRUFBRSxDQUFDLENBQUM7Z0JBQ3BILENBQUM7cUJBQU0sQ0FBQztvQkFDSixPQUFPLENBQUM7d0JBQ0osT0FBTyxFQUFFLElBQUk7d0JBQ2IsT0FBTyxFQUFFLGtCQUFrQixhQUFhLHFDQUFxQyxRQUFRLEdBQUc7d0JBQ3hGLElBQUksRUFBRSxFQUFFLFFBQVEsRUFBRSxhQUFhLEVBQUU7cUJBQ3BDLENBQUMsQ0FBQztnQkFDUCxDQUFDO1lBQ0wsQ0FBQztZQUFDLE9BQU8sR0FBUSxFQUFFLENBQUM7Z0JBQ2hCLE9BQU8sQ0FBQyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLCtCQUErQixHQUFHLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQ3JGLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFTyxLQUFLLENBQUMsYUFBYSxDQUFDLFFBQWdCO1FBQ3hDLE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsRUFBRTtZQUMzQiw2QkFBNkI7WUFDN0IsTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLFlBQVksRUFBRSxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxRQUFhLEVBQUUsRUFBRTtnQkFDM0UsSUFBSSxRQUFRLElBQUksUUFBUSxDQUFDLFNBQVMsRUFBRSxDQUFDO29CQUNqQyxNQUFNLFVBQVUsR0FBRyxRQUFRLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQVMsRUFBRSxFQUFFOzt3QkFBQyxPQUFBLENBQUM7NEJBQ3RELElBQUksRUFBRSxJQUFJLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxHQUFHLElBQUksSUFBSSxDQUFDLElBQUksSUFBSSxTQUFTOzRCQUN6RCxJQUFJLEVBQUUsQ0FBQSxNQUFBLElBQUksQ0FBQyxJQUFJLDBDQUFFLEtBQUssS0FBSSxJQUFJLENBQUMsSUFBSSxJQUFJLElBQUk7NEJBQzNDLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTyxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSTs0QkFDekQsVUFBVSxFQUFFLElBQUksQ0FBQywwQkFBMEIsQ0FBQyxJQUFJLENBQUM7eUJBQ3BELENBQUMsQ0FBQTtxQkFBQSxDQUFDLENBQUM7b0JBRUosT0FBTyxDQUFDO3dCQUNKLE9BQU8sRUFBRSxJQUFJO3dCQUNiLElBQUksRUFBRTs0QkFDRixRQUFRLEVBQUUsUUFBUTs0QkFDbEIsVUFBVSxFQUFFLFVBQVU7eUJBQ3pCO3FCQUNKLENBQUMsQ0FBQztnQkFDUCxDQUFDO3FCQUFNLENBQUM7b0JBQ0osT0FBTyxDQUFDLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsc0NBQXNDLEVBQUUsQ0FBQyxDQUFDO2dCQUMvRSxDQUFDO1lBQ0wsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBVSxFQUFFLEVBQUU7Z0JBQ3BCLGNBQWM7Z0JBQ2QsTUFBTSxPQUFPLEdBQUc7b0JBQ1osSUFBSSxFQUFFLGtCQUFrQjtvQkFDeEIsTUFBTSxFQUFFLGFBQWE7b0JBQ3JCLElBQUksRUFBRSxDQUFDLFFBQVEsQ0FBQztpQkFDbkIsQ0FBQztnQkFFRixNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsc0JBQXNCLEVBQUUsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBVyxFQUFFLEVBQUU7b0JBQ2xGLElBQUksTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDO3dCQUNqQixPQUFPLENBQUM7NEJBQ0osT0FBTyxFQUFFLElBQUk7NEJBQ2IsSUFBSSxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVTt5QkFDL0IsQ0FBQyxDQUFDO29CQUNQLENBQUM7eUJBQU0sQ0FBQzt3QkFDSixPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7b0JBQ3BCLENBQUM7Z0JBQ0wsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBVyxFQUFFLEVBQUU7b0JBQ3JCLE9BQU8sQ0FBQyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLHNCQUFzQixHQUFHLENBQUMsT0FBTywwQkFBMEIsSUFBSSxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUMsQ0FBQztnQkFDbEgsQ0FBQyxDQUFDLENBQUM7WUFDUCxDQUFDLENBQUMsQ0FBQztRQUNQLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVPLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFnQixFQUFFLGFBQXFCO1FBQ2xFLE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsRUFBRTtZQUMzQiw2QkFBNkI7WUFDN0IsTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLFlBQVksRUFBRSxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxRQUFhLEVBQUUsRUFBRTtnQkFDM0UsSUFBSSxRQUFRLElBQUksUUFBUSxDQUFDLFNBQVMsRUFBRSxDQUFDO29CQUNqQyxNQUFNLFNBQVMsR0FBRyxRQUFRLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQVMsRUFBRSxFQUFFO3dCQUNwRCxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxHQUFHLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQzt3QkFDeEQsT0FBTyxRQUFRLEtBQUssYUFBYSxDQUFDO29CQUN0QyxDQUFDLENBQUMsQ0FBQztvQkFFSCxJQUFJLFNBQVMsRUFBRSxDQUFDO3dCQUNaLE9BQU8sQ0FBQzs0QkFDSixPQUFPLEVBQUUsSUFBSTs0QkFDYixJQUFJLEVBQUU7Z0NBQ0YsUUFBUSxFQUFFLFFBQVE7Z0NBQ2xCLGFBQWEsRUFBRSxhQUFhO2dDQUM1QixPQUFPLEVBQUUsU0FBUyxDQUFDLE9BQU8sS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUk7Z0NBQ25FLFVBQVUsRUFBRSxJQUFJLENBQUMsMEJBQTBCLENBQUMsU0FBUyxDQUFDOzZCQUN6RDt5QkFDSixDQUFDLENBQUM7b0JBQ1AsQ0FBQzt5QkFBTSxDQUFDO3dCQUNKLE9BQU8sQ0FBQyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLGNBQWMsYUFBYSxxQkFBcUIsRUFBRSxDQUFDLENBQUM7b0JBQ3pGLENBQUM7Z0JBQ0wsQ0FBQztxQkFBTSxDQUFDO29CQUNKLE9BQU8sQ0FBQyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLHNDQUFzQyxFQUFFLENBQUMsQ0FBQztnQkFDL0UsQ0FBQztZQUNMLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQVUsRUFBRSxFQUFFO2dCQUNwQixjQUFjO2dCQUNkLE1BQU0sT0FBTyxHQUFHO29CQUNaLElBQUksRUFBRSxrQkFBa0I7b0JBQ3hCLE1BQU0sRUFBRSxhQUFhO29CQUNyQixJQUFJLEVBQUUsQ0FBQyxRQUFRLENBQUM7aUJBQ25CLENBQUM7Z0JBRUYsTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQVcsRUFBRSxFQUFFO29CQUNsRixJQUFJLE1BQU0sQ0FBQyxPQUFPLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQzt3QkFDM0MsTUFBTSxTQUFTLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBUyxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLGFBQWEsQ0FBQyxDQUFDO3dCQUMxRixJQUFJLFNBQVMsRUFBRSxDQUFDOzRCQUNaLE9BQU8sQ0FBQztnQ0FDSixPQUFPLEVBQUUsSUFBSTtnQ0FDYixJQUFJLGtCQUNBLFFBQVEsRUFBRSxRQUFRLEVBQ2xCLGFBQWEsRUFBRSxhQUFhLElBQ3pCLFNBQVMsQ0FDZjs2QkFDSixDQUFDLENBQUM7d0JBQ1AsQ0FBQzs2QkFBTSxDQUFDOzRCQUNKLE9BQU8sQ0FBQyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLGNBQWMsYUFBYSxxQkFBcUIsRUFBRSxDQUFDLENBQUM7d0JBQ3pGLENBQUM7b0JBQ0wsQ0FBQzt5QkFBTSxDQUFDO3dCQUNKLE9BQU8sQ0FBQyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLE1BQU0sQ0FBQyxLQUFLLElBQUksOEJBQThCLEVBQUUsQ0FBQyxDQUFDO29CQUN2RixDQUFDO2dCQUNMLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQVcsRUFBRSxFQUFFO29CQUNyQixPQUFPLENBQUMsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxzQkFBc0IsR0FBRyxDQUFDLE9BQU8sMEJBQTBCLElBQUksQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLENBQUM7Z0JBQ2xILENBQUMsQ0FBQyxDQUFDO1lBQ1AsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFTywwQkFBMEIsQ0FBQyxTQUFjO1FBQzdDLE9BQU8sQ0FBQyxHQUFHLENBQUMsb0RBQW9ELEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUVyRyxnQ0FBZ0M7UUFDaEMsSUFBSSxTQUFTLENBQUMsS0FBSyxJQUFJLE9BQU8sU0FBUyxDQUFDLEtBQUssS0FBSyxRQUFRLEVBQUUsQ0FBQztZQUN6RCxPQUFPLENBQUMsR0FBRyxDQUFDLHFFQUFxRSxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQzVILE9BQU8sU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLDBCQUEwQjtRQUN0RCxDQUFDO1FBRUQsb0JBQW9CO1FBQ3BCLE1BQU0sVUFBVSxHQUF3QixFQUFFLENBQUM7UUFDM0MsTUFBTSxXQUFXLEdBQUcsQ0FBQyxVQUFVLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsZUFBZSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLFdBQVcsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxTQUFTLENBQUMsQ0FBQztRQUV6TCxLQUFLLE1BQU0sR0FBRyxJQUFJLFNBQVMsRUFBRSxDQUFDO1lBQzFCLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDO2dCQUNyRCxPQUFPLENBQUMsR0FBRyxDQUFDLHVEQUF1RCxHQUFHLElBQUksRUFBRSxPQUFPLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUNuRyxVQUFVLENBQUMsR0FBRyxDQUFDLEdBQUcsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3JDLENBQUM7UUFDTCxDQUFDO1FBRUQsT0FBTyxDQUFDLEdBQUcsQ0FBQywwREFBMEQsRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQzVHLE9BQU8sVUFBVSxDQUFDO0lBQ3RCLENBQUM7SUFFTyxLQUFLLENBQUMsdUJBQXVCLENBQUMsYUFBcUI7O1FBQ3ZELE9BQU8sQ0FBQyxHQUFHLENBQUMscUVBQXFFLGFBQWEsRUFBRSxDQUFDLENBQUM7UUFDbEcsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO1lBQ2pCLE9BQU8sSUFBSSxDQUFDO1FBQ2hCLENBQUM7UUFDRCxJQUFJLENBQUM7WUFDRCxNQUFNLFFBQVEsR0FBRyxNQUFNLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxpQkFBaUIsQ0FBQyxDQUFDO1lBQzFFLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztnQkFDWixPQUFPLENBQUMsSUFBSSxDQUFDLHNEQUFzRCxDQUFDLENBQUM7Z0JBQ3JFLE9BQU8sSUFBSSxDQUFDO1lBQ2hCLENBQUM7WUFFRCxNQUFNLEtBQUssR0FBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBRWhDLE9BQU8sS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUsQ0FBQztnQkFDdEIsTUFBTSxlQUFlLEdBQUcsS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDO2dCQUN0QyxJQUFJLENBQUMsZUFBZSxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksRUFBRSxDQUFDO29CQUM1QyxTQUFTO2dCQUNiLENBQUM7Z0JBRUQsSUFBSSxDQUFDO29CQUNELE1BQU0sWUFBWSxHQUFHLE1BQU0sTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLFlBQVksRUFBRSxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBQy9GLElBQUksWUFBWSxJQUFJLFlBQVksQ0FBQyxTQUFTLEVBQUUsQ0FBQzt3QkFDekMsS0FBSyxNQUFNLElBQUksSUFBSSxZQUFZLENBQUMsU0FBUyxFQUFFLENBQUM7NEJBQ3hDLE1BQU0sT0FBTyxHQUFHLElBQVcsQ0FBQyxDQUFDLDJDQUEyQzs0QkFDeEUsdURBQXVEOzRCQUN2RCxJQUFJLE9BQU8sQ0FBQyxJQUFJLElBQUksT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLEtBQUssYUFBYSxFQUFFLENBQUM7Z0NBQ3ZELE1BQU0sYUFBYSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUM7Z0NBQ3ZDLE9BQU8sQ0FBQyxHQUFHLENBQUMsbURBQW1ELGFBQWEsY0FBYyxhQUFhLFlBQVksTUFBQSxZQUFZLENBQUMsSUFBSSwwQ0FBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO2dDQUMvSSxPQUFPLGFBQWEsQ0FBQzs0QkFDekIsQ0FBQzt3QkFDTCxDQUFDO29CQUNMLENBQUM7Z0JBQ0wsQ0FBQztnQkFBQyxPQUFPLENBQUMsRUFBRSxDQUFDO29CQUNULE9BQU8sQ0FBQyxJQUFJLENBQUMsa0RBQWtELGVBQWUsQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDL0YsQ0FBQztnQkFFRCxJQUFJLGVBQWUsQ0FBQyxRQUFRLEVBQUUsQ0FBQztvQkFDM0IsS0FBSyxNQUFNLEtBQUssSUFBSSxlQUFlLENBQUMsUUFBUSxFQUFFLENBQUM7d0JBQzNDLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7b0JBQ3RCLENBQUM7Z0JBQ0wsQ0FBQztZQUNMLENBQUM7WUFFRCxPQUFPLENBQUMsSUFBSSxDQUFDLGlEQUFpRCxhQUFhLDJCQUEyQixDQUFDLENBQUM7WUFDeEcsT0FBTyxJQUFJLENBQUM7UUFDaEIsQ0FBQztRQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7WUFDYixPQUFPLENBQUMsS0FBSyxDQUFDLHFFQUFxRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQzVGLE9BQU8sSUFBSSxDQUFDO1FBQ2hCLENBQUM7SUFDTCxDQUFDO0lBRU8sS0FBSyxDQUFDLG9CQUFvQixDQUFDLElBQVM7UUFDeEIsTUFBTSxFQUFFLFFBQVEsRUFBRSxhQUFhLEVBQUUsUUFBUSxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQUUsR0FBRyxJQUFJLENBQUM7UUFFeEYsT0FBTyxJQUFJLE9BQU8sQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFLEVBQUU7O1lBQ2pDLElBQUksQ0FBQztnQkFDRCxTQUFTO2dCQUNULElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztvQkFDWixPQUFPLENBQUMsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxzQkFBc0IsRUFBRSxDQUFDLENBQUM7b0JBQzNELE9BQU87Z0JBQ1gsQ0FBQztnQkFDRCxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7b0JBQ2pCLE9BQU8sQ0FBQyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLDJCQUEyQixFQUFFLENBQUMsQ0FBQztvQkFDaEUsT0FBTztnQkFDWCxDQUFDO2dCQUNELElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztvQkFDWixPQUFPLENBQUMsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxzQkFBc0IsRUFBRSxDQUFDLENBQUM7b0JBQzNELE9BQU87Z0JBQ1gsQ0FBQztnQkFDRCxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7b0JBQ2hCLE9BQU8sQ0FBQyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLDBCQUEwQixFQUFFLENBQUMsQ0FBQztvQkFDL0QsT0FBTztnQkFDWCxDQUFDO2dCQUNELElBQUksS0FBSyxLQUFLLFNBQVMsSUFBSSxLQUFLLEtBQUssSUFBSSxFQUFFLENBQUM7b0JBQ3hDLE9BQU8sQ0FBQyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLG1CQUFtQixFQUFFLENBQUMsQ0FBQztvQkFDeEQsT0FBTztnQkFDWCxDQUFDO2dCQUVELE9BQU8sQ0FBQyxHQUFHLENBQUMsNEJBQTRCLGFBQWEsSUFBSSxRQUFRLFdBQVcsWUFBWSxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLFlBQVksUUFBUSxFQUFFLENBQUMsQ0FBQztnQkFFNUksb0NBQW9DO2dCQUNwQyxNQUFNLGtCQUFrQixHQUFHLE1BQU0sSUFBSSxDQUFDLDhCQUE4QixDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUMzRSxJQUFJLGtCQUFrQixFQUFFLENBQUM7b0JBQ3JCLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO29CQUM1QixPQUFPO2dCQUNYLENBQUM7Z0JBRUQsdUNBQXVDO2dCQUN2QyxNQUFNLGtCQUFrQixHQUFHLE1BQU0sSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDOUQsSUFBSSxDQUFDLGtCQUFrQixDQUFDLE9BQU8sSUFBSSxDQUFDLGtCQUFrQixDQUFDLElBQUksRUFBRSxDQUFDO29CQUMxRCxPQUFPLENBQUM7d0JBQ0osT0FBTyxFQUFFLEtBQUs7d0JBQ2QsS0FBSyxFQUFFLHNDQUFzQyxRQUFRLE1BQU0sa0JBQWtCLENBQUMsS0FBSyxFQUFFO3dCQUNyRixXQUFXLEVBQUUsaUNBQWlDLFFBQVEsb0ZBQW9GO3FCQUM3SSxDQUFDLENBQUM7b0JBQ0gsT0FBTztnQkFDWCxDQUFDO2dCQUVELE1BQU0sYUFBYSxHQUFHLGtCQUFrQixDQUFDLElBQUksQ0FBQyxVQUFVLENBQUM7Z0JBRXpELGlCQUFpQjtnQkFDakIsSUFBSSxlQUFlLEdBQUcsSUFBSSxDQUFDO2dCQUMzQixNQUFNLGNBQWMsR0FBYSxFQUFFLENBQUM7Z0JBRXBDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxhQUFhLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7b0JBQzVDLE1BQU0sSUFBSSxHQUFHLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDOUIsY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBRS9CLElBQUksSUFBSSxDQUFDLElBQUksS0FBSyxhQUFhLEVBQUUsQ0FBQzt3QkFDOUIsZUFBZSxHQUFHLElBQUksQ0FBQzt3QkFDdkIsTUFBTTtvQkFDVixDQUFDO2dCQUNMLENBQUM7Z0JBRUQsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO29CQUNuQixnQkFBZ0I7b0JBQ2hCLE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQywyQkFBMkIsQ0FBQyxhQUFhLEVBQUUsY0FBYyxFQUFFLFFBQVEsQ0FBQyxDQUFDO29CQUM5RixPQUFPLENBQUM7d0JBQ0osT0FBTyxFQUFFLEtBQUs7d0JBQ2QsS0FBSyxFQUFFLGNBQWMsYUFBYSw4Q0FBOEMsY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRTt3QkFDM0csV0FBVyxFQUFFLFdBQVc7cUJBQzNCLENBQUMsQ0FBQztvQkFDSCxPQUFPO2dCQUNYLENBQUM7Z0JBRUQscUJBQXFCO2dCQUNyQixJQUFJLFlBQVksQ0FBQztnQkFDakIsSUFBSSxDQUFDO29CQUNELE9BQU8sQ0FBQyxHQUFHLENBQUMsd0NBQXdDLFFBQVEsRUFBRSxDQUFDLENBQUM7b0JBQ2hFLFlBQVksR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLGVBQWUsRUFBRSxRQUFRLENBQUMsQ0FBQztnQkFDbkUsQ0FBQztnQkFBQyxPQUFPLFlBQWlCLEVBQUUsQ0FBQztvQkFDekIsT0FBTyxDQUFDLEtBQUssQ0FBQyw0Q0FBNEMsRUFBRSxZQUFZLENBQUMsQ0FBQztvQkFDMUUsT0FBTyxDQUFDO3dCQUNKLE9BQU8sRUFBRSxLQUFLO3dCQUNkLEtBQUssRUFBRSwrQkFBK0IsUUFBUSxNQUFNLFlBQVksQ0FBQyxPQUFPLEVBQUU7cUJBQzdFLENBQUMsQ0FBQztvQkFDSCxPQUFPO2dCQUNYLENBQUM7Z0JBRUQsSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUUsQ0FBQztvQkFDdkIsT0FBTyxDQUFDO3dCQUNKLE9BQU8sRUFBRSxLQUFLO3dCQUNkLEtBQUssRUFBRSxhQUFhLFFBQVEsNkJBQTZCLGFBQWEsNEJBQTRCLFlBQVksQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUU7cUJBQ2xKLENBQUMsQ0FBQztvQkFDSCxPQUFPO2dCQUNYLENBQUM7Z0JBRUQsbUJBQW1CO2dCQUNuQixNQUFNLGFBQWEsR0FBRyxZQUFZLENBQUMsYUFBYSxDQUFDO2dCQUNqRCxJQUFJLGNBQW1CLENBQUM7Z0JBRXhCLDhDQUE4QztnQkFDOUMsSUFBSSxrQkFBa0IsR0FBRyxZQUFZLElBQUksWUFBWSxDQUFDLElBQUksQ0FBQztnQkFFM0QsdURBQXVEO2dCQUN2RCxJQUFJLGtCQUFrQixLQUFLLFNBQVMsSUFBSSxrQkFBa0IsS0FBSyxXQUFXLEVBQUUsQ0FBQztvQkFDekUsa0JBQWtCLEdBQUcsa0JBQWtCLEtBQUssV0FBVyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQztnQkFDbkYsQ0FBQztxQkFBTSxJQUFJLGtCQUFrQixJQUFJLGtCQUFrQixDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsV0FBVyxFQUFFLFVBQVUsRUFBRSxXQUFXLENBQUMsQ0FBQyxRQUFRLENBQUMsa0JBQWtCLENBQUMsRUFBRSxDQUFDO29CQUM1SSxxQkFBcUI7b0JBQ3JCLElBQUksa0JBQWtCLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxJQUFJLGtCQUFrQixLQUFLLGdCQUFnQixFQUFFLENBQUM7d0JBQ3RGLGtCQUFrQixHQUFHLFdBQVcsQ0FBQztvQkFDckMsQ0FBQztnQkFDTCxDQUFDO2dCQUVELE9BQU8sQ0FBQyxHQUFHLENBQUMsd0NBQXdDLFlBQVksMkJBQTJCLGtCQUFrQixFQUFFLENBQUMsQ0FBQztnQkFFakgseUJBQXlCO2dCQUN6QixRQUFRLGtCQUFrQixFQUFFLENBQUM7b0JBQ3pCLEtBQUssUUFBUTt3QkFDVCxjQUFjLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO3dCQUMvQixNQUFNO29CQUNWLEtBQUssUUFBUSxDQUFDO29CQUNkLEtBQUssU0FBUyxDQUFDO29CQUNmLEtBQUssT0FBTzt3QkFDUixjQUFjLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO3dCQUMvQixNQUFNO29CQUNWLEtBQUssU0FBUzt3QkFDVixjQUFjLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO3dCQUNoQyxNQUFNO29CQUNWLEtBQUssT0FBTzt3QkFDUixJQUFJLE9BQU8sS0FBSyxLQUFLLFFBQVEsRUFBRSxDQUFDOzRCQUM1QixpQ0FBaUM7NEJBQ2pDLGNBQWMsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLENBQUM7d0JBQ2xELENBQUM7NkJBQU0sSUFBSSxPQUFPLEtBQUssS0FBSyxRQUFRLElBQUksS0FBSyxLQUFLLElBQUksRUFBRSxDQUFDOzRCQUNyRCxrQkFBa0I7NEJBQ2xCLGNBQWMsR0FBRztnQ0FDYixDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQ0FDbkQsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7Z0NBQ25ELENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dDQUNuRCxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHOzZCQUMvRSxDQUFDO3dCQUNOLENBQUM7NkJBQU0sQ0FBQzs0QkFDSixNQUFNLElBQUksS0FBSyxDQUFDLGlHQUFpRyxDQUFDLENBQUM7d0JBQ3ZILENBQUM7d0JBQ0QsTUFBTTtvQkFDVixLQUFLLE1BQU07d0JBQ1AsSUFBSSxPQUFPLEtBQUssS0FBSyxRQUFRLElBQUksS0FBSyxLQUFLLElBQUksRUFBRSxDQUFDOzRCQUM5QyxjQUFjLEdBQUc7Z0NBQ2IsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztnQ0FDdkIsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQzs2QkFDMUIsQ0FBQzt3QkFDTixDQUFDOzZCQUFNLENBQUM7NEJBQ0osTUFBTSxJQUFJLEtBQUssQ0FBQyxtREFBbUQsQ0FBQyxDQUFDO3dCQUN6RSxDQUFDO3dCQUNELE1BQU07b0JBQ1YsS0FBSyxNQUFNO3dCQUNQLElBQUksT0FBTyxLQUFLLEtBQUssUUFBUSxJQUFJLEtBQUssS0FBSyxJQUFJLEVBQUUsQ0FBQzs0QkFDOUMsY0FBYyxHQUFHO2dDQUNiLENBQUMsRUFBRSxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7Z0NBQ3ZCLENBQUMsRUFBRSxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7Z0NBQ3ZCLENBQUMsRUFBRSxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7NkJBQzFCLENBQUM7d0JBQ04sQ0FBQzs2QkFBTSxDQUFDOzRCQUNKLE1BQU0sSUFBSSxLQUFLLENBQUMsc0RBQXNELENBQUMsQ0FBQzt3QkFDNUUsQ0FBQzt3QkFDRCxNQUFNO29CQUNWLEtBQUssTUFBTTt3QkFDUCxJQUFJLE9BQU8sS0FBSyxLQUFLLFFBQVEsSUFBSSxLQUFLLEtBQUssSUFBSSxFQUFFLENBQUM7NEJBQzlDLGNBQWMsR0FBRztnQ0FDYixLQUFLLEVBQUUsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDO2dDQUMvQixNQUFNLEVBQUUsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDOzZCQUNwQyxDQUFDO3dCQUNOLENBQUM7NkJBQU0sQ0FBQzs0QkFDSixNQUFNLElBQUksS0FBSyxDQUFDLDREQUE0RCxDQUFDLENBQUM7d0JBQ2xGLENBQUM7d0JBQ0QsTUFBTTtvQkFDVixLQUFLLE1BQU07d0JBQ1AsSUFBSSxPQUFPLEtBQUssS0FBSyxRQUFRLEVBQUUsQ0FBQzs0QkFDNUIsY0FBYyxHQUFHLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxDQUFDO3dCQUNyQyxDQUFDOzZCQUFNLENBQUM7NEJBQ0osTUFBTSxJQUFJLEtBQUssQ0FBQyw0Q0FBNEMsQ0FBQyxDQUFDO3dCQUNsRSxDQUFDO3dCQUNELE1BQU07b0JBQ1YsS0FBSyxXQUFXO3dCQUNaLElBQUksT0FBTyxLQUFLLEtBQUssUUFBUSxFQUFFLENBQUM7NEJBQzVCLGlDQUFpQzs0QkFDakMsY0FBYyxHQUFHLEtBQUssQ0FBQyxDQUFDLHlCQUF5Qjt3QkFDckQsQ0FBQzs2QkFBTSxDQUFDOzRCQUNKLE1BQU0sSUFBSSxLQUFLLENBQUMsd0ZBQXdGLENBQUMsQ0FBQzt3QkFDOUcsQ0FBQzt3QkFDRCxNQUFNO29CQUNWLEtBQUssYUFBYSxDQUFDO29CQUNuQixLQUFLLFFBQVEsQ0FBQztvQkFDZCxLQUFLLE9BQU87d0JBQ1IsSUFBSSxPQUFPLEtBQUssS0FBSyxRQUFRLEVBQUUsQ0FBQzs0QkFDNUIsY0FBYyxHQUFHLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxDQUFDO3dCQUNyQyxDQUFDOzZCQUFNLENBQUM7NEJBQ0osTUFBTSxJQUFJLEtBQUssQ0FBQyxHQUFHLFlBQVksOEJBQThCLENBQUMsQ0FBQzt3QkFDbkUsQ0FBQzt3QkFDRCxNQUFNO29CQUNWLEtBQUssV0FBVzt3QkFDWixJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQzs0QkFDdkIsY0FBYyxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFTLEVBQUUsRUFBRTtnQ0FDckMsSUFBSSxPQUFPLElBQUksS0FBSyxRQUFRLEVBQUUsQ0FBQztvQ0FDM0IsT0FBTyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsQ0FBQztnQ0FDMUIsQ0FBQztxQ0FBTSxDQUFDO29DQUNKLE1BQU0sSUFBSSxLQUFLLENBQUMsc0NBQXNDLENBQUMsQ0FBQztnQ0FDNUQsQ0FBQzs0QkFDTCxDQUFDLENBQUMsQ0FBQzt3QkFDUCxDQUFDOzZCQUFNLENBQUM7NEJBQ0osTUFBTSxJQUFJLEtBQUssQ0FBQyxrQ0FBa0MsQ0FBQyxDQUFDO3dCQUN4RCxDQUFDO3dCQUNELE1BQU07b0JBQ1YsS0FBSyxZQUFZO3dCQUNiLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDOzRCQUN2QixjQUFjLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQVMsRUFBRSxFQUFFO2dDQUNyQyxJQUFJLE9BQU8sSUFBSSxLQUFLLFFBQVEsSUFBSSxJQUFJLEtBQUssSUFBSSxJQUFJLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQztvQ0FDM0QsT0FBTzt3Q0FDSCxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQzt3Q0FDbEQsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7d0NBQ2xELENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO3dDQUNsRCxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHO3FDQUM3RSxDQUFDO2dDQUNOLENBQUM7cUNBQU0sQ0FBQztvQ0FDSixPQUFPLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDO2dDQUM5QyxDQUFDOzRCQUNMLENBQUMsQ0FBQyxDQUFDO3dCQUNQLENBQUM7NkJBQU0sQ0FBQzs0QkFDSixNQUFNLElBQUksS0FBSyxDQUFDLG1DQUFtQyxDQUFDLENBQUM7d0JBQ3pELENBQUM7d0JBQ0QsTUFBTTtvQkFDVixLQUFLLGFBQWE7d0JBQ2QsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUM7NEJBQ3ZCLGNBQWMsR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBUyxFQUFFLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQzt3QkFDNUQsQ0FBQzs2QkFBTSxDQUFDOzRCQUNKLE1BQU0sSUFBSSxLQUFLLENBQUMsb0NBQW9DLENBQUMsQ0FBQzt3QkFDMUQsQ0FBQzt3QkFDRCxNQUFNO29CQUNWLEtBQUssYUFBYTt3QkFDZCxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQzs0QkFDdkIsY0FBYyxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFTLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO3dCQUM1RCxDQUFDOzZCQUFNLENBQUM7NEJBQ0osTUFBTSxJQUFJLEtBQUssQ0FBQyxvQ0FBb0MsQ0FBQyxDQUFDO3dCQUMxRCxDQUFDO3dCQUNELE1BQU07b0JBQ1Y7d0JBQ0ksTUFBTSxJQUFJLEtBQUssQ0FBQyw4QkFBOEIsWUFBWSxFQUFFLENBQUMsQ0FBQztnQkFDdEUsQ0FBQztnQkFFRCxPQUFPLENBQUMsR0FBRyxDQUFDLHNDQUFzQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLFdBQVcsa0JBQWtCLEdBQUcsQ0FBQyxDQUFDO2dCQUM5SSxPQUFPLENBQUMsR0FBRyxDQUFDLGlFQUFpRSxZQUFZLENBQUMsSUFBSSwwQkFBMEIsa0JBQWtCLEdBQUcsQ0FBQyxDQUFDO2dCQUMvSSxPQUFPLENBQUMsR0FBRyxDQUFDLHFEQUFxRCxrQkFBa0IsS0FBSyxPQUFPLElBQUksY0FBYyxJQUFJLE9BQU8sY0FBYyxLQUFLLFFBQVEsRUFBRSxDQUFDLENBQUM7Z0JBRTNKLDJCQUEyQjtnQkFDM0IsSUFBSSxtQkFBbUIsR0FBRyxjQUFjLENBQUM7Z0JBRXpDLDJCQUEyQjtnQkFDM0IsTUFBTSxXQUFXLEdBQUcsTUFBTSxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsWUFBWSxFQUFFLFFBQVEsQ0FBQyxDQUFDO2dCQUNsRixJQUFJLENBQUMsV0FBVyxJQUFJLENBQUMsV0FBVyxDQUFDLFNBQVMsRUFBRSxDQUFDO29CQUN6QyxPQUFPLENBQUM7d0JBQ0osT0FBTyxFQUFFLEtBQUs7d0JBQ2QsS0FBSyxFQUFFLGtEQUFrRDtxQkFDNUQsQ0FBQyxDQUFDO29CQUNILE9BQU87Z0JBQ1gsQ0FBQztnQkFFRCxZQUFZO2dCQUNaLElBQUksaUJBQWlCLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQzNCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxXQUFXLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO29CQUNwRCxNQUFNLElBQUksR0FBRyxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBUSxDQUFDO29CQUM3QyxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxHQUFHLElBQUksSUFBSSxDQUFDLElBQUksSUFBSSxTQUFTLENBQUM7b0JBQ3JFLElBQUksUUFBUSxLQUFLLGFBQWEsRUFBRSxDQUFDO3dCQUM3QixpQkFBaUIsR0FBRyxDQUFDLENBQUM7d0JBQ3RCLE1BQU07b0JBQ1YsQ0FBQztnQkFDTCxDQUFDO2dCQUVELElBQUksaUJBQWlCLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQztvQkFDM0IsT0FBTyxDQUFDO3dCQUNKLE9BQU8sRUFBRSxLQUFLO3dCQUNkLEtBQUssRUFBRSxxREFBcUQ7cUJBQy9ELENBQUMsQ0FBQztvQkFDSCxPQUFPO2dCQUNYLENBQUM7Z0JBRUQsWUFBWTtnQkFDWixJQUFJLFlBQVksR0FBRyxhQUFhLGlCQUFpQixJQUFJLFFBQVEsRUFBRSxDQUFDO2dCQUVoRSxZQUFZO2dCQUNaLElBQUksa0JBQWtCLEtBQUssT0FBTyxJQUFJLGtCQUFrQixLQUFLLGFBQWEsSUFBSSxrQkFBa0IsS0FBSyxRQUFRO29CQUN6RyxDQUFDLFlBQVksQ0FBQyxJQUFJLEtBQUssT0FBTyxJQUFJLGtCQUFrQixLQUFLLFFBQVEsQ0FBQyxFQUFFLENBQUM7b0JBRXJFLE9BQU8sQ0FBQyxHQUFHLENBQUMsMkNBQTJDLEVBQUU7d0JBQ3JELEtBQUssRUFBRSxjQUFjO3dCQUNyQixRQUFRLEVBQUUsUUFBUTt3QkFDbEIsa0JBQWtCLEVBQUUsa0JBQWtCO3dCQUN0QyxJQUFJLEVBQUUsWUFBWTtxQkFDckIsQ0FBQyxDQUFDO29CQUVILDhDQUE4QztvQkFDOUMsSUFBSSxTQUFTLEdBQUcsZ0JBQWdCLENBQUMsQ0FBQyxVQUFVO29CQUM1QyxJQUFJLFFBQVEsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQzt3QkFDN0MsU0FBUyxHQUFHLGNBQWMsQ0FBQztvQkFDL0IsQ0FBQzt5QkFBTSxJQUFJLFFBQVEsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQzt3QkFDckQsU0FBUyxHQUFHLGFBQWEsQ0FBQztvQkFDOUIsQ0FBQzt5QkFBTSxJQUFJLFFBQVEsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQzt3QkFDakQsU0FBUyxHQUFHLFNBQVMsQ0FBQztvQkFDMUIsQ0FBQzt5QkFBTSxJQUFJLFFBQVEsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQzt3QkFDakQsU0FBUyxHQUFHLGNBQWMsQ0FBQztvQkFDL0IsQ0FBQzt5QkFBTSxJQUFJLGtCQUFrQixLQUFLLFFBQVEsRUFBRSxDQUFDO3dCQUN6QyxTQUFTLEdBQUcsV0FBVyxDQUFDO29CQUM1QixDQUFDO29CQUVELE1BQU0sTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLGNBQWMsRUFBRTt3QkFDbEQsSUFBSSxFQUFFLFFBQVE7d0JBQ2QsSUFBSSxFQUFFLFlBQVk7d0JBQ2xCLElBQUksRUFBRTs0QkFDRixLQUFLLEVBQUUsY0FBYzs0QkFDckIsSUFBSSxFQUFFLFNBQVM7eUJBQ2xCO3FCQUNKLENBQUMsQ0FBQztnQkFDUCxDQUFDO3FCQUFNLElBQUksYUFBYSxLQUFLLGdCQUFnQixJQUFJLENBQUMsUUFBUSxLQUFLLGNBQWMsSUFBSSxRQUFRLEtBQUssYUFBYSxDQUFDLEVBQUUsQ0FBQztvQkFDM0csaUZBQWlGO29CQUNqRixNQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsQ0FBQztvQkFDekMsTUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxHQUFHLENBQUM7b0JBRTNDLGtCQUFrQjtvQkFDbEIsTUFBTSxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsY0FBYyxFQUFFO3dCQUNsRCxJQUFJLEVBQUUsUUFBUTt3QkFDZCxJQUFJLEVBQUUsYUFBYSxpQkFBaUIsUUFBUTt3QkFDNUMsSUFBSSxFQUFFLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRTtxQkFDekIsQ0FBQyxDQUFDO29CQUVILGtCQUFrQjtvQkFDbEIsTUFBTSxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsY0FBYyxFQUFFO3dCQUNsRCxJQUFJLEVBQUUsUUFBUTt3QkFDZCxJQUFJLEVBQUUsYUFBYSxpQkFBaUIsU0FBUzt3QkFDN0MsSUFBSSxFQUFFLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRTtxQkFDMUIsQ0FBQyxDQUFDO2dCQUNQLENBQUM7cUJBQU0sSUFBSSxhQUFhLEtBQUssZ0JBQWdCLElBQUksQ0FBQyxRQUFRLEtBQUssY0FBYyxJQUFJLFFBQVEsS0FBSyxhQUFhLENBQUMsRUFBRSxDQUFDO29CQUMzRyxvRkFBb0Y7b0JBQ3BGLE1BQU0sT0FBTyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDO29CQUN2QyxNQUFNLE9BQU8sR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQztvQkFFdkMsb0JBQW9CO29CQUNwQixNQUFNLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxjQUFjLEVBQUU7d0JBQ2xELElBQUksRUFBRSxRQUFRO3dCQUNkLElBQUksRUFBRSxhQUFhLGlCQUFpQixVQUFVO3dCQUM5QyxJQUFJLEVBQUUsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFO3FCQUMzQixDQUFDLENBQUM7b0JBRUgscUJBQXFCO29CQUNyQixNQUFNLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxjQUFjLEVBQUU7d0JBQ2xELElBQUksRUFBRSxRQUFRO3dCQUNkLElBQUksRUFBRSxhQUFhLGlCQUFpQixVQUFVO3dCQUM5QyxJQUFJLEVBQUUsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFO3FCQUMzQixDQUFDLENBQUM7Z0JBQ1AsQ0FBQztxQkFBTSxJQUFJLGtCQUFrQixLQUFLLE9BQU8sSUFBSSxjQUFjLElBQUksT0FBTyxjQUFjLEtBQUssUUFBUSxFQUFFLENBQUM7b0JBQ2hHLHFCQUFxQjtvQkFDckIsMkJBQTJCO29CQUMzQixNQUFNLFVBQVUsR0FBRzt3QkFDZixDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQzt3QkFDNUQsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7d0JBQzVELENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO3dCQUM1RCxDQUFDLEVBQUUsY0FBYyxDQUFDLENBQUMsS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHO3FCQUNqRyxDQUFDO29CQUVGLE9BQU8sQ0FBQyxHQUFHLENBQUMsdUNBQXVDLEVBQUUsVUFBVSxDQUFDLENBQUM7b0JBRWpFLE1BQU0sTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLGNBQWMsRUFBRTt3QkFDbEQsSUFBSSxFQUFFLFFBQVE7d0JBQ2QsSUFBSSxFQUFFLFlBQVk7d0JBQ2xCLElBQUksRUFBRTs0QkFDRixLQUFLLEVBQUUsVUFBVTs0QkFDakIsSUFBSSxFQUFFLFVBQVU7eUJBQ25CO3FCQUNKLENBQUMsQ0FBQztnQkFDUCxDQUFDO3FCQUFNLElBQUksa0JBQWtCLEtBQUssTUFBTSxJQUFJLGNBQWMsSUFBSSxPQUFPLGNBQWMsS0FBSyxRQUFRLEVBQUUsQ0FBQztvQkFDL0YsYUFBYTtvQkFDYixNQUFNLFNBQVMsR0FBRzt3QkFDZCxDQUFDLEVBQUUsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO3dCQUNoQyxDQUFDLEVBQUUsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO3dCQUNoQyxDQUFDLEVBQUUsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO3FCQUNuQyxDQUFDO29CQUVGLE1BQU0sTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLGNBQWMsRUFBRTt3QkFDbEQsSUFBSSxFQUFFLFFBQVE7d0JBQ2QsSUFBSSxFQUFFLFlBQVk7d0JBQ2xCLElBQUksRUFBRTs0QkFDRixLQUFLLEVBQUUsU0FBUzs0QkFDaEIsSUFBSSxFQUFFLFNBQVM7eUJBQ2xCO3FCQUNKLENBQUMsQ0FBQztnQkFDUCxDQUFDO3FCQUFNLElBQUksa0JBQWtCLEtBQUssTUFBTSxJQUFJLGNBQWMsSUFBSSxPQUFPLGNBQWMsS0FBSyxRQUFRLEVBQUUsQ0FBQztvQkFDL0YsYUFBYTtvQkFDYixNQUFNLFNBQVMsR0FBRzt3QkFDZCxDQUFDLEVBQUUsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO3dCQUNoQyxDQUFDLEVBQUUsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO3FCQUNuQyxDQUFDO29CQUVGLE1BQU0sTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLGNBQWMsRUFBRTt3QkFDbEQsSUFBSSxFQUFFLFFBQVE7d0JBQ2QsSUFBSSxFQUFFLFlBQVk7d0JBQ2xCLElBQUksRUFBRTs0QkFDRixLQUFLLEVBQUUsU0FBUzs0QkFDaEIsSUFBSSxFQUFFLFNBQVM7eUJBQ2xCO3FCQUNKLENBQUMsQ0FBQztnQkFDUCxDQUFDO3FCQUFNLElBQUksa0JBQWtCLEtBQUssTUFBTSxJQUFJLGNBQWMsSUFBSSxPQUFPLGNBQWMsS0FBSyxRQUFRLEVBQUUsQ0FBQztvQkFDL0YsYUFBYTtvQkFDYixNQUFNLFNBQVMsR0FBRzt3QkFDZCxLQUFLLEVBQUUsTUFBTSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDO3dCQUN4QyxNQUFNLEVBQUUsTUFBTSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDO3FCQUM3QyxDQUFDO29CQUVGLE1BQU0sTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLGNBQWMsRUFBRTt3QkFDbEQsSUFBSSxFQUFFLFFBQVE7d0JBQ2QsSUFBSSxFQUFFLFlBQVk7d0JBQ2xCLElBQUksRUFBRTs0QkFDRixLQUFLLEVBQUUsU0FBUzs0QkFDaEIsSUFBSSxFQUFFLFNBQVM7eUJBQ2xCO3FCQUNKLENBQUMsQ0FBQztnQkFDUCxDQUFDO3FCQUFNLElBQUksa0JBQWtCLEtBQUssTUFBTSxJQUFJLGNBQWMsSUFBSSxPQUFPLGNBQWMsS0FBSyxRQUFRLElBQUksTUFBTSxJQUFJLGNBQWMsRUFBRSxDQUFDO29CQUMzSCxXQUFXO29CQUNYLE9BQU8sQ0FBQyxHQUFHLENBQUMsc0RBQXNELGNBQWMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO29CQUN6RixNQUFNLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxjQUFjLEVBQUU7d0JBQ2xELElBQUksRUFBRSxRQUFRO3dCQUNkLElBQUksRUFBRSxZQUFZO3dCQUNsQixJQUFJLEVBQUU7NEJBQ0YsS0FBSyxFQUFFLGNBQWM7NEJBQ3JCLElBQUksRUFBRSxTQUFTO3lCQUNsQjtxQkFDSixDQUFDLENBQUM7Z0JBQ1AsQ0FBQztxQkFBTSxJQUFJLGtCQUFrQixLQUFLLFdBQVcsSUFBSSxPQUFPLGNBQWMsS0FBSyxRQUFRLEVBQUUsQ0FBQztvQkFDbEYsK0JBQStCO29CQUMvQixNQUFNLGNBQWMsR0FBRyxjQUFjLENBQUM7b0JBQ3RDLE9BQU8sQ0FBQyxHQUFHLENBQUMsNkVBQTZFLGNBQWMsRUFBRSxDQUFDLENBQUM7b0JBRTNHLHdCQUF3QjtvQkFDeEIsSUFBSSxxQkFBcUIsR0FBRyxFQUFFLENBQUM7b0JBRS9CLHNCQUFzQjtvQkFDdEIsTUFBTSxvQkFBb0IsR0FBRyxNQUFNLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLEVBQUUsYUFBYSxDQUFDLENBQUM7b0JBQ2xGLElBQUksb0JBQW9CLENBQUMsT0FBTyxLQUFJLE1BQUEsTUFBQSxvQkFBb0IsQ0FBQyxJQUFJLDBDQUFFLFVBQVUsMENBQUcsUUFBUSxDQUFDLENBQUEsRUFBRSxDQUFDO3dCQUNwRixNQUFNLFlBQVksR0FBRyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDO3dCQUVwRSxrQkFBa0I7d0JBQ2xCLElBQUksWUFBWSxJQUFJLE9BQU8sWUFBWSxLQUFLLFFBQVEsRUFBRSxDQUFDOzRCQUNuRCxvQkFBb0I7NEJBQ3BCLElBQUksWUFBWSxDQUFDLElBQUksRUFBRSxDQUFDO2dDQUNwQixxQkFBcUIsR0FBRyxZQUFZLENBQUMsSUFBSSxDQUFDOzRCQUM5QyxDQUFDO2lDQUFNLElBQUksWUFBWSxDQUFDLElBQUksRUFBRSxDQUFDO2dDQUMzQixpQkFBaUI7Z0NBQ2pCLHFCQUFxQixHQUFHLFlBQVksQ0FBQyxJQUFJLENBQUM7NEJBQzlDLENBQUM7aUNBQU0sSUFBSSxZQUFZLENBQUMsT0FBTyxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUM7Z0NBQ3JFLDJCQUEyQjtnQ0FDM0IsS0FBSyxNQUFNLFVBQVUsSUFBSSxZQUFZLENBQUMsT0FBTyxFQUFFLENBQUM7b0NBQzVDLElBQUksVUFBVSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsSUFBSSxVQUFVLEtBQUssY0FBYyxJQUFJLFVBQVUsS0FBSyxXQUFXLEVBQUUsQ0FBQzt3Q0FDOUYscUJBQXFCLEdBQUcsVUFBVSxDQUFDO3dDQUNuQyxNQUFNO29DQUNWLENBQUM7Z0NBQ0wsQ0FBQzs0QkFDTCxDQUFDO3dCQUNMLENBQUM7b0JBQ0wsQ0FBQztvQkFFRCxJQUFJLENBQUMscUJBQXFCLEVBQUUsQ0FBQzt3QkFDekIsTUFBTSxJQUFJLEtBQUssQ0FBQyw2REFBNkQsUUFBUSxtQkFBbUIsYUFBYSx3REFBd0QsQ0FBQyxDQUFDO29CQUNuTCxDQUFDO29CQUVELE9BQU8sQ0FBQyxHQUFHLENBQUMsc0RBQXNELHFCQUFxQixrQkFBa0IsUUFBUSxFQUFFLENBQUMsQ0FBQztvQkFFckgsSUFBSSxDQUFDO3dCQUNELGNBQWM7d0JBQ2QsTUFBTSxjQUFjLEdBQUcsTUFBTSxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsWUFBWSxFQUFFLGNBQWMsQ0FBQyxDQUFDO3dCQUMzRixJQUFJLENBQUMsY0FBYyxJQUFJLENBQUMsY0FBYyxDQUFDLFNBQVMsRUFBRSxDQUFDOzRCQUMvQyxNQUFNLElBQUksS0FBSyxDQUFDLGVBQWUsY0FBYyxpQ0FBaUMsQ0FBQyxDQUFDO3dCQUNwRixDQUFDO3dCQUVELGNBQWM7d0JBQ2QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxnQ0FBZ0MsY0FBYyxRQUFRLGNBQWMsQ0FBQyxTQUFTLENBQUMsTUFBTSxjQUFjLENBQUMsQ0FBQzt3QkFDakgsY0FBYyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFTLEVBQUUsS0FBYSxFQUFFLEVBQUU7NEJBQzFELE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQzs0QkFDM0csT0FBTyxDQUFDLEdBQUcsQ0FBQyw4QkFBOEIsS0FBSyxLQUFLLElBQUksQ0FBQyxJQUFJLGVBQWUsT0FBTyxHQUFHLENBQUMsQ0FBQzt3QkFDNUYsQ0FBQyxDQUFDLENBQUM7d0JBRUgsVUFBVTt3QkFDVixJQUFJLGVBQWUsR0FBRyxJQUFJLENBQUM7d0JBQzNCLElBQUksV0FBVyxHQUFrQixJQUFJLENBQUM7d0JBRXRDLGdDQUFnQzt3QkFDaEMsa0NBQWtDO3dCQUNsQyxPQUFPLENBQUMsR0FBRyxDQUFDLGtEQUFrRCxxQkFBcUIsRUFBRSxDQUFDLENBQUM7d0JBRXZGLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxjQUFjLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDOzRCQUN2RCxNQUFNLElBQUksR0FBRyxjQUFjLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBUSxDQUFDOzRCQUNoRCxPQUFPLENBQUMsR0FBRyxDQUFDLHVDQUF1QyxDQUFDLFVBQVUsSUFBSSxDQUFDLElBQUksWUFBWSxxQkFBcUIsRUFBRSxDQUFDLENBQUM7NEJBRTVHLElBQUksSUFBSSxDQUFDLElBQUksS0FBSyxxQkFBcUIsRUFBRSxDQUFDO2dDQUN0QyxlQUFlLEdBQUcsSUFBSSxDQUFDO2dDQUN2QixPQUFPLENBQUMsR0FBRyxDQUFDLHNEQUFzRCxDQUFDLEtBQUssSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7Z0NBRXJGLG1DQUFtQztnQ0FDbkMsSUFBSSxJQUFJLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO29DQUN6RCxXQUFXLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO29DQUNwQyxPQUFPLENBQUMsR0FBRyxDQUFDLGdFQUFnRSxXQUFXLEVBQUUsQ0FBQyxDQUFDO2dDQUMvRixDQUFDO3FDQUFNLENBQUM7b0NBQ0osT0FBTyxDQUFDLEdBQUcsQ0FBQyx1Q0FBdUMsRUFBRTt3Q0FDakQsUUFBUSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSzt3Q0FDdEIsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUM7d0NBQzFDLFlBQVksRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQzt3Q0FDeEUsYUFBYSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxVQUFVO3FDQUMzRCxDQUFDLENBQUM7b0NBQ0gsTUFBTSxJQUFJLEtBQUssQ0FBQyx5REFBeUQsQ0FBQyxDQUFDO2dDQUMvRSxDQUFDO2dDQUVELE1BQU07NEJBQ1YsQ0FBQzt3QkFDTCxDQUFDO3dCQUVELElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQzs0QkFDbkIsK0JBQStCOzRCQUMvQixNQUFNLG1CQUFtQixHQUFHLGNBQWMsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBUyxFQUFFLEtBQWEsRUFBRSxFQUFFO2dDQUNsRixJQUFJLE9BQU8sR0FBRyxTQUFTLENBQUM7Z0NBQ3hCLDZCQUE2QjtnQ0FDN0IsSUFBSSxJQUFJLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO29DQUN6RCxPQUFPLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO2dDQUNwQyxDQUFDO2dDQUNELE9BQU8sR0FBRyxJQUFJLENBQUMsSUFBSSxhQUFhLE9BQU8sR0FBRyxDQUFDOzRCQUMvQyxDQUFDLENBQUMsQ0FBQzs0QkFDSCxNQUFNLElBQUksS0FBSyxDQUFDLG1CQUFtQixxQkFBcUIsdUJBQXVCLGNBQWMsMkJBQTJCLG1CQUFtQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7d0JBQzlKLENBQUM7d0JBRUQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxvQ0FBb0MscUJBQXFCLG1CQUFtQixXQUFXLFlBQVksY0FBYyxFQUFFLENBQUMsQ0FBQzt3QkFFakksMkJBQTJCO3dCQUMzQixJQUFJLFdBQVcsRUFBRSxDQUFDOzRCQUNkLG1CQUFtQixHQUFHLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxDQUFDO3dCQUNoRCxDQUFDO3dCQUVELHdDQUF3Qzt3QkFDeEMsaUJBQWlCO3dCQUNqQixNQUFNLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxjQUFjLEVBQUU7NEJBQ2xELElBQUksRUFBRSxRQUFROzRCQUNkLElBQUksRUFBRSxZQUFZOzRCQUNsQixJQUFJLEVBQUU7Z0NBQ0YsS0FBSyxFQUFFLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxFQUFHLG9CQUFvQjtnQ0FDbkQsSUFBSSxFQUFFLHFCQUFxQjs2QkFDOUI7eUJBQ0osQ0FBQyxDQUFDO29CQUVQLENBQUM7b0JBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQzt3QkFDYixPQUFPLENBQUMsS0FBSyxDQUFDLHFEQUFxRCxFQUFFLEtBQUssQ0FBQyxDQUFDO3dCQUM1RSxNQUFNLEtBQUssQ0FBQztvQkFDaEIsQ0FBQztnQkFDTCxDQUFDO3FCQUFNLElBQUksa0JBQWtCLEtBQUssV0FBVyxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLEVBQUUsQ0FBQztvQkFDN0Usc0JBQXNCO29CQUN0QixPQUFPLENBQUMsR0FBRyxDQUFDLHNDQUFzQyxFQUFFLGNBQWMsQ0FBQyxDQUFDO29CQUVwRSxNQUFNLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxjQUFjLEVBQUU7d0JBQ2xELElBQUksRUFBRSxRQUFRO3dCQUNkLElBQUksRUFBRSxZQUFZO3dCQUNsQixJQUFJLEVBQUU7NEJBQ0YsS0FBSyxFQUFFLGNBQWMsQ0FBRSx1Q0FBdUM7eUJBQ2pFO3FCQUNKLENBQUMsQ0FBQztnQkFDUCxDQUFDO3FCQUFNLElBQUksa0JBQWtCLEtBQUssWUFBWSxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLEVBQUUsQ0FBQztvQkFDOUUsV0FBVztvQkFDWCxNQUFNLGVBQWUsR0FBRyxjQUFjLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBUyxFQUFFLEVBQUU7d0JBQ3JELElBQUksSUFBSSxJQUFJLE9BQU8sSUFBSSxLQUFLLFFBQVEsSUFBSSxHQUFHLElBQUksSUFBSSxFQUFFLENBQUM7NEJBQ2xELE9BQU87Z0NBQ0gsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7Z0NBQ2xELENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dDQUNsRCxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQ0FDbEQsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRzs2QkFDN0UsQ0FBQzt3QkFDTixDQUFDOzZCQUFNLENBQUM7NEJBQ0osT0FBTyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQzt3QkFDOUMsQ0FBQztvQkFDTCxDQUFDLENBQUMsQ0FBQztvQkFFSCxNQUFNLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxjQUFjLEVBQUU7d0JBQ2xELElBQUksRUFBRSxRQUFRO3dCQUNkLElBQUksRUFBRSxZQUFZO3dCQUNsQixJQUFJLEVBQUU7NEJBQ0YsS0FBSyxFQUFFLGVBQWU7NEJBQ3RCLElBQUksRUFBRSxVQUFVO3lCQUNuQjtxQkFDSixDQUFDLENBQUM7Z0JBQ1AsQ0FBQztxQkFBTSxDQUFDO29CQUNKLG1EQUFtRDtvQkFDbkQsTUFBTSxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsY0FBYyxFQUFFO3dCQUNsRCxJQUFJLEVBQUUsUUFBUTt3QkFDZCxJQUFJLEVBQUUsWUFBWTt3QkFDbEIsSUFBSSxFQUFFLEVBQUUsS0FBSyxFQUFFLGNBQWMsRUFBRTtxQkFDbEMsQ0FBQyxDQUFDO2dCQUNQLENBQUM7Z0JBRUQsZ0NBQWdDO2dCQUNoQyxNQUFNLElBQUksT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMscUJBQXFCO2dCQUU3RSxNQUFNLFlBQVksR0FBRyxNQUFNLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxRQUFRLEVBQUUsYUFBYSxFQUFFLFFBQVEsRUFBRSxhQUFhLEVBQUUsbUJBQW1CLENBQUMsQ0FBQztnQkFFNUgsT0FBTyxDQUFDO29CQUNKLE9BQU8sRUFBRSxJQUFJO29CQUNiLE9BQU8sRUFBRSxvQkFBb0IsYUFBYSxJQUFJLFFBQVEsRUFBRTtvQkFDeEQsSUFBSSxFQUFFO3dCQUNGLFFBQVE7d0JBQ1IsYUFBYTt3QkFDYixRQUFRO3dCQUNSLFdBQVcsRUFBRSxZQUFZLENBQUMsV0FBVzt3QkFDckMsY0FBYyxFQUFFLFlBQVksQ0FBQyxRQUFRO3FCQUN4QztpQkFDSixDQUFDLENBQUM7WUFFUCxDQUFDO1lBQUMsT0FBTyxLQUFVLEVBQUUsQ0FBQztnQkFDbEIsT0FBTyxDQUFDLEtBQUssQ0FBQywwQ0FBMEMsRUFBRSxLQUFLLENBQUMsQ0FBQztnQkFDakUsT0FBTyxDQUFDO29CQUNKLE9BQU8sRUFBRSxLQUFLO29CQUNkLEtBQUssRUFBRSwyQkFBMkIsS0FBSyxDQUFDLE9BQU8sRUFBRTtpQkFDcEQsQ0FBQyxDQUFDO1lBQ1AsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVEOzs7T0FHRztJQUNLLEtBQUssQ0FBQyxzQkFBc0IsQ0FBQyxJQUFTO1FBQzFDLE1BQU0sRUFBRSxRQUFRLEVBQUUsYUFBYSxFQUFFLFVBQVUsRUFBRSxHQUFHLElBQUksQ0FBQztRQUVyRCxPQUFPLElBQUksT0FBTyxDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUUsRUFBRTs7WUFDakMsSUFBSSxDQUFDO2dCQUNELFNBQVM7Z0JBQ1QsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO29CQUNaLE9BQU8sQ0FBQyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLHNCQUFzQixFQUFFLENBQUMsQ0FBQztvQkFDM0QsT0FBTztnQkFDWCxDQUFDO2dCQUNELElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztvQkFDakIsT0FBTyxDQUFDLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsMkJBQTJCLEVBQUUsQ0FBQyxDQUFDO29CQUNoRSxPQUFPO2dCQUNYLENBQUM7Z0JBQ0QsSUFBSSxDQUFDLFVBQVUsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLElBQUksVUFBVSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUUsQ0FBQztvQkFDdkUsT0FBTyxDQUFDLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsb0RBQW9ELEVBQUUsQ0FBQyxDQUFDO29CQUN6RixPQUFPO2dCQUNYLENBQUM7Z0JBRUQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQ0FBa0MsVUFBVSxDQUFDLE1BQU0sa0JBQWtCLGFBQWEsYUFBYSxRQUFRLEVBQUUsQ0FBQyxDQUFDO2dCQUV2SCxZQUFZO2dCQUNaLE1BQU0sa0JBQWtCLEdBQUcsTUFBTSxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUM5RCxJQUFJLENBQUMsa0JBQWtCLENBQUMsT0FBTyxJQUFJLENBQUMsQ0FBQSxNQUFBLGtCQUFrQixDQUFDLElBQUksMENBQUUsVUFBVSxDQUFBLEVBQUUsQ0FBQztvQkFDdEUsT0FBTyxDQUFDO3dCQUNKLE9BQU8sRUFBRSxLQUFLO3dCQUNkLEtBQUssRUFBRSw2QkFBNkIsa0JBQWtCLENBQUMsS0FBSyxFQUFFO3FCQUNqRSxDQUFDLENBQUM7b0JBQ0gsT0FBTztnQkFDWCxDQUFDO2dCQUVELE1BQU0sY0FBYyxHQUFHLGtCQUFrQixDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBTSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ2xGLE1BQU0sZUFBZSxHQUFHLGtCQUFrQixDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBUyxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLGFBQWEsQ0FBQyxDQUFDO2dCQUU1RyxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7b0JBQ25CLE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQywyQkFBMkIsQ0FBQyxhQUFhLEVBQUUsY0FBYyxFQUFFLEVBQUUsQ0FBQyxDQUFDO29CQUN4RixPQUFPLENBQUM7d0JBQ0osT0FBTyxFQUFFLEtBQUs7d0JBQ2QsS0FBSyxFQUFFLGNBQWMsYUFBYSw4Q0FBOEMsY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRTt3QkFDM0csV0FBVyxFQUFFLFdBQVc7cUJBQzNCLENBQUMsQ0FBQztvQkFDSCxPQUFPO2dCQUNYLENBQUM7Z0JBRUQsU0FBUztnQkFDVCxNQUFNLE9BQU8sR0FBa0UsRUFBRSxDQUFDO2dCQUNsRixJQUFJLFFBQVEsR0FBRyxLQUFLLENBQUM7Z0JBRXJCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxVQUFVLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7b0JBQ3pDLE1BQU0sV0FBVyxHQUFHLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFFbEMsZ0JBQWdCO29CQUNoQixJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsRUFBRSxDQUFDO3dCQUN4QixPQUFPLENBQUMsSUFBSSxDQUFDOzRCQUNULFFBQVEsRUFBRSxTQUFTLENBQUMsRUFBRTs0QkFDdEIsT0FBTyxFQUFFLEtBQUs7NEJBQ2QsS0FBSyxFQUFFLDJCQUEyQjt5QkFDckMsQ0FBQyxDQUFDO3dCQUNILFFBQVEsR0FBRyxJQUFJLENBQUM7d0JBQ2hCLFNBQVM7b0JBQ2IsQ0FBQztvQkFFRCxJQUFJLFdBQVcsQ0FBQyxLQUFLLEtBQUssU0FBUyxJQUFJLFdBQVcsQ0FBQyxLQUFLLEtBQUssSUFBSSxFQUFFLENBQUM7d0JBQ2hFLE9BQU8sQ0FBQyxJQUFJLENBQUM7NEJBQ1QsUUFBUSxFQUFFLFdBQVcsQ0FBQyxRQUFROzRCQUM5QixPQUFPLEVBQUUsS0FBSzs0QkFDZCxLQUFLLEVBQUUsbUJBQW1CO3lCQUM3QixDQUFDLENBQUM7d0JBQ0gsUUFBUSxHQUFHLElBQUksQ0FBQzt3QkFDaEIsU0FBUztvQkFDYixDQUFDO29CQUVELElBQUksQ0FBQzt3QkFDRCxjQUFjO3dCQUNkLE1BQU0sY0FBYyxHQUFHOzRCQUNuQixRQUFROzRCQUNSLGFBQWE7NEJBQ2IsUUFBUSxFQUFFLFdBQVcsQ0FBQyxRQUFROzRCQUM5QixZQUFZLEVBQUUsV0FBVyxDQUFDLFlBQVk7NEJBQ3RDLEtBQUssRUFBRSxXQUFXLENBQUMsS0FBSzt5QkFDM0IsQ0FBQzt3QkFFRixlQUFlO3dCQUNmLE1BQU0sTUFBTSxHQUFHLE1BQU0sSUFBSSxDQUFDLG9CQUFvQixDQUFDLGNBQWMsQ0FBQyxDQUFDO3dCQUUvRCxPQUFPLENBQUMsSUFBSSxDQUFDOzRCQUNULFFBQVEsRUFBRSxXQUFXLENBQUMsUUFBUTs0QkFDOUIsT0FBTyxFQUFFLE1BQU0sQ0FBQyxPQUFPOzRCQUN2QixLQUFLLEVBQUUsTUFBTSxDQUFDLEtBQUs7eUJBQ3RCLENBQUMsQ0FBQzt3QkFFSCxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDOzRCQUNsQixRQUFRLEdBQUcsSUFBSSxDQUFDOzRCQUNoQixPQUFPLENBQUMsSUFBSSxDQUFDLDRDQUE0QyxXQUFXLENBQUMsUUFBUSxNQUFNLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO3dCQUN2RyxDQUFDO29CQUNMLENBQUM7b0JBQUMsT0FBTyxLQUFVLEVBQUUsQ0FBQzt3QkFDbEIsT0FBTyxDQUFDLElBQUksQ0FBQzs0QkFDVCxRQUFRLEVBQUUsV0FBVyxDQUFDLFFBQVE7NEJBQzlCLE9BQU8sRUFBRSxLQUFLOzRCQUNkLEtBQUssRUFBRSxLQUFLLENBQUMsT0FBTzt5QkFDdkIsQ0FBQyxDQUFDO3dCQUNILFFBQVEsR0FBRyxJQUFJLENBQUM7d0JBQ2hCLE9BQU8sQ0FBQyxLQUFLLENBQUMsNENBQTRDLFdBQVcsQ0FBQyxRQUFRLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztvQkFDL0YsQ0FBQztnQkFDTCxDQUFDO2dCQUVELFdBQVc7Z0JBQ1gsTUFBTSxZQUFZLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxNQUFNLENBQUM7Z0JBQzNELE1BQU0sU0FBUyxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxNQUFNLENBQUM7Z0JBRXpELE9BQU8sQ0FBQztvQkFDSixPQUFPLEVBQUUsQ0FBQyxRQUFRO29CQUNsQixPQUFPLEVBQUUsb0NBQW9DLFlBQVksZUFBZSxTQUFTLFNBQVM7b0JBQzFGLElBQUksRUFBRTt3QkFDRixRQUFRO3dCQUNSLGFBQWE7d0JBQ2IsZUFBZSxFQUFFLFVBQVUsQ0FBQyxNQUFNO3dCQUNsQyxZQUFZO3dCQUNaLFNBQVM7d0JBQ1QsT0FBTztxQkFDVjtpQkFDSixDQUFDLENBQUM7WUFFUCxDQUFDO1lBQUMsT0FBTyxLQUFVLEVBQUUsQ0FBQztnQkFDbEIsT0FBTyxDQUFDLEtBQUssQ0FBQyxrREFBa0QsRUFBRSxLQUFLLENBQUMsQ0FBQztnQkFDekUsT0FBTyxDQUFDO29CQUNKLE9BQU8sRUFBRSxLQUFLO29CQUNkLEtBQUssRUFBRSxpQ0FBaUMsS0FBSyxDQUFDLE9BQU8sRUFBRTtpQkFDMUQsQ0FBQyxDQUFDO1lBQ1AsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUdPLEtBQUssQ0FBQyxZQUFZLENBQUMsUUFBZ0IsRUFBRSxVQUFrQjtRQUMzRCxPQUFPLElBQUksT0FBTyxDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUUsRUFBRTs7WUFDakMsU0FBUztZQUNULElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztnQkFDWixPQUFPLENBQUMsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxzQkFBc0IsRUFBRSxDQUFDLENBQUM7Z0JBQzNELE9BQU87WUFDWCxDQUFDO1lBQ0QsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO2dCQUNkLE9BQU8sQ0FBQyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLHdCQUF3QixFQUFFLENBQUMsQ0FBQztnQkFDN0QsT0FBTztZQUNYLENBQUM7WUFFRCxjQUFjO1lBQ2QsTUFBTSxVQUFVLEdBQUcsTUFBQSxVQUFVLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSwwQ0FBRSxPQUFPLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxPQUFPLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQ3RGLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztnQkFDZCxPQUFPLENBQUMsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxxQkFBcUIsRUFBRSxDQUFDLENBQUM7Z0JBQzFELE9BQU87WUFDWCxDQUFDO1lBQ0QsbUJBQW1CO1lBQ25CLE1BQU0saUJBQWlCLEdBQUcsTUFBTSxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQzdELElBQUksaUJBQWlCLENBQUMsT0FBTyxLQUFJLE1BQUEsaUJBQWlCLENBQUMsSUFBSSwwQ0FBRSxVQUFVLENBQUEsRUFBRSxDQUFDO2dCQUNsRSxNQUFNLGNBQWMsR0FBRyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQVMsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksS0FBSyxVQUFVLENBQUMsQ0FBQztnQkFDdkcsSUFBSSxjQUFjLEVBQUUsQ0FBQztvQkFDakIsT0FBTyxDQUFDO3dCQUNKLE9BQU8sRUFBRSxJQUFJO3dCQUNiLE9BQU8sRUFBRSxXQUFXLFVBQVUsMEJBQTBCO3dCQUN4RCxJQUFJLEVBQUU7NEJBQ0YsUUFBUSxFQUFFLFFBQVE7NEJBQ2xCLGFBQWEsRUFBRSxVQUFVOzRCQUN6QixRQUFRLEVBQUUsSUFBSTt5QkFDakI7cUJBQ0osQ0FBQyxDQUFDO29CQUNILE9BQU87Z0JBQ1gsQ0FBQztZQUNMLENBQUM7WUFDRCxxQkFBcUI7WUFDckIsSUFBSSxDQUFDO2dCQUNELE1BQU0sTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLGtCQUFrQixFQUFFO29CQUN0RCxJQUFJLEVBQUUsUUFBUTtvQkFDZCxTQUFTLEVBQUUsVUFBVSxDQUFFLGVBQWU7aUJBQ3pDLENBQUMsQ0FBQztnQkFFSCxzQkFBc0I7Z0JBQ3RCLE1BQU0sSUFBSSxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBRXZELHVCQUF1QjtnQkFDdkIsTUFBTSxrQkFBa0IsR0FBRyxNQUFNLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBQzlELElBQUksa0JBQWtCLENBQUMsT0FBTyxLQUFJLE1BQUEsa0JBQWtCLENBQUMsSUFBSSwwQ0FBRSxVQUFVLENBQUEsRUFBRSxDQUFDO29CQUNwRSxNQUFNLFdBQVcsR0FBRyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQVMsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksS0FBSyxVQUFVLENBQUMsQ0FBQztvQkFDckcsSUFBSSxXQUFXLEVBQUUsQ0FBQzt3QkFDZCxPQUFPLENBQUM7NEJBQ0osT0FBTyxFQUFFLElBQUk7NEJBQ2IsT0FBTyxFQUFFLFdBQVcsVUFBVSx5QkFBeUI7NEJBQ3ZELElBQUksRUFBRTtnQ0FDRixRQUFRLEVBQUUsUUFBUTtnQ0FDbEIsYUFBYSxFQUFFLFVBQVU7Z0NBQ3pCLFFBQVEsRUFBRSxLQUFLOzZCQUNsQjt5QkFDSixDQUFDLENBQUM7b0JBQ1AsQ0FBQzt5QkFBTSxDQUFDO3dCQUNKLE9BQU8sQ0FBQzs0QkFDSixPQUFPLEVBQUUsS0FBSzs0QkFDZCxLQUFLLEVBQUUsV0FBVyxVQUFVLGlFQUFpRSxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQU0sRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRTt5QkFDdkssQ0FBQyxDQUFDO29CQUNQLENBQUM7Z0JBQ0wsQ0FBQztxQkFBTSxDQUFDO29CQUNKLE9BQU8sQ0FBQzt3QkFDSixPQUFPLEVBQUUsS0FBSzt3QkFDZCxLQUFLLEVBQUUscUNBQXFDLGtCQUFrQixDQUFDLEtBQUssSUFBSSwrQkFBK0IsRUFBRTtxQkFDNUcsQ0FBQyxDQUFDO2dCQUNQLENBQUM7WUFDTCxDQUFDO1lBQUMsT0FBTyxHQUFRLEVBQUUsQ0FBQztnQkFDaEIsY0FBYztnQkFDZCxPQUFPLENBQUMsSUFBSSxDQUFDLGtGQUFrRixHQUFHLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztnQkFDOUcsSUFBSSxDQUFDO29CQUNELE1BQU0sT0FBTyxHQUFHO3dCQUNaLElBQUksRUFBRSxrQkFBa0I7d0JBQ3hCLE1BQU0sRUFBRSxjQUFjO3dCQUN0QixJQUFJLEVBQUUsQ0FBQyxRQUFRLEVBQUUsVUFBVSxDQUFDO3FCQUMvQixDQUFDO29CQUNGLE1BQU0sTUFBTSxHQUFHLE1BQU0sTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE9BQU8sQ0FBQyxDQUFDO29CQUN0RixPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQ3BCLENBQUM7Z0JBQUMsT0FBTyxJQUFTLEVBQUUsQ0FBQztvQkFDakIsT0FBTyxDQUFDO3dCQUNKLE9BQU8sRUFBRSxLQUFLO3dCQUNkLEtBQUssRUFBRSw0QkFBNEIsVUFBVSxNQUFNLEdBQUcsQ0FBQyxPQUFPLEVBQUU7d0JBQ2hFLFdBQVcsRUFBRSxzS0FBc0s7cUJBQ3RMLENBQUMsQ0FBQztnQkFDUCxDQUFDO1lBQ0wsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVPLEtBQUssQ0FBQyxzQkFBc0IsQ0FBQyxXQUFtQixLQUFLO1FBQ3pELE1BQU0sbUJBQW1CLEdBQTZCO1lBQ2xELFFBQVEsRUFBRSxDQUFDLFdBQVcsRUFBRSxVQUFVLEVBQUUsYUFBYSxFQUFFLFNBQVMsRUFBRSxhQUFhLENBQUM7WUFDNUUsRUFBRSxFQUFFLENBQUMsV0FBVyxFQUFFLFdBQVcsRUFBRSxXQUFXLEVBQUUsZUFBZSxFQUFFLFlBQVksRUFBRSxnQkFBZ0IsQ0FBQztZQUM1RixPQUFPLEVBQUUsQ0FBQyxnQkFBZ0IsRUFBRSxrQkFBa0IsRUFBRSxxQkFBcUIsRUFBRSxzQkFBc0IsQ0FBQztZQUM5RixTQUFTLEVBQUUsQ0FBQyxjQUFjLEVBQUUsa0JBQWtCLEVBQUUsc0JBQXNCLENBQUM7WUFDdkUsS0FBSyxFQUFFLENBQUMsZ0JBQWdCLENBQUM7WUFDekIsTUFBTSxFQUFFLENBQUMsV0FBVyxFQUFFLFdBQVcsRUFBRSxhQUFhLEVBQUUsc0JBQXNCLENBQUM7WUFDekUsT0FBTyxFQUFFLENBQUMsaUJBQWlCLEVBQUUscUJBQXFCLENBQUM7WUFDbkQsTUFBTSxFQUFFLENBQUMsV0FBVyxDQUFDO1lBQ3JCLEtBQUssRUFBRSxDQUFDLFVBQVUsRUFBRSxxQkFBcUIsRUFBRSxlQUFlLEVBQUUsY0FBYyxDQUFDO1NBQzlFLENBQUM7UUFFRixJQUFJLFVBQVUsR0FBYSxFQUFFLENBQUM7UUFFOUIsSUFBSSxRQUFRLEtBQUssS0FBSyxFQUFFLENBQUM7WUFDckIsS0FBSyxNQUFNLEdBQUcsSUFBSSxtQkFBbUIsRUFBRSxDQUFDO2dCQUNwQyxVQUFVLEdBQUcsVUFBVSxDQUFDLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQzdELENBQUM7UUFDTCxDQUFDO2FBQU0sSUFBSSxtQkFBbUIsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDO1lBQ3ZDLFVBQVUsR0FBRyxtQkFBbUIsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUMvQyxDQUFDO1FBRUQsT0FBTztZQUNILE9BQU8sRUFBRSxJQUFJO1lBQ2IsSUFBSSxFQUFFO2dCQUNGLFFBQVEsRUFBRSxRQUFRO2dCQUNsQixVQUFVLEVBQUUsVUFBVTthQUN6QjtTQUNKLENBQUM7SUFDTixDQUFDO0lBRU8seUJBQXlCLENBQUMsUUFBYTtRQUMzQyxpQkFBaUI7UUFDakIsSUFBSSxPQUFPLFFBQVEsS0FBSyxRQUFRLElBQUksUUFBUSxLQUFLLElBQUksRUFBRSxDQUFDO1lBQ3BELE9BQU8sS0FBSyxDQUFDO1FBQ2pCLENBQUM7UUFFRCxJQUFJLENBQUM7WUFDRCxNQUFNLElBQUksR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBRW5DLDJDQUEyQztZQUMzQyxNQUFNLG1CQUFtQixHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUU7Z0JBQ3pDLE1BQU0sS0FBSyxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDNUIsT0FBTyxPQUFPLEtBQUssS0FBSyxRQUFRLElBQUksT0FBTyxLQUFLLEtBQUssUUFBUSxJQUFJLE9BQU8sS0FBSyxLQUFLLFNBQVMsQ0FBQztZQUNoRyxDQUFDLENBQUMsQ0FBQztZQUVILElBQUksbUJBQW1CLEVBQUUsQ0FBQztnQkFDdEIsT0FBTyxLQUFLLENBQUM7WUFDakIsQ0FBQztZQUVELDhCQUE4QjtZQUM5QixNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3RDLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDeEMsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUN0QyxNQUFNLGNBQWMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBQ3BELE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUM7WUFFOUMsK0JBQStCO1lBQy9CLE1BQU0saUJBQWlCLEdBQUcsQ0FBQyxPQUFPLElBQUksUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLElBQUksY0FBYyxJQUFJLFdBQVcsQ0FBQyxDQUFDO1lBRTlGLGdDQUFnQztZQUNoQyxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLElBQUksUUFBUSxDQUFDLE9BQU8sSUFBSSxPQUFPLFFBQVEsQ0FBQyxPQUFPLEtBQUssUUFBUSxFQUFFLENBQUM7Z0JBQ3ZGLE1BQU0sV0FBVyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUNsRCxJQUFJLFdBQVcsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLElBQUksT0FBTyxRQUFRLENBQUMsT0FBTyxDQUFDLEtBQUssS0FBSyxRQUFRLEVBQUUsQ0FBQztvQkFDOUUscUNBQXFDO29CQUNyQyxPQUFPLGlCQUFpQixDQUFDO2dCQUM3QixDQUFDO1lBQ0wsQ0FBQztZQUVELE9BQU8saUJBQWlCLENBQUM7UUFDN0IsQ0FBQztRQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7WUFDYixPQUFPLENBQUMsSUFBSSxDQUFDLGlFQUFpRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQ3ZGLE9BQU8sS0FBSyxDQUFDO1FBQ2pCLENBQUM7SUFDTCxDQUFDO0lBRU8sZUFBZSxDQUFDLFNBQWMsRUFBRSxZQUFvQjtRQUN4RCxrQkFBa0I7UUFDbEIsTUFBTSxtQkFBbUIsR0FBYSxFQUFFLENBQUM7UUFDekMsSUFBSSxhQUFhLEdBQVEsU0FBUyxDQUFDO1FBQ25DLElBQUksY0FBYyxHQUFHLEtBQUssQ0FBQztRQUUzQixjQUFjO1FBQ2QsWUFBWTtRQUNaLElBQUksTUFBTSxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxZQUFZLENBQUMsRUFBRSxDQUFDO1lBQ2hFLGFBQWEsR0FBRyxTQUFTLENBQUMsWUFBWSxDQUFDLENBQUM7WUFDeEMsY0FBYyxHQUFHLElBQUksQ0FBQztRQUMxQixDQUFDO1FBRUQsOEJBQThCO1FBQzlCLElBQUksQ0FBQyxjQUFjLElBQUksU0FBUyxDQUFDLFVBQVUsSUFBSSxPQUFPLFNBQVMsQ0FBQyxVQUFVLEtBQUssUUFBUSxFQUFFLENBQUM7WUFDdEYscURBQXFEO1lBQ3JELElBQUksU0FBUyxDQUFDLFVBQVUsQ0FBQyxLQUFLLElBQUksT0FBTyxTQUFTLENBQUMsVUFBVSxDQUFDLEtBQUssS0FBSyxRQUFRLEVBQUUsQ0FBQztnQkFDL0UsTUFBTSxRQUFRLEdBQUcsU0FBUyxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUM7Z0JBQzVDLEtBQUssTUFBTSxDQUFDLEdBQUcsRUFBRSxRQUFRLENBQUMsSUFBSSxNQUFNLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUM7b0JBQ3JELDJCQUEyQjtvQkFDM0IsMEJBQTBCO29CQUMxQixJQUFJLElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDO3dCQUMzQyxNQUFNLFFBQVEsR0FBRyxRQUFlLENBQUM7d0JBQ2pDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQzt3QkFDOUIsSUFBSSxHQUFHLEtBQUssWUFBWSxFQUFFLENBQUM7NEJBQ3ZCLGdDQUFnQzs0QkFDaEMsSUFBSSxDQUFDO2dDQUNELE1BQU0sUUFBUSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7Z0NBQ3ZDLGFBQWEsR0FBRyxRQUFRLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUM7NEJBQzNFLENBQUM7NEJBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztnQ0FDYixzQkFBc0I7Z0NBQ3RCLGFBQWEsR0FBRyxRQUFRLENBQUM7NEJBQzdCLENBQUM7NEJBQ0QsY0FBYyxHQUFHLElBQUksQ0FBQzt3QkFDMUIsQ0FBQztvQkFDTCxDQUFDO2dCQUNMLENBQUM7WUFDTCxDQUFDO2lCQUFNLENBQUM7Z0JBQ0osdUJBQXVCO2dCQUN2QixLQUFLLE1BQU0sQ0FBQyxHQUFHLEVBQUUsUUFBUSxDQUFDLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQztvQkFDakUsSUFBSSxJQUFJLENBQUMseUJBQXlCLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQzt3QkFDM0MsTUFBTSxRQUFRLEdBQUcsUUFBZSxDQUFDO3dCQUNqQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7d0JBQzlCLElBQUksR0FBRyxLQUFLLFlBQVksRUFBRSxDQUFDOzRCQUN2QixnQ0FBZ0M7NEJBQ2hDLElBQUksQ0FBQztnQ0FDRCxNQUFNLFFBQVEsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dDQUN2QyxhQUFhLEdBQUcsUUFBUSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDOzRCQUMzRSxDQUFDOzRCQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7Z0NBQ2Isc0JBQXNCO2dDQUN0QixhQUFhLEdBQUcsUUFBUSxDQUFDOzRCQUM3QixDQUFDOzRCQUNELGNBQWMsR0FBRyxJQUFJLENBQUM7d0JBQzFCLENBQUM7b0JBQ0wsQ0FBQztnQkFDTCxDQUFDO1lBQ0wsQ0FBQztRQUNMLENBQUM7UUFFRCxtQkFBbUI7UUFDbkIsSUFBSSxtQkFBbUIsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFLENBQUM7WUFDbkMsS0FBSyxNQUFNLEdBQUcsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUM7Z0JBQ3ZDLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxVQUFVLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLFNBQVMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDO29CQUMvSCxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ2xDLENBQUM7WUFDTCxDQUFDO1FBQ0wsQ0FBQztRQUVELElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztZQUNsQixPQUFPO2dCQUNILE1BQU0sRUFBRSxLQUFLO2dCQUNiLElBQUksRUFBRSxTQUFTO2dCQUNmLG1CQUFtQjtnQkFDbkIsYUFBYSxFQUFFLFNBQVM7YUFDM0IsQ0FBQztRQUNOLENBQUM7UUFFRCxJQUFJLElBQUksR0FBRyxTQUFTLENBQUM7UUFFckIsa0NBQWtDO1FBQ2xDLElBQUksYUFBYSxJQUFJLE9BQU8sYUFBYSxLQUFLLFFBQVEsSUFBSSxhQUFhLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDM0UsTUFBTSxZQUFZLEdBQUcsYUFBYSxDQUFDLElBQUksQ0FBQztZQUN4QyxPQUFPLENBQUMsR0FBRyxDQUFDLDBDQUEwQyxZQUFZLGlCQUFpQixZQUFZLEVBQUUsQ0FBQyxDQUFDO1lBRW5HLGdCQUFnQjtZQUNoQixJQUFJLFlBQVksS0FBSyxTQUFTLElBQUksWUFBWSxLQUFLLFdBQVcsRUFBRSxDQUFDO2dCQUM3RCxJQUFJLEdBQUcsWUFBWSxLQUFLLFdBQVcsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUM7Z0JBQzNELE9BQU87b0JBQ0gsTUFBTSxFQUFFLElBQUk7b0JBQ1osSUFBSTtvQkFDSixtQkFBbUI7b0JBQ25CLGFBQWEsRUFBRSxhQUFhLENBQUMsS0FBSyxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsYUFBYTtpQkFDekYsQ0FBQztZQUNOLENBQUM7aUJBQU0sSUFBSSxZQUFZLEtBQUssY0FBYyxJQUFJLFlBQVksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDO2dCQUNyRSxZQUFZLEtBQUssZ0JBQWdCLElBQUksWUFBWSxLQUFLLFVBQVU7Z0JBQ2hFLFlBQVksS0FBSyxXQUFXLElBQUksWUFBWSxLQUFLLFdBQVcsRUFBRSxDQUFDO2dCQUN0RSxTQUFTO2dCQUNULElBQUksR0FBRyxXQUFXLENBQUM7Z0JBQ25CLE9BQU87b0JBQ0gsTUFBTSxFQUFFLElBQUk7b0JBQ1osSUFBSTtvQkFDSixtQkFBbUI7b0JBQ25CLGFBQWEsRUFBRSxhQUFhLENBQUMsS0FBSyxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsYUFBYTtpQkFDekYsQ0FBQztZQUNOLENBQUM7aUJBQU0sSUFBSSxZQUFZLEtBQUssZ0JBQWdCLElBQUksWUFBWSxLQUFLLFdBQVc7Z0JBQ2pFLFlBQVksS0FBSyxhQUFhLElBQUksWUFBWSxLQUFLLFNBQVM7Z0JBQzVELFlBQVksS0FBSyxZQUFZLElBQUksWUFBWSxLQUFLLGNBQWMsRUFBRSxDQUFDO2dCQUMxRSxJQUFJLEdBQUcsT0FBTyxDQUFDO2dCQUNmLE9BQU87b0JBQ0gsTUFBTSxFQUFFLElBQUk7b0JBQ1osSUFBSTtvQkFDSixtQkFBbUI7b0JBQ25CLGFBQWEsRUFBRSxhQUFhLENBQUMsS0FBSyxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsYUFBYTtpQkFDekYsQ0FBQztZQUNOLENBQUM7aUJBQU0sSUFBSSxZQUFZLEtBQUssVUFBVSxFQUFFLENBQUM7Z0JBQ3JDLElBQUksR0FBRyxPQUFPLENBQUM7Z0JBQ2YsT0FBTztvQkFDSCxNQUFNLEVBQUUsSUFBSTtvQkFDWixJQUFJO29CQUNKLG1CQUFtQjtvQkFDbkIsYUFBYSxFQUFFLGFBQWEsQ0FBQyxLQUFLLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxhQUFhO2lCQUN6RixDQUFDO1lBQ04sQ0FBQztpQkFBTSxJQUFJLFlBQVksS0FBSyxTQUFTLEVBQUUsQ0FBQztnQkFDcEMsSUFBSSxHQUFHLE1BQU0sQ0FBQztnQkFDZCxPQUFPO29CQUNILE1BQU0sRUFBRSxJQUFJO29CQUNaLElBQUk7b0JBQ0osbUJBQW1CO29CQUNuQixhQUFhLEVBQUUsYUFBYSxDQUFDLEtBQUssS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLGFBQWE7aUJBQ3pGLENBQUM7WUFDTixDQUFDO2lCQUFNLElBQUksWUFBWSxLQUFLLFNBQVMsRUFBRSxDQUFDO2dCQUNwQyxJQUFJLEdBQUcsTUFBTSxDQUFDO2dCQUNkLE9BQU87b0JBQ0gsTUFBTSxFQUFFLElBQUk7b0JBQ1osSUFBSTtvQkFDSixtQkFBbUI7b0JBQ25CLGFBQWEsRUFBRSxhQUFhLENBQUMsS0FBSyxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsYUFBYTtpQkFDekYsQ0FBQztZQUNOLENBQUM7aUJBQU0sSUFBSSxZQUFZLEtBQUssU0FBUyxFQUFFLENBQUM7Z0JBQ3BDLElBQUksR0FBRyxNQUFNLENBQUM7Z0JBQ2QsT0FBTztvQkFDSCxNQUFNLEVBQUUsSUFBSTtvQkFDWixJQUFJO29CQUNKLG1CQUFtQjtvQkFDbkIsYUFBYSxFQUFFLGFBQWEsQ0FBQyxLQUFLLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxhQUFhO2lCQUN6RixDQUFDO1lBQ04sQ0FBQztpQkFBTSxJQUFJLFlBQVksS0FBSyxRQUFRLEVBQUUsQ0FBQztnQkFDbkMsSUFBSSxHQUFHLFFBQVEsQ0FBQztnQkFDaEIsT0FBTztvQkFDSCxNQUFNLEVBQUUsSUFBSTtvQkFDWixJQUFJO29CQUNKLG1CQUFtQjtvQkFDbkIsYUFBYSxFQUFFLGFBQWEsQ0FBQyxLQUFLLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxhQUFhO2lCQUN6RixDQUFDO1lBQ04sQ0FBQztpQkFBTSxJQUFJLFlBQVksS0FBSyxRQUFRLElBQUksWUFBWSxLQUFLLFNBQVMsSUFBSSxZQUFZLEtBQUssT0FBTyxFQUFFLENBQUM7Z0JBQzdGLElBQUksR0FBRyxRQUFRLENBQUM7Z0JBQ2hCLE9BQU87b0JBQ0gsTUFBTSxFQUFFLElBQUk7b0JBQ1osSUFBSTtvQkFDSixtQkFBbUI7b0JBQ25CLGFBQWEsRUFBRSxhQUFhLENBQUMsS0FBSyxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsYUFBYTtpQkFDekYsQ0FBQztZQUNOLENBQUM7aUJBQU0sSUFBSSxZQUFZLEtBQUssU0FBUyxFQUFFLENBQUM7Z0JBQ3BDLElBQUksR0FBRyxTQUFTLENBQUM7Z0JBQ2pCLE9BQU87b0JBQ0gsTUFBTSxFQUFFLElBQUk7b0JBQ1osSUFBSTtvQkFDSixtQkFBbUI7b0JBQ25CLGFBQWEsRUFBRSxhQUFhLENBQUMsS0FBSyxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsYUFBYTtpQkFDekYsQ0FBQztZQUNOLENBQUM7UUFDTCxDQUFDO1FBRUQsNkJBQTZCO1FBQzdCLE1BQU0sV0FBVyxHQUFHLENBQUMsYUFBYSxJQUFJLE9BQU8sYUFBYSxLQUFLLFFBQVEsSUFBSSxPQUFPLElBQUksYUFBYSxDQUFDO1lBQ2hHLENBQUMsQ0FBQyxhQUFhLENBQUMsS0FBSztZQUNyQixDQUFDLENBQUMsYUFBYSxDQUFDO1FBRXBCLFNBQVM7UUFDVCxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQztZQUM3QixTQUFTO1lBQ1QsSUFBSSxZQUFZLENBQUMsV0FBVyxFQUFFLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUM7Z0JBQzlDLElBQUksR0FBRyxXQUFXLENBQUM7WUFDdkIsQ0FBQztpQkFBTSxJQUFJLFlBQVksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQztnQkFDdEQsSUFBSSxHQUFHLFlBQVksQ0FBQztZQUN4QixDQUFDO2lCQUFNLENBQUM7Z0JBQ0osSUFBSSxHQUFHLE9BQU8sQ0FBQztZQUNuQixDQUFDO1FBQ0wsQ0FBQzthQUFNLElBQUksT0FBTyxXQUFXLEtBQUssUUFBUSxFQUFFLENBQUM7WUFDekMsZ0RBQWdEO1lBQ2hELElBQUksQ0FBQyxhQUFhLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsV0FBVyxFQUFFLENBQUMsRUFBRSxDQUFDO2dCQUN4RyxJQUFJLEdBQUcsT0FBTyxDQUFDO1lBQ25CLENBQUM7aUJBQU0sQ0FBQztnQkFDSixJQUFJLEdBQUcsUUFBUSxDQUFDO1lBQ3BCLENBQUM7UUFDTCxDQUFDO2FBQU0sSUFBSSxPQUFPLFdBQVcsS0FBSyxRQUFRLEVBQUUsQ0FBQztZQUN6QyxJQUFJLEdBQUcsUUFBUSxDQUFDO1FBQ3BCLENBQUM7YUFBTSxJQUFJLE9BQU8sV0FBVyxLQUFLLFNBQVMsRUFBRSxDQUFDO1lBQzFDLElBQUksR0FBRyxTQUFTLENBQUM7UUFDckIsQ0FBQzthQUFNLElBQUksV0FBVyxJQUFJLE9BQU8sV0FBVyxLQUFLLFFBQVEsRUFBRSxDQUFDO1lBQ3hELElBQUksQ0FBQztnQkFDRCxNQUFNLElBQUksR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO2dCQUN0QyxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUM7b0JBQ2pFLElBQUksR0FBRyxPQUFPLENBQUM7Z0JBQ25CLENBQUM7cUJBQU0sSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQztvQkFDbEQsSUFBSSxHQUFHLFdBQVcsQ0FBQyxDQUFDLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQztnQkFDekQsQ0FBQztxQkFBTSxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDO29CQUMzRCxJQUFJLEdBQUcsTUFBTSxDQUFDO2dCQUNsQixDQUFDO3FCQUFNLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUM7b0JBQzVELDhCQUE4QjtvQkFDOUIsSUFBSSxZQUFZLENBQUMsV0FBVyxFQUFFLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQzt3QkFDM0MsWUFBWSxDQUFDLFdBQVcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUM7d0JBQzdDLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQzt3QkFDMUIsSUFBSSxHQUFHLE1BQU0sQ0FBQztvQkFDbEIsQ0FBQzt5QkFBTSxDQUFDO3dCQUNKLElBQUksR0FBRyxPQUFPLENBQUM7b0JBQ25CLENBQUM7Z0JBQ0wsQ0FBQztxQkFBTSxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQztvQkFDakMsU0FBUztvQkFDVCxJQUFJLEdBQUcsTUFBTSxDQUFDO2dCQUNsQixDQUFDO3FCQUFNLENBQUM7b0JBQ0osSUFBSSxHQUFHLFFBQVEsQ0FBQztnQkFDcEIsQ0FBQztZQUNMLENBQUM7WUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO2dCQUNiLE9BQU8sQ0FBQyxJQUFJLENBQUMsdURBQXVELElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxDQUFDO2dCQUNuRyxJQUFJLEdBQUcsUUFBUSxDQUFDO1lBQ3BCLENBQUM7UUFDTCxDQUFDO2FBQU0sSUFBSSxXQUFXLEtBQUssSUFBSSxJQUFJLFdBQVcsS0FBSyxTQUFTLEVBQUUsQ0FBQztZQUMzRCxtRUFBbUU7WUFDbkUsSUFBSSxDQUFDLGFBQWEsRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsUUFBUSxDQUFDLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxFQUFFLENBQUM7Z0JBQ3hHLElBQUksR0FBRyxPQUFPLENBQUM7WUFDbkIsQ0FBQztpQkFBTSxJQUFJLFlBQVksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDO2dCQUM1QyxZQUFZLENBQUMsV0FBVyxFQUFFLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUM7Z0JBQ3RELElBQUksR0FBRyxNQUFNLENBQUM7WUFDbEIsQ0FBQztpQkFBTSxJQUFJLFlBQVksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQztnQkFDMUQsSUFBSSxHQUFHLFdBQVcsQ0FBQztZQUN2QixDQUFDO2lCQUFNLENBQUM7Z0JBQ0osSUFBSSxHQUFHLFNBQVMsQ0FBQztZQUNyQixDQUFDO1FBQ0wsQ0FBQztRQUVELE9BQU87WUFDSCxNQUFNLEVBQUUsSUFBSTtZQUNaLElBQUk7WUFDSixtQkFBbUI7WUFDbkIsYUFBYSxFQUFFLFdBQVc7U0FDN0IsQ0FBQztJQUNOLENBQUM7SUFFTyxpQkFBaUIsQ0FBQyxVQUFlLEVBQUUsWUFBaUI7UUFDeEQsTUFBTSxFQUFFLElBQUksRUFBRSxhQUFhLEVBQUUsR0FBRyxZQUFZLENBQUM7UUFFN0MsT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQ0FBa0MsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsYUFBYSxJQUFJLEVBQUUsQ0FBQyxDQUFDO1FBRTdGLFFBQVEsSUFBSSxFQUFFLENBQUM7WUFDWCxLQUFLLFFBQVE7Z0JBQ1QsT0FBTyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7WUFFOUIsS0FBSyxRQUFRO2dCQUNULE9BQU8sTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBRTlCLEtBQUssU0FBUztnQkFDVixJQUFJLE9BQU8sVUFBVSxLQUFLLFNBQVM7b0JBQUUsT0FBTyxVQUFVLENBQUM7Z0JBQ3ZELElBQUksT0FBTyxVQUFVLEtBQUssUUFBUSxFQUFFLENBQUM7b0JBQ2pDLE9BQU8sVUFBVSxDQUFDLFdBQVcsRUFBRSxLQUFLLE1BQU0sSUFBSSxVQUFVLEtBQUssR0FBRyxDQUFDO2dCQUNyRSxDQUFDO2dCQUNELE9BQU8sT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBRS9CLEtBQUssT0FBTztnQkFDUixtQkFBbUI7Z0JBQ25CLElBQUksT0FBTyxVQUFVLEtBQUssUUFBUSxFQUFFLENBQUM7b0JBQ2pDLCtCQUErQjtvQkFDL0IsT0FBTyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsVUFBVSxDQUFDLENBQUM7Z0JBQzdDLENBQUM7cUJBQU0sSUFBSSxPQUFPLFVBQVUsS0FBSyxRQUFRLElBQUksVUFBVSxLQUFLLElBQUksRUFBRSxDQUFDO29CQUMvRCxJQUFJLENBQUM7d0JBQ0QsTUFBTSxTQUFTLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQzt3QkFDMUMsa0JBQWtCO3dCQUNsQixJQUFJLFNBQVMsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLElBQUksU0FBUyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSxTQUFTLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUM7NEJBQ2hGLE9BQU87Z0NBQ0gsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7Z0NBQ3hELENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dDQUN4RCxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQ0FDeEQsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxDQUFDLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRzs2QkFDekYsQ0FBQzt3QkFDTixDQUFDO29CQUNMLENBQUM7b0JBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQzt3QkFDYixPQUFPLENBQUMsSUFBSSxDQUFDLDZDQUE2QyxJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQztvQkFDNUYsQ0FBQztnQkFDTCxDQUFDO2dCQUNELHNCQUFzQjtnQkFDdEIsSUFBSSxhQUFhLElBQUksT0FBTyxhQUFhLEtBQUssUUFBUSxFQUFFLENBQUM7b0JBQ3JELElBQUksQ0FBQzt3QkFDRCxNQUFNLFNBQVMsR0FBRyxPQUFPLFVBQVUsS0FBSyxRQUFRLElBQUksVUFBVSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7d0JBQzlGLE9BQU87NEJBQ0gsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDOzRCQUN4RyxDQUFDLEVBQUUsU0FBUyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUM7NEJBQ3hHLENBQUMsRUFBRSxTQUFTLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQzs0QkFDeEcsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDO3lCQUMzRyxDQUFDO29CQUNOLENBQUM7b0JBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQzt3QkFDYixPQUFPLENBQUMsSUFBSSxDQUFDLG1FQUFtRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO29CQUM3RixDQUFDO2dCQUNMLENBQUM7Z0JBQ0QsU0FBUztnQkFDVCxPQUFPLENBQUMsSUFBSSxDQUFDLG9FQUFvRSxJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFDL0csT0FBTyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQztZQUU5QyxLQUFLLE1BQU07Z0JBQ1AsSUFBSSxPQUFPLFVBQVUsS0FBSyxRQUFRLElBQUksVUFBVSxLQUFLLElBQUksRUFBRSxDQUFDO29CQUN4RCxPQUFPO3dCQUNILENBQUMsRUFBRSxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxJQUFJLGFBQWEsQ0FBQyxDQUFDLElBQUksQ0FBQzt3QkFDL0MsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLElBQUksYUFBYSxDQUFDLENBQUMsSUFBSSxDQUFDO3FCQUNsRCxDQUFDO2dCQUNOLENBQUM7Z0JBQ0QsT0FBTyxhQUFhLENBQUM7WUFFekIsS0FBSyxNQUFNO2dCQUNQLElBQUksT0FBTyxVQUFVLEtBQUssUUFBUSxJQUFJLFVBQVUsS0FBSyxJQUFJLEVBQUUsQ0FBQztvQkFDeEQsT0FBTzt3QkFDSCxDQUFDLEVBQUUsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsSUFBSSxhQUFhLENBQUMsQ0FBQyxJQUFJLENBQUM7d0JBQy9DLENBQUMsRUFBRSxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxJQUFJLGFBQWEsQ0FBQyxDQUFDLElBQUksQ0FBQzt3QkFDL0MsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLElBQUksYUFBYSxDQUFDLENBQUMsSUFBSSxDQUFDO3FCQUNsRCxDQUFDO2dCQUNOLENBQUM7Z0JBQ0QsT0FBTyxhQUFhLENBQUM7WUFFekIsS0FBSyxNQUFNO2dCQUNQLElBQUksT0FBTyxVQUFVLEtBQUssUUFBUSxJQUFJLFVBQVUsS0FBSyxJQUFJLEVBQUUsQ0FBQztvQkFDeEQsT0FBTzt3QkFDSCxLQUFLLEVBQUUsTUFBTSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsSUFBSSxhQUFhLENBQUMsS0FBSyxJQUFJLEdBQUc7d0JBQzdELE1BQU0sRUFBRSxNQUFNLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxJQUFJLGFBQWEsQ0FBQyxNQUFNLElBQUksR0FBRztxQkFDbkUsQ0FBQztnQkFDTixDQUFDO2dCQUNELE9BQU8sYUFBYSxDQUFDO1lBRXpCLEtBQUssTUFBTTtnQkFDUCxJQUFJLE9BQU8sVUFBVSxLQUFLLFFBQVEsRUFBRSxDQUFDO29CQUNqQyxhQUFhO29CQUNiLE9BQU8sVUFBVSxDQUFDO2dCQUN0QixDQUFDO3FCQUFNLElBQUksT0FBTyxVQUFVLEtBQUssUUFBUSxJQUFJLFVBQVUsS0FBSyxJQUFJLEVBQUUsQ0FBQztvQkFDL0Qsd0JBQXdCO29CQUN4QixPQUFPLFVBQVUsQ0FBQyxJQUFJLElBQUksVUFBVSxDQUFDO2dCQUN6QyxDQUFDO2dCQUNELE9BQU8sYUFBYSxDQUFDO1lBRXpCLEtBQUssT0FBTztnQkFDUixJQUFJLE9BQU8sVUFBVSxLQUFLLFFBQVEsRUFBRSxDQUFDO29CQUNqQyx3QkFBd0I7b0JBQ3hCLE9BQU8sRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLENBQUM7Z0JBQ2hDLENBQUM7cUJBQU0sSUFBSSxPQUFPLFVBQVUsS0FBSyxRQUFRLElBQUksVUFBVSxLQUFLLElBQUksRUFBRSxDQUFDO29CQUMvRCxPQUFPLFVBQVUsQ0FBQztnQkFDdEIsQ0FBQztnQkFDRCxPQUFPLGFBQWEsQ0FBQztZQUV6QjtnQkFDSSxrQkFBa0I7Z0JBQ2xCLElBQUksT0FBTyxVQUFVLEtBQUssT0FBTyxhQUFhLEVBQUUsQ0FBQztvQkFDN0MsT0FBTyxVQUFVLENBQUM7Z0JBQ3RCLENBQUM7Z0JBQ0QsT0FBTyxhQUFhLENBQUM7UUFDN0IsQ0FBQztJQUNMLENBQUM7SUFFVyxnQkFBZ0IsQ0FBQyxRQUFnQjtRQUN6QyxNQUFNLEdBQUcsR0FBRyxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUM7UUFFNUIsZ0NBQWdDO1FBQ2hDLElBQUksR0FBRyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDO1lBQ3RCLElBQUksR0FBRyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLFVBQVU7Z0JBQzlCLE1BQU0sQ0FBQyxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztnQkFDNUMsTUFBTSxDQUFDLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO2dCQUM1QyxNQUFNLENBQUMsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7Z0JBQzVDLE9BQU8sRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUM7WUFDL0IsQ0FBQztpQkFBTSxJQUFJLEdBQUcsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxZQUFZO2dCQUN2QyxNQUFNLENBQUMsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7Z0JBQzVDLE1BQU0sQ0FBQyxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztnQkFDNUMsTUFBTSxDQUFDLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO2dCQUM1QyxNQUFNLENBQUMsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7Z0JBQzVDLE9BQU8sRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQztZQUMxQixDQUFDO1FBQ0wsQ0FBQztRQUVELHVCQUF1QjtRQUN2QixNQUFNLElBQUksS0FBSyxDQUFDLDBCQUEwQixRQUFRLDBFQUEwRSxDQUFDLENBQUM7SUFDbEksQ0FBQztJQUVPLEtBQUssQ0FBQyxvQkFBb0IsQ0FBQyxRQUFnQixFQUFFLGFBQXFCLEVBQUUsUUFBZ0IsRUFBRSxhQUFrQixFQUFFLGFBQWtCOztRQUNoSSxPQUFPLENBQUMsR0FBRyxDQUFDLG9EQUFvRCxhQUFhLElBQUksUUFBUSxFQUFFLENBQUMsQ0FBQztRQUM3RixPQUFPLENBQUMsR0FBRyxDQUFDLHdDQUF3QyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztRQUNyRixPQUFPLENBQUMsR0FBRyxDQUFDLHdDQUF3QyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztRQUVyRixJQUFJLENBQUM7WUFDRCxlQUFlO1lBQ2YsT0FBTyxDQUFDLEdBQUcsQ0FBQyxvREFBb0QsQ0FBQyxDQUFDO1lBQ2xFLE1BQU0sYUFBYSxHQUFHLE1BQU0sSUFBSSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsRUFBRSxhQUFhLENBQUMsQ0FBQztZQUMzRSxPQUFPLENBQUMsR0FBRyxDQUFDLGtEQUFrRCxFQUFFLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUV2RixNQUFNLGFBQWEsR0FBRyxNQUFNLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDekQsT0FBTyxDQUFDLEdBQUcsQ0FBQywrQ0FBK0MsRUFBRSxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUM7WUFFcEYsSUFBSSxhQUFhLENBQUMsT0FBTyxJQUFJLGFBQWEsQ0FBQyxJQUFJLEVBQUUsQ0FBQztnQkFDOUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyx5RUFBeUUsUUFBUSxHQUFHLENBQUMsQ0FBQztnQkFDbEcsTUFBTSxnQkFBZ0IsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsVUFBVSxJQUFJLEVBQUUsQ0FBQyxDQUFDO2dCQUMxRSxPQUFPLENBQUMsR0FBRyxDQUFDLDhDQUE4QyxFQUFFLGdCQUFnQixDQUFDLENBQUM7Z0JBQzlFLE1BQU0sWUFBWSxHQUFHLE1BQUEsYUFBYSxDQUFDLElBQUksQ0FBQyxVQUFVLDBDQUFHLFFBQVEsQ0FBQyxDQUFDO2dCQUMvRCxPQUFPLENBQUMsR0FBRyxDQUFDLGlEQUFpRCxRQUFRLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7Z0JBRXpHLGNBQWM7Z0JBQ2QsSUFBSSxXQUFXLEdBQUcsWUFBWSxDQUFDO2dCQUMvQixPQUFPLENBQUMsR0FBRyxDQUFDLDZDQUE2QyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztnQkFFeEYsSUFBSSxZQUFZLElBQUksT0FBTyxZQUFZLEtBQUssUUFBUSxJQUFJLE9BQU8sSUFBSSxZQUFZLEVBQUUsQ0FBQztvQkFDOUUsV0FBVyxHQUFHLFlBQVksQ0FBQyxLQUFLLENBQUM7b0JBQ2pDLE9BQU8sQ0FBQyxHQUFHLENBQUMsMkRBQTJELEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO2dCQUMxRyxDQUFDO3FCQUFNLENBQUM7b0JBQ0osT0FBTyxDQUFDLEdBQUcsQ0FBQyxpRUFBaUUsQ0FBQyxDQUFDO2dCQUNuRixDQUFDO2dCQUVELHNCQUFzQjtnQkFDdEIsSUFBSSxRQUFRLEdBQUcsS0FBSyxDQUFDO2dCQUVyQixJQUFJLE9BQU8sYUFBYSxLQUFLLFFBQVEsSUFBSSxhQUFhLEtBQUssSUFBSSxJQUFJLE1BQU0sSUFBSSxhQUFhLEVBQUUsQ0FBQztvQkFDekYsMEJBQTBCO29CQUMxQixNQUFNLFVBQVUsR0FBRyxXQUFXLElBQUksT0FBTyxXQUFXLEtBQUssUUFBUSxJQUFJLE1BQU0sSUFBSSxXQUFXLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztvQkFDbkgsTUFBTSxZQUFZLEdBQUcsYUFBYSxDQUFDLElBQUksSUFBSSxFQUFFLENBQUM7b0JBQzlDLFFBQVEsR0FBRyxVQUFVLEtBQUssWUFBWSxJQUFJLFlBQVksS0FBSyxFQUFFLENBQUM7b0JBRTlELE9BQU8sQ0FBQyxHQUFHLENBQUMsOENBQThDLENBQUMsQ0FBQztvQkFDNUQsT0FBTyxDQUFDLEdBQUcsQ0FBQyx1QkFBdUIsWUFBWSxHQUFHLENBQUMsQ0FBQztvQkFDcEQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxxQkFBcUIsVUFBVSxHQUFHLENBQUMsQ0FBQztvQkFDaEQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsVUFBVSxLQUFLLFlBQVksRUFBRSxDQUFDLENBQUM7b0JBQzlELE9BQU8sQ0FBQyxHQUFHLENBQUMsdUJBQXVCLFlBQVksS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO29CQUMxRCxPQUFPLENBQUMsR0FBRyxDQUFDLHVCQUF1QixRQUFRLEVBQUUsQ0FBQyxDQUFDO2dCQUNuRCxDQUFDO3FCQUFNLENBQUM7b0JBQ0osZUFBZTtvQkFDZixPQUFPLENBQUMsR0FBRyxDQUFDLDBDQUEwQyxDQUFDLENBQUM7b0JBQ3hELE9BQU8sQ0FBQyxHQUFHLENBQUMsc0JBQXNCLE9BQU8sYUFBYSxFQUFFLENBQUMsQ0FBQztvQkFDMUQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsT0FBTyxXQUFXLEVBQUUsQ0FBQyxDQUFDO29CQUV0RCxJQUFJLE9BQU8sV0FBVyxLQUFLLE9BQU8sYUFBYSxFQUFFLENBQUM7d0JBQzlDLElBQUksT0FBTyxXQUFXLEtBQUssUUFBUSxJQUFJLFdBQVcsS0FBSyxJQUFJLElBQUksYUFBYSxLQUFLLElBQUksRUFBRSxDQUFDOzRCQUNwRixZQUFZOzRCQUNaLFFBQVEsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxLQUFLLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLENBQUM7NEJBQ3pFLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUNBQWlDLFFBQVEsRUFBRSxDQUFDLENBQUM7d0JBQzdELENBQUM7NkJBQU0sQ0FBQzs0QkFDSixZQUFZOzRCQUNaLFFBQVEsR0FBRyxXQUFXLEtBQUssYUFBYSxDQUFDOzRCQUN6QyxPQUFPLENBQUMsR0FBRyxDQUFDLDBCQUEwQixRQUFRLEVBQUUsQ0FBQyxDQUFDO3dCQUN0RCxDQUFDO29CQUNMLENBQUM7eUJBQU0sQ0FBQzt3QkFDSix1QkFBdUI7d0JBQ3ZCLE1BQU0sV0FBVyxHQUFHLE1BQU0sQ0FBQyxXQUFXLENBQUMsS0FBSyxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUM7d0JBQ2xFLE1BQU0sV0FBVyxHQUFHLE1BQU0sQ0FBQyxXQUFXLENBQUMsS0FBSyxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUM7d0JBQ2xFLFFBQVEsR0FBRyxXQUFXLElBQUksV0FBVyxDQUFDO3dCQUN0QyxPQUFPLENBQUMsR0FBRyxDQUFDLHFCQUFxQixXQUFXLEVBQUUsQ0FBQyxDQUFDO3dCQUNoRCxPQUFPLENBQUMsR0FBRyxDQUFDLHFCQUFxQixXQUFXLEVBQUUsQ0FBQyxDQUFDO3dCQUNoRCxPQUFPLENBQUMsR0FBRyxDQUFDLCtCQUErQixRQUFRLEVBQUUsQ0FBQyxDQUFDO29CQUMzRCxDQUFDO2dCQUNMLENBQUM7Z0JBRUQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxxREFBcUQsUUFBUSxFQUFFLENBQUMsQ0FBQztnQkFDN0UsT0FBTyxDQUFDLEdBQUcsQ0FBQywyQ0FBMkMsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7Z0JBRXRGLE1BQU0sTUFBTSxHQUFHO29CQUNYLFFBQVE7b0JBQ1IsV0FBVztvQkFDWCxRQUFRLEVBQUU7d0JBQ04sdUJBQXVCO3dCQUN2QixnQkFBZ0IsRUFBRTs0QkFDZCxJQUFJLEVBQUUsUUFBUTs0QkFDZCxNQUFNLEVBQUUsYUFBYTs0QkFDckIsUUFBUSxFQUFFLGFBQWE7NEJBQ3ZCLE1BQU0sRUFBRSxXQUFXOzRCQUNuQixRQUFROzRCQUNSLGdCQUFnQixFQUFFLFlBQVksQ0FBQyxjQUFjO3lCQUNoRDt3QkFDRCxVQUFVO3dCQUNWLGdCQUFnQixFQUFFOzRCQUNkLFFBQVE7NEJBQ1IsYUFBYTs0QkFDYixlQUFlLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFBLE1BQUEsYUFBYSxDQUFDLElBQUksMENBQUUsVUFBVSxLQUFJLEVBQUUsQ0FBQyxDQUFDLE1BQU07eUJBQzVFO3FCQUNKO2lCQUNKLENBQUM7Z0JBRUYsT0FBTyxDQUFDLEdBQUcsQ0FBQywwQ0FBMEMsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDekYsT0FBTyxNQUFNLENBQUM7WUFDbEIsQ0FBQztpQkFBTSxDQUFDO2dCQUNKLE9BQU8sQ0FBQyxHQUFHLENBQUMseURBQXlELEVBQUUsYUFBYSxDQUFDLENBQUM7WUFDMUYsQ0FBQztRQUNMLENBQUM7UUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1lBQ2IsT0FBTyxDQUFDLEtBQUssQ0FBQyx3REFBd0QsRUFBRSxLQUFLLENBQUMsQ0FBQztZQUMvRSxPQUFPLENBQUMsS0FBSyxDQUFDLHFDQUFxQyxFQUFFLEtBQUssWUFBWSxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLENBQUM7UUFDbEgsQ0FBQztRQUVELE9BQU8sQ0FBQyxHQUFHLENBQUMsa0RBQWtELENBQUMsQ0FBQztRQUNoRSxPQUFPO1lBQ0gsUUFBUSxFQUFFLEtBQUs7WUFDZixXQUFXLEVBQUUsU0FBUztZQUN0QixRQUFRLEVBQUUsSUFBSTtTQUNqQixDQUFDO0lBQ04sQ0FBQztJQUVEOztPQUVHO0lBQ0ssS0FBSyxDQUFDLDhCQUE4QixDQUFDLElBQVM7UUFDbEQsTUFBTSxFQUFFLFFBQVEsRUFBRSxhQUFhLEVBQUUsUUFBUSxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQUUsR0FBRyxJQUFJLENBQUM7UUFFeEUsc0NBQXNDO1FBQ3RDLE1BQU0sbUJBQW1CLEdBQUc7WUFDeEIsTUFBTSxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxVQUFVLEVBQUUsV0FBVztTQUMzRSxDQUFDO1FBRUYsdUNBQXVDO1FBQ3ZDLE1BQU0sdUJBQXVCLEdBQUc7WUFDNUIsVUFBVSxFQUFFLFVBQVUsRUFBRSxPQUFPLEVBQUUsYUFBYSxFQUFFLE9BQU87U0FDMUQsQ0FBQztRQUVGLDZEQUE2RDtRQUM3RCxJQUFJLGFBQWEsS0FBSyxTQUFTLElBQUksYUFBYSxLQUFLLE1BQU0sRUFBRSxDQUFDO1lBQzFELElBQUksbUJBQW1CLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUM7Z0JBQ3pDLE9BQU87b0JBQ0gsT0FBTyxFQUFFLEtBQUs7b0JBQ1EsS0FBSyxFQUFFLGFBQWEsUUFBUSxzREFBc0Q7b0JBQ3RHLFdBQVcsRUFBRSx1RkFBdUYsUUFBUSxnQkFBZ0IsUUFBUSxZQUFZLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLEdBQUc7aUJBQzNLLENBQUM7WUFDTixDQUFDO2lCQUFNLElBQUksdUJBQXVCLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUM7Z0JBQ3BELE9BQU87b0JBQ0gsT0FBTyxFQUFFLEtBQUs7b0JBQ2QsS0FBSyxFQUFFLGFBQWEsUUFBUSwwREFBMEQ7b0JBQ3RGLFdBQVcsRUFBRSw4RkFBOEYsUUFBUSxNQUFNLFFBQVEsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxHQUFHO2lCQUNoSyxDQUFDO1lBQ04sQ0FBQztRQUNMLENBQUM7UUFFRCxnQ0FBZ0M7UUFDaEMsSUFBSSxtQkFBbUIsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLElBQUksdUJBQXVCLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUM7WUFDdkYsTUFBTSxVQUFVLEdBQUcsdUJBQXVCLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsbUJBQW1CLENBQUM7WUFDM0csT0FBTztnQkFDSCxPQUFPLEVBQUUsS0FBSztnQkFDZCxLQUFLLEVBQUUsYUFBYSxRQUFRLGdEQUFnRDtnQkFDNUUsV0FBVyxFQUFFLGFBQWEsUUFBUSx5QkFBeUIsVUFBVSxvREFBb0QsVUFBVSxVQUFVLFFBQVEsTUFBTSx1QkFBdUIsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsYUFBYSxRQUFRLEdBQUcsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxHQUFHO2FBQzFRLENBQUM7UUFDTixDQUFDO1FBRUQsT0FBTyxJQUFJLENBQUMsQ0FBQyxnQkFBZ0I7SUFDakMsQ0FBQztJQUVEOztPQUVHO0lBQ0ssMkJBQTJCLENBQUMsYUFBcUIsRUFBRSxjQUF3QixFQUFFLFFBQWdCO1FBQ2pHLE9BQU87UUFDUCxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7WUFDakIsT0FBTyx5RkFBeUYsQ0FBQztRQUNyRyxDQUFDO1FBRUQsSUFBSSxDQUFDLGNBQWMsSUFBSSxjQUFjLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRSxDQUFDO1lBQ2pELE9BQU8sbURBQW1ELENBQUM7UUFDL0QsQ0FBQztRQUVELGdCQUFnQjtRQUNoQixNQUFNLFlBQVksR0FBRyxjQUFjLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQzlDLElBQUksSUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUNoRSxhQUFhLENBQUMsV0FBVyxFQUFFLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FDdkUsQ0FBQztRQUVGLElBQUksV0FBVyxHQUFHLEVBQUUsQ0FBQztRQUVyQixJQUFJLFlBQVksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUM7WUFDMUIsV0FBVyxJQUFJLG9DQUFvQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUM7WUFDN0UsV0FBVyxJQUFJLGtEQUFrRCxZQUFZLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQztRQUNuRyxDQUFDO1FBRUQsdURBQXVEO1FBQ3ZELE1BQU0sc0JBQXNCLEdBQTZCO1lBQ3JELFFBQVEsRUFBRSxDQUFDLFVBQVUsRUFBRSxhQUFhLEVBQUUsWUFBWSxDQUFDO1lBQ25ELE1BQU0sRUFBRSxDQUFDLFVBQVUsRUFBRSxhQUFhLENBQUM7WUFDbkMsVUFBVSxFQUFFLENBQUMsVUFBVSxFQUFFLGFBQWEsQ0FBQztZQUN2QyxhQUFhLEVBQUUsQ0FBQyxXQUFXLENBQUM7WUFDNUIsT0FBTyxFQUFFLENBQUMsVUFBVSxFQUFFLFdBQVcsRUFBRSxhQUFhLENBQUM7WUFDakQsYUFBYSxFQUFFLENBQUMsV0FBVyxDQUFDO1lBQzVCLGNBQWMsRUFBRSxDQUFDLFdBQVcsQ0FBQztZQUM3QixRQUFRLEVBQUUsQ0FBQyxXQUFXLENBQUM7WUFDdkIsYUFBYSxFQUFFLENBQUMsZ0JBQWdCLENBQUM7WUFDakMsYUFBYSxFQUFFLENBQUMsZ0JBQWdCLENBQUM7U0FDcEMsQ0FBQztRQUVGLE1BQU0scUJBQXFCLEdBQUcsc0JBQXNCLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ3JFLE1BQU0sb0JBQW9CLEdBQUcscUJBQXFCLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBRWpHLElBQUksb0JBQW9CLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRSxDQUFDO1lBQ2xDLFdBQVcsSUFBSSw2QkFBNkIsUUFBUSw4QkFBOEIsb0JBQW9CLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUM7UUFDeEgsQ0FBQztRQUVELGdDQUFnQztRQUNoQyxXQUFXLElBQUksMkJBQTJCLENBQUM7UUFDM0MsV0FBVyxJQUFJLHFDQUFxQyxhQUFhLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsVUFBVSx1Q0FBdUMsQ0FBQztRQUMxSixXQUFXLElBQUkseUZBQXlGLGFBQWEsSUFBSSxDQUFDO1FBQzFILFdBQVcsSUFBSSxzRUFBc0UsQ0FBQztRQUU5RSxPQUFPLFdBQVcsQ0FBQztJQUNqQyxDQUFDO0lBRUQ7O09BRUc7SUFDSyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsUUFBZ0IsRUFBRSxhQUFxQixFQUFFLFFBQWdCO1FBQ3BGLElBQUksQ0FBQztZQUNELE1BQU0sV0FBVyxHQUFHLE1BQU0sTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLFlBQVksRUFBRSxRQUFRLENBQUMsQ0FBQztZQUNsRixJQUFJLENBQUMsV0FBVyxJQUFJLENBQUMsV0FBVyxDQUFDLFNBQVMsRUFBRSxDQUFDO2dCQUN6QyxPQUFPLElBQUksQ0FBQztZQUNoQixDQUFDO1lBRUQsT0FBTztZQUNQLE1BQU0sU0FBUyxHQUFHLFdBQVcsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBUyxFQUFFLEVBQUU7Z0JBQ3ZELE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLEdBQUcsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDO2dCQUN4RCxPQUFPLFFBQVEsS0FBSyxhQUFhLENBQUM7WUFDdEMsQ0FBQyxDQUFDLENBQUM7WUFFSCxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7Z0JBQ2IsT0FBTyxJQUFJLENBQUM7WUFDaEIsQ0FBQztZQUVELFFBQVE7WUFDUixNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsMEJBQTBCLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDOUQsTUFBTSxZQUFZLEdBQUcsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBRTFDLElBQUksWUFBWSxJQUFJLE9BQU8sWUFBWSxLQUFLLFFBQVEsSUFBSSxPQUFPLElBQUksWUFBWSxFQUFFLENBQUM7Z0JBQzlFLE9BQU8sWUFBWSxDQUFDLEtBQUssQ0FBQztZQUM5QixDQUFDO2lCQUFNLENBQUM7Z0JBQ0osT0FBTyxZQUFZLENBQUM7WUFDeEIsQ0FBQztRQUNMLENBQUM7UUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1lBQ2IsT0FBTyxDQUFDLEtBQUssQ0FBQywyQkFBMkIsRUFBRSxLQUFLLENBQUMsQ0FBQztZQUNsRCxPQUFPLElBQUksQ0FBQztRQUNoQixDQUFDO0lBQ0wsQ0FBQztJQUVEOztPQUVHO0lBQ0ssS0FBSyxDQUFDLHdCQUF3QixDQUFDLElBQVM7O1FBQzVDLE1BQU0sRUFBRSxRQUFRLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQUUsU0FBUyxFQUFFLFdBQVcsRUFBRSxXQUFXLEVBQUUsTUFBTSxHQUFHLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQztRQUUvRyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDWixPQUFPLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsc0JBQXNCLEVBQUUsQ0FBQztRQUM3RCxDQUFDO1FBRUQsSUFBSSxDQUFDO1lBQ0QsVUFBVTtZQUNWLE1BQU0sVUFBVSxHQUFHLE1BQU0sSUFBSSxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUN2RCxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sSUFBSSxDQUFDLENBQUEsTUFBQSxVQUFVLENBQUMsSUFBSSwwQ0FBRSxRQUFRLENBQUEsRUFBRSxDQUFDO2dCQUNwRCxPQUFPO29CQUNILE9BQU8sRUFBRSxLQUFLO29CQUNkLEtBQUssRUFBRSxTQUFTLFFBQVEsZ0JBQWdCLFVBQVUsQ0FBQyxLQUFLLEVBQUU7aUJBQzdELENBQUM7WUFDTixDQUFDO1lBRUQsTUFBTSxRQUFRLEdBQUcsVUFBVSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUM7WUFFMUMsMkJBQTJCO1lBQzNCLE1BQU0sZ0JBQWdCLEdBQUcsTUFBTSxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQzVELElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLElBQUksQ0FBQyxDQUFBLE1BQUEsZ0JBQWdCLENBQUMsSUFBSSwwQ0FBRSxVQUFVLENBQUEsRUFBRSxDQUFDO2dCQUNsRSxPQUFPO29CQUNILE9BQU8sRUFBRSxLQUFLO29CQUNkLEtBQUssRUFBRSxzQ0FBc0MsUUFBUSxNQUFNLGdCQUFnQixDQUFDLEtBQUssRUFBRTtpQkFDdEYsQ0FBQztZQUNOLENBQUM7WUFFRCxnREFBZ0Q7WUFDaEQsTUFBTSxlQUFlLEdBQUcsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQ3pELENBQUMsSUFBUyxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLGFBQWE7Z0JBQzVCLENBQUMsSUFBSSxDQUFDLFVBQVUsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FDeEQsR0FBRyxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsSUFBSSxHQUFHLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLENBQ25GLENBQUMsQ0FDbkIsQ0FBQztZQUVGLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztnQkFDbkIsT0FBTztvQkFDSCxPQUFPLEVBQUUsS0FBSztvQkFDZCxLQUFLLEVBQUUsNENBQTRDLFFBQVEsNEJBQTRCLGdCQUFnQixDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBTSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFO2lCQUMvSixDQUFDO1lBQ04sQ0FBQztZQUVELE9BQU8sQ0FBQyxHQUFHLENBQUMsK0NBQStDLFFBQVEsMEJBQTBCLENBQUMsQ0FBQztZQUUvRixVQUFVO1lBQ1YsTUFBTSxlQUFlLEdBQWtFLEVBQUUsQ0FBQztZQUUxRixJQUFJLFNBQVMsS0FBSyxTQUFTLEVBQUUsQ0FBQztnQkFDMUIsZUFBZSxDQUFDLElBQUksQ0FBQyxFQUFFLFFBQVEsRUFBRSxXQUFXLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRSxZQUFZLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQztZQUM3RixDQUFDO1lBQ0QsSUFBSSxNQUFNLEtBQUssU0FBUyxFQUFFLENBQUM7Z0JBQ3ZCLGVBQWUsQ0FBQyxJQUFJLENBQUMsRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsWUFBWSxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUM7WUFDeEYsQ0FBQztZQUNELElBQUksWUFBWSxLQUFLLFNBQVMsRUFBRSxDQUFDO2dCQUM3QixlQUFlLENBQUMsSUFBSSxDQUFDLEVBQUUsUUFBUSxFQUFFLGNBQWMsRUFBRSxLQUFLLEVBQUUsWUFBWSxFQUFFLFlBQVksRUFBRSxTQUFTLEVBQUUsQ0FBQyxDQUFDO1lBQ3JHLENBQUM7WUFDRCxJQUFJLFNBQVMsS0FBSyxTQUFTLEVBQUUsQ0FBQztnQkFDMUIsZUFBZSxDQUFDLElBQUksQ0FBQyxFQUFFLFFBQVEsRUFBRSxXQUFXLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRSxZQUFZLEVBQUUsU0FBUyxFQUFFLENBQUMsQ0FBQztZQUMvRixDQUFDO1lBQ0QsSUFBSSxXQUFXLEtBQUssU0FBUyxFQUFFLENBQUM7Z0JBQzVCLGVBQWUsQ0FBQyxJQUFJLENBQUMsRUFBRSxRQUFRLEVBQUUsYUFBYSxFQUFFLEtBQUssRUFBRSxXQUFXLEVBQUUsWUFBWSxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUM7WUFDbEcsQ0FBQztZQUNELElBQUksV0FBVyxLQUFLLFNBQVMsRUFBRSxDQUFDO2dCQUM1QixlQUFlLENBQUMsSUFBSSxDQUFDLEVBQUUsUUFBUSxFQUFFLGFBQWEsRUFBRSxLQUFLLEVBQUUsV0FBVyxFQUFFLFlBQVksRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDO1lBQ2pHLENBQUM7WUFFRCxJQUFJLGVBQWUsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFLENBQUM7Z0JBQy9CLE9BQU87b0JBQ0gsT0FBTyxFQUFFLEtBQUs7b0JBQ2QsS0FBSyxFQUFFLHFIQUFxSDtpQkFDL0gsQ0FBQztZQUNOLENBQUM7WUFFRCxZQUFZO1lBQ1osTUFBTSxTQUFTLEdBQUcsTUFBTSxJQUFJLENBQUMsc0JBQXNCLENBQUM7Z0JBQ2hELFFBQVE7Z0JBQ1IsYUFBYSxFQUFFLGVBQWUsQ0FBQyxJQUFJO2dCQUNuQyxVQUFVLEVBQUUsZUFBZTthQUM5QixDQUFDLENBQUM7WUFFSCxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxDQUFDO2dCQUNyQixPQUFPLFNBQVMsQ0FBQztZQUNyQixDQUFDO1lBRUQsc0JBQXNCO1lBQ3RCLElBQUksTUFBTSxFQUFFLENBQUM7Z0JBQ1QsSUFBSSxDQUFDO29CQUNELE1BQU0sTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLDBCQUEwQixFQUFFO3dCQUM5RCxJQUFJLEVBQUUsUUFBUTt3QkFDZCxLQUFLLEVBQUUsZUFBZSxDQUFDLElBQUk7d0JBQzNCLE1BQU0sRUFBRSxRQUFRO3dCQUNoQixJQUFJLEVBQUUsRUFBRTtxQkFDWCxDQUFDLENBQUM7b0JBQ0gsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpREFBaUQsQ0FBQyxDQUFDO2dCQUNuRSxDQUFDO2dCQUFDLE9BQU8sR0FBUSxFQUFFLENBQUM7b0JBQ2hCLE9BQU8sQ0FBQyxJQUFJLENBQUMsNkNBQTZDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO2dCQUM3RSxDQUFDO1lBQ0wsQ0FBQztZQUVELE9BQU87Z0JBQ0gsT0FBTyxFQUFFLElBQUk7Z0JBQ2IsT0FBTyxFQUFFLG9EQUFvRCxRQUFRLEdBQUc7Z0JBQ3hFLElBQUksRUFBRTtvQkFDRixRQUFRO29CQUNSLFFBQVE7b0JBQ1IsYUFBYSxFQUFFLGVBQWUsQ0FBQyxJQUFJO29CQUNuQyxhQUFhLEVBQUUsZUFBZSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUM7b0JBQ25ELFlBQVksRUFBRSxNQUFNO2lCQUN2QjthQUNKLENBQUM7UUFFTixDQUFDO1FBQUMsT0FBTyxLQUFVLEVBQUUsQ0FBQztZQUNsQixPQUFPLENBQUMsS0FBSyxDQUFDLGtEQUFrRCxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQ3pFLE9BQU87Z0JBQ0gsT0FBTyxFQUFFLEtBQUs7Z0JBQ2QsS0FBSyxFQUFFLHlDQUF5QyxLQUFLLENBQUMsT0FBTyxFQUFFO2FBQ2xFLENBQUM7UUFDTixDQUFDO0lBQ0wsQ0FBQztJQUVEOztPQUVHO0lBQ0ssS0FBSyxDQUFDLGNBQWMsQ0FBQyxJQUFZO1FBQ3JDLE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsRUFBRTtZQUMzQixNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsUUFBYSxFQUFFLEVBQUU7Z0JBQy9FLElBQUksUUFBUSxFQUFFLENBQUM7b0JBQ1gsT0FBTyxDQUFDO3dCQUNKLE9BQU8sRUFBRSxJQUFJO3dCQUNiLElBQUksRUFBRSxFQUFFLFFBQVEsRUFBRTtxQkFDckIsQ0FBQyxDQUFDO2dCQUNQLENBQUM7cUJBQU0sQ0FBQztvQkFDSixPQUFPLENBQUMsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxTQUFTLElBQUksYUFBYSxFQUFFLENBQUMsQ0FBQztnQkFDbkUsQ0FBQztZQUNMLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQVUsRUFBRSxFQUFFO2dCQUNwQixPQUFPLENBQUMsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSx3QkFBd0IsR0FBRyxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUMsQ0FBQztZQUM5RSxDQUFDLENBQUMsQ0FBQztRQUNQLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztDQUNKO0FBcndFRCx3Q0Fxd0VDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgVG9vbERlZmluaXRpb24sIFRvb2xSZXNwb25zZSwgVG9vbEV4ZWN1dG9yLCBDb21wb25lbnRJbmZvIH0gZnJvbSAnLi4vdHlwZXMnO1xyXG5cclxuZXhwb3J0IGNsYXNzIENvbXBvbmVudFRvb2xzIGltcGxlbWVudHMgVG9vbEV4ZWN1dG9yIHtcclxuICAgIGdldFRvb2xzKCk6IFRvb2xEZWZpbml0aW9uW10ge1xyXG4gICAgICAgIHJldHVybiBbXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIG5hbWU6ICdhZGRfY29tcG9uZW50JyxcclxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnQWRkIGEgY29tcG9uZW50IHRvIGEgc3BlY2lmaWMgbm9kZS4gSU1QT1JUQU5UOiBZb3UgbXVzdCBwcm92aWRlIHRoZSBub2RlVXVpZCBwYXJhbWV0ZXIgdG8gc3BlY2lmeSB3aGljaCBub2RlIHRvIGFkZCB0aGUgY29tcG9uZW50IHRvLicsXHJcbiAgICAgICAgICAgICAgICBpbnB1dFNjaGVtYToge1xyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdvYmplY3QnLFxyXG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbm9kZVV1aWQ6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246ICdUYXJnZXQgbm9kZSBVVUlELiBSRVFVSVJFRDogWW91IG11c3Qgc3BlY2lmeSB0aGUgZXhhY3Qgbm9kZSB0byBhZGQgdGhlIGNvbXBvbmVudCB0by4gVXNlIGdldF9hbGxfbm9kZXMgb3IgZmluZF9ub2RlX2J5X25hbWUgdG8gZ2V0IHRoZSBVVUlEIG9mIHRoZSBkZXNpcmVkIG5vZGUuJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb21wb25lbnRUeXBlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnc3RyaW5nJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnQ29tcG9uZW50IHR5cGUgKGUuZy4sIGNjLlNwcml0ZSwgY2MuTGFiZWwsIGNjLkJ1dHRvbiknXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHJlcXVpcmVkOiBbJ25vZGVVdWlkJywgJ2NvbXBvbmVudFR5cGUnXVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiAncmVtb3ZlX2NvbXBvbmVudCcsXHJcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogJ1JlbW92ZSBhIGNvbXBvbmVudCBmcm9tIGEgbm9kZS4gY29tcG9uZW50VHlwZSBtdXN0IGJlIHRoZSBjb21wb25lbnRcXCdzIGNsYXNzSWQgKGNpZCwgaS5lLiB0aGUgdHlwZSBmaWVsZCBmcm9tIGdldENvbXBvbmVudHMpLCBub3QgdGhlIHNjcmlwdCBuYW1lIG9yIGNsYXNzIG5hbWUuIFVzZSBnZXRDb21wb25lbnRzIHRvIGdldCB0aGUgY29ycmVjdCBjaWQuJyxcclxuICAgICAgICAgICAgICAgIGlucHV0U2NoZW1hOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ29iamVjdCcsXHJcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBub2RlVXVpZDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3N0cmluZycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogJ05vZGUgVVVJRCdcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50VHlwZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3N0cmluZycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogJ0NvbXBvbmVudCBjaWQgKHR5cGUgZmllbGQgZnJvbSBnZXRDb21wb25lbnRzKS4gRG8gTk9UIHVzZSBzY3JpcHQgbmFtZSBvciBjbGFzcyBuYW1lLiBFeGFtcGxlOiBcImNjLlNwcml0ZVwiIG9yIFwiOWI0YTd1ZVQ5eEQ2YVJFK0FsT3VzeTFcIidcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgcmVxdWlyZWQ6IFsnbm9kZVV1aWQnLCAnY29tcG9uZW50VHlwZSddXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIG5hbWU6ICdnZXRfY29tcG9uZW50cycsXHJcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogJ0dldCBhbGwgY29tcG9uZW50cyBvZiBhIG5vZGUnLFxyXG4gICAgICAgICAgICAgICAgaW5wdXRTY2hlbWE6IHtcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnb2JqZWN0JyxcclxuICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vZGVVdWlkOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnc3RyaW5nJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnTm9kZSBVVUlEJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICByZXF1aXJlZDogWydub2RlVXVpZCddXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIG5hbWU6ICdnZXRfY29tcG9uZW50X2luZm8nLFxyXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246ICdHZXQgc3BlY2lmaWMgY29tcG9uZW50IGluZm9ybWF0aW9uJyxcclxuICAgICAgICAgICAgICAgIGlucHV0U2NoZW1hOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ29iamVjdCcsXHJcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBub2RlVXVpZDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3N0cmluZycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogJ05vZGUgVVVJRCdcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50VHlwZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3N0cmluZycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogJ0NvbXBvbmVudCB0eXBlIHRvIGdldCBpbmZvIGZvcidcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgcmVxdWlyZWQ6IFsnbm9kZVV1aWQnLCAnY29tcG9uZW50VHlwZSddXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIG5hbWU6ICdzZXRfY29tcG9uZW50X3Byb3BlcnR5JyxcclxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnU2V0IGNvbXBvbmVudCBwcm9wZXJ0eSB2YWx1ZXMgZm9yIFVJIGNvbXBvbmVudHMgb3IgY3VzdG9tIHNjcmlwdCBjb21wb25lbnRzLiBTdXBwb3J0cyBzZXR0aW5nIHByb3BlcnRpZXMgb2YgYnVpbHQtaW4gVUkgY29tcG9uZW50cyAoZS5nLiwgY2MuTGFiZWwsIGNjLlNwcml0ZSkgYW5kIGN1c3RvbSBzY3JpcHQgY29tcG9uZW50cy4gTm90ZTogRm9yIG5vZGUgYmFzaWMgcHJvcGVydGllcyAobmFtZSwgYWN0aXZlLCBsYXllciwgZXRjLiksIHVzZSBzZXRfbm9kZV9wcm9wZXJ0eS4gRm9yIG5vZGUgdHJhbnNmb3JtIHByb3BlcnRpZXMgKHBvc2l0aW9uLCByb3RhdGlvbiwgc2NhbGUsIGV0Yy4pLCB1c2Ugc2V0X25vZGVfdHJhbnNmb3JtLicsXHJcbiAgICAgICAgICAgICAgICBpbnB1dFNjaGVtYToge1xyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdvYmplY3QnLFxyXG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbm9kZVV1aWQ6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246ICdUYXJnZXQgbm9kZSBVVUlEIC0gTXVzdCBzcGVjaWZ5IHRoZSBub2RlIHRvIG9wZXJhdGUgb24nXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudFR5cGU6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246ICdDb21wb25lbnQgdHlwZSAtIENhbiBiZSBidWlsdC1pbiBjb21wb25lbnRzIChlLmcuLCBjYy5MYWJlbCkgb3IgY3VzdG9tIHNjcmlwdCBjb21wb25lbnRzIChlLmcuLCBNeVNjcmlwdCkuIElmIHVuc3VyZSBhYm91dCBjb21wb25lbnQgdHlwZSwgdXNlIGdldF9jb21wb25lbnRzIGZpcnN0IHRvIHJldHJpZXZlIGFsbCBjb21wb25lbnRzIG9uIHRoZSBub2RlLicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDnp7vpmaRlbnVt6ZmQ5Yi277yM5YWB6K645Lu75oSP57uE5Lu257G75Z6L5YyF5ous6Ieq5a6a5LmJ6ISa5pysXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb3BlcnR5OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnc3RyaW5nJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnUHJvcGVydHkgbmFtZSAtIFRoZSBwcm9wZXJ0eSB0byBzZXQuIENvbW1vbiBwcm9wZXJ0aWVzIGluY2x1ZGU6XFxuJyArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ+KAoiBjYy5MYWJlbDogc3RyaW5nICh0ZXh0IGNvbnRlbnQpLCBmb250U2l6ZSAoZm9udCBzaXplKSwgY29sb3IgKHRleHQgY29sb3IpXFxuJyArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ+KAoiBjYy5TcHJpdGU6IHNwcml0ZUZyYW1lIChzcHJpdGUgZnJhbWUpLCBjb2xvciAodGludCBjb2xvciksIHNpemVNb2RlIChzaXplIG1vZGUpXFxuJyArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ+KAoiBjYy5CdXR0b246IG5vcm1hbENvbG9yIChub3JtYWwgY29sb3IpLCBwcmVzc2VkQ29sb3IgKHByZXNzZWQgY29sb3IpLCB0YXJnZXQgKHRhcmdldCBub2RlKVxcbicgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICfigKIgY2MuVUlUcmFuc2Zvcm06IGNvbnRlbnRTaXplIChjb250ZW50IHNpemUpLCBhbmNob3JQb2ludCAoYW5jaG9yIHBvaW50KVxcbicgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICfigKIgQ3VzdG9tIFNjcmlwdHM6IEJhc2VkIG9uIHByb3BlcnRpZXMgZGVmaW5lZCBpbiB0aGUgc2NyaXB0J1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0eVR5cGU6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246ICdQcm9wZXJ0eSB0eXBlIC0gTXVzdCBleHBsaWNpdGx5IHNwZWNpZnkgdGhlIHByb3BlcnR5IGRhdGEgdHlwZSBmb3IgY29ycmVjdCB2YWx1ZSBjb252ZXJzaW9uIGFuZCB2YWxpZGF0aW9uJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVudW06IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnc3RyaW5nJywgJ251bWJlcicsICdib29sZWFuJywgJ2ludGVnZXInLCAnZmxvYXQnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdjb2xvcicsICd2ZWMyJywgJ3ZlYzMnLCAnc2l6ZScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ25vZGUnLCAnY29tcG9uZW50JywgJ3Nwcml0ZUZyYW1lJywgJ3ByZWZhYicsICdhc3NldCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ25vZGVBcnJheScsICdjb2xvckFycmF5JywgJ251bWJlckFycmF5JywgJ3N0cmluZ0FycmF5J1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnUHJvcGVydHkgdmFsdWUgLSBVc2UgdGhlIGNvcnJlc3BvbmRpbmcgZGF0YSBmb3JtYXQgYmFzZWQgb24gcHJvcGVydHlUeXBlOlxcblxcbicgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICfwn5OdIEJhc2ljIERhdGEgVHlwZXM6XFxuJyArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ+KAoiBzdHJpbmc6IFwiSGVsbG8gV29ybGRcIiAodGV4dCBzdHJpbmcpXFxuJyArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ+KAoiBudW1iZXIvaW50ZWdlci9mbG9hdDogNDIgb3IgMy4xNCAobnVtZXJpYyB2YWx1ZSlcXG4nICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAn4oCiIGJvb2xlYW46IHRydWUgb3IgZmFsc2UgKGJvb2xlYW4gdmFsdWUpXFxuXFxuJyArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ/CfjqggQ29sb3IgVHlwZTpcXG4nICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAn4oCiIGNvbG9yOiB7XCJyXCI6MjU1LFwiZ1wiOjAsXCJiXCI6MCxcImFcIjoyNTV9IChSR0JBIHZhbHVlcywgcmFuZ2UgMC0yNTUpXFxuJyArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJyAgLSBBbHRlcm5hdGl2ZTogXCIjRkYwMDAwXCIgKGhleGFkZWNpbWFsIGZvcm1hdClcXG4nICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnICAtIFRyYW5zcGFyZW5jeTogYSB2YWx1ZSBjb250cm9scyBvcGFjaXR5LCAyNTUgPSBmdWxseSBvcGFxdWUsIDAgPSBmdWxseSB0cmFuc3BhcmVudFxcblxcbicgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICfwn5OQIFZlY3RvciBhbmQgU2l6ZSBUeXBlczpcXG4nICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAn4oCiIHZlYzI6IHtcInhcIjoxMDAsXCJ5XCI6NTB9ICgyRCB2ZWN0b3IpXFxuJyArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ+KAoiB2ZWMzOiB7XCJ4XCI6MSxcInlcIjoyLFwielwiOjN9ICgzRCB2ZWN0b3IpXFxuJyArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ+KAoiBzaXplOiB7XCJ3aWR0aFwiOjEwMCxcImhlaWdodFwiOjUwfSAoc2l6ZSBkaW1lbnNpb25zKVxcblxcbicgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICfwn5SXIFJlZmVyZW5jZSBUeXBlcyAodXNpbmcgVVVJRCBzdHJpbmdzKTpcXG4nICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAn4oCiIG5vZGU6IFwidGFyZ2V0LW5vZGUtdXVpZFwiIChub2RlIHJlZmVyZW5jZSlcXG4nICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnICBIb3cgdG8gZ2V0OiBVc2UgZ2V0X2FsbF9ub2RlcyBvciBmaW5kX25vZGVfYnlfbmFtZSB0byBnZXQgbm9kZSBVVUlEc1xcbicgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICfigKIgY29tcG9uZW50OiBcInRhcmdldC1ub2RlLXV1aWRcIiAoY29tcG9uZW50IHJlZmVyZW5jZSlcXG4nICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnICBIb3cgaXQgd29ya3M6IFxcbicgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICcgICAgMS4gUHJvdmlkZSB0aGUgVVVJRCBvZiB0aGUgTk9ERSB0aGF0IGNvbnRhaW5zIHRoZSB0YXJnZXQgY29tcG9uZW50XFxuJyArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJyAgICAyLiBTeXN0ZW0gYXV0by1kZXRlY3RzIHJlcXVpcmVkIGNvbXBvbmVudCB0eXBlIGZyb20gcHJvcGVydHkgbWV0YWRhdGFcXG4nICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnICAgIDMuIEZpbmRzIHRoZSBjb21wb25lbnQgb24gdGFyZ2V0IG5vZGUgYW5kIGdldHMgaXRzIHNjZW5lIF9faWRfX1xcbicgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICcgICAgNC4gU2V0cyByZWZlcmVuY2UgdXNpbmcgdGhlIHNjZW5lIF9faWRfXyAobm90IG5vZGUgVVVJRClcXG4nICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnICBFeGFtcGxlOiB2YWx1ZT1cImxhYmVsLW5vZGUtdXVpZFwiIHdpbGwgZmluZCBjYy5MYWJlbCBhbmQgdXNlIGl0cyBzY2VuZSBJRFxcbicgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICfigKIgc3ByaXRlRnJhbWU6IFwic3ByaXRlZnJhbWUtdXVpZFwiIChzcHJpdGUgZnJhbWUgYXNzZXQpXFxuJyArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJyAgSG93IHRvIGdldDogQ2hlY2sgYXNzZXQgZGF0YWJhc2Ugb3IgdXNlIGFzc2V0IGJyb3dzZXJcXG4nICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAn4oCiIHByZWZhYjogXCJwcmVmYWItdXVpZFwiIChwcmVmYWIgYXNzZXQpXFxuJyArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJyAgSG93IHRvIGdldDogQ2hlY2sgYXNzZXQgZGF0YWJhc2Ugb3IgdXNlIGFzc2V0IGJyb3dzZXJcXG4nICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAn4oCiIGFzc2V0OiBcImFzc2V0LXV1aWRcIiAoZ2VuZXJpYyBhc3NldCByZWZlcmVuY2UpXFxuJyArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJyAgSG93IHRvIGdldDogQ2hlY2sgYXNzZXQgZGF0YWJhc2Ugb3IgdXNlIGFzc2V0IGJyb3dzZXJcXG5cXG4nICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAn8J+TiyBBcnJheSBUeXBlczpcXG4nICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAn4oCiIG5vZGVBcnJheTogW1widXVpZDFcIixcInV1aWQyXCJdIChhcnJheSBvZiBub2RlIFVVSURzKVxcbicgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICfigKIgY29sb3JBcnJheTogW3tcInJcIjoyNTUsXCJnXCI6MCxcImJcIjowLFwiYVwiOjI1NX1dIChhcnJheSBvZiBjb2xvcnMpXFxuJyArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ+KAoiBudW1iZXJBcnJheTogWzEsMiwzLDQsNV0gKGFycmF5IG9mIG51bWJlcnMpXFxuJyArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ+KAoiBzdHJpbmdBcnJheTogW1wiaXRlbTFcIixcIml0ZW0yXCJdIChhcnJheSBvZiBzdHJpbmdzKSdcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgcmVxdWlyZWQ6IFsnbm9kZVV1aWQnLCAnY29tcG9uZW50VHlwZScsICdwcm9wZXJ0eScsICdwcm9wZXJ0eVR5cGUnLCAndmFsdWUnXVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiAnc2V0X2NvbXBvbmVudF9wcm9wZXJ0aWVzJyxcclxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnU2V0IG11bHRpcGxlIHByb3BlcnRpZXMgb24gYSBjb21wb25lbnQgYXQgb25jZSAoYmF0Y2ggb3BlcmF0aW9uKScsXHJcbiAgICAgICAgICAgICAgICBpbnB1dFNjaGVtYToge1xyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdvYmplY3QnLFxyXG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbm9kZVV1aWQ6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246ICdOb2RlIFVVSUQnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudFR5cGU6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246ICdDb21wb25lbnQgdHlwZSAoZS5nLiwgXCJjYy5MYWJlbFwiLCBcImNjLlNwcml0ZVwiKSdcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2FycmF5JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnQXJyYXkgb2YgcHJvcGVydHkgc2V0dGluZ3MgdG8gYXBwbHknLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbXM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnb2JqZWN0JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3BlcnR5OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnc3RyaW5nJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnUHJvcGVydHkgbmFtZSdcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvcGVydHlUeXBlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnc3RyaW5nJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnUHJvcGVydHkgdHlwZSAtIE11c3QgZXhwbGljaXRseSBzcGVjaWZ5IHRoZSBwcm9wZXJ0eSBkYXRhIHR5cGUnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW51bTogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdzdHJpbmcnLCAnbnVtYmVyJywgJ2Jvb2xlYW4nLCAnaW50ZWdlcicsICdmbG9hdCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2NvbG9yJywgJ3ZlYzInLCAndmVjMycsICdzaXplJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnbm9kZScsICdjb21wb25lbnQnLCAnc3ByaXRlRnJhbWUnLCAncHJlZmFiJywgJ2Fzc2V0JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnbm9kZUFycmF5JywgJ2NvbG9yQXJyYXknLCAnbnVtYmVyQXJyYXknLCAnc3RyaW5nQXJyYXknXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogJ1Byb3BlcnR5IHZhbHVlIC0gU2FtZSBmb3JtYXQgYXMgc2V0X2NvbXBvbmVudF9wcm9wZXJ0eSdcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVxdWlyZWQ6IFsncHJvcGVydHknLCAndmFsdWUnXVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICByZXF1aXJlZDogWydub2RlVXVpZCcsICdjb21wb25lbnRUeXBlJywgJ3Byb3BlcnRpZXMnXVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiAnYXR0YWNoX3NjcmlwdCcsXHJcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogJ0F0dGFjaCBhIHNjcmlwdCBjb21wb25lbnQgdG8gYSBub2RlJyxcclxuICAgICAgICAgICAgICAgIGlucHV0U2NoZW1hOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ29iamVjdCcsXHJcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBub2RlVXVpZDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3N0cmluZycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogJ05vZGUgVVVJRCdcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2NyaXB0UGF0aDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3N0cmluZycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogJ1NjcmlwdCBhc3NldCBwYXRoIChlLmcuLCBkYjovL2Fzc2V0cy9zY3JpcHRzL015U2NyaXB0LnRzKSdcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgcmVxdWlyZWQ6IFsnbm9kZVV1aWQnLCAnc2NyaXB0UGF0aCddXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIG5hbWU6ICdnZXRfYXZhaWxhYmxlX2NvbXBvbmVudHMnLFxyXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246ICdHZXQgbGlzdCBvZiBhdmFpbGFibGUgY29tcG9uZW50IHR5cGVzJyxcclxuICAgICAgICAgICAgICAgIGlucHV0U2NoZW1hOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ29iamVjdCcsXHJcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXRlZ29yeToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3N0cmluZycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogJ0NvbXBvbmVudCBjYXRlZ29yeSBmaWx0ZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZW51bTogWydhbGwnLCAncmVuZGVyZXInLCAndWknLCAncGh5c2ljcycsICdhbmltYXRpb24nLCAnYXVkaW8nXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6ICdhbGwnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIG5hbWU6ICdzZXRfc2hhcGVkcmF3ZXJfcHJvcGVydGllcycsXHJcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogJ1NldCBTaGFwZURyYXdlciBjb21wb25lbnQgcHJvcGVydGllcyBieSBub2RlIG5hbWUuIFRoaXMgaXMgYSBjb252ZW5pZW50IHRvb2wgdG8gY29uZmlndXJlIFNoYXBlRHJhd2VyIGNvbXBvbmVudHMgb24gc3BlY2lmaWMgbm9kZXMuJyxcclxuICAgICAgICAgICAgICAgIGlucHV0U2NoZW1hOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ29iamVjdCcsXHJcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBub2RlTmFtZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3N0cmluZycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogJ05vZGUgbmFtZSB0byBmaW5kIHRoZSBTaGFwZURyYXdlciBjb21wb25lbnQgKGUuZy4sIFwiSGludEJ1dHRvblwiLCBcIkNvbXBsZXRlQnV0dG9uXCIpJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWxsQ29sb3I6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246ICdGaWxsIGNvbG9yIGluIGhleCBmb3JtYXQgKGUuZy4sIFwiI0Y2RUNEQlwiLCBcIiNCOTc4MkRcIiknXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJhZGl1czoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ251bWJlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogJ0JvcmRlciByYWRpdXMgKDAgZm9yIHNoYXJwIGNvcm5lcnMpJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbmFibGVTdHJva2U6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdib29sZWFuJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnRW5hYmxlIHN0cm9rZS9ib3JkZXInXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNoYXBlVHlwZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2ludGVnZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246ICdTaGFwZSB0eXBlOiAwPVJFQ1RBTkdMRSwgMT1ST1VOREVEX1JFQ1QsIDI9Q0lSQ0xFJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVudW06IFswLCAxLCAyXVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdHJva2VXaWR0aDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ251bWJlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogJ1N0cm9rZSB3aWR0aCAob25seSB1c2VkIHdoZW4gZW5hYmxlU3Ryb2tlIGlzIHRydWUpJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdHJva2VDb2xvcjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3N0cmluZycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogJ1N0cm9rZSBjb2xvciBpbiBoZXggZm9ybWF0IChlLmcuLCBcIiMwMDAwMDBcIiknXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlZHJhdzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246ICdXaGV0aGVyIHRvIGNhbGwgcmVkcmF3KCkgYWZ0ZXIgc2V0dGluZyBwcm9wZXJ0aWVzIChkZWZhdWx0OiB0cnVlKScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OiB0cnVlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHJlcXVpcmVkOiBbJ25vZGVOYW1lJ11cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIF07XHJcbiAgICB9XHJcblxyXG4gICAgYXN5bmMgZXhlY3V0ZSh0b29sTmFtZTogc3RyaW5nLCBhcmdzOiBhbnkpOiBQcm9taXNlPFRvb2xSZXNwb25zZT4ge1xyXG4gICAgICAgIHN3aXRjaCAodG9vbE5hbWUpIHtcclxuICAgICAgICAgICAgY2FzZSAnYWRkX2NvbXBvbmVudCc6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5hZGRDb21wb25lbnQoYXJncy5ub2RlVXVpZCwgYXJncy5jb21wb25lbnRUeXBlKTtcclxuICAgICAgICAgICAgY2FzZSAncmVtb3ZlX2NvbXBvbmVudCc6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5yZW1vdmVDb21wb25lbnQoYXJncy5ub2RlVXVpZCwgYXJncy5jb21wb25lbnRUeXBlKTtcclxuICAgICAgICAgICAgY2FzZSAnZ2V0X2NvbXBvbmVudHMnOlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuZ2V0Q29tcG9uZW50cyhhcmdzLm5vZGVVdWlkKTtcclxuICAgICAgICAgICAgY2FzZSAnZ2V0X2NvbXBvbmVudF9pbmZvJzpcclxuICAgICAgICAgICAgICAgIHJldHVybiBhd2FpdCB0aGlzLmdldENvbXBvbmVudEluZm8oYXJncy5ub2RlVXVpZCwgYXJncy5jb21wb25lbnRUeXBlKTtcclxuICAgICAgICAgICAgY2FzZSAnc2V0X2NvbXBvbmVudF9wcm9wZXJ0eSc6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5zZXRDb21wb25lbnRQcm9wZXJ0eShhcmdzKTtcclxuICAgICAgICAgICAgY2FzZSAnc2V0X2NvbXBvbmVudF9wcm9wZXJ0aWVzJzpcclxuICAgICAgICAgICAgICAgIHJldHVybiBhd2FpdCB0aGlzLnNldENvbXBvbmVudFByb3BlcnRpZXMoYXJncyk7XHJcbiAgICAgICAgICAgIGNhc2UgJ2F0dGFjaF9zY3JpcHQnOlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuYXR0YWNoU2NyaXB0KGFyZ3Mubm9kZVV1aWQsIGFyZ3Muc2NyaXB0UGF0aCk7XHJcbiAgICAgICAgICAgIGNhc2UgJ2dldF9hdmFpbGFibGVfY29tcG9uZW50cyc6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5nZXRBdmFpbGFibGVDb21wb25lbnRzKGFyZ3MuY2F0ZWdvcnkpO1xyXG4gICAgICAgICAgICBjYXNlICdzZXRfc2hhcGVkcmF3ZXJfcHJvcGVydGllcyc6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5zZXRTaGFwZURyYXdlclByb3BlcnRpZXMoYXJncyk7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFVua25vd24gdG9vbDogJHt0b29sTmFtZX1gKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBhc3luYyBhZGRDb21wb25lbnQobm9kZVV1aWQ6IHN0cmluZywgY29tcG9uZW50VHlwZTogc3RyaW5nKTogUHJvbWlzZTxUb29sUmVzcG9uc2U+IHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHJlc29sdmUpID0+IHtcclxuICAgICAgICAgICAgLy8g5YWI5p+l5om+6IqC54K55LiK5piv5ZCm5bey5a2Y5Zyo6K+l57uE5Lu2XHJcbiAgICAgICAgICAgIGNvbnN0IGFsbENvbXBvbmVudHNJbmZvID0gYXdhaXQgdGhpcy5nZXRDb21wb25lbnRzKG5vZGVVdWlkKTtcclxuICAgICAgICAgICAgaWYgKGFsbENvbXBvbmVudHNJbmZvLnN1Y2Nlc3MgJiYgYWxsQ29tcG9uZW50c0luZm8uZGF0YT8uY29tcG9uZW50cykge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZXhpc3RpbmdDb21wb25lbnQgPSBhbGxDb21wb25lbnRzSW5mby5kYXRhLmNvbXBvbmVudHMuZmluZCgoY29tcDogYW55KSA9PiBjb21wLnR5cGUgPT09IGNvbXBvbmVudFR5cGUpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGV4aXN0aW5nQ29tcG9uZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGBDb21wb25lbnQgJyR7Y29tcG9uZW50VHlwZX0nIGFscmVhZHkgZXhpc3RzIG9uIG5vZGVgLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBub2RlVXVpZDogbm9kZVV1aWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wb25lbnRUeXBlOiBjb21wb25lbnRUeXBlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50VmVyaWZpZWQ6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBleGlzdGluZzogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIOWwneivleebtOaOpeS9v+eUqCBFZGl0b3IgQVBJIOa3u+WKoOe7hOS7tlxyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgYXdhaXQgRWRpdG9yLk1lc3NhZ2UucmVxdWVzdCgnc2NlbmUnLCAnY3JlYXRlLWNvbXBvbmVudCcsIHtcclxuICAgICAgICAgICAgICAgICAgICB1dWlkOiBub2RlVXVpZCxcclxuICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQ6IGNvbXBvbmVudFR5cGVcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAvLyDnrYnlvoXkuIDmrrXml7bpl7TorqlFZGl0b3LlrozmiJDnu4Tku7bmt7vliqBcclxuICAgICAgICAgICAgICAgIGF3YWl0IG5ldyBQcm9taXNlKHJlc29sdmUgPT4gc2V0VGltZW91dChyZXNvbHZlLCAxMDApKTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgLy8g6YeN5paw5p+l6K+i6IqC54K55L+h5oGv6aqM6K+B57uE5Lu25piv5ZCm55yf55qE5re75Yqg5oiQ5YqfXHJcbiAgICAgICAgICAgICAgICBjb25zdCBhbGxDb21wb25lbnRzSW5mbzIgPSBhd2FpdCB0aGlzLmdldENvbXBvbmVudHMobm9kZVV1aWQpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGFsbENvbXBvbmVudHNJbmZvMi5zdWNjZXNzICYmIGFsbENvbXBvbmVudHNJbmZvMi5kYXRhPy5jb21wb25lbnRzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYWRkZWRDb21wb25lbnQgPSBhbGxDb21wb25lbnRzSW5mbzIuZGF0YS5jb21wb25lbnRzLmZpbmQoKGNvbXA6IGFueSkgPT4gY29tcC50eXBlID09PSBjb21wb25lbnRUeXBlKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoYWRkZWRDb21wb25lbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogYENvbXBvbmVudCAnJHtjb21wb25lbnRUeXBlfScgYWRkZWQgc3VjY2Vzc2Z1bGx5YCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBub2RlVXVpZDogbm9kZVV1aWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50VHlwZTogY29tcG9uZW50VHlwZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wb25lbnRWZXJpZmllZDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBleGlzdGluZzogZmFsc2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yOiBgQ29tcG9uZW50ICcke2NvbXBvbmVudFR5cGV9JyB3YXMgbm90IGZvdW5kIG9uIG5vZGUgYWZ0ZXIgYWRkaXRpb24uIEF2YWlsYWJsZSBjb21wb25lbnRzOiAke2FsbENvbXBvbmVudHNJbmZvMi5kYXRhLmNvbXBvbmVudHMubWFwKChjOiBhbnkpID0+IGMudHlwZSkuam9pbignLCAnKX1gXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvcjogYEZhaWxlZCB0byB2ZXJpZnkgY29tcG9uZW50IGFkZGl0aW9uOiAke2FsbENvbXBvbmVudHNJbmZvMi5lcnJvciB8fCAnVW5hYmxlIHRvIGdldCBub2RlIGNvbXBvbmVudHMnfWBcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBjYXRjaCAoZXJyOiBhbnkpIHtcclxuICAgICAgICAgICAgICAgIC8vIOWkh+eUqOaWueahiO+8muS9v+eUqOWcuuaZr+iEmuacrFxyXG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKGBbQ29tcG9uZW50VG9vbHNdIERpcmVjdCBBUEkgZmFpbGVkLCB0cnlpbmcgc2NlbmUgc2NyaXB0OiAke2Vyci5tZXNzYWdlfWApO1xyXG4gICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBvcHRpb25zID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAnY29jb3MtbWNwLXNlcnZlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1ldGhvZDogJ2FkZENvbXBvbmVudFRvTm9kZScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyZ3M6IFtub2RlVXVpZCwgY29tcG9uZW50VHlwZV1cclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IEVkaXRvci5NZXNzYWdlLnJlcXVlc3QoJ3NjZW5lJywgJ2V4ZWN1dGUtc2NlbmUtc2NyaXB0Jywgb3B0aW9ucyk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShyZXN1bHQpO1xyXG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyMjogYW55KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSh7IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmYWxzZSwgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yOiBgRGlyZWN0IEFQSSBmYWlsZWQ6ICR7ZXJyLm1lc3NhZ2V9LCBTY2VuZSBzY3JpcHQgZmFpbGVkOiAke2VycjIubWVzc2FnZX1gIFxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBhc3luYyByZW1vdmVDb21wb25lbnQobm9kZVV1aWQ6IHN0cmluZywgY29tcG9uZW50VHlwZTogc3RyaW5nKTogUHJvbWlzZTxUb29sUmVzcG9uc2U+IHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHJlc29sdmUpID0+IHtcclxuICAgICAgICAgICAgLy8gMS4g5p+l5om+6IqC54K55LiK55qE5omA5pyJ57uE5Lu2XHJcbiAgICAgICAgICAgIGNvbnN0IGFsbENvbXBvbmVudHNJbmZvID0gYXdhaXQgdGhpcy5nZXRDb21wb25lbnRzKG5vZGVVdWlkKTtcclxuICAgICAgICAgICAgaWYgKCFhbGxDb21wb25lbnRzSW5mby5zdWNjZXNzIHx8ICFhbGxDb21wb25lbnRzSW5mby5kYXRhPy5jb21wb25lbnRzKSB7XHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBgRmFpbGVkIHRvIGdldCBjb21wb25lbnRzIGZvciBub2RlICcke25vZGVVdWlkfSc6ICR7YWxsQ29tcG9uZW50c0luZm8uZXJyb3J9YCB9KTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyAyLiDlj6rmn6Xmib50eXBl5a2X5q61562J5LqOY29tcG9uZW50VHlwZeeahOe7hOS7tu+8iOWNs2NpZO+8iVxyXG4gICAgICAgICAgICBjb25zdCBleGlzdHMgPSBhbGxDb21wb25lbnRzSW5mby5kYXRhLmNvbXBvbmVudHMuc29tZSgoY29tcDogYW55KSA9PiBjb21wLnR5cGUgPT09IGNvbXBvbmVudFR5cGUpO1xyXG4gICAgICAgICAgICBpZiAoIWV4aXN0cykge1xyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZSh7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogYENvbXBvbmVudCBjaWQgJyR7Y29tcG9uZW50VHlwZX0nIG5vdCBmb3VuZCBvbiBub2RlICcke25vZGVVdWlkfScuIOivt+eUqGdldENvbXBvbmVudHPojrflj5Z0eXBl5a2X5q6177yIY2lk77yJ5L2c5Li6Y29tcG9uZW50VHlwZeOAgmAgfSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gMy4g5a6Y5pa5QVBJ55u05o6l56e76ZmkXHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBhd2FpdCBFZGl0b3IuTWVzc2FnZS5yZXF1ZXN0KCdzY2VuZScsICdyZW1vdmUtY29tcG9uZW50Jywge1xyXG4gICAgICAgICAgICAgICAgICAgIHV1aWQ6IG5vZGVVdWlkLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudDogY29tcG9uZW50VHlwZVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAvLyA0LiDlho3mn6XkuIDmrKHnoa7orqTmmK/lkKbnp7vpmaRcclxuICAgICAgICAgICAgICAgIGNvbnN0IGFmdGVyUmVtb3ZlSW5mbyA9IGF3YWl0IHRoaXMuZ2V0Q29tcG9uZW50cyhub2RlVXVpZCk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBzdGlsbEV4aXN0cyA9IGFmdGVyUmVtb3ZlSW5mby5zdWNjZXNzICYmIGFmdGVyUmVtb3ZlSW5mby5kYXRhPy5jb21wb25lbnRzPy5zb21lKChjb21wOiBhbnkpID0+IGNvbXAudHlwZSA9PT0gY29tcG9uZW50VHlwZSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoc3RpbGxFeGlzdHMpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBgQ29tcG9uZW50IGNpZCAnJHtjb21wb25lbnRUeXBlfScgd2FzIG5vdCByZW1vdmVkIGZyb20gbm9kZSAnJHtub2RlVXVpZH0nLmAgfSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBgQ29tcG9uZW50IGNpZCAnJHtjb21wb25lbnRUeXBlfScgcmVtb3ZlZCBzdWNjZXNzZnVsbHkgZnJvbSBub2RlICcke25vZGVVdWlkfSdgLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7IG5vZGVVdWlkLCBjb21wb25lbnRUeXBlIH1cclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBjYXRjaCAoZXJyOiBhbnkpIHtcclxuICAgICAgICAgICAgICAgIHJlc29sdmUoeyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IGBGYWlsZWQgdG8gcmVtb3ZlIGNvbXBvbmVudDogJHtlcnIubWVzc2FnZX1gIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBhc3luYyBnZXRDb21wb25lbnRzKG5vZGVVdWlkOiBzdHJpbmcpOiBQcm9taXNlPFRvb2xSZXNwb25zZT4ge1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xyXG4gICAgICAgICAgICAvLyDkvJjlhYjlsJ3or5Xnm7TmjqXkvb/nlKggRWRpdG9yIEFQSSDmn6Xor6LoioLngrnkv6Hmga9cclxuICAgICAgICAgICAgRWRpdG9yLk1lc3NhZ2UucmVxdWVzdCgnc2NlbmUnLCAncXVlcnktbm9kZScsIG5vZGVVdWlkKS50aGVuKChub2RlRGF0YTogYW55KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAobm9kZURhdGEgJiYgbm9kZURhdGEuX19jb21wc19fKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY29tcG9uZW50cyA9IG5vZGVEYXRhLl9fY29tcHNfXy5tYXAoKGNvbXA6IGFueSkgPT4gKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogY29tcC5fX3R5cGVfXyB8fCBjb21wLmNpZCB8fCBjb21wLnR5cGUgfHwgJ1Vua25vd24nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB1dWlkOiBjb21wLnV1aWQ/LnZhbHVlIHx8IGNvbXAudXVpZCB8fCBudWxsLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbmFibGVkOiBjb21wLmVuYWJsZWQgIT09IHVuZGVmaW5lZCA/IGNvbXAuZW5hYmxlZCA6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXM6IHRoaXMuZXh0cmFjdENvbXBvbmVudFByb3BlcnRpZXMoY29tcClcclxuICAgICAgICAgICAgICAgICAgICB9KSk7XHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vZGVVdWlkOiBub2RlVXVpZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudHM6IGNvbXBvbmVudHNcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiAnTm9kZSBub3QgZm91bmQgb3Igbm8gY29tcG9uZW50cyBkYXRhJyB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSkuY2F0Y2goKGVycjogRXJyb3IpID0+IHtcclxuICAgICAgICAgICAgICAgIC8vIOWkh+eUqOaWueahiO+8muS9v+eUqOWcuuaZr+iEmuacrFxyXG4gICAgICAgICAgICAgICAgY29uc3Qgb3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgICAgICAgICBuYW1lOiAnY29jb3MtbWNwLXNlcnZlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgbWV0aG9kOiAnZ2V0Tm9kZUluZm8nLFxyXG4gICAgICAgICAgICAgICAgICAgIGFyZ3M6IFtub2RlVXVpZF1cclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIEVkaXRvci5NZXNzYWdlLnJlcXVlc3QoJ3NjZW5lJywgJ2V4ZWN1dGUtc2NlbmUtc2NyaXB0Jywgb3B0aW9ucykudGhlbigocmVzdWx0OiBhbnkpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocmVzdWx0LnN1Y2Nlc3MpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogcmVzdWx0LmRhdGEuY29tcG9uZW50c1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSkuY2F0Y2goKGVycjI6IEVycm9yKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSh7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogYERpcmVjdCBBUEkgZmFpbGVkOiAke2Vyci5tZXNzYWdlfSwgU2NlbmUgc2NyaXB0IGZhaWxlZDogJHtlcnIyLm1lc3NhZ2V9YCB9KTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGFzeW5jIGdldENvbXBvbmVudEluZm8obm9kZVV1aWQ6IHN0cmluZywgY29tcG9uZW50VHlwZTogc3RyaW5nKTogUHJvbWlzZTxUb29sUmVzcG9uc2U+IHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcclxuICAgICAgICAgICAgLy8g5LyY5YWI5bCd6K+V55u05o6l5L2/55SoIEVkaXRvciBBUEkg5p+l6K+i6IqC54K55L+h5oGvXHJcbiAgICAgICAgICAgIEVkaXRvci5NZXNzYWdlLnJlcXVlc3QoJ3NjZW5lJywgJ3F1ZXJ5LW5vZGUnLCBub2RlVXVpZCkudGhlbigobm9kZURhdGE6IGFueSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKG5vZGVEYXRhICYmIG5vZGVEYXRhLl9fY29tcHNfXykge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNvbXBvbmVudCA9IG5vZGVEYXRhLl9fY29tcHNfXy5maW5kKChjb21wOiBhbnkpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgY29tcFR5cGUgPSBjb21wLl9fdHlwZV9fIHx8IGNvbXAuY2lkIHx8IGNvbXAudHlwZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNvbXBUeXBlID09PSBjb21wb25lbnRUeXBlO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjb21wb25lbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vZGVVdWlkOiBub2RlVXVpZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wb25lbnRUeXBlOiBjb21wb25lbnRUeXBlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuYWJsZWQ6IGNvbXBvbmVudC5lbmFibGVkICE9PSB1bmRlZmluZWQgPyBjb21wb25lbnQuZW5hYmxlZCA6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllczogdGhpcy5leHRyYWN0Q29tcG9uZW50UHJvcGVydGllcyhjb21wb25lbnQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoeyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IGBDb21wb25lbnQgJyR7Y29tcG9uZW50VHlwZX0nIG5vdCBmb3VuZCBvbiBub2RlYCB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoeyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6ICdOb2RlIG5vdCBmb3VuZCBvciBubyBjb21wb25lbnRzIGRhdGEnIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KS5jYXRjaCgoZXJyOiBFcnJvcikgPT4ge1xyXG4gICAgICAgICAgICAgICAgLy8g5aSH55So5pa55qGI77ya5L2/55So5Zy65pmv6ISa5pysXHJcbiAgICAgICAgICAgICAgICBjb25zdCBvcHRpb25zID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6ICdjb2Nvcy1tY3Atc2VydmVyJyxcclxuICAgICAgICAgICAgICAgICAgICBtZXRob2Q6ICdnZXROb2RlSW5mbycsXHJcbiAgICAgICAgICAgICAgICAgICAgYXJnczogW25vZGVVdWlkXVxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgRWRpdG9yLk1lc3NhZ2UucmVxdWVzdCgnc2NlbmUnLCAnZXhlY3V0ZS1zY2VuZS1zY3JpcHQnLCBvcHRpb25zKS50aGVuKChyZXN1bHQ6IGFueSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXN1bHQuc3VjY2VzcyAmJiByZXN1bHQuZGF0YS5jb21wb25lbnRzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGNvbXBvbmVudCA9IHJlc3VsdC5kYXRhLmNvbXBvbmVudHMuZmluZCgoY29tcDogYW55KSA9PiBjb21wLnR5cGUgPT09IGNvbXBvbmVudFR5cGUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY29tcG9uZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbm9kZVV1aWQ6IG5vZGVVdWlkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wb25lbnRUeXBlOiBjb21wb25lbnRUeXBlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuLi5jb21wb25lbnRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoeyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IGBDb21wb25lbnQgJyR7Y29tcG9uZW50VHlwZX0nIG5vdCBmb3VuZCBvbiBub2RlYCB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoeyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IHJlc3VsdC5lcnJvciB8fCAnRmFpbGVkIHRvIGdldCBjb21wb25lbnQgaW5mbycgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSkuY2F0Y2goKGVycjI6IEVycm9yKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSh7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogYERpcmVjdCBBUEkgZmFpbGVkOiAke2Vyci5tZXNzYWdlfSwgU2NlbmUgc2NyaXB0IGZhaWxlZDogJHtlcnIyLm1lc3NhZ2V9YCB9KTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGV4dHJhY3RDb21wb25lbnRQcm9wZXJ0aWVzKGNvbXBvbmVudDogYW55KTogUmVjb3JkPHN0cmluZywgYW55PiB7XHJcbiAgICAgICAgY29uc29sZS5sb2coYFtleHRyYWN0Q29tcG9uZW50UHJvcGVydGllc10gUHJvY2Vzc2luZyBjb21wb25lbnQ6YCwgT2JqZWN0LmtleXMoY29tcG9uZW50KS5qb2luKCcsICcpKTtcclxuICAgICAgICBcclxuICAgICAgICAvLyDmo4Dmn6Xnu4Tku7bmmK/lkKbmnIkgdmFsdWUg5bGe5oCn77yM6L+Z6YCa5bi45YyF5ZCr5a6e6ZmF55qE57uE5Lu25bGe5oCnXHJcbiAgICAgICAgaWYgKGNvbXBvbmVudC52YWx1ZSAmJiB0eXBlb2YgY29tcG9uZW50LnZhbHVlID09PSAnb2JqZWN0Jykge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgW2V4dHJhY3RDb21wb25lbnRQcm9wZXJ0aWVzXSBGb3VuZCBjb21wb25lbnQudmFsdWUgd2l0aCBwcm9wZXJ0aWVzOmAsIE9iamVjdC5rZXlzKGNvbXBvbmVudC52YWx1ZSkuam9pbignLCAnKSk7XHJcbiAgICAgICAgICAgIHJldHVybiBjb21wb25lbnQudmFsdWU7IC8vIOebtOaOpei/lOWbniB2YWx1ZSDlr7nosaHvvIzlroPljIXlkKvmiYDmnInnu4Tku7blsZ7mgKdcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8g5aSH55So5pa55qGI77ya5LuO57uE5Lu25a+56LGh5Lit55u05o6l5o+Q5Y+W5bGe5oCnXHJcbiAgICAgICAgY29uc3QgcHJvcGVydGllczogUmVjb3JkPHN0cmluZywgYW55PiA9IHt9O1xyXG4gICAgICAgIGNvbnN0IGV4Y2x1ZGVLZXlzID0gWydfX3R5cGVfXycsICdlbmFibGVkJywgJ25vZGUnLCAnX2lkJywgJ19fc2NyaXB0QXNzZXQnLCAndXVpZCcsICduYW1lJywgJ19uYW1lJywgJ19vYmpGbGFncycsICdfZW5hYmxlZCcsICd0eXBlJywgJ3JlYWRvbmx5JywgJ3Zpc2libGUnLCAnY2lkJywgJ2VkaXRvcicsICdleHRlbmRzJ107XHJcbiAgICAgICAgXHJcbiAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gY29tcG9uZW50KSB7XHJcbiAgICAgICAgICAgIGlmICghZXhjbHVkZUtleXMuaW5jbHVkZXMoa2V5KSAmJiAha2V5LnN0YXJ0c1dpdGgoJ18nKSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coYFtleHRyYWN0Q29tcG9uZW50UHJvcGVydGllc10gRm91bmQgZGlyZWN0IHByb3BlcnR5ICcke2tleX0nOmAsIHR5cGVvZiBjb21wb25lbnRba2V5XSk7XHJcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzW2tleV0gPSBjb21wb25lbnRba2V5XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBjb25zb2xlLmxvZyhgW2V4dHJhY3RDb21wb25lbnRQcm9wZXJ0aWVzXSBGaW5hbCBleHRyYWN0ZWQgcHJvcGVydGllczpgLCBPYmplY3Qua2V5cyhwcm9wZXJ0aWVzKS5qb2luKCcsICcpKTtcclxuICAgICAgICByZXR1cm4gcHJvcGVydGllcztcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGFzeW5jIGZpbmRDb21wb25lbnRUeXBlQnlVdWlkKGNvbXBvbmVudFV1aWQ6IHN0cmluZyk6IFByb21pc2U8c3RyaW5nIHwgbnVsbD4ge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGBbZmluZENvbXBvbmVudFR5cGVCeVV1aWRdIFNlYXJjaGluZyBmb3IgY29tcG9uZW50IHR5cGUgd2l0aCBVVUlEOiAke2NvbXBvbmVudFV1aWR9YCk7XHJcbiAgICAgICAgaWYgKCFjb21wb25lbnRVdWlkKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBjb25zdCBub2RlVHJlZSA9IGF3YWl0IEVkaXRvci5NZXNzYWdlLnJlcXVlc3QoJ3NjZW5lJywgJ3F1ZXJ5LW5vZGUtdHJlZScpO1xyXG4gICAgICAgICAgICBpZiAoIW5vZGVUcmVlKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oJ1tmaW5kQ29tcG9uZW50VHlwZUJ5VXVpZF0gRmFpbGVkIHRvIHF1ZXJ5IG5vZGUgdHJlZS4nKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjb25zdCBxdWV1ZTogYW55W10gPSBbbm9kZVRyZWVdO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgd2hpbGUgKHF1ZXVlLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGN1cnJlbnROb2RlSW5mbyA9IHF1ZXVlLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoIWN1cnJlbnROb2RlSW5mbyB8fCAhY3VycmVudE5vZGVJbmZvLnV1aWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGZ1bGxOb2RlRGF0YSA9IGF3YWl0IEVkaXRvci5NZXNzYWdlLnJlcXVlc3QoJ3NjZW5lJywgJ3F1ZXJ5LW5vZGUnLCBjdXJyZW50Tm9kZUluZm8udXVpZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGZ1bGxOb2RlRGF0YSAmJiBmdWxsTm9kZURhdGEuX19jb21wc19fKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoY29uc3QgY29tcCBvZiBmdWxsTm9kZURhdGEuX19jb21wc19fKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBjb21wQW55ID0gY29tcCBhcyBhbnk7IC8vIENhc3QgdG8gYW55IHRvIGFjY2VzcyBkeW5hbWljIHByb3BlcnRpZXNcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFRoZSBjb21wb25lbnQgVVVJRCBpcyBuZXN0ZWQgaW4gdGhlICd2YWx1ZScgcHJvcGVydHlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjb21wQW55LnV1aWQgJiYgY29tcEFueS51dWlkLnZhbHVlID09PSBjb21wb25lbnRVdWlkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgY29tcG9uZW50VHlwZSA9IGNvbXBBbnkuX190eXBlX187XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coYFtmaW5kQ29tcG9uZW50VHlwZUJ5VXVpZF0gRm91bmQgY29tcG9uZW50IHR5cGUgJyR7Y29tcG9uZW50VHlwZX0nIGZvciBVVUlEICR7Y29tcG9uZW50VXVpZH0gb24gbm9kZSAke2Z1bGxOb2RlRGF0YS5uYW1lPy52YWx1ZX1gKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gY29tcG9uZW50VHlwZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oYFtmaW5kQ29tcG9uZW50VHlwZUJ5VXVpZF0gQ291bGQgbm90IHF1ZXJ5IG5vZGUgJHtjdXJyZW50Tm9kZUluZm8udXVpZH06YCwgZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGN1cnJlbnROb2RlSW5mby5jaGlsZHJlbikge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAoY29uc3QgY2hpbGQgb2YgY3VycmVudE5vZGVJbmZvLmNoaWxkcmVuKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHF1ZXVlLnB1c2goY2hpbGQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29uc29sZS53YXJuKGBbZmluZENvbXBvbmVudFR5cGVCeVV1aWRdIENvbXBvbmVudCB3aXRoIFVVSUQgJHtjb21wb25lbnRVdWlkfSBub3QgZm91bmQgaW4gc2NlbmUgdHJlZS5gKTtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihgW2ZpbmRDb21wb25lbnRUeXBlQnlVdWlkXSBFcnJvciB3aGlsZSBzZWFyY2hpbmcgZm9yIGNvbXBvbmVudCB0eXBlOmAsIGVycm9yKTtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgYXN5bmMgc2V0Q29tcG9uZW50UHJvcGVydHkoYXJnczogYW55KTogUHJvbWlzZTxUb29sUmVzcG9uc2U+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgeyBub2RlVXVpZCwgY29tcG9uZW50VHlwZSwgcHJvcGVydHksIHByb3BlcnR5VHlwZSwgdmFsdWUgfSA9IGFyZ3M7XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIChyZXNvbHZlKSA9PiB7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAvLyDpqozor4Hlv4XopoHlj4LmlbBcclxuICAgICAgICAgICAgICAgIGlmICghbm9kZVV1aWQpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiAnbm9kZVV1aWQgaXMgcmVxdWlyZWQnIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmICghY29tcG9uZW50VHlwZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoeyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6ICdjb21wb25lbnRUeXBlIGlzIHJlcXVpcmVkJyB9KTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoIXByb3BlcnR5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSh7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogJ3Byb3BlcnR5IGlzIHJlcXVpcmVkJyB9KTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoIXByb3BlcnR5VHlwZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoeyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6ICdwcm9wZXJ0eVR5cGUgaXMgcmVxdWlyZWQnIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkIHx8IHZhbHVlID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSh7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogJ3ZhbHVlIGlzIHJlcXVpcmVkJyB9KTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGBbQ29tcG9uZW50VG9vbHNdIFNldHRpbmcgJHtjb21wb25lbnRUeXBlfS4ke3Byb3BlcnR5fSAodHlwZTogJHtwcm9wZXJ0eVR5cGV9KSA9ICR7SlNPTi5zdHJpbmdpZnkodmFsdWUpfSBvbiBub2RlICR7bm9kZVV1aWR9YCk7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIC8vIFN0ZXAgMDog5qOA5rWL5piv5ZCm5Li66IqC54K55bGe5oCn77yM5aaC5p6c5piv5YiZ6YeN5a6a5ZCR5Yiw5a+55bqU55qE6IqC54K55pa55rOVXHJcbiAgICAgICAgICAgICAgICBjb25zdCBub2RlUmVkaXJlY3RSZXN1bHQgPSBhd2FpdCB0aGlzLmNoZWNrQW5kUmVkaXJlY3ROb2RlUHJvcGVydGllcyhhcmdzKTtcclxuICAgICAgICAgICAgICAgIGlmIChub2RlUmVkaXJlY3RSZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG5vZGVSZWRpcmVjdFJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAvLyBTdGVwIDE6IOiOt+WPlue7hOS7tuS/oeaBr++8jOS9v+eUqOS4jmdldENvbXBvbmVudHPnm7jlkIznmoTmlrnms5VcclxuICAgICAgICAgICAgICAgIGNvbnN0IGNvbXBvbmVudHNSZXNwb25zZSA9IGF3YWl0IHRoaXMuZ2V0Q29tcG9uZW50cyhub2RlVXVpZCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoIWNvbXBvbmVudHNSZXNwb25zZS5zdWNjZXNzIHx8ICFjb21wb25lbnRzUmVzcG9uc2UuZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3I6IGBGYWlsZWQgdG8gZ2V0IGNvbXBvbmVudHMgZm9yIG5vZGUgJyR7bm9kZVV1aWR9JzogJHtjb21wb25lbnRzUmVzcG9uc2UuZXJyb3J9YCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgaW5zdHJ1Y3Rpb246IGBQbGVhc2UgdmVyaWZ5IHRoYXQgbm9kZSBVVUlEICcke25vZGVVdWlkfScgaXMgY29ycmVjdC4gVXNlIGdldF9hbGxfbm9kZXMgb3IgZmluZF9ub2RlX2J5X25hbWUgdG8gZ2V0IHRoZSBjb3JyZWN0IG5vZGUgVVVJRC5gXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBjb25zdCBhbGxDb21wb25lbnRzID0gY29tcG9uZW50c1Jlc3BvbnNlLmRhdGEuY29tcG9uZW50cztcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgLy8gU3RlcCAyOiDmn6Xmib7nm67moIfnu4Tku7ZcclxuICAgICAgICAgICAgICAgIGxldCB0YXJnZXRDb21wb25lbnQgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgYXZhaWxhYmxlVHlwZXM6IHN0cmluZ1tdID0gW107XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYWxsQ29tcG9uZW50cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNvbXAgPSBhbGxDb21wb25lbnRzW2ldO1xyXG4gICAgICAgICAgICAgICAgICAgIGF2YWlsYWJsZVR5cGVzLnB1c2goY29tcC50eXBlKTtcclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICBpZiAoY29tcC50eXBlID09PSBjb21wb25lbnRUeXBlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldENvbXBvbmVudCA9IGNvbXA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgaWYgKCF0YXJnZXRDb21wb25lbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyDmj5Dkvpvmm7Tor6bnu4bnmoTplJnor6/kv6Hmga/lkozlu7rorq5cclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBpbnN0cnVjdGlvbiA9IHRoaXMuZ2VuZXJhdGVDb21wb25lbnRTdWdnZXN0aW9uKGNvbXBvbmVudFR5cGUsIGF2YWlsYWJsZVR5cGVzLCBwcm9wZXJ0eSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvcjogYENvbXBvbmVudCAnJHtjb21wb25lbnRUeXBlfScgbm90IGZvdW5kIG9uIG5vZGUuIEF2YWlsYWJsZSBjb21wb25lbnRzOiAke2F2YWlsYWJsZVR5cGVzLmpvaW4oJywgJyl9YCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgaW5zdHJ1Y3Rpb246IGluc3RydWN0aW9uXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAvLyBTdGVwIDM6IOiHquWKqOajgOa1i+WSjOi9rOaNouWxnuaAp+WAvFxyXG4gICAgICAgICAgICAgICAgbGV0IHByb3BlcnR5SW5mbztcclxuICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coYFtDb21wb25lbnRUb29sc10gQW5hbHl6aW5nIHByb3BlcnR5OiAke3Byb3BlcnR5fWApO1xyXG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnR5SW5mbyA9IHRoaXMuYW5hbHl6ZVByb3BlcnR5KHRhcmdldENvbXBvbmVudCwgcHJvcGVydHkpO1xyXG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoYW5hbHl6ZUVycm9yOiBhbnkpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGBbQ29tcG9uZW50VG9vbHNdIEVycm9yIGluIGFuYWx5emVQcm9wZXJ0eTpgLCBhbmFseXplRXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3I6IGBGYWlsZWQgdG8gYW5hbHl6ZSBwcm9wZXJ0eSAnJHtwcm9wZXJ0eX0nOiAke2FuYWx5emVFcnJvci5tZXNzYWdlfWBcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGlmICghcHJvcGVydHlJbmZvLmV4aXN0cykge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3I6IGBQcm9wZXJ0eSAnJHtwcm9wZXJ0eX0nIG5vdCBmb3VuZCBvbiBjb21wb25lbnQgJyR7Y29tcG9uZW50VHlwZX0nLiBBdmFpbGFibGUgcHJvcGVydGllczogJHtwcm9wZXJ0eUluZm8uYXZhaWxhYmxlUHJvcGVydGllcy5qb2luKCcsICcpfWBcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIC8vIFN0ZXAgNDog5aSE55CG5bGe5oCn5YC85ZKM6K6+572uXHJcbiAgICAgICAgICAgICAgICBjb25zdCBvcmlnaW5hbFZhbHVlID0gcHJvcGVydHlJbmZvLm9yaWdpbmFsVmFsdWU7XHJcbiAgICAgICAgICAgICAgICBsZXQgcHJvY2Vzc2VkVmFsdWU6IGFueTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyDlpoLmnpzmnKrmj5DkvpsgcHJvcGVydHlUeXBl77yM5L2/55SoIGFuYWx5emVQcm9wZXJ0eSDmo4DmtYvnmoTnsbvlnotcclxuICAgICAgICAgICAgICAgIGxldCBhY3R1YWxQcm9wZXJ0eVR5cGUgPSBwcm9wZXJ0eVR5cGUgfHwgcHJvcGVydHlJbmZvLnR5cGU7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8g5qCH5YeG5YyW57G75Z6L5ZCN56ew77ya5bCGIGNjLk5vZGUsIGNjLkNvbXBvbmVudCDnrYnovazmjaLkuLogbm9kZSwgY29tcG9uZW50XHJcbiAgICAgICAgICAgICAgICBpZiAoYWN0dWFsUHJvcGVydHlUeXBlID09PSAnY2MuTm9kZScgfHwgYWN0dWFsUHJvcGVydHlUeXBlID09PSAnY2MuTm9kZVtdJykge1xyXG4gICAgICAgICAgICAgICAgICAgIGFjdHVhbFByb3BlcnR5VHlwZSA9IGFjdHVhbFByb3BlcnR5VHlwZSA9PT0gJ2NjLk5vZGVbXScgPyAnbm9kZUFycmF5JyA6ICdub2RlJztcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoYWN0dWFsUHJvcGVydHlUeXBlICYmIGFjdHVhbFByb3BlcnR5VHlwZS5zdGFydHNXaXRoKCdjYy4nKSAmJiAhWydjYy5TcHJpdGUnLCAnY2MuTGFiZWwnLCAnY2MuQnV0dG9uJ10uaW5jbHVkZXMoYWN0dWFsUHJvcGVydHlUeXBlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIOajgOafpeaYr+WQpuaYr+e7hOS7tuW8leeUqOexu+Wei++8iOmdnuWGhee9rue7hOS7tu+8iVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChhY3R1YWxQcm9wZXJ0eVR5cGUuaW5jbHVkZXMoJ0NvbXBvbmVudCcpIHx8IGFjdHVhbFByb3BlcnR5VHlwZSA9PT0gJ2NjLkF1ZGlvU291cmNlJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhY3R1YWxQcm9wZXJ0eVR5cGUgPSAnY29tcG9uZW50JztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coYFtDb21wb25lbnRUb29sc10gVXNpbmcgcHJvcGVydHlUeXBlOiAke3Byb3BlcnR5VHlwZX0gLT4gYWN0dWFsUHJvcGVydHlUeXBlOiAke2FjdHVhbFByb3BlcnR5VHlwZX1gKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyDmoLnmja7mmI7noa7nmoRwcm9wZXJ0eVR5cGXlpITnkIblsZ7mgKflgLxcclxuICAgICAgICAgICAgICAgIHN3aXRjaCAoYWN0dWFsUHJvcGVydHlUeXBlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnc3RyaW5nJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvY2Vzc2VkVmFsdWUgPSBTdHJpbmcodmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlICdudW1iZXInOlxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2ludGVnZXInOlxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2Zsb2F0JzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvY2Vzc2VkVmFsdWUgPSBOdW1iZXIodmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlICdib29sZWFuJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvY2Vzc2VkVmFsdWUgPSBCb29sZWFuKHZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnY29sb3InOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g5a2X56ym5Liy5qC85byP77ya5pSv5oyB5Y2B5YWt6L+b5Yi244CB6aKc6Imy5ZCN56ew44CBcmdiKCkvcmdiYSgpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9jZXNzZWRWYWx1ZSA9IHRoaXMucGFyc2VDb2xvclN0cmluZyh2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g5a+56LGh5qC85byP77ya6aqM6K+B5bm26L2s5o2iUkdCQeWAvFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvY2Vzc2VkVmFsdWUgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcjogTWF0aC5taW4oMjU1LCBNYXRoLm1heCgwLCBOdW1iZXIodmFsdWUucikgfHwgMCkpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGc6IE1hdGgubWluKDI1NSwgTWF0aC5tYXgoMCwgTnVtYmVyKHZhbHVlLmcpIHx8IDApKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiOiBNYXRoLm1pbigyNTUsIE1hdGgubWF4KDAsIE51bWJlcih2YWx1ZS5iKSB8fCAwKSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYTogdmFsdWUuYSAhPT0gdW5kZWZpbmVkID8gTWF0aC5taW4oMjU1LCBNYXRoLm1heCgwLCBOdW1iZXIodmFsdWUuYSkpKSA6IDI1NVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQ29sb3IgdmFsdWUgbXVzdCBiZSBhbiBvYmplY3Qgd2l0aCByLCBnLCBiIHByb3BlcnRpZXMgb3IgYSBoZXhhZGVjaW1hbCBzdHJpbmcgKGUuZy4sIFwiI0ZGMDAwMFwiKScpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ3ZlYzInOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvY2Vzc2VkVmFsdWUgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeDogTnVtYmVyKHZhbHVlLngpIHx8IDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeTogTnVtYmVyKHZhbHVlLnkpIHx8IDBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1ZlYzIgdmFsdWUgbXVzdCBiZSBhbiBvYmplY3Qgd2l0aCB4LCB5IHByb3BlcnRpZXMnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlICd2ZWMzJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb2Nlc3NlZFZhbHVlID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHg6IE51bWJlcih2YWx1ZS54KSB8fCAwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHk6IE51bWJlcih2YWx1ZS55KSB8fCAwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHo6IE51bWJlcih2YWx1ZS56KSB8fCAwXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdWZWMzIHZhbHVlIG11c3QgYmUgYW4gb2JqZWN0IHdpdGggeCwgeSwgeiBwcm9wZXJ0aWVzJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnc2l6ZSc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9jZXNzZWRWYWx1ZSA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogTnVtYmVyKHZhbHVlLndpZHRoKSB8fCAwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhlaWdodDogTnVtYmVyKHZhbHVlLmhlaWdodCkgfHwgMFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignU2l6ZSB2YWx1ZSBtdXN0IGJlIGFuIG9iamVjdCB3aXRoIHdpZHRoLCBoZWlnaHQgcHJvcGVydGllcycpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ25vZGUnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvY2Vzc2VkVmFsdWUgPSB7IHV1aWQ6IHZhbHVlIH07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vZGUgcmVmZXJlbmNlIHZhbHVlIG11c3QgYmUgYSBzdHJpbmcgVVVJRCcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2NvbXBvbmVudCc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDnu4Tku7blvJXnlKjpnIDopoHnibnmrorlpITnkIbvvJrpgJrov4foioLngrlVVUlE5om+5Yiw57uE5Lu255qEX19pZF9fXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9jZXNzZWRWYWx1ZSA9IHZhbHVlOyAvLyDlhYjkv53lrZjoioLngrlVVUlE77yM5ZCO57ut5Lya6L2s5o2i5Li6X19pZF9fXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0NvbXBvbmVudCByZWZlcmVuY2UgdmFsdWUgbXVzdCBiZSBhIHN0cmluZyAobm9kZSBVVUlEIGNvbnRhaW5pbmcgdGhlIHRhcmdldCBjb21wb25lbnQpJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnc3ByaXRlRnJhbWUnOlxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ3ByZWZhYic6XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnYXNzZXQnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvY2Vzc2VkVmFsdWUgPSB7IHV1aWQ6IHZhbHVlIH07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7cHJvcGVydHlUeXBlfSB2YWx1ZSBtdXN0IGJlIGEgc3RyaW5nIFVVSURgKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlICdub2RlQXJyYXknOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb2Nlc3NlZFZhbHVlID0gdmFsdWUubWFwKChpdGVtOiBhbnkpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGl0ZW0gPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7IHV1aWQ6IGl0ZW0gfTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vZGVBcnJheSBpdGVtcyBtdXN0IGJlIHN0cmluZyBVVUlEcycpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdOb2RlQXJyYXkgdmFsdWUgbXVzdCBiZSBhbiBhcnJheScpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2NvbG9yQXJyYXknOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb2Nlc3NlZFZhbHVlID0gdmFsdWUubWFwKChpdGVtOiBhbnkpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGl0ZW0gPT09ICdvYmplY3QnICYmIGl0ZW0gIT09IG51bGwgJiYgJ3InIGluIGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHI6IE1hdGgubWluKDI1NSwgTWF0aC5tYXgoMCwgTnVtYmVyKGl0ZW0ucikgfHwgMCkpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZzogTWF0aC5taW4oMjU1LCBNYXRoLm1heCgwLCBOdW1iZXIoaXRlbS5nKSB8fCAwKSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiOiBNYXRoLm1pbigyNTUsIE1hdGgubWF4KDAsIE51bWJlcihpdGVtLmIpIHx8IDApKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGE6IGl0ZW0uYSAhPT0gdW5kZWZpbmVkID8gTWF0aC5taW4oMjU1LCBNYXRoLm1heCgwLCBOdW1iZXIoaXRlbS5hKSkpIDogMjU1XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSwgYTogMjU1IH07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0NvbG9yQXJyYXkgdmFsdWUgbXVzdCBiZSBhbiBhcnJheScpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ251bWJlckFycmF5JzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9jZXNzZWRWYWx1ZSA9IHZhbHVlLm1hcCgoaXRlbTogYW55KSA9PiBOdW1iZXIoaXRlbSkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdOdW1iZXJBcnJheSB2YWx1ZSBtdXN0IGJlIGFuIGFycmF5Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnc3RyaW5nQXJyYXknOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb2Nlc3NlZFZhbHVlID0gdmFsdWUubWFwKChpdGVtOiBhbnkpID0+IFN0cmluZyhpdGVtKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1N0cmluZ0FycmF5IHZhbHVlIG11c3QgYmUgYW4gYXJyYXknKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFVuc3VwcG9ydGVkIHByb3BlcnR5IHR5cGU6ICR7cHJvcGVydHlUeXBlfWApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgW0NvbXBvbmVudFRvb2xzXSBDb252ZXJ0aW5nIHZhbHVlOiAke0pTT04uc3RyaW5naWZ5KHZhbHVlKX0gLT4gJHtKU09OLnN0cmluZ2lmeShwcm9jZXNzZWRWYWx1ZSl9ICh0eXBlOiAke2FjdHVhbFByb3BlcnR5VHlwZX0pYCk7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgW0NvbXBvbmVudFRvb2xzXSBQcm9wZXJ0eSBhbmFseXNpcyByZXN1bHQ6IHByb3BlcnR5SW5mby50eXBlPVwiJHtwcm9wZXJ0eUluZm8udHlwZX1cIiwgYWN0dWFsUHJvcGVydHlUeXBlPVwiJHthY3R1YWxQcm9wZXJ0eVR5cGV9XCJgKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGBbQ29tcG9uZW50VG9vbHNdIFdpbGwgdXNlIGNvbG9yIHNwZWNpYWwgaGFuZGxpbmc6ICR7YWN0dWFsUHJvcGVydHlUeXBlID09PSAnY29sb3InICYmIHByb2Nlc3NlZFZhbHVlICYmIHR5cGVvZiBwcm9jZXNzZWRWYWx1ZSA9PT0gJ29iamVjdCd9YCk7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIC8vIOeUqOS6jumqjOivgeeahOWunumZheacn+acm+WAvO+8iOWvueS6jue7hOS7tuW8leeUqOmcgOimgeeJueauiuWkhOeQhu+8iVxyXG4gICAgICAgICAgICAgICAgbGV0IGFjdHVhbEV4cGVjdGVkVmFsdWUgPSBwcm9jZXNzZWRWYWx1ZTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgLy8gU3RlcCA1OiDojrflj5bljp/lp4voioLngrnmlbDmja7mnaXmnoTlu7rmraPnoa7nmoTot6/lvoRcclxuICAgICAgICAgICAgICAgIGNvbnN0IHJhd05vZGVEYXRhID0gYXdhaXQgRWRpdG9yLk1lc3NhZ2UucmVxdWVzdCgnc2NlbmUnLCAncXVlcnktbm9kZScsIG5vZGVVdWlkKTtcclxuICAgICAgICAgICAgICAgIGlmICghcmF3Tm9kZURhdGEgfHwgIXJhd05vZGVEYXRhLl9fY29tcHNfXykge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3I6IGBGYWlsZWQgdG8gZ2V0IHJhdyBub2RlIGRhdGEgZm9yIHByb3BlcnR5IHNldHRpbmdgXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAvLyDmib7liLDljp/lp4vnu4Tku7bnmoTntKLlvJVcclxuICAgICAgICAgICAgICAgIGxldCByYXdDb21wb25lbnRJbmRleCA9IC0xO1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCByYXdOb2RlRGF0YS5fX2NvbXBzX18ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBjb21wID0gcmF3Tm9kZURhdGEuX19jb21wc19fW2ldIGFzIGFueTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBjb21wVHlwZSA9IGNvbXAuX190eXBlX18gfHwgY29tcC5jaWQgfHwgY29tcC50eXBlIHx8ICdVbmtub3duJztcclxuICAgICAgICAgICAgICAgICAgICBpZiAoY29tcFR5cGUgPT09IGNvbXBvbmVudFR5cGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmF3Q29tcG9uZW50SW5kZXggPSBpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGlmIChyYXdDb21wb25lbnRJbmRleCA9PT0gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yOiBgQ291bGQgbm90IGZpbmQgY29tcG9uZW50IGluZGV4IGZvciBzZXR0aW5nIHByb3BlcnR5YFxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgLy8g5p6E5bu65q2j56Gu55qE5bGe5oCn6Lev5b6EXHJcbiAgICAgICAgICAgICAgICBsZXQgcHJvcGVydHlQYXRoID0gYF9fY29tcHNfXy4ke3Jhd0NvbXBvbmVudEluZGV4fS4ke3Byb3BlcnR5fWA7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIC8vIOeJueauiuWkhOeQhui1hOa6kOexu+WxnuaAp1xyXG4gICAgICAgICAgICAgICAgaWYgKGFjdHVhbFByb3BlcnR5VHlwZSA9PT0gJ2Fzc2V0JyB8fCBhY3R1YWxQcm9wZXJ0eVR5cGUgPT09ICdzcHJpdGVGcmFtZScgfHwgYWN0dWFsUHJvcGVydHlUeXBlID09PSAncHJlZmFiJyB8fCBcclxuICAgICAgICAgICAgICAgICAgICAocHJvcGVydHlJbmZvLnR5cGUgPT09ICdhc3NldCcgJiYgYWN0dWFsUHJvcGVydHlUeXBlID09PSAnc3RyaW5nJykpIHtcclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgW0NvbXBvbmVudFRvb2xzXSBTZXR0aW5nIGFzc2V0IHJlZmVyZW5jZTpgLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBwcm9jZXNzZWRWYWx1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvcGVydHk6IHByb3BlcnR5LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhY3R1YWxQcm9wZXJ0eVR5cGU6IGFjdHVhbFByb3BlcnR5VHlwZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGF0aDogcHJvcGVydHlQYXRoXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gRGV0ZXJtaW5lIGFzc2V0IHR5cGUgYmFzZWQgb24gcHJvcGVydHkgbmFtZVxyXG4gICAgICAgICAgICAgICAgICAgIGxldCBhc3NldFR5cGUgPSAnY2MuU3ByaXRlRnJhbWUnOyAvLyBkZWZhdWx0XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHByb3BlcnR5LnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoJ3RleHR1cmUnKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhc3NldFR5cGUgPSAnY2MuVGV4dHVyZTJEJztcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHByb3BlcnR5LnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoJ21hdGVyaWFsJykpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXNzZXRUeXBlID0gJ2NjLk1hdGVyaWFsJztcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHByb3BlcnR5LnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoJ2ZvbnQnKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhc3NldFR5cGUgPSAnY2MuRm9udCc7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChwcm9wZXJ0eS50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKCdjbGlwJykpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXNzZXRUeXBlID0gJ2NjLkF1ZGlvQ2xpcCc7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChhY3R1YWxQcm9wZXJ0eVR5cGUgPT09ICdwcmVmYWInKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFzc2V0VHlwZSA9ICdjYy5QcmVmYWInO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICBhd2FpdCBFZGl0b3IuTWVzc2FnZS5yZXF1ZXN0KCdzY2VuZScsICdzZXQtcHJvcGVydHknLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHV1aWQ6IG5vZGVVdWlkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXRoOiBwcm9wZXJ0eVBhdGgsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGR1bXA6IHsgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogcHJvY2Vzc2VkVmFsdWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBhc3NldFR5cGVcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChjb21wb25lbnRUeXBlID09PSAnY2MuVUlUcmFuc2Zvcm0nICYmIChwcm9wZXJ0eSA9PT0gJ19jb250ZW50U2l6ZScgfHwgcHJvcGVydHkgPT09ICdjb250ZW50U2l6ZScpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gU3BlY2lhbCBoYW5kbGluZyBmb3IgVUlUcmFuc2Zvcm0gY29udGVudFNpemUgLSBzZXQgd2lkdGggYW5kIGhlaWdodCBzZXBhcmF0ZWx5XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgd2lkdGggPSBOdW1iZXIodmFsdWUud2lkdGgpIHx8IDEwMDtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBoZWlnaHQgPSBOdW1iZXIodmFsdWUuaGVpZ2h0KSB8fCAxMDA7XHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gU2V0IHdpZHRoIGZpcnN0XHJcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgRWRpdG9yLk1lc3NhZ2UucmVxdWVzdCgnc2NlbmUnLCAnc2V0LXByb3BlcnR5Jywge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB1dWlkOiBub2RlVXVpZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGF0aDogYF9fY29tcHNfXy4ke3Jhd0NvbXBvbmVudEluZGV4fS53aWR0aGAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGR1bXA6IHsgdmFsdWU6IHdpZHRoIH1cclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAvLyBUaGVuIHNldCBoZWlnaHRcclxuICAgICAgICAgICAgICAgICAgICBhd2FpdCBFZGl0b3IuTWVzc2FnZS5yZXF1ZXN0KCdzY2VuZScsICdzZXQtcHJvcGVydHknLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHV1aWQ6IG5vZGVVdWlkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXRoOiBgX19jb21wc19fLiR7cmF3Q29tcG9uZW50SW5kZXh9LmhlaWdodGAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGR1bXA6IHsgdmFsdWU6IGhlaWdodCB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGNvbXBvbmVudFR5cGUgPT09ICdjYy5VSVRyYW5zZm9ybScgJiYgKHByb3BlcnR5ID09PSAnX2FuY2hvclBvaW50JyB8fCBwcm9wZXJ0eSA9PT0gJ2FuY2hvclBvaW50JykpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBTcGVjaWFsIGhhbmRsaW5nIGZvciBVSVRyYW5zZm9ybSBhbmNob3JQb2ludCAtIHNldCBhbmNob3JYIGFuZCBhbmNob3JZIHNlcGFyYXRlbHlcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBhbmNob3JYID0gTnVtYmVyKHZhbHVlLngpIHx8IDAuNTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBhbmNob3JZID0gTnVtYmVyKHZhbHVlLnkpIHx8IDAuNTtcclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAvLyBTZXQgYW5jaG9yWCBmaXJzdFxyXG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IEVkaXRvci5NZXNzYWdlLnJlcXVlc3QoJ3NjZW5lJywgJ3NldC1wcm9wZXJ0eScsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdXVpZDogbm9kZVV1aWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhdGg6IGBfX2NvbXBzX18uJHtyYXdDb21wb25lbnRJbmRleH0uYW5jaG9yWGAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGR1bXA6IHsgdmFsdWU6IGFuY2hvclggfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIC8vIFRoZW4gc2V0IGFuY2hvclkgIFxyXG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IEVkaXRvci5NZXNzYWdlLnJlcXVlc3QoJ3NjZW5lJywgJ3NldC1wcm9wZXJ0eScsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdXVpZDogbm9kZVV1aWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhdGg6IGBfX2NvbXBzX18uJHtyYXdDb21wb25lbnRJbmRleH0uYW5jaG9yWWAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGR1bXA6IHsgdmFsdWU6IGFuY2hvclkgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChhY3R1YWxQcm9wZXJ0eVR5cGUgPT09ICdjb2xvcicgJiYgcHJvY2Vzc2VkVmFsdWUgJiYgdHlwZW9mIHByb2Nlc3NlZFZhbHVlID09PSAnb2JqZWN0Jykge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIOeJueauiuWkhOeQhuminOiJsuWxnuaAp++8jOehruS/nVJHQkHlgLzmraPnoa5cclxuICAgICAgICAgICAgICAgICAgICAvLyBDb2NvcyBDcmVhdG9y6aKc6Imy5YC86IyD5Zu05pivMC0yNTVcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBjb2xvclZhbHVlID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByOiBNYXRoLm1pbigyNTUsIE1hdGgubWF4KDAsIE51bWJlcihwcm9jZXNzZWRWYWx1ZS5yKSB8fCAwKSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGc6IE1hdGgubWluKDI1NSwgTWF0aC5tYXgoMCwgTnVtYmVyKHByb2Nlc3NlZFZhbHVlLmcpIHx8IDApKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYjogTWF0aC5taW4oMjU1LCBNYXRoLm1heCgwLCBOdW1iZXIocHJvY2Vzc2VkVmFsdWUuYikgfHwgMCkpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhOiBwcm9jZXNzZWRWYWx1ZS5hICE9PSB1bmRlZmluZWQgPyBNYXRoLm1pbigyNTUsIE1hdGgubWF4KDAsIE51bWJlcihwcm9jZXNzZWRWYWx1ZS5hKSkpIDogMjU1XHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgW0NvbXBvbmVudFRvb2xzXSBTZXR0aW5nIGNvbG9yIHZhbHVlOmAsIGNvbG9yVmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IEVkaXRvci5NZXNzYWdlLnJlcXVlc3QoJ3NjZW5lJywgJ3NldC1wcm9wZXJ0eScsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdXVpZDogbm9kZVV1aWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhdGg6IHByb3BlcnR5UGF0aCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZHVtcDogeyBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBjb2xvclZhbHVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2NjLkNvbG9yJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGFjdHVhbFByb3BlcnR5VHlwZSA9PT0gJ3ZlYzMnICYmIHByb2Nlc3NlZFZhbHVlICYmIHR5cGVvZiBwcm9jZXNzZWRWYWx1ZSA9PT0gJ29iamVjdCcpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyDnibnmrorlpITnkIZWZWMz5bGe5oCnXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdmVjM1ZhbHVlID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB4OiBOdW1iZXIocHJvY2Vzc2VkVmFsdWUueCkgfHwgMCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgeTogTnVtYmVyKHByb2Nlc3NlZFZhbHVlLnkpIHx8IDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHo6IE51bWJlcihwcm9jZXNzZWRWYWx1ZS56KSB8fCAwXHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICBhd2FpdCBFZGl0b3IuTWVzc2FnZS5yZXF1ZXN0KCdzY2VuZScsICdzZXQtcHJvcGVydHknLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHV1aWQ6IG5vZGVVdWlkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXRoOiBwcm9wZXJ0eVBhdGgsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGR1bXA6IHsgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogdmVjM1ZhbHVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2NjLlZlYzMnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoYWN0dWFsUHJvcGVydHlUeXBlID09PSAndmVjMicgJiYgcHJvY2Vzc2VkVmFsdWUgJiYgdHlwZW9mIHByb2Nlc3NlZFZhbHVlID09PSAnb2JqZWN0Jykge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIOeJueauiuWkhOeQhlZlYzLlsZ7mgKdcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCB2ZWMyVmFsdWUgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHg6IE51bWJlcihwcm9jZXNzZWRWYWx1ZS54KSB8fCAwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB5OiBOdW1iZXIocHJvY2Vzc2VkVmFsdWUueSkgfHwgMFxyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgRWRpdG9yLk1lc3NhZ2UucmVxdWVzdCgnc2NlbmUnLCAnc2V0LXByb3BlcnR5Jywge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB1dWlkOiBub2RlVXVpZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGF0aDogcHJvcGVydHlQYXRoLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkdW1wOiB7IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHZlYzJWYWx1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdjYy5WZWMyJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGFjdHVhbFByb3BlcnR5VHlwZSA9PT0gJ3NpemUnICYmIHByb2Nlc3NlZFZhbHVlICYmIHR5cGVvZiBwcm9jZXNzZWRWYWx1ZSA9PT0gJ29iamVjdCcpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyDnibnmrorlpITnkIZTaXpl5bGe5oCnXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc2l6ZVZhbHVlID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogTnVtYmVyKHByb2Nlc3NlZFZhbHVlLndpZHRoKSB8fCAwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IE51bWJlcihwcm9jZXNzZWRWYWx1ZS5oZWlnaHQpIHx8IDBcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IEVkaXRvci5NZXNzYWdlLnJlcXVlc3QoJ3NjZW5lJywgJ3NldC1wcm9wZXJ0eScsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdXVpZDogbm9kZVV1aWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhdGg6IHByb3BlcnR5UGF0aCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZHVtcDogeyBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBzaXplVmFsdWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnY2MuU2l6ZSdcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChhY3R1YWxQcm9wZXJ0eVR5cGUgPT09ICdub2RlJyAmJiBwcm9jZXNzZWRWYWx1ZSAmJiB0eXBlb2YgcHJvY2Vzc2VkVmFsdWUgPT09ICdvYmplY3QnICYmICd1dWlkJyBpbiBwcm9jZXNzZWRWYWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIOeJueauiuWkhOeQhuiKgueCueW8leeUqFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGBbQ29tcG9uZW50VG9vbHNdIFNldHRpbmcgbm9kZSByZWZlcmVuY2Ugd2l0aCBVVUlEOiAke3Byb2Nlc3NlZFZhbHVlLnV1aWR9YCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgRWRpdG9yLk1lc3NhZ2UucmVxdWVzdCgnc2NlbmUnLCAnc2V0LXByb3BlcnR5Jywge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB1dWlkOiBub2RlVXVpZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGF0aDogcHJvcGVydHlQYXRoLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkdW1wOiB7IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHByb2Nlc3NlZFZhbHVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2NjLk5vZGUnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoYWN0dWFsUHJvcGVydHlUeXBlID09PSAnY29tcG9uZW50JyAmJiB0eXBlb2YgcHJvY2Vzc2VkVmFsdWUgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8g54m55q6K5aSE55CG57uE5Lu25byV55So77ya6YCa6L+H6IqC54K5VVVJROaJvuWIsOe7hOS7tueahF9faWRfX1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRhcmdldE5vZGVVdWlkID0gcHJvY2Vzc2VkVmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coYFtDb21wb25lbnRUb29sc10gU2V0dGluZyBjb21wb25lbnQgcmVmZXJlbmNlIC0gZmluZGluZyBjb21wb25lbnQgb24gbm9kZTogJHt0YXJnZXROb2RlVXVpZH1gKTtcclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAvLyDku47lvZPliY3nu4Tku7bnmoTlsZ7mgKflhYPmlbDmja7kuK3ojrflj5bmnJ/mnJvnmoTnu4Tku7bnsbvlnotcclxuICAgICAgICAgICAgICAgICAgICBsZXQgZXhwZWN0ZWRDb21wb25lbnRUeXBlID0gJyc7XHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgLy8g6I635Y+W5b2T5YmN57uE5Lu255qE6K+m57uG5L+h5oGv77yM5YyF5ous5bGe5oCn5YWD5pWw5o2uXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY3VycmVudENvbXBvbmVudEluZm8gPSBhd2FpdCB0aGlzLmdldENvbXBvbmVudEluZm8obm9kZVV1aWQsIGNvbXBvbmVudFR5cGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjdXJyZW50Q29tcG9uZW50SW5mby5zdWNjZXNzICYmIGN1cnJlbnRDb21wb25lbnRJbmZvLmRhdGE/LnByb3BlcnRpZXM/Lltwcm9wZXJ0eV0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcHJvcGVydHlNZXRhID0gY3VycmVudENvbXBvbmVudEluZm8uZGF0YS5wcm9wZXJ0aWVzW3Byb3BlcnR5XTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIOS7juWxnuaAp+WFg+aVsOaNruS4reaPkOWPlue7hOS7tuexu+Wei+S/oeaBr1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocHJvcGVydHlNZXRhICYmIHR5cGVvZiBwcm9wZXJ0eU1ldGEgPT09ICdvYmplY3QnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDmo4Dmn6XmmK/lkKbmnIl0eXBl5a2X5q615oyH56S657uE5Lu257G75Z6LXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocHJvcGVydHlNZXRhLnR5cGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBleHBlY3RlZENvbXBvbmVudFR5cGUgPSBwcm9wZXJ0eU1ldGEudHlwZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAocHJvcGVydHlNZXRhLmN0b3IpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDmnInkupvlsZ7mgKflj6/og73kvb/nlKhjdG9y5a2X5q61XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXhwZWN0ZWRDb21wb25lbnRUeXBlID0gcHJvcGVydHlNZXRhLmN0b3I7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHByb3BlcnR5TWV0YS5leHRlbmRzICYmIEFycmF5LmlzQXJyYXkocHJvcGVydHlNZXRhLmV4dGVuZHMpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g5qOA5p+lZXh0ZW5kc+aVsOe7hO+8jOmAmuW4uOesrOS4gOS4quaYr+acgOWFt+S9k+eahOexu+Wei1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoY29uc3QgZXh0ZW5kVHlwZSBvZiBwcm9wZXJ0eU1ldGEuZXh0ZW5kcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXh0ZW5kVHlwZS5zdGFydHNXaXRoKCdjYy4nKSAmJiBleHRlbmRUeXBlICE9PSAnY2MuQ29tcG9uZW50JyAmJiBleHRlbmRUeXBlICE9PSAnY2MuT2JqZWN0Jykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXhwZWN0ZWRDb21wb25lbnRUeXBlID0gZXh0ZW5kVHlwZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIGlmICghZXhwZWN0ZWRDb21wb25lbnRUeXBlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgVW5hYmxlIHRvIGRldGVybWluZSByZXF1aXJlZCBjb21wb25lbnQgdHlwZSBmb3IgcHJvcGVydHkgJyR7cHJvcGVydHl9JyBvbiBjb21wb25lbnQgJyR7Y29tcG9uZW50VHlwZX0nLiBQcm9wZXJ0eSBtZXRhZGF0YSBtYXkgbm90IGNvbnRhaW4gdHlwZSBpbmZvcm1hdGlvbi5gKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coYFtDb21wb25lbnRUb29sc10gRGV0ZWN0ZWQgcmVxdWlyZWQgY29tcG9uZW50IHR5cGU6ICR7ZXhwZWN0ZWRDb21wb25lbnRUeXBlfSBmb3IgcHJvcGVydHk6ICR7cHJvcGVydHl9YCk7XHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8g6I635Y+W55uu5qCH6IqC54K555qE57uE5Lu25L+h5oGvXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHRhcmdldE5vZGVEYXRhID0gYXdhaXQgRWRpdG9yLk1lc3NhZ2UucmVxdWVzdCgnc2NlbmUnLCAncXVlcnktbm9kZScsIHRhcmdldE5vZGVVdWlkKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCF0YXJnZXROb2RlRGF0YSB8fCAhdGFyZ2V0Tm9kZURhdGEuX19jb21wc19fKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFRhcmdldCBub2RlICR7dGFyZ2V0Tm9kZVV1aWR9IG5vdCBmb3VuZCBvciBoYXMgbm8gY29tcG9uZW50c2ApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyDmiZPljbDnm67moIfoioLngrnnmoTnu4Tku7bmpoLop4hcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coYFtDb21wb25lbnRUb29sc10gVGFyZ2V0IG5vZGUgJHt0YXJnZXROb2RlVXVpZH0gaGFzICR7dGFyZ2V0Tm9kZURhdGEuX19jb21wc19fLmxlbmd0aH0gY29tcG9uZW50czpgKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0Tm9kZURhdGEuX19jb21wc19fLmZvckVhY2goKGNvbXA6IGFueSwgaW5kZXg6IG51bWJlcikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgc2NlbmVJZCA9IGNvbXAudmFsdWUgJiYgY29tcC52YWx1ZS51dWlkICYmIGNvbXAudmFsdWUudXVpZC52YWx1ZSA/IGNvbXAudmFsdWUudXVpZC52YWx1ZSA6ICd1bmtub3duJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGBbQ29tcG9uZW50VG9vbHNdIENvbXBvbmVudCAke2luZGV4fTogJHtjb21wLnR5cGV9IChzY2VuZV9pZDogJHtzY2VuZUlkfSlgKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyDmn6Xmib7lr7nlupTnmoTnu4Tku7ZcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHRhcmdldENvbXBvbmVudCA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBjb21wb25lbnRJZDogc3RyaW5nIHwgbnVsbCA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyDlnKjnm67moIfoioLngrnnmoRfY29tcG9uZW50c+aVsOe7hOS4reafpeaJvuaMh+Wumuexu+Wei+eahOe7hOS7tlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyDms6jmhI/vvJpfX2NvbXBzX1/lkoxfY29tcG9uZW50c+eahOe0ouW8leaYr+WvueW6lOeahFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgW0NvbXBvbmVudFRvb2xzXSBTZWFyY2hpbmcgZm9yIGNvbXBvbmVudCB0eXBlOiAke2V4cGVjdGVkQ29tcG9uZW50VHlwZX1gKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGFyZ2V0Tm9kZURhdGEuX19jb21wc19fLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBjb21wID0gdGFyZ2V0Tm9kZURhdGEuX19jb21wc19fW2ldIGFzIGFueTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGBbQ29tcG9uZW50VG9vbHNdIENoZWNraW5nIGNvbXBvbmVudCAke2l9OiB0eXBlPSR7Y29tcC50eXBlfSwgdGFyZ2V0PSR7ZXhwZWN0ZWRDb21wb25lbnRUeXBlfWApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY29tcC50eXBlID09PSBleHBlY3RlZENvbXBvbmVudFR5cGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRDb21wb25lbnQgPSBjb21wO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGBbQ29tcG9uZW50VG9vbHNdIEZvdW5kIG1hdGNoaW5nIGNvbXBvbmVudCBhdCBpbmRleCAke2l9OiAke2NvbXAudHlwZX1gKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDku47nu4Tku7bnmoR2YWx1ZS51dWlkLnZhbHVl5Lit6I635Y+W57uE5Lu25Zyo5Zy65pmv5Lit55qESURcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY29tcC52YWx1ZSAmJiBjb21wLnZhbHVlLnV1aWQgJiYgY29tcC52YWx1ZS51dWlkLnZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudElkID0gY29tcC52YWx1ZS51dWlkLnZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgW0NvbXBvbmVudFRvb2xzXSBHb3QgY29tcG9uZW50SWQgZnJvbSBjb21wLnZhbHVlLnV1aWQudmFsdWU6ICR7Y29tcG9uZW50SWR9YCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coYFtDb21wb25lbnRUb29sc10gQ29tcG9uZW50IHN0cnVjdHVyZTpgLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoYXNWYWx1ZTogISFjb21wLnZhbHVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaGFzVXVpZDogISEoY29tcC52YWx1ZSAmJiBjb21wLnZhbHVlLnV1aWQpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaGFzVXVpZFZhbHVlOiAhIShjb21wLnZhbHVlICYmIGNvbXAudmFsdWUudXVpZCAmJiBjb21wLnZhbHVlLnV1aWQudmFsdWUpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXVpZFN0cnVjdHVyZTogY29tcC52YWx1ZSA/IGNvbXAudmFsdWUudXVpZCA6ICdObyB2YWx1ZSdcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgVW5hYmxlIHRvIGV4dHJhY3QgY29tcG9uZW50IElEIGZyb20gY29tcG9uZW50IHN0cnVjdHVyZWApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCF0YXJnZXRDb21wb25lbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOWmguaenOayoeaJvuWIsO+8jOWIl+WHuuWPr+eUqOe7hOS7tuiuqeeUqOaIt+S6huino++8jOaYvuekuuWcuuaZr+S4reeahOecn+WunklEXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBhdmFpbGFibGVDb21wb25lbnRzID0gdGFyZ2V0Tm9kZURhdGEuX19jb21wc19fLm1hcCgoY29tcDogYW55LCBpbmRleDogbnVtYmVyKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHNjZW5lSWQgPSAndW5rbm93bic7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g5LuO57uE5Lu255qEdmFsdWUudXVpZC52YWx1ZeiOt+WPluWcuuaZr0lEXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNvbXAudmFsdWUgJiYgY29tcC52YWx1ZS51dWlkICYmIGNvbXAudmFsdWUudXVpZC52YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY2VuZUlkID0gY29tcC52YWx1ZS51dWlkLnZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYCR7Y29tcC50eXBlfShzY2VuZV9pZDoke3NjZW5lSWR9KWA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgQ29tcG9uZW50IHR5cGUgJyR7ZXhwZWN0ZWRDb21wb25lbnRUeXBlfScgbm90IGZvdW5kIG9uIG5vZGUgJHt0YXJnZXROb2RlVXVpZH0uIEF2YWlsYWJsZSBjb21wb25lbnRzOiAke2F2YWlsYWJsZUNvbXBvbmVudHMuam9pbignLCAnKX1gKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coYFtDb21wb25lbnRUb29sc10gRm91bmQgY29tcG9uZW50ICR7ZXhwZWN0ZWRDb21wb25lbnRUeXBlfSB3aXRoIHNjZW5lIElEOiAke2NvbXBvbmVudElkfSBvbiBub2RlICR7dGFyZ2V0Tm9kZVV1aWR9YCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyDmm7TmlrDmnJ/mnJvlgLzkuLrlrp7pmYXnmoTnu4Tku7ZJROWvueixoeagvOW8j++8jOeUqOS6juWQjue7remqjOivgVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY29tcG9uZW50SWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFjdHVhbEV4cGVjdGVkVmFsdWUgPSB7IHV1aWQ6IGNvbXBvbmVudElkIH07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIOWwneivleS9v+eUqOS4juiKgueCuS/otYTmupDlvJXnlKjnm7jlkIznmoTmoLzlvI/vvJp7dXVpZDogY29tcG9uZW50SWR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIOa1i+ivleeci+aYr+WQpuiDveato+ehruiuvue9rue7hOS7tuW8leeUqFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCBFZGl0b3IuTWVzc2FnZS5yZXF1ZXN0KCdzY2VuZScsICdzZXQtcHJvcGVydHknLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1dWlkOiBub2RlVXVpZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhdGg6IHByb3BlcnR5UGF0aCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR1bXA6IHsgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHsgdXVpZDogY29tcG9uZW50SWQgfSwgIC8vIOS9v+eUqOWvueixoeagvOW8j++8jOWDj+iKgueCuS/otYTmupDlvJXnlKjkuIDmoLdcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBleHBlY3RlZENvbXBvbmVudFR5cGVcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoYFtDb21wb25lbnRUb29sc10gRXJyb3Igc2V0dGluZyBjb21wb25lbnQgcmVmZXJlbmNlOmAsIGVycm9yKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgZXJyb3I7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChhY3R1YWxQcm9wZXJ0eVR5cGUgPT09ICdub2RlQXJyYXknICYmIEFycmF5LmlzQXJyYXkocHJvY2Vzc2VkVmFsdWUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8g54m55q6K5aSE55CG6IqC54K55pWw57uEIC0g5L+d5oyB6aKE5aSE55CG55qE5qC85byPXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coYFtDb21wb25lbnRUb29sc10gU2V0dGluZyBub2RlIGFycmF5OmAsIHByb2Nlc3NlZFZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICBhd2FpdCBFZGl0b3IuTWVzc2FnZS5yZXF1ZXN0KCdzY2VuZScsICdzZXQtcHJvcGVydHknLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHV1aWQ6IG5vZGVVdWlkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXRoOiBwcm9wZXJ0eVBhdGgsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGR1bXA6IHsgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogcHJvY2Vzc2VkVmFsdWUgIC8vIOS/neaMgSBbe3V1aWQ6IFwiLi4uXCJ9LCB7dXVpZDogXCIuLi5cIn1dIOagvOW8j1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGFjdHVhbFByb3BlcnR5VHlwZSA9PT0gJ2NvbG9yQXJyYXknICYmIEFycmF5LmlzQXJyYXkocHJvY2Vzc2VkVmFsdWUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8g54m55q6K5aSE55CG6aKc6Imy5pWw57uEXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY29sb3JBcnJheVZhbHVlID0gcHJvY2Vzc2VkVmFsdWUubWFwKChpdGVtOiBhbnkpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZW0gJiYgdHlwZW9mIGl0ZW0gPT09ICdvYmplY3QnICYmICdyJyBpbiBpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHI6IE1hdGgubWluKDI1NSwgTWF0aC5tYXgoMCwgTnVtYmVyKGl0ZW0ucikgfHwgMCkpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGc6IE1hdGgubWluKDI1NSwgTWF0aC5tYXgoMCwgTnVtYmVyKGl0ZW0uZykgfHwgMCkpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGI6IE1hdGgubWluKDI1NSwgTWF0aC5tYXgoMCwgTnVtYmVyKGl0ZW0uYikgfHwgMCkpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGE6IGl0ZW0uYSAhPT0gdW5kZWZpbmVkID8gTWF0aC5taW4oMjU1LCBNYXRoLm1heCgwLCBOdW1iZXIoaXRlbS5hKSkpIDogMjU1XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSwgYTogMjU1IH07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICBhd2FpdCBFZGl0b3IuTWVzc2FnZS5yZXF1ZXN0KCdzY2VuZScsICdzZXQtcHJvcGVydHknLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHV1aWQ6IG5vZGVVdWlkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXRoOiBwcm9wZXJ0eVBhdGgsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGR1bXA6IHsgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogY29sb3JBcnJheVZhbHVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2NjLkNvbG9yJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIE5vcm1hbCBwcm9wZXJ0eSBzZXR0aW5nIGZvciBub24tYXNzZXQgcHJvcGVydGllc1xyXG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IEVkaXRvci5NZXNzYWdlLnJlcXVlc3QoJ3NjZW5lJywgJ3NldC1wcm9wZXJ0eScsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdXVpZDogbm9kZVV1aWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhdGg6IHByb3BlcnR5UGF0aCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZHVtcDogeyB2YWx1ZTogcHJvY2Vzc2VkVmFsdWUgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAvLyBTdGVwIDU6IOetieW+hUVkaXRvcuWujOaIkOabtOaWsO+8jOeEtuWQjumqjOivgeiuvue9rue7k+aenFxyXG4gICAgICAgICAgICAgICAgYXdhaXQgbmV3IFByb21pc2UocmVzb2x2ZSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIDIwMCkpOyAvLyDnrYnlvoUyMDBtc+iuqUVkaXRvcuWujOaIkOabtOaWsFxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBjb25zdCB2ZXJpZmljYXRpb24gPSBhd2FpdCB0aGlzLnZlcmlmeVByb3BlcnR5Q2hhbmdlKG5vZGVVdWlkLCBjb21wb25lbnRUeXBlLCBwcm9wZXJ0eSwgb3JpZ2luYWxWYWx1ZSwgYWN0dWFsRXhwZWN0ZWRWYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIHJlc29sdmUoe1xyXG4gICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogYFN1Y2Nlc3NmdWxseSBzZXQgJHtjb21wb25lbnRUeXBlfS4ke3Byb3BlcnR5fWAsXHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBub2RlVXVpZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50VHlwZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvcGVydHksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjdHVhbFZhbHVlOiB2ZXJpZmljYXRpb24uYWN0dWFsVmFsdWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoYW5nZVZlcmlmaWVkOiB2ZXJpZmljYXRpb24udmVyaWZpZWRcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB9IGNhdGNoIChlcnJvcjogYW55KSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGBbQ29tcG9uZW50VG9vbHNdIEVycm9yIHNldHRpbmcgcHJvcGVydHk6YCwgZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgZXJyb3I6IGBGYWlsZWQgdG8gc2V0IHByb3BlcnR5OiAke2Vycm9yLm1lc3NhZ2V9YFxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOaJuemHj+iuvue9rue7hOS7tueahOWkmuS4quWxnuaAp1xyXG4gICAgICogQHBhcmFtIGFyZ3Mg5YyF5ZCrIG5vZGVVdWlkLCBjb21wb25lbnRUeXBlLCBwcm9wZXJ0aWVzIOaVsOe7hFxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGFzeW5jIHNldENvbXBvbmVudFByb3BlcnRpZXMoYXJnczogYW55KTogUHJvbWlzZTxUb29sUmVzcG9uc2U+IHtcclxuICAgICAgICBjb25zdCB7IG5vZGVVdWlkLCBjb21wb25lbnRUeXBlLCBwcm9wZXJ0aWVzIH0gPSBhcmdzO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAocmVzb2x2ZSkgPT4ge1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgLy8g6aqM6K+B5b+F6KaB5Y+C5pWwXHJcbiAgICAgICAgICAgICAgICBpZiAoIW5vZGVVdWlkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSh7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogJ25vZGVVdWlkIGlzIHJlcXVpcmVkJyB9KTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoIWNvbXBvbmVudFR5cGUpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiAnY29tcG9uZW50VHlwZSBpcyByZXF1aXJlZCcgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKCFwcm9wZXJ0aWVzIHx8ICFBcnJheS5pc0FycmF5KHByb3BlcnRpZXMpIHx8IHByb3BlcnRpZXMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSh7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogJ3Byb3BlcnRpZXMgYXJyYXkgaXMgcmVxdWlyZWQgYW5kIG11c3Qgbm90IGJlIGVtcHR5JyB9KTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGBbQ29tcG9uZW50VG9vbHNdIEJhdGNoIHNldHRpbmcgJHtwcm9wZXJ0aWVzLmxlbmd0aH0gcHJvcGVydGllcyBvbiAke2NvbXBvbmVudFR5cGV9IGZvciBub2RlICR7bm9kZVV1aWR9YCk7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIC8vIOWFiOajgOafpee7hOS7tuaYr+WQpuWtmOWcqFxyXG4gICAgICAgICAgICAgICAgY29uc3QgY29tcG9uZW50c1Jlc3BvbnNlID0gYXdhaXQgdGhpcy5nZXRDb21wb25lbnRzKG5vZGVVdWlkKTtcclxuICAgICAgICAgICAgICAgIGlmICghY29tcG9uZW50c1Jlc3BvbnNlLnN1Y2Nlc3MgfHwgIWNvbXBvbmVudHNSZXNwb25zZS5kYXRhPy5jb21wb25lbnRzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvcjogYEZhaWxlZCB0byBnZXQgY29tcG9uZW50czogJHtjb21wb25lbnRzUmVzcG9uc2UuZXJyb3J9YFxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgY29uc3QgYXZhaWxhYmxlVHlwZXMgPSBjb21wb25lbnRzUmVzcG9uc2UuZGF0YS5jb21wb25lbnRzLm1hcCgoYzogYW55KSA9PiBjLnR5cGUpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdGFyZ2V0Q29tcG9uZW50ID0gY29tcG9uZW50c1Jlc3BvbnNlLmRhdGEuY29tcG9uZW50cy5maW5kKChjb21wOiBhbnkpID0+IGNvbXAudHlwZSA9PT0gY29tcG9uZW50VHlwZSk7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGlmICghdGFyZ2V0Q29tcG9uZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaW5zdHJ1Y3Rpb24gPSB0aGlzLmdlbmVyYXRlQ29tcG9uZW50U3VnZ2VzdGlvbihjb21wb25lbnRUeXBlLCBhdmFpbGFibGVUeXBlcywgJycpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3I6IGBDb21wb25lbnQgJyR7Y29tcG9uZW50VHlwZX0nIG5vdCBmb3VuZCBvbiBub2RlLiBBdmFpbGFibGUgY29tcG9uZW50czogJHthdmFpbGFibGVUeXBlcy5qb2luKCcsICcpfWAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGluc3RydWN0aW9uOiBpbnN0cnVjdGlvblxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgLy8g6YCQ5Liq6K6+572u5bGe5oCnXHJcbiAgICAgICAgICAgICAgICBjb25zdCByZXN1bHRzOiBBcnJheTx7IHByb3BlcnR5OiBzdHJpbmc7IHN1Y2Nlc3M6IGJvb2xlYW47IGVycm9yPzogc3RyaW5nIH0+ID0gW107XHJcbiAgICAgICAgICAgICAgICBsZXQgaGFzRXJyb3IgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwcm9wZXJ0aWVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcHJvcFNldHRpbmcgPSBwcm9wZXJ0aWVzW2ldO1xyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIC8vIOmqjOivgeavj+S4quWxnuaAp+iuvue9rueahOW/hemcgOWtl+autVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICghcHJvcFNldHRpbmcucHJvcGVydHkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0cy5wdXNoKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3BlcnR5OiBgaW5kZXhfJHtpfWAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yOiAncHJvcGVydHkgbmFtZSBpcyByZXF1aXJlZCdcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhhc0Vycm9yID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChwcm9wU2V0dGluZy52YWx1ZSA9PT0gdW5kZWZpbmVkIHx8IHByb3BTZXR0aW5nLnZhbHVlID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdHMucHVzaCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0eTogcHJvcFNldHRpbmcucHJvcGVydHksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yOiAndmFsdWUgaXMgcmVxdWlyZWQnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBoYXNFcnJvciA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyDmnoTpgKDljZXkuKrlsZ7mgKforr7nva7nmoTlj4LmlbBcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgc2luZ2xlUHJvcEFyZ3MgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBub2RlVXVpZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudFR5cGUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0eTogcHJvcFNldHRpbmcucHJvcGVydHksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0eVR5cGU6IHByb3BTZXR0aW5nLnByb3BlcnR5VHlwZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBwcm9wU2V0dGluZy52YWx1ZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8g6LCD55So546w5pyJ55qE5Y2V5bGe5oCn6K6+572u5pa55rOVXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHRoaXMuc2V0Q29tcG9uZW50UHJvcGVydHkoc2luZ2xlUHJvcEFyZ3MpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0cy5wdXNoKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3BlcnR5OiBwcm9wU2V0dGluZy5wcm9wZXJ0eSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IHJlc3VsdC5zdWNjZXNzLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3I6IHJlc3VsdC5lcnJvclxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghcmVzdWx0LnN1Y2Nlc3MpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhhc0Vycm9yID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihgW0NvbXBvbmVudFRvb2xzXSBGYWlsZWQgdG8gc2V0IHByb3BlcnR5ICcke3Byb3BTZXR0aW5nLnByb3BlcnR5fSc6ICR7cmVzdWx0LmVycm9yfWApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3I6IGFueSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRzLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvcGVydHk6IHByb3BTZXR0aW5nLnByb3BlcnR5LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlcnJvcjogZXJyb3IubWVzc2FnZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaGFzRXJyb3IgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGBbQ29tcG9uZW50VG9vbHNdIEVycm9yIHNldHRpbmcgcHJvcGVydHkgJyR7cHJvcFNldHRpbmcucHJvcGVydHl9JzpgLCBlcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAvLyDov5Tlm57mibnph4/mk43kvZznu5PmnpxcclxuICAgICAgICAgICAgICAgIGNvbnN0IHN1Y2Nlc3NDb3VudCA9IHJlc3VsdHMuZmlsdGVyKHIgPT4gci5zdWNjZXNzKS5sZW5ndGg7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBmYWlsQ291bnQgPSByZXN1bHRzLmZpbHRlcihyID0+ICFyLnN1Y2Nlc3MpLmxlbmd0aDtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogIWhhc0Vycm9yLFxyXG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGBCYXRjaCBwcm9wZXJ0eSB1cGRhdGUgY29tcGxldGVkOiAke3N1Y2Nlc3NDb3VudH0gc3VjY2VlZGVkLCAke2ZhaWxDb3VudH0gZmFpbGVkYCxcclxuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vZGVVdWlkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb21wb25lbnRUeXBlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0b3RhbFByb3BlcnRpZXM6IHByb3BlcnRpZXMubGVuZ3RoLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzQ291bnQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZhaWxDb3VudCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0c1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yOiBhbnkpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoYFtDb21wb25lbnRUb29sc10gRXJyb3IgaW4gYmF0Y2ggcHJvcGVydHkgdXBkYXRlOmAsIGVycm9yKTtcclxuICAgICAgICAgICAgICAgIHJlc29sdmUoe1xyXG4gICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgIGVycm9yOiBgQmF0Y2ggcHJvcGVydHkgdXBkYXRlIGZhaWxlZDogJHtlcnJvci5tZXNzYWdlfWBcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIHByaXZhdGUgYXN5bmMgYXR0YWNoU2NyaXB0KG5vZGVVdWlkOiBzdHJpbmcsIHNjcmlwdFBhdGg6IHN0cmluZyk6IFByb21pc2U8VG9vbFJlc3BvbnNlPiB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIChyZXNvbHZlKSA9PiB7XHJcbiAgICAgICAgICAgIC8vIOmqjOivgeW/heimgeWPguaVsFxyXG4gICAgICAgICAgICBpZiAoIW5vZGVVdWlkKSB7XHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiAnbm9kZVV1aWQgaXMgcmVxdWlyZWQnIH0pO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICghc2NyaXB0UGF0aCkge1xyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZSh7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogJ3NjcmlwdFBhdGggaXMgcmVxdWlyZWQnIH0pO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAvLyDku47ohJrmnKzot6/lvoTmj5Dlj5bnu4Tku7bnsbvlkI1cclxuICAgICAgICAgICAgY29uc3Qgc2NyaXB0TmFtZSA9IHNjcmlwdFBhdGguc3BsaXQoJy8nKS5wb3AoKT8ucmVwbGFjZSgnLnRzJywgJycpLnJlcGxhY2UoJy5qcycsICcnKTtcclxuICAgICAgICAgICAgaWYgKCFzY3JpcHROYW1lKSB7XHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiAnSW52YWxpZCBzY3JpcHQgcGF0aCcgfSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8g5YWI5p+l5om+6IqC54K55LiK5piv5ZCm5bey5a2Y5Zyo6K+l6ISa5pys57uE5Lu2XHJcbiAgICAgICAgICAgIGNvbnN0IGFsbENvbXBvbmVudHNJbmZvID0gYXdhaXQgdGhpcy5nZXRDb21wb25lbnRzKG5vZGVVdWlkKTtcclxuICAgICAgICAgICAgaWYgKGFsbENvbXBvbmVudHNJbmZvLnN1Y2Nlc3MgJiYgYWxsQ29tcG9uZW50c0luZm8uZGF0YT8uY29tcG9uZW50cykge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZXhpc3RpbmdTY3JpcHQgPSBhbGxDb21wb25lbnRzSW5mby5kYXRhLmNvbXBvbmVudHMuZmluZCgoY29tcDogYW55KSA9PiBjb21wLnR5cGUgPT09IHNjcmlwdE5hbWUpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGV4aXN0aW5nU2NyaXB0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGBTY3JpcHQgJyR7c2NyaXB0TmFtZX0nIGFscmVhZHkgZXhpc3RzIG9uIG5vZGVgLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBub2RlVXVpZDogbm9kZVV1aWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wb25lbnROYW1lOiBzY3JpcHROYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXhpc3Rpbmc6IHRydWVcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyDpppblhYjlsJ3or5Xnm7TmjqXkvb/nlKjohJrmnKzlkI3np7DkvZzkuLrnu4Tku7bnsbvlnotcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIGF3YWl0IEVkaXRvci5NZXNzYWdlLnJlcXVlc3QoJ3NjZW5lJywgJ2NyZWF0ZS1jb21wb25lbnQnLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgdXVpZDogbm9kZVV1aWQsXHJcbiAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50OiBzY3JpcHROYW1lICAvLyDkvb/nlKjohJrmnKzlkI3np7DogIzpnZ5VVUlEXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgLy8g562J5b6F5LiA5q615pe26Ze06K6pRWRpdG9y5a6M5oiQ57uE5Lu25re75YqgXHJcbiAgICAgICAgICAgICAgICBhd2FpdCBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgMTAwKSk7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIC8vIOmHjeaWsOafpeivouiKgueCueS/oeaBr+mqjOivgeiEmuacrOaYr+WQpuecn+eahOa3u+WKoOaIkOWKn1xyXG4gICAgICAgICAgICAgICAgY29uc3QgYWxsQ29tcG9uZW50c0luZm8yID0gYXdhaXQgdGhpcy5nZXRDb21wb25lbnRzKG5vZGVVdWlkKTtcclxuICAgICAgICAgICAgICAgIGlmIChhbGxDb21wb25lbnRzSW5mbzIuc3VjY2VzcyAmJiBhbGxDb21wb25lbnRzSW5mbzIuZGF0YT8uY29tcG9uZW50cykge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGFkZGVkU2NyaXB0ID0gYWxsQ29tcG9uZW50c0luZm8yLmRhdGEuY29tcG9uZW50cy5maW5kKChjb21wOiBhbnkpID0+IGNvbXAudHlwZSA9PT0gc2NyaXB0TmFtZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFkZGVkU2NyaXB0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGBTY3JpcHQgJyR7c2NyaXB0TmFtZX0nIGF0dGFjaGVkIHN1Y2Nlc3NmdWxseWAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbm9kZVV1aWQ6IG5vZGVVdWlkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudE5hbWU6IHNjcmlwdE5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXhpc3Rpbmc6IGZhbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlcnJvcjogYFNjcmlwdCAnJHtzY3JpcHROYW1lfScgd2FzIG5vdCBmb3VuZCBvbiBub2RlIGFmdGVyIGFkZGl0aW9uLiBBdmFpbGFibGUgY29tcG9uZW50czogJHthbGxDb21wb25lbnRzSW5mbzIuZGF0YS5jb21wb25lbnRzLm1hcCgoYzogYW55KSA9PiBjLnR5cGUpLmpvaW4oJywgJyl9YFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3I6IGBGYWlsZWQgdG8gdmVyaWZ5IHNjcmlwdCBhZGRpdGlvbjogJHthbGxDb21wb25lbnRzSW5mbzIuZXJyb3IgfHwgJ1VuYWJsZSB0byBnZXQgbm9kZSBjb21wb25lbnRzJ31gXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycjogYW55KSB7XHJcbiAgICAgICAgICAgICAgICAvLyDlpIfnlKjmlrnmoYjvvJrkvb/nlKjlnLrmma/ohJrmnKxcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihgW0NvbXBvbmVudFRvb2xzXSBEaXJlY3QgQVBJIGZhaWxlZCBmb3Igc2NyaXB0IGF0dGFjaG1lbnQsIHRyeWluZyBzY2VuZSBzY3JpcHQ6ICR7ZXJyLm1lc3NhZ2V9YCk7XHJcbiAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG9wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICdjb2Nvcy1tY3Atc2VydmVyJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWV0aG9kOiAnYXR0YWNoU2NyaXB0JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXJnczogW25vZGVVdWlkLCBzY3JpcHRQYXRoXVxyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgRWRpdG9yLk1lc3NhZ2UucmVxdWVzdCgnc2NlbmUnLCAnZXhlY3V0ZS1zY2VuZS1zY3JpcHQnLCBvcHRpb25zKTtcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnIyOiBhbnkpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHsgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZhbHNlLCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3I6IGBGYWlsZWQgdG8gYXR0YWNoIHNjcmlwdCAnJHtzY3JpcHROYW1lfSc6ICR7ZXJyLm1lc3NhZ2V9YCwgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGluc3RydWN0aW9uOiAnUGxlYXNlIGVuc3VyZSB0aGUgc2NyaXB0IGlzIHByb3Blcmx5IGNvbXBpbGVkIGFuZCBleHBvcnRlZCBhcyBhIENvbXBvbmVudCBjbGFzcy4gWW91IGNhbiBhbHNvIG1hbnVhbGx5IGF0dGFjaCB0aGUgc2NyaXB0IHRocm91Z2ggdGhlIFByb3BlcnRpZXMgcGFuZWwgaW4gdGhlIGVkaXRvci4nXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGFzeW5jIGdldEF2YWlsYWJsZUNvbXBvbmVudHMoY2F0ZWdvcnk6IHN0cmluZyA9ICdhbGwnKTogUHJvbWlzZTxUb29sUmVzcG9uc2U+IHtcclxuICAgICAgICBjb25zdCBjb21wb25lbnRDYXRlZ29yaWVzOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmdbXT4gPSB7XHJcbiAgICAgICAgICAgIHJlbmRlcmVyOiBbJ2NjLlNwcml0ZScsICdjYy5MYWJlbCcsICdjYy5SaWNoVGV4dCcsICdjYy5NYXNrJywgJ2NjLkdyYXBoaWNzJ10sXHJcbiAgICAgICAgICAgIHVpOiBbJ2NjLkJ1dHRvbicsICdjYy5Ub2dnbGUnLCAnY2MuU2xpZGVyJywgJ2NjLlNjcm9sbFZpZXcnLCAnY2MuRWRpdEJveCcsICdjYy5Qcm9ncmVzc0JhciddLFxyXG4gICAgICAgICAgICBwaHlzaWNzOiBbJ2NjLlJpZ2lkQm9keTJEJywgJ2NjLkJveENvbGxpZGVyMkQnLCAnY2MuQ2lyY2xlQ29sbGlkZXIyRCcsICdjYy5Qb2x5Z29uQ29sbGlkZXIyRCddLFxyXG4gICAgICAgICAgICBhbmltYXRpb246IFsnY2MuQW5pbWF0aW9uJywgJ2NjLkFuaW1hdGlvbkNsaXAnLCAnY2MuU2tlbGV0YWxBbmltYXRpb24nXSxcclxuICAgICAgICAgICAgYXVkaW86IFsnY2MuQXVkaW9Tb3VyY2UnXSxcclxuICAgICAgICAgICAgbGF5b3V0OiBbJ2NjLkxheW91dCcsICdjYy5XaWRnZXQnLCAnY2MuUGFnZVZpZXcnLCAnY2MuUGFnZVZpZXdJbmRpY2F0b3InXSxcclxuICAgICAgICAgICAgZWZmZWN0czogWydjYy5Nb3Rpb25TdHJlYWsnLCAnY2MuUGFydGljbGVTeXN0ZW0yRCddLFxyXG4gICAgICAgICAgICBjYW1lcmE6IFsnY2MuQ2FtZXJhJ10sXHJcbiAgICAgICAgICAgIGxpZ2h0OiBbJ2NjLkxpZ2h0JywgJ2NjLkRpcmVjdGlvbmFsTGlnaHQnLCAnY2MuUG9pbnRMaWdodCcsICdjYy5TcG90TGlnaHQnXVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGxldCBjb21wb25lbnRzOiBzdHJpbmdbXSA9IFtdO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGlmIChjYXRlZ29yeSA9PT0gJ2FsbCcpIHtcclxuICAgICAgICAgICAgZm9yIChjb25zdCBjYXQgaW4gY29tcG9uZW50Q2F0ZWdvcmllcykge1xyXG4gICAgICAgICAgICAgICAgY29tcG9uZW50cyA9IGNvbXBvbmVudHMuY29uY2F0KGNvbXBvbmVudENhdGVnb3JpZXNbY2F0XSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgaWYgKGNvbXBvbmVudENhdGVnb3JpZXNbY2F0ZWdvcnldKSB7XHJcbiAgICAgICAgICAgIGNvbXBvbmVudHMgPSBjb21wb25lbnRDYXRlZ29yaWVzW2NhdGVnb3J5XTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHN1Y2Nlc3M6IHRydWUsXHJcbiAgICAgICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgICAgICAgIGNhdGVnb3J5OiBjYXRlZ29yeSxcclxuICAgICAgICAgICAgICAgIGNvbXBvbmVudHM6IGNvbXBvbmVudHNcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBpc1ZhbGlkUHJvcGVydHlEZXNjcmlwdG9yKHByb3BEYXRhOiBhbnkpOiBib29sZWFuIHtcclxuICAgICAgICAvLyDmo4Dmn6XmmK/lkKbmmK/mnInmlYjnmoTlsZ7mgKfmj4/ov7Dlr7nosaFcclxuICAgICAgICBpZiAodHlwZW9mIHByb3BEYXRhICE9PSAnb2JqZWN0JyB8fCBwcm9wRGF0YSA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyhwcm9wRGF0YSk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAvLyDpgb/lhY3pgY3ljobnroDljZXnmoTmlbDlgLzlr7nosaHvvIjlpoIge3dpZHRoOiAyMDAsIGhlaWdodDogMTUwfe+8iVxyXG4gICAgICAgICAgICBjb25zdCBpc1NpbXBsZVZhbHVlT2JqZWN0ID0ga2V5cy5ldmVyeShrZXkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdmFsdWUgPSBwcm9wRGF0YVtrZXldO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicgfHwgdHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyB8fCB0eXBlb2YgdmFsdWUgPT09ICdib29sZWFuJztcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBpZiAoaXNTaW1wbGVWYWx1ZU9iamVjdCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAvLyDmo4Dmn6XmmK/lkKbljIXlkKvlsZ7mgKfmj4/ov7DnrKbnmoTnibnlvoHlrZfmrrXvvIzkuI3kvb/nlKgnaW4n5pON5L2c56ymXHJcbiAgICAgICAgICAgIGNvbnN0IGhhc05hbWUgPSBrZXlzLmluY2x1ZGVzKCduYW1lJyk7XHJcbiAgICAgICAgICAgIGNvbnN0IGhhc1ZhbHVlID0ga2V5cy5pbmNsdWRlcygndmFsdWUnKTtcclxuICAgICAgICAgICAgY29uc3QgaGFzVHlwZSA9IGtleXMuaW5jbHVkZXMoJ3R5cGUnKTtcclxuICAgICAgICAgICAgY29uc3QgaGFzRGlzcGxheU5hbWUgPSBrZXlzLmluY2x1ZGVzKCdkaXNwbGF5TmFtZScpO1xyXG4gICAgICAgICAgICBjb25zdCBoYXNSZWFkb25seSA9IGtleXMuaW5jbHVkZXMoJ3JlYWRvbmx5Jyk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAvLyDlv4XpobvljIXlkKtuYW1l5oiWdmFsdWXlrZfmrrXvvIzkuJTpgJrluLjov5jmnIl0eXBl5a2X5q61XHJcbiAgICAgICAgICAgIGNvbnN0IGhhc1ZhbGlkU3RydWN0dXJlID0gKGhhc05hbWUgfHwgaGFzVmFsdWUpICYmIChoYXNUeXBlIHx8IGhhc0Rpc3BsYXlOYW1lIHx8IGhhc1JlYWRvbmx5KTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIC8vIOmineWkluajgOafpe+8muWmguaenOaciWRlZmF1bHTlrZfmrrXkuJTnu5PmnoTlpI3mnYLvvIzpgb/lhY3mt7HluqbpgY3ljoZcclxuICAgICAgICAgICAgaWYgKGtleXMuaW5jbHVkZXMoJ2RlZmF1bHQnKSAmJiBwcm9wRGF0YS5kZWZhdWx0ICYmIHR5cGVvZiBwcm9wRGF0YS5kZWZhdWx0ID09PSAnb2JqZWN0Jykge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZGVmYXVsdEtleXMgPSBPYmplY3Qua2V5cyhwcm9wRGF0YS5kZWZhdWx0KTtcclxuICAgICAgICAgICAgICAgIGlmIChkZWZhdWx0S2V5cy5pbmNsdWRlcygndmFsdWUnKSAmJiB0eXBlb2YgcHJvcERhdGEuZGVmYXVsdC52YWx1ZSA9PT0gJ29iamVjdCcpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyDov5nnp43mg4XlhrXkuIvvvIzmiJHku6zlj6rov5Tlm57pobblsYLlsZ7mgKfvvIzkuI3mt7HlhaXpgY3ljoZkZWZhdWx0LnZhbHVlXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGhhc1ZhbGlkU3RydWN0dXJlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICByZXR1cm4gaGFzVmFsaWRTdHJ1Y3R1cmU7XHJcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgY29uc29sZS53YXJuKGBbaXNWYWxpZFByb3BlcnR5RGVzY3JpcHRvcl0gRXJyb3IgY2hlY2tpbmcgcHJvcGVydHkgZGVzY3JpcHRvcjpgLCBlcnJvcik7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBhbmFseXplUHJvcGVydHkoY29tcG9uZW50OiBhbnksIHByb3BlcnR5TmFtZTogc3RyaW5nKTogeyBleGlzdHM6IGJvb2xlYW47IHR5cGU6IHN0cmluZzsgYXZhaWxhYmxlUHJvcGVydGllczogc3RyaW5nW107IG9yaWdpbmFsVmFsdWU6IGFueSB9IHtcclxuICAgICAgICAvLyDku47lpI3mnYLnmoTnu4Tku7bnu5PmnoTkuK3mj5Dlj5blj6/nlKjlsZ7mgKdcclxuICAgICAgICBjb25zdCBhdmFpbGFibGVQcm9wZXJ0aWVzOiBzdHJpbmdbXSA9IFtdO1xyXG4gICAgICAgIGxldCBwcm9wZXJ0eVZhbHVlOiBhbnkgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgbGV0IHByb3BlcnR5RXhpc3RzID0gZmFsc2U7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8g5bCd6K+V5aSa56eN5pa55byP5p+l5om+5bGe5oCn77yaXHJcbiAgICAgICAgLy8gMS4g55u05o6l5bGe5oCn6K6/6ZeuXHJcbiAgICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChjb21wb25lbnQsIHByb3BlcnR5TmFtZSkpIHtcclxuICAgICAgICAgICAgcHJvcGVydHlWYWx1ZSA9IGNvbXBvbmVudFtwcm9wZXJ0eU5hbWVdO1xyXG4gICAgICAgICAgICBwcm9wZXJ0eUV4aXN0cyA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIDIuIOS7juW1jOWll+e7k+aehOS4reafpeaJviAo5aaC5LuO5rWL6K+V5pWw5o2u55yL5Yiw55qE5aSN5p2C57uT5p6EKVxyXG4gICAgICAgIGlmICghcHJvcGVydHlFeGlzdHMgJiYgY29tcG9uZW50LnByb3BlcnRpZXMgJiYgdHlwZW9mIGNvbXBvbmVudC5wcm9wZXJ0aWVzID09PSAnb2JqZWN0Jykge1xyXG4gICAgICAgICAgICAvLyDpppblhYjmo4Dmn6Vwcm9wZXJ0aWVzLnZhbHVl5piv5ZCm5a2Y5Zyo77yI6L+Z5piv5oiR5Lus5ZyoZ2V0Q29tcG9uZW50c+S4reeci+WIsOeahOe7k+aehO+8iVxyXG4gICAgICAgICAgICBpZiAoY29tcG9uZW50LnByb3BlcnRpZXMudmFsdWUgJiYgdHlwZW9mIGNvbXBvbmVudC5wcm9wZXJ0aWVzLnZhbHVlID09PSAnb2JqZWN0Jykge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdmFsdWVPYmogPSBjb21wb25lbnQucHJvcGVydGllcy52YWx1ZTtcclxuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgW2tleSwgcHJvcERhdGFdIG9mIE9iamVjdC5lbnRyaWVzKHZhbHVlT2JqKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIOajgOafpXByb3BEYXRh5piv5ZCm5piv5LiA5Liq5pyJ5pWI55qE5bGe5oCn5o+P6L+w5a+56LGhXHJcbiAgICAgICAgICAgICAgICAgICAgLy8g56Gu5L+dcHJvcERhdGHmmK/lr7nosaHkuJTljIXlkKvpooTmnJ/nmoTlsZ7mgKfnu5PmnoRcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5pc1ZhbGlkUHJvcGVydHlEZXNjcmlwdG9yKHByb3BEYXRhKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBwcm9wSW5mbyA9IHByb3BEYXRhIGFzIGFueTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXZhaWxhYmxlUHJvcGVydGllcy5wdXNoKGtleSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChrZXkgPT09IHByb3BlcnR5TmFtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g5LyY5YWI5L2/55SodmFsdWXlsZ7mgKfvvIzlpoLmnpzmsqHmnInliJnkvb/nlKhwcm9wRGF0YeacrOi6q1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBwcm9wS2V5cyA9IE9iamVjdC5rZXlzKHByb3BJbmZvKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0eVZhbHVlID0gcHJvcEtleXMuaW5jbHVkZXMoJ3ZhbHVlJykgPyBwcm9wSW5mby52YWx1ZSA6IHByb3BJbmZvO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDlpoLmnpzmo4Dmn6XlpLHotKXvvIznm7TmjqXkvb/nlKhwcm9wSW5mb1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3BlcnR5VmFsdWUgPSBwcm9wSW5mbztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3BlcnR5RXhpc3RzID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIC8vIOWkh+eUqOaWueahiO+8muebtOaOpeS7jnByb3BlcnRpZXPmn6Xmib5cclxuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgW2tleSwgcHJvcERhdGFdIG9mIE9iamVjdC5lbnRyaWVzKGNvbXBvbmVudC5wcm9wZXJ0aWVzKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzVmFsaWRQcm9wZXJ0eURlc2NyaXB0b3IocHJvcERhdGEpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHByb3BJbmZvID0gcHJvcERhdGEgYXMgYW55O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhdmFpbGFibGVQcm9wZXJ0aWVzLnB1c2goa2V5KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGtleSA9PT0gcHJvcGVydHlOYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDkvJjlhYjkvb/nlKh2YWx1ZeWxnuaAp++8jOWmguaenOayoeacieWImeS9v+eUqHByb3BEYXRh5pys6LqrXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHByb3BLZXlzID0gT2JqZWN0LmtleXMocHJvcEluZm8pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3BlcnR5VmFsdWUgPSBwcm9wS2V5cy5pbmNsdWRlcygndmFsdWUnKSA/IHByb3BJbmZvLnZhbHVlIDogcHJvcEluZm87XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOWmguaenOajgOafpeWksei0pe+8jOebtOaOpeS9v+eUqHByb3BJbmZvXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvcGVydHlWYWx1ZSA9IHByb3BJbmZvO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvcGVydHlFeGlzdHMgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIDMuIOS7juebtOaOpeWxnuaAp+S4reaPkOWPlueugOWNleWxnuaAp+WQjVxyXG4gICAgICAgIGlmIChhdmFpbGFibGVQcm9wZXJ0aWVzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICBmb3IgKGNvbnN0IGtleSBvZiBPYmplY3Qua2V5cyhjb21wb25lbnQpKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIWtleS5zdGFydHNXaXRoKCdfJykgJiYgIVsnX190eXBlX18nLCAnY2lkJywgJ25vZGUnLCAndXVpZCcsICduYW1lJywgJ2VuYWJsZWQnLCAndHlwZScsICdyZWFkb25seScsICd2aXNpYmxlJ10uaW5jbHVkZXMoa2V5KSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGF2YWlsYWJsZVByb3BlcnRpZXMucHVzaChrZXkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGlmICghcHJvcGVydHlFeGlzdHMpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIGV4aXN0czogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICB0eXBlOiAndW5rbm93bicsXHJcbiAgICAgICAgICAgICAgICBhdmFpbGFibGVQcm9wZXJ0aWVzLFxyXG4gICAgICAgICAgICAgICAgb3JpZ2luYWxWYWx1ZTogdW5kZWZpbmVkXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgdHlwZSA9ICd1bmtub3duJztcclxuXHJcbiAgICAgICAgLy8g6aaW5YWI5qOA5p+l5bGe5oCn5o+P6L+w56ym5Lit55qEIHR5cGUg5a2X5q6177yI6L+Z5piv5pyA5YeG56Gu55qE57G75Z6L5L+h5oGv77yJXHJcbiAgICAgICAgaWYgKHByb3BlcnR5VmFsdWUgJiYgdHlwZW9mIHByb3BlcnR5VmFsdWUgPT09ICdvYmplY3QnICYmIHByb3BlcnR5VmFsdWUudHlwZSkge1xyXG4gICAgICAgICAgICBjb25zdCBkZWNsYXJlZFR5cGUgPSBwcm9wZXJ0eVZhbHVlLnR5cGU7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGBbYW5hbHl6ZVByb3BlcnR5XSBGb3VuZCBkZWNsYXJlZCB0eXBlOiAke2RlY2xhcmVkVHlwZX0gZm9yIHByb3BlcnR5ICR7cHJvcGVydHlOYW1lfWApO1xyXG5cclxuICAgICAgICAgICAgLy8g5qC55o2u5aOw5piO55qE57G75Z6L56Gu5a6a5aSE55CG5pa55byPXHJcbiAgICAgICAgICAgIGlmIChkZWNsYXJlZFR5cGUgPT09ICdjYy5Ob2RlJyB8fCBkZWNsYXJlZFR5cGUgPT09ICdjYy5Ob2RlW10nKSB7XHJcbiAgICAgICAgICAgICAgICB0eXBlID0gZGVjbGFyZWRUeXBlID09PSAnY2MuTm9kZVtdJyA/ICdub2RlQXJyYXknIDogJ25vZGUnO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgICBleGlzdHM6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZSxcclxuICAgICAgICAgICAgICAgICAgICBhdmFpbGFibGVQcm9wZXJ0aWVzLFxyXG4gICAgICAgICAgICAgICAgICAgIG9yaWdpbmFsVmFsdWU6IHByb3BlcnR5VmFsdWUudmFsdWUgIT09IHVuZGVmaW5lZCA/IHByb3BlcnR5VmFsdWUudmFsdWUgOiBwcm9wZXJ0eVZhbHVlXHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGRlY2xhcmVkVHlwZSA9PT0gJ2NjLkNvbXBvbmVudCcgfHwgZGVjbGFyZWRUeXBlLmluY2x1ZGVzKCdDb21wb25lbnQnKSB8fFxyXG4gICAgICAgICAgICAgICAgICAgICAgIGRlY2xhcmVkVHlwZSA9PT0gJ2NjLkF1ZGlvU291cmNlJyB8fCBkZWNsYXJlZFR5cGUgPT09ICdjYy5MYWJlbCcgfHxcclxuICAgICAgICAgICAgICAgICAgICAgICBkZWNsYXJlZFR5cGUgPT09ICdjYy5TcHJpdGUnIHx8IGRlY2xhcmVkVHlwZSA9PT0gJ2NjLkJ1dHRvbicpIHtcclxuICAgICAgICAgICAgICAgIC8vIOe7hOS7tuW8leeUqOexu+Wei1xyXG4gICAgICAgICAgICAgICAgdHlwZSA9ICdjb21wb25lbnQnO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgICBleGlzdHM6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZSxcclxuICAgICAgICAgICAgICAgICAgICBhdmFpbGFibGVQcm9wZXJ0aWVzLFxyXG4gICAgICAgICAgICAgICAgICAgIG9yaWdpbmFsVmFsdWU6IHByb3BlcnR5VmFsdWUudmFsdWUgIT09IHVuZGVmaW5lZCA/IHByb3BlcnR5VmFsdWUudmFsdWUgOiBwcm9wZXJ0eVZhbHVlXHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGRlY2xhcmVkVHlwZSA9PT0gJ2NjLlNwcml0ZUZyYW1lJyB8fCBkZWNsYXJlZFR5cGUgPT09ICdjYy5QcmVmYWInIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgICAgZGVjbGFyZWRUeXBlID09PSAnY2MuTWF0ZXJpYWwnIHx8IGRlY2xhcmVkVHlwZSA9PT0gJ2NjLkZvbnQnIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgICAgZGVjbGFyZWRUeXBlID09PSAnY2MuVGV4dHVyZScgfHwgZGVjbGFyZWRUeXBlID09PSAnY2MuQXVkaW9DbGlwJykge1xyXG4gICAgICAgICAgICAgICAgdHlwZSA9ICdhc3NldCc7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGV4aXN0czogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICB0eXBlLFxyXG4gICAgICAgICAgICAgICAgICAgIGF2YWlsYWJsZVByb3BlcnRpZXMsXHJcbiAgICAgICAgICAgICAgICAgICAgb3JpZ2luYWxWYWx1ZTogcHJvcGVydHlWYWx1ZS52YWx1ZSAhPT0gdW5kZWZpbmVkID8gcHJvcGVydHlWYWx1ZS52YWx1ZSA6IHByb3BlcnR5VmFsdWVcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZGVjbGFyZWRUeXBlID09PSAnY2MuQ29sb3InKSB7XHJcbiAgICAgICAgICAgICAgICB0eXBlID0gJ2NvbG9yJztcclxuICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgZXhpc3RzOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIHR5cGUsXHJcbiAgICAgICAgICAgICAgICAgICAgYXZhaWxhYmxlUHJvcGVydGllcyxcclxuICAgICAgICAgICAgICAgICAgICBvcmlnaW5hbFZhbHVlOiBwcm9wZXJ0eVZhbHVlLnZhbHVlICE9PSB1bmRlZmluZWQgPyBwcm9wZXJ0eVZhbHVlLnZhbHVlIDogcHJvcGVydHlWYWx1ZVxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChkZWNsYXJlZFR5cGUgPT09ICdjYy5WZWMyJykge1xyXG4gICAgICAgICAgICAgICAgdHlwZSA9ICd2ZWMyJztcclxuICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgZXhpc3RzOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIHR5cGUsXHJcbiAgICAgICAgICAgICAgICAgICAgYXZhaWxhYmxlUHJvcGVydGllcyxcclxuICAgICAgICAgICAgICAgICAgICBvcmlnaW5hbFZhbHVlOiBwcm9wZXJ0eVZhbHVlLnZhbHVlICE9PSB1bmRlZmluZWQgPyBwcm9wZXJ0eVZhbHVlLnZhbHVlIDogcHJvcGVydHlWYWx1ZVxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChkZWNsYXJlZFR5cGUgPT09ICdjYy5WZWMzJykge1xyXG4gICAgICAgICAgICAgICAgdHlwZSA9ICd2ZWMzJztcclxuICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgZXhpc3RzOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIHR5cGUsXHJcbiAgICAgICAgICAgICAgICAgICAgYXZhaWxhYmxlUHJvcGVydGllcyxcclxuICAgICAgICAgICAgICAgICAgICBvcmlnaW5hbFZhbHVlOiBwcm9wZXJ0eVZhbHVlLnZhbHVlICE9PSB1bmRlZmluZWQgPyBwcm9wZXJ0eVZhbHVlLnZhbHVlIDogcHJvcGVydHlWYWx1ZVxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChkZWNsYXJlZFR5cGUgPT09ICdjYy5TaXplJykge1xyXG4gICAgICAgICAgICAgICAgdHlwZSA9ICdzaXplJztcclxuICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgZXhpc3RzOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIHR5cGUsXHJcbiAgICAgICAgICAgICAgICAgICAgYXZhaWxhYmxlUHJvcGVydGllcyxcclxuICAgICAgICAgICAgICAgICAgICBvcmlnaW5hbFZhbHVlOiBwcm9wZXJ0eVZhbHVlLnZhbHVlICE9PSB1bmRlZmluZWQgPyBwcm9wZXJ0eVZhbHVlLnZhbHVlIDogcHJvcGVydHlWYWx1ZVxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChkZWNsYXJlZFR5cGUgPT09ICdTdHJpbmcnKSB7XHJcbiAgICAgICAgICAgICAgICB0eXBlID0gJ3N0cmluZyc7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGV4aXN0czogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICB0eXBlLFxyXG4gICAgICAgICAgICAgICAgICAgIGF2YWlsYWJsZVByb3BlcnRpZXMsXHJcbiAgICAgICAgICAgICAgICAgICAgb3JpZ2luYWxWYWx1ZTogcHJvcGVydHlWYWx1ZS52YWx1ZSAhPT0gdW5kZWZpbmVkID8gcHJvcGVydHlWYWx1ZS52YWx1ZSA6IHByb3BlcnR5VmFsdWVcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZGVjbGFyZWRUeXBlID09PSAnTnVtYmVyJyB8fCBkZWNsYXJlZFR5cGUgPT09ICdJbnRlZ2VyJyB8fCBkZWNsYXJlZFR5cGUgPT09ICdGbG9hdCcpIHtcclxuICAgICAgICAgICAgICAgIHR5cGUgPSAnbnVtYmVyJztcclxuICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgZXhpc3RzOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIHR5cGUsXHJcbiAgICAgICAgICAgICAgICAgICAgYXZhaWxhYmxlUHJvcGVydGllcyxcclxuICAgICAgICAgICAgICAgICAgICBvcmlnaW5hbFZhbHVlOiBwcm9wZXJ0eVZhbHVlLnZhbHVlICE9PSB1bmRlZmluZWQgPyBwcm9wZXJ0eVZhbHVlLnZhbHVlIDogcHJvcGVydHlWYWx1ZVxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChkZWNsYXJlZFR5cGUgPT09ICdCb29sZWFuJykge1xyXG4gICAgICAgICAgICAgICAgdHlwZSA9ICdib29sZWFuJztcclxuICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgZXhpc3RzOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIHR5cGUsXHJcbiAgICAgICAgICAgICAgICAgICAgYXZhaWxhYmxlUHJvcGVydGllcyxcclxuICAgICAgICAgICAgICAgICAgICBvcmlnaW5hbFZhbHVlOiBwcm9wZXJ0eVZhbHVlLnZhbHVlICE9PSB1bmRlZmluZWQgPyBwcm9wZXJ0eVZhbHVlLnZhbHVlIDogcHJvcGVydHlWYWx1ZVxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8g5aaC5p6c5bGe5oCn5pyJIHZhbHVlIOWtl+aute+8jOaPkOWPluWunumZheWAvOi/m+ihjOexu+Wei+ajgOa1i1xyXG4gICAgICAgIGNvbnN0IGFjdHVhbFZhbHVlID0gKHByb3BlcnR5VmFsdWUgJiYgdHlwZW9mIHByb3BlcnR5VmFsdWUgPT09ICdvYmplY3QnICYmICd2YWx1ZScgaW4gcHJvcGVydHlWYWx1ZSlcclxuICAgICAgICAgICAgPyBwcm9wZXJ0eVZhbHVlLnZhbHVlXHJcbiAgICAgICAgICAgIDogcHJvcGVydHlWYWx1ZTtcclxuXHJcbiAgICAgICAgLy8g5pm66IO957G75Z6L5qOA5rWLXHJcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoYWN0dWFsVmFsdWUpKSB7XHJcbiAgICAgICAgICAgIC8vIOaVsOe7hOexu+Wei+ajgOa1i1xyXG4gICAgICAgICAgICBpZiAocHJvcGVydHlOYW1lLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoJ25vZGUnKSkge1xyXG4gICAgICAgICAgICAgICAgdHlwZSA9ICdub2RlQXJyYXknO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHByb3BlcnR5TmFtZS50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKCdjb2xvcicpKSB7XHJcbiAgICAgICAgICAgICAgICB0eXBlID0gJ2NvbG9yQXJyYXknO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdHlwZSA9ICdhcnJheSc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBhY3R1YWxWYWx1ZSA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgLy8gQ2hlY2sgaWYgcHJvcGVydHkgbmFtZSBzdWdnZXN0cyBpdCdzIGFuIGFzc2V0XHJcbiAgICAgICAgICAgIGlmIChbJ3Nwcml0ZUZyYW1lJywgJ3RleHR1cmUnLCAnbWF0ZXJpYWwnLCAnZm9udCcsICdjbGlwJywgJ3ByZWZhYiddLmluY2x1ZGVzKHByb3BlcnR5TmFtZS50b0xvd2VyQ2FzZSgpKSkge1xyXG4gICAgICAgICAgICAgICAgdHlwZSA9ICdhc3NldCc7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0eXBlID0gJ3N0cmluZyc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBhY3R1YWxWYWx1ZSA9PT0gJ251bWJlcicpIHtcclxuICAgICAgICAgICAgdHlwZSA9ICdudW1iZXInO1xyXG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGFjdHVhbFZhbHVlID09PSAnYm9vbGVhbicpIHtcclxuICAgICAgICAgICAgdHlwZSA9ICdib29sZWFuJztcclxuICAgICAgICB9IGVsc2UgaWYgKGFjdHVhbFZhbHVlICYmIHR5cGVvZiBhY3R1YWxWYWx1ZSA9PT0gJ29iamVjdCcpIHtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyhhY3R1YWxWYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoa2V5cy5pbmNsdWRlcygncicpICYmIGtleXMuaW5jbHVkZXMoJ2cnKSAmJiBrZXlzLmluY2x1ZGVzKCdiJykpIHtcclxuICAgICAgICAgICAgICAgICAgICB0eXBlID0gJ2NvbG9yJztcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoa2V5cy5pbmNsdWRlcygneCcpICYmIGtleXMuaW5jbHVkZXMoJ3knKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHR5cGUgPSBhY3R1YWxWYWx1ZS56ICE9PSB1bmRlZmluZWQgPyAndmVjMycgOiAndmVjMic7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGtleXMuaW5jbHVkZXMoJ3dpZHRoJykgJiYga2V5cy5pbmNsdWRlcygnaGVpZ2h0JykpIHtcclxuICAgICAgICAgICAgICAgICAgICB0eXBlID0gJ3NpemUnO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChrZXlzLmluY2x1ZGVzKCd1dWlkJykgfHwga2V5cy5pbmNsdWRlcygnX191dWlkX18nKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIOajgOafpeaYr+WQpuaYr+iKgueCueW8leeUqO+8iOmAmui/h+WxnuaAp+WQjeaIll9faWRfX+WxnuaAp+WIpOaWre+8iVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChwcm9wZXJ0eU5hbWUudG9Mb3dlckNhc2UoKS5pbmNsdWRlcygnbm9kZScpIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb3BlcnR5TmFtZS50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKCd0YXJnZXQnKSB8fFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBrZXlzLmluY2x1ZGVzKCdfX2lkX18nKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlID0gJ25vZGUnO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGUgPSAnYXNzZXQnO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoa2V5cy5pbmNsdWRlcygnX19pZF9fJykpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyDoioLngrnlvJXnlKjnibnlvoFcclxuICAgICAgICAgICAgICAgICAgICB0eXBlID0gJ25vZGUnO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0eXBlID0gJ29iamVjdCc7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oYFthbmFseXplUHJvcGVydHldIEVycm9yIGNoZWNraW5nIHByb3BlcnR5IHR5cGUgZm9yOiAke0pTT04uc3RyaW5naWZ5KGFjdHVhbFZhbHVlKX1gKTtcclxuICAgICAgICAgICAgICAgIHR5cGUgPSAnb2JqZWN0JztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSBpZiAoYWN0dWFsVmFsdWUgPT09IG51bGwgfHwgYWN0dWFsVmFsdWUgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAvLyBGb3IgbnVsbC91bmRlZmluZWQgdmFsdWVzLCBjaGVjayBwcm9wZXJ0eSBuYW1lIHRvIGRldGVybWluZSB0eXBlXHJcbiAgICAgICAgICAgIGlmIChbJ3Nwcml0ZUZyYW1lJywgJ3RleHR1cmUnLCAnbWF0ZXJpYWwnLCAnZm9udCcsICdjbGlwJywgJ3ByZWZhYiddLmluY2x1ZGVzKHByb3BlcnR5TmFtZS50b0xvd2VyQ2FzZSgpKSkge1xyXG4gICAgICAgICAgICAgICAgdHlwZSA9ICdhc3NldCc7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAocHJvcGVydHlOYW1lLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoJ25vZGUnKSB8fFxyXG4gICAgICAgICAgICAgICAgICAgICAgcHJvcGVydHlOYW1lLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoJ3RhcmdldCcpKSB7XHJcbiAgICAgICAgICAgICAgICB0eXBlID0gJ25vZGUnO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHByb3BlcnR5TmFtZS50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKCdjb21wb25lbnQnKSkge1xyXG4gICAgICAgICAgICAgICAgdHlwZSA9ICdjb21wb25lbnQnO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdHlwZSA9ICd1bmtub3duJztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgZXhpc3RzOiB0cnVlLFxyXG4gICAgICAgICAgICB0eXBlLFxyXG4gICAgICAgICAgICBhdmFpbGFibGVQcm9wZXJ0aWVzLFxyXG4gICAgICAgICAgICBvcmlnaW5hbFZhbHVlOiBhY3R1YWxWYWx1ZVxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzbWFydENvbnZlcnRWYWx1ZShpbnB1dFZhbHVlOiBhbnksIHByb3BlcnR5SW5mbzogYW55KTogYW55IHtcclxuICAgICAgICBjb25zdCB7IHR5cGUsIG9yaWdpbmFsVmFsdWUgfSA9IHByb3BlcnR5SW5mbztcclxuICAgICAgICBcclxuICAgICAgICBjb25zb2xlLmxvZyhgW3NtYXJ0Q29udmVydFZhbHVlXSBDb252ZXJ0aW5nICR7SlNPTi5zdHJpbmdpZnkoaW5wdXRWYWx1ZSl9IHRvIHR5cGU6ICR7dHlwZX1gKTtcclxuICAgICAgICBcclxuICAgICAgICBzd2l0Y2ggKHR5cGUpIHtcclxuICAgICAgICAgICAgY2FzZSAnc3RyaW5nJzpcclxuICAgICAgICAgICAgICAgIHJldHVybiBTdHJpbmcoaW5wdXRWYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgY2FzZSAnbnVtYmVyJzpcclxuICAgICAgICAgICAgICAgIHJldHVybiBOdW1iZXIoaW5wdXRWYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgY2FzZSAnYm9vbGVhbic6XHJcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGlucHV0VmFsdWUgPT09ICdib29sZWFuJykgcmV0dXJuIGlucHV0VmFsdWU7XHJcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGlucHV0VmFsdWUgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGlucHV0VmFsdWUudG9Mb3dlckNhc2UoKSA9PT0gJ3RydWUnIHx8IGlucHV0VmFsdWUgPT09ICcxJztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiBCb29sZWFuKGlucHV0VmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGNhc2UgJ2NvbG9yJzpcclxuICAgICAgICAgICAgICAgIC8vIOS8mOWMlueahOminOiJsuWkhOeQhu+8jOaUr+aMgeWkmuenjei+k+WFpeagvOW8j1xyXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBpbnB1dFZhbHVlID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIOWtl+espuS4suagvOW8j++8muWNgeWFrei/m+WItuOAgeminOiJsuWQjeensOOAgXJnYigpL3JnYmEoKVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnBhcnNlQ29sb3JTdHJpbmcoaW5wdXRWYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBpbnB1dFZhbHVlID09PSAnb2JqZWN0JyAmJiBpbnB1dFZhbHVlICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgaW5wdXRLZXlzID0gT2JqZWN0LmtleXMoaW5wdXRWYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIOWmguaenOi+k+WFpeaYr+minOiJsuWvueixoe+8jOmqjOivgeW5tui9rOaNolxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW5wdXRLZXlzLmluY2x1ZGVzKCdyJykgfHwgaW5wdXRLZXlzLmluY2x1ZGVzKCdnJykgfHwgaW5wdXRLZXlzLmluY2x1ZGVzKCdiJykpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcjogTWF0aC5taW4oMjU1LCBNYXRoLm1heCgwLCBOdW1iZXIoaW5wdXRWYWx1ZS5yKSB8fCAwKSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZzogTWF0aC5taW4oMjU1LCBNYXRoLm1heCgwLCBOdW1iZXIoaW5wdXRWYWx1ZS5nKSB8fCAwKSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYjogTWF0aC5taW4oMjU1LCBNYXRoLm1heCgwLCBOdW1iZXIoaW5wdXRWYWx1ZS5iKSB8fCAwKSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYTogaW5wdXRWYWx1ZS5hICE9PSB1bmRlZmluZWQgPyBNYXRoLm1pbigyNTUsIE1hdGgubWF4KDAsIE51bWJlcihpbnB1dFZhbHVlLmEpKSkgOiAyNTVcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oYFtzbWFydENvbnZlcnRWYWx1ZV0gSW52YWxpZCBjb2xvciBvYmplY3Q6ICR7SlNPTi5zdHJpbmdpZnkoaW5wdXRWYWx1ZSl9YCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgLy8g5aaC5p6c5pyJ5Y6f5YC877yM5L+d5oyB5Y6f5YC857uT5p6E5bm25pu05paw5o+Q5L6b55qE5YC8XHJcbiAgICAgICAgICAgICAgICBpZiAob3JpZ2luYWxWYWx1ZSAmJiB0eXBlb2Ygb3JpZ2luYWxWYWx1ZSA9PT0gJ29iamVjdCcpIHtcclxuICAgICAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBpbnB1dEtleXMgPSB0eXBlb2YgaW5wdXRWYWx1ZSA9PT0gJ29iamVjdCcgJiYgaW5wdXRWYWx1ZSA/IE9iamVjdC5rZXlzKGlucHV0VmFsdWUpIDogW107XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByOiBpbnB1dEtleXMuaW5jbHVkZXMoJ3InKSA/IE1hdGgubWluKDI1NSwgTWF0aC5tYXgoMCwgTnVtYmVyKGlucHV0VmFsdWUucikpKSA6IChvcmlnaW5hbFZhbHVlLnIgfHwgMjU1KSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGc6IGlucHV0S2V5cy5pbmNsdWRlcygnZycpID8gTWF0aC5taW4oMjU1LCBNYXRoLm1heCgwLCBOdW1iZXIoaW5wdXRWYWx1ZS5nKSkpIDogKG9yaWdpbmFsVmFsdWUuZyB8fCAyNTUpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYjogaW5wdXRLZXlzLmluY2x1ZGVzKCdiJykgPyBNYXRoLm1pbigyNTUsIE1hdGgubWF4KDAsIE51bWJlcihpbnB1dFZhbHVlLmIpKSkgOiAob3JpZ2luYWxWYWx1ZS5iIHx8IDI1NSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhOiBpbnB1dEtleXMuaW5jbHVkZXMoJ2EnKSA/IE1hdGgubWluKDI1NSwgTWF0aC5tYXgoMCwgTnVtYmVyKGlucHV0VmFsdWUuYSkpKSA6IChvcmlnaW5hbFZhbHVlLmEgfHwgMjU1KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihgW3NtYXJ0Q29udmVydFZhbHVlXSBFcnJvciBwcm9jZXNzaW5nIGNvbG9yIHdpdGggb3JpZ2luYWwgdmFsdWU6ICR7ZXJyb3J9YCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgLy8g6buY6K6k6L+U5Zue55m96ImyXHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oYFtzbWFydENvbnZlcnRWYWx1ZV0gVXNpbmcgZGVmYXVsdCB3aGl0ZSBjb2xvciBmb3IgaW52YWxpZCBpbnB1dDogJHtKU09OLnN0cmluZ2lmeShpbnB1dFZhbHVlKX1gKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB7IHI6IDI1NSwgZzogMjU1LCBiOiAyNTUsIGE6IDI1NSB9O1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGNhc2UgJ3ZlYzInOlxyXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBpbnB1dFZhbHVlID09PSAnb2JqZWN0JyAmJiBpbnB1dFZhbHVlICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgeDogTnVtYmVyKGlucHV0VmFsdWUueCkgfHwgb3JpZ2luYWxWYWx1ZS54IHx8IDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHk6IE51bWJlcihpbnB1dFZhbHVlLnkpIHx8IG9yaWdpbmFsVmFsdWUueSB8fCAwXHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiBvcmlnaW5hbFZhbHVlO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGNhc2UgJ3ZlYzMnOlxyXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBpbnB1dFZhbHVlID09PSAnb2JqZWN0JyAmJiBpbnB1dFZhbHVlICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgeDogTnVtYmVyKGlucHV0VmFsdWUueCkgfHwgb3JpZ2luYWxWYWx1ZS54IHx8IDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHk6IE51bWJlcihpbnB1dFZhbHVlLnkpIHx8IG9yaWdpbmFsVmFsdWUueSB8fCAwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB6OiBOdW1iZXIoaW5wdXRWYWx1ZS56KSB8fCBvcmlnaW5hbFZhbHVlLnogfHwgMFxyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gb3JpZ2luYWxWYWx1ZTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBjYXNlICdzaXplJzpcclxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgaW5wdXRWYWx1ZSA9PT0gJ29iamVjdCcgJiYgaW5wdXRWYWx1ZSAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiBOdW1iZXIoaW5wdXRWYWx1ZS53aWR0aCkgfHwgb3JpZ2luYWxWYWx1ZS53aWR0aCB8fCAxMDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhlaWdodDogTnVtYmVyKGlucHV0VmFsdWUuaGVpZ2h0KSB8fCBvcmlnaW5hbFZhbHVlLmhlaWdodCB8fCAxMDBcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG9yaWdpbmFsVmFsdWU7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgY2FzZSAnbm9kZSc6XHJcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGlucHV0VmFsdWUgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8g6IqC54K55byV55So6ZyA6KaB54m55q6K5aSE55CGXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGlucHV0VmFsdWU7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBpbnB1dFZhbHVlID09PSAnb2JqZWN0JyAmJiBpbnB1dFZhbHVlICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8g5aaC5p6c5bey57uP5piv5a+56LGh5b2i5byP77yM6L+U5ZueVVVJROaIluWujOaVtOWvueixoVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpbnB1dFZhbHVlLnV1aWQgfHwgaW5wdXRWYWx1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiBvcmlnaW5hbFZhbHVlO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGNhc2UgJ2Fzc2V0JzpcclxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgaW5wdXRWYWx1ZSA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyDlpoLmnpzovpPlhaXmmK/lrZfnrKbkuLLot6/lvoTvvIzovazmjaLkuLphc3NldOWvueixoVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7IHV1aWQ6IGlucHV0VmFsdWUgfTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGlucHV0VmFsdWUgPT09ICdvYmplY3QnICYmIGlucHV0VmFsdWUgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaW5wdXRWYWx1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiBvcmlnaW5hbFZhbHVlO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAvLyDlr7nkuo7mnKrnn6XnsbvlnovvvIzlsL3ph4/kv53mjIHljp/mnInnu5PmnoRcclxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgaW5wdXRWYWx1ZSA9PT0gdHlwZW9mIG9yaWdpbmFsVmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaW5wdXRWYWx1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiBvcmlnaW5hbFZhbHVlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBwYXJzZUNvbG9yU3RyaW5nKGNvbG9yU3RyOiBzdHJpbmcpOiB7IHI6IG51bWJlcjsgZzogbnVtYmVyOyBiOiBudW1iZXI7IGE6IG51bWJlciB9IHtcclxuICAgICAgICBjb25zdCBzdHIgPSBjb2xvclN0ci50cmltKCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8g5Y+q5pSv5oyB5Y2B5YWt6L+b5Yi25qC85byPICNSUkdHQkIg5oiWICNSUkdHQkJBQVxyXG4gICAgICAgIGlmIChzdHIuc3RhcnRzV2l0aCgnIycpKSB7XHJcbiAgICAgICAgICAgIGlmIChzdHIubGVuZ3RoID09PSA3KSB7IC8vICNSUkdHQkJcclxuICAgICAgICAgICAgICAgIGNvbnN0IHIgPSBwYXJzZUludChzdHIuc3Vic3RyaW5nKDEsIDMpLCAxNik7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBnID0gcGFyc2VJbnQoc3RyLnN1YnN0cmluZygzLCA1KSwgMTYpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgYiA9IHBhcnNlSW50KHN0ci5zdWJzdHJpbmcoNSwgNyksIDE2KTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB7IHIsIGcsIGIsIGE6IDI1NSB9O1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHN0ci5sZW5ndGggPT09IDkpIHsgLy8gI1JSR0dCQkFBXHJcbiAgICAgICAgICAgICAgICBjb25zdCByID0gcGFyc2VJbnQoc3RyLnN1YnN0cmluZygxLCAzKSwgMTYpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZyA9IHBhcnNlSW50KHN0ci5zdWJzdHJpbmcoMywgNSksIDE2KTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGIgPSBwYXJzZUludChzdHIuc3Vic3RyaW5nKDUsIDcpLCAxNik7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBhID0gcGFyc2VJbnQoc3RyLnN1YnN0cmluZyg3LCA5KSwgMTYpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgciwgZywgYiwgYSB9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIOWmguaenOS4jeaYr+acieaViOeahOWNgeWFrei/m+WItuagvOW8j++8jOi/lOWbnumUmeivr+aPkOekulxyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBjb2xvciBmb3JtYXQ6IFwiJHtjb2xvclN0cn1cIi4gT25seSBoZXhhZGVjaW1hbCBmb3JtYXQgaXMgc3VwcG9ydGVkIChlLmcuLCBcIiNGRjAwMDBcIiBvciBcIiNGRjAwMDBGRlwiKWApO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgYXN5bmMgdmVyaWZ5UHJvcGVydHlDaGFuZ2Uobm9kZVV1aWQ6IHN0cmluZywgY29tcG9uZW50VHlwZTogc3RyaW5nLCBwcm9wZXJ0eTogc3RyaW5nLCBvcmlnaW5hbFZhbHVlOiBhbnksIGV4cGVjdGVkVmFsdWU6IGFueSk6IFByb21pc2U8eyB2ZXJpZmllZDogYm9vbGVhbjsgYWN0dWFsVmFsdWU6IGFueTsgZnVsbERhdGE6IGFueSB9PiB7XHJcbiAgICAgICAgY29uc29sZS5sb2coYFt2ZXJpZnlQcm9wZXJ0eUNoYW5nZV0gU3RhcnRpbmcgdmVyaWZpY2F0aW9uIGZvciAke2NvbXBvbmVudFR5cGV9LiR7cHJvcGVydHl9YCk7XHJcbiAgICAgICAgY29uc29sZS5sb2coYFt2ZXJpZnlQcm9wZXJ0eUNoYW5nZV0gRXhwZWN0ZWQgdmFsdWU6YCwgSlNPTi5zdHJpbmdpZnkoZXhwZWN0ZWRWYWx1ZSkpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGBbdmVyaWZ5UHJvcGVydHlDaGFuZ2VdIE9yaWdpbmFsIHZhbHVlOmAsIEpTT04uc3RyaW5naWZ5KG9yaWdpbmFsVmFsdWUpKTtcclxuICAgICAgICBcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAvLyDph43mlrDojrflj5bnu4Tku7bkv6Hmga/ov5vooYzpqozor4FcclxuICAgICAgICAgICAgY29uc29sZS5sb2coYFt2ZXJpZnlQcm9wZXJ0eUNoYW5nZV0gQ2FsbGluZyBnZXRDb21wb25lbnRJbmZvLi4uYCk7XHJcbiAgICAgICAgICAgIGNvbnN0IGNvbXBvbmVudEluZm8gPSBhd2FpdCB0aGlzLmdldENvbXBvbmVudEluZm8obm9kZVV1aWQsIGNvbXBvbmVudFR5cGUpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgW3ZlcmlmeVByb3BlcnR5Q2hhbmdlXSBnZXRDb21wb25lbnRJbmZvIHN1Y2Nlc3M6YCwgY29tcG9uZW50SW5mby5zdWNjZXNzKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGNvbnN0IGFsbENvbXBvbmVudHMgPSBhd2FpdCB0aGlzLmdldENvbXBvbmVudHMobm9kZVV1aWQpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgW3ZlcmlmeVByb3BlcnR5Q2hhbmdlXSBnZXRDb21wb25lbnRzIHN1Y2Nlc3M6YCwgYWxsQ29tcG9uZW50cy5zdWNjZXNzKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGlmIChjb21wb25lbnRJbmZvLnN1Y2Nlc3MgJiYgY29tcG9uZW50SW5mby5kYXRhKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgW3ZlcmlmeVByb3BlcnR5Q2hhbmdlXSBDb21wb25lbnQgZGF0YSBhdmFpbGFibGUsIGV4dHJhY3RpbmcgcHJvcGVydHkgJyR7cHJvcGVydHl9J2ApO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgYWxsUHJvcGVydHlOYW1lcyA9IE9iamVjdC5rZXlzKGNvbXBvbmVudEluZm8uZGF0YS5wcm9wZXJ0aWVzIHx8IHt9KTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGBbdmVyaWZ5UHJvcGVydHlDaGFuZ2VdIEF2YWlsYWJsZSBwcm9wZXJ0aWVzOmAsIGFsbFByb3BlcnR5TmFtZXMpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcHJvcGVydHlEYXRhID0gY29tcG9uZW50SW5mby5kYXRhLnByb3BlcnRpZXM/Lltwcm9wZXJ0eV07XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgW3ZlcmlmeVByb3BlcnR5Q2hhbmdlXSBSYXcgcHJvcGVydHkgZGF0YSBmb3IgJyR7cHJvcGVydHl9JzpgLCBKU09OLnN0cmluZ2lmeShwcm9wZXJ0eURhdGEpKTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgLy8g5LuO5bGe5oCn5pWw5o2u5Lit5o+Q5Y+W5a6e6ZmF5YC8XHJcbiAgICAgICAgICAgICAgICBsZXQgYWN0dWFsVmFsdWUgPSBwcm9wZXJ0eURhdGE7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgW3ZlcmlmeVByb3BlcnR5Q2hhbmdlXSBJbml0aWFsIGFjdHVhbFZhbHVlOmAsIEpTT04uc3RyaW5naWZ5KGFjdHVhbFZhbHVlKSk7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGlmIChwcm9wZXJ0eURhdGEgJiYgdHlwZW9mIHByb3BlcnR5RGF0YSA9PT0gJ29iamVjdCcgJiYgJ3ZhbHVlJyBpbiBwcm9wZXJ0eURhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICBhY3R1YWxWYWx1ZSA9IHByb3BlcnR5RGF0YS52YWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgW3ZlcmlmeVByb3BlcnR5Q2hhbmdlXSBFeHRyYWN0ZWQgYWN0dWFsVmFsdWUgZnJvbSAudmFsdWU6YCwgSlNPTi5zdHJpbmdpZnkoYWN0dWFsVmFsdWUpKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coYFt2ZXJpZnlQcm9wZXJ0eUNoYW5nZV0gTm8gLnZhbHVlIHByb3BlcnR5IGZvdW5kLCB1c2luZyByYXcgZGF0YWApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAvLyDkv67lpI3pqozor4HpgLvovpHvvJrmo4Dmn6Xlrp7pmYXlgLzmmK/lkKbljLnphY3mnJ/mnJvlgLxcclxuICAgICAgICAgICAgICAgIGxldCB2ZXJpZmllZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGV4cGVjdGVkVmFsdWUgPT09ICdvYmplY3QnICYmIGV4cGVjdGVkVmFsdWUgIT09IG51bGwgJiYgJ3V1aWQnIGluIGV4cGVjdGVkVmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyDlr7nkuo7lvJXnlKjnsbvlnovvvIjoioLngrkv57uE5Lu2L+i1hOa6kO+8ie+8jOavlOi+g1VVSURcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBhY3R1YWxVdWlkID0gYWN0dWFsVmFsdWUgJiYgdHlwZW9mIGFjdHVhbFZhbHVlID09PSAnb2JqZWN0JyAmJiAndXVpZCcgaW4gYWN0dWFsVmFsdWUgPyBhY3R1YWxWYWx1ZS51dWlkIDogJyc7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZXhwZWN0ZWRVdWlkID0gZXhwZWN0ZWRWYWx1ZS51dWlkIHx8ICcnO1xyXG4gICAgICAgICAgICAgICAgICAgIHZlcmlmaWVkID0gYWN0dWFsVXVpZCA9PT0gZXhwZWN0ZWRVdWlkICYmIGV4cGVjdGVkVXVpZCAhPT0gJyc7XHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coYFt2ZXJpZnlQcm9wZXJ0eUNoYW5nZV0gUmVmZXJlbmNlIGNvbXBhcmlzb246YCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coYCAgLSBFeHBlY3RlZCBVVUlEOiBcIiR7ZXhwZWN0ZWRVdWlkfVwiYCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coYCAgLSBBY3R1YWwgVVVJRDogXCIke2FjdHVhbFV1aWR9XCJgKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgICAtIFVVSUQgbWF0Y2g6ICR7YWN0dWFsVXVpZCA9PT0gZXhwZWN0ZWRVdWlkfWApO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGAgIC0gVVVJRCBub3QgZW1wdHk6ICR7ZXhwZWN0ZWRVdWlkICE9PSAnJ31gKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgICAtIEZpbmFsIHZlcmlmaWVkOiAke3ZlcmlmaWVkfWApO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyDlr7nkuo7lhbbku5bnsbvlnovvvIznm7TmjqXmr5TovoPlgLxcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgW3ZlcmlmeVByb3BlcnR5Q2hhbmdlXSBWYWx1ZSBjb21wYXJpc29uOmApO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGAgIC0gRXhwZWN0ZWQgdHlwZTogJHt0eXBlb2YgZXhwZWN0ZWRWYWx1ZX1gKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgICAtIEFjdHVhbCB0eXBlOiAke3R5cGVvZiBhY3R1YWxWYWx1ZX1gKTtcclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGFjdHVhbFZhbHVlID09PSB0eXBlb2YgZXhwZWN0ZWRWYWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGFjdHVhbFZhbHVlID09PSAnb2JqZWN0JyAmJiBhY3R1YWxWYWx1ZSAhPT0gbnVsbCAmJiBleHBlY3RlZFZhbHVlICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDlr7nosaHnsbvlnovnmoTmt7Hluqbmr5TovoNcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZlcmlmaWVkID0gSlNPTi5zdHJpbmdpZnkoYWN0dWFsVmFsdWUpID09PSBKU09OLnN0cmluZ2lmeShleHBlY3RlZFZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGAgIC0gT2JqZWN0IGNvbXBhcmlzb24gKEpTT04pOiAke3ZlcmlmaWVkfWApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g5Z+65pys57G75Z6L55qE55u05o6l5q+U6L6DXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2ZXJpZmllZCA9IGFjdHVhbFZhbHVlID09PSBleHBlY3RlZFZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coYCAgLSBEaXJlY3QgY29tcGFyaXNvbjogJHt2ZXJpZmllZH1gKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIOexu+Wei+S4jeWMuemFjeaXtueahOeJueauiuWkhOeQhu+8iOWmguaVsOWtl+WSjOWtl+espuS4su+8iVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBzdHJpbmdNYXRjaCA9IFN0cmluZyhhY3R1YWxWYWx1ZSkgPT09IFN0cmluZyhleHBlY3RlZFZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbnVtYmVyTWF0Y2ggPSBOdW1iZXIoYWN0dWFsVmFsdWUpID09PSBOdW1iZXIoZXhwZWN0ZWRWYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZlcmlmaWVkID0gc3RyaW5nTWF0Y2ggfHwgbnVtYmVyTWF0Y2g7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGAgIC0gU3RyaW5nIG1hdGNoOiAke3N0cmluZ01hdGNofWApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgICAtIE51bWJlciBtYXRjaDogJHtudW1iZXJNYXRjaH1gKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coYCAgLSBUeXBlIG1pc21hdGNoIHZlcmlmaWVkOiAke3ZlcmlmaWVkfWApO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coYFt2ZXJpZnlQcm9wZXJ0eUNoYW5nZV0gRmluYWwgdmVyaWZpY2F0aW9uIHJlc3VsdDogJHt2ZXJpZmllZH1gKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGBbdmVyaWZ5UHJvcGVydHlDaGFuZ2VdIEZpbmFsIGFjdHVhbFZhbHVlOmAsIEpTT04uc3RyaW5naWZ5KGFjdHVhbFZhbHVlKSk7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IHtcclxuICAgICAgICAgICAgICAgICAgICB2ZXJpZmllZCxcclxuICAgICAgICAgICAgICAgICAgICBhY3R1YWxWYWx1ZSxcclxuICAgICAgICAgICAgICAgICAgICBmdWxsRGF0YToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyDlj6rov5Tlm57kv67mlLnnmoTlsZ7mgKfkv6Hmga/vvIzkuI3ov5Tlm57lrozmlbTnu4Tku7bmlbDmja5cclxuICAgICAgICAgICAgICAgICAgICAgICAgbW9kaWZpZWRQcm9wZXJ0eToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogcHJvcGVydHksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBiZWZvcmU6IG9yaWdpbmFsVmFsdWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBleHBlY3RlZDogZXhwZWN0ZWRWYWx1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFjdHVhbDogYWN0dWFsVmFsdWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2ZXJpZmllZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3BlcnR5TWV0YWRhdGE6IHByb3BlcnR5RGF0YSAvLyDlj6rljIXlkKvov5nkuKrlsZ7mgKfnmoTlhYPmlbDmja5cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8g566A5YyW55qE57uE5Lu25L+h5oGvXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudFN1bW1hcnk6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vZGVVdWlkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50VHlwZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvdGFsUHJvcGVydGllczogT2JqZWN0LmtleXMoY29tcG9uZW50SW5mby5kYXRhPy5wcm9wZXJ0aWVzIHx8IHt9KS5sZW5ndGhcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGBbdmVyaWZ5UHJvcGVydHlDaGFuZ2VdIFJldHVybmluZyByZXN1bHQ6YCwgSlNPTi5zdHJpbmdpZnkocmVzdWx0LCBudWxsLCAyKSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coYFt2ZXJpZnlQcm9wZXJ0eUNoYW5nZV0gQ29tcG9uZW50SW5mbyBmYWlsZWQgb3Igbm8gZGF0YTpgLCBjb21wb25lbnRJbmZvKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ1t2ZXJpZnlQcm9wZXJ0eUNoYW5nZV0gVmVyaWZpY2F0aW9uIGZhaWxlZCB3aXRoIGVycm9yOicsIGVycm9yKTtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcignW3ZlcmlmeVByb3BlcnR5Q2hhbmdlXSBFcnJvciBzdGFjazonLCBlcnJvciBpbnN0YW5jZW9mIEVycm9yID8gZXJyb3Iuc3RhY2sgOiAnTm8gc3RhY2sgdHJhY2UnKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgY29uc29sZS5sb2coYFt2ZXJpZnlQcm9wZXJ0eUNoYW5nZV0gUmV0dXJuaW5nIGZhbGxiYWNrIHJlc3VsdGApO1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHZlcmlmaWVkOiBmYWxzZSxcclxuICAgICAgICAgICAgYWN0dWFsVmFsdWU6IHVuZGVmaW5lZCxcclxuICAgICAgICAgICAgZnVsbERhdGE6IG51bGxcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5qOA5rWL5piv5ZCm5Li66IqC54K55bGe5oCn77yM5aaC5p6c5piv5YiZ6YeN5a6a5ZCR5Yiw5a+55bqU55qE6IqC54K55pa55rOVXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgYXN5bmMgY2hlY2tBbmRSZWRpcmVjdE5vZGVQcm9wZXJ0aWVzKGFyZ3M6IGFueSk6IFByb21pc2U8VG9vbFJlc3BvbnNlIHwgbnVsbD4ge1xyXG4gICAgICAgIGNvbnN0IHsgbm9kZVV1aWQsIGNvbXBvbmVudFR5cGUsIHByb3BlcnR5LCBwcm9wZXJ0eVR5cGUsIHZhbHVlIH0gPSBhcmdzO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIOajgOa1i+aYr+WQpuS4uuiKgueCueWfuuehgOWxnuaAp++8iOW6lOivpeS9v+eUqCBzZXRfbm9kZV9wcm9wZXJ0ee+8iVxyXG4gICAgICAgIGNvbnN0IG5vZGVCYXNpY1Byb3BlcnRpZXMgPSBbXHJcbiAgICAgICAgICAgICduYW1lJywgJ2FjdGl2ZScsICdsYXllcicsICdtb2JpbGl0eScsICdwYXJlbnQnLCAnY2hpbGRyZW4nLCAnaGlkZUZsYWdzJ1xyXG4gICAgICAgIF07XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8g5qOA5rWL5piv5ZCm5Li66IqC54K55Y+Y5o2i5bGe5oCn77yI5bqU6K+l5L2/55SoIHNldF9ub2RlX3RyYW5zZm9ybe+8iVxyXG4gICAgICAgIGNvbnN0IG5vZGVUcmFuc2Zvcm1Qcm9wZXJ0aWVzID0gW1xyXG4gICAgICAgICAgICAncG9zaXRpb24nLCAncm90YXRpb24nLCAnc2NhbGUnLCAnZXVsZXJBbmdsZXMnLCAnYW5nbGUnXHJcbiAgICAgICAgXTtcclxuICAgICAgICBcclxuICAgICAgICAvLyBEZXRlY3QgYXR0ZW1wdHMgdG8gc2V0IGNjLk5vZGUgcHJvcGVydGllcyAoY29tbW9uIG1pc3Rha2UpXHJcbiAgICAgICAgaWYgKGNvbXBvbmVudFR5cGUgPT09ICdjYy5Ob2RlJyB8fCBjb21wb25lbnRUeXBlID09PSAnTm9kZScpIHtcclxuICAgICAgICAgICAgaWYgKG5vZGVCYXNpY1Byb3BlcnRpZXMuaW5jbHVkZXMocHJvcGVydHkpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlcnJvcjogYFByb3BlcnR5ICcke3Byb3BlcnR5fScgaXMgYSBub2RlIGJhc2ljIHByb3BlcnR5LCBub3QgYSBjb21wb25lbnQgcHJvcGVydHlgLFxyXG4gICAgICAgICAgICAgICAgICAgICAgaW5zdHJ1Y3Rpb246IGBQbGVhc2UgdXNlIHNldF9ub2RlX3Byb3BlcnR5IG1ldGhvZCB0byBzZXQgbm9kZSBwcm9wZXJ0aWVzOiBzZXRfbm9kZV9wcm9wZXJ0eSh1dWlkPVwiJHtub2RlVXVpZH1cIiwgcHJvcGVydHk9XCIke3Byb3BlcnR5fVwiLCB2YWx1ZT0ke0pTT04uc3RyaW5naWZ5KHZhbHVlKX0pYFxyXG4gICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAobm9kZVRyYW5zZm9ybVByb3BlcnRpZXMuaW5jbHVkZXMocHJvcGVydHkpKSB7XHJcbiAgICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICAgIGVycm9yOiBgUHJvcGVydHkgJyR7cHJvcGVydHl9JyBpcyBhIG5vZGUgdHJhbnNmb3JtIHByb3BlcnR5LCBub3QgYSBjb21wb25lbnQgcHJvcGVydHlgLFxyXG4gICAgICAgICAgICAgICAgICAgICAgaW5zdHJ1Y3Rpb246IGBQbGVhc2UgdXNlIHNldF9ub2RlX3RyYW5zZm9ybSBtZXRob2QgdG8gc2V0IHRyYW5zZm9ybSBwcm9wZXJ0aWVzOiBzZXRfbm9kZV90cmFuc2Zvcm0odXVpZD1cIiR7bm9kZVV1aWR9XCIsICR7cHJvcGVydHl9PSR7SlNPTi5zdHJpbmdpZnkodmFsdWUpfSlgXHJcbiAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgXHJcbiAgICAgICAgICAvLyBEZXRlY3QgY29tbW9uIGluY29ycmVjdCB1c2FnZVxyXG4gICAgICAgICAgaWYgKG5vZGVCYXNpY1Byb3BlcnRpZXMuaW5jbHVkZXMocHJvcGVydHkpIHx8IG5vZGVUcmFuc2Zvcm1Qcm9wZXJ0aWVzLmluY2x1ZGVzKHByb3BlcnR5KSkge1xyXG4gICAgICAgICAgICAgIGNvbnN0IG1ldGhvZE5hbWUgPSBub2RlVHJhbnNmb3JtUHJvcGVydGllcy5pbmNsdWRlcyhwcm9wZXJ0eSkgPyAnc2V0X25vZGVfdHJhbnNmb3JtJyA6ICdzZXRfbm9kZV9wcm9wZXJ0eSc7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgc3VjY2VzczogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgIGVycm9yOiBgUHJvcGVydHkgJyR7cHJvcGVydHl9JyBpcyBhIG5vZGUgcHJvcGVydHksIG5vdCBhIGNvbXBvbmVudCBwcm9wZXJ0eWAsXHJcbiAgICAgICAgICAgICAgICAgIGluc3RydWN0aW9uOiBgUHJvcGVydHkgJyR7cHJvcGVydHl9JyBzaG91bGQgYmUgc2V0IHVzaW5nICR7bWV0aG9kTmFtZX0gbWV0aG9kLCBub3Qgc2V0X2NvbXBvbmVudF9wcm9wZXJ0eS4gUGxlYXNlIHVzZTogJHttZXRob2ROYW1lfSh1dWlkPVwiJHtub2RlVXVpZH1cIiwgJHtub2RlVHJhbnNmb3JtUHJvcGVydGllcy5pbmNsdWRlcyhwcm9wZXJ0eSkgPyBwcm9wZXJ0eSA6IGBwcm9wZXJ0eT1cIiR7cHJvcGVydHl9XCJgfT0ke0pTT04uc3RyaW5naWZ5KHZhbHVlKX0pYFxyXG4gICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBcclxuICAgICAgICAgIHJldHVybiBudWxsOyAvLyDkuI3mmK/oioLngrnlsZ7mgKfvvIznu6fnu63mraPluLjlpITnkIZcclxuICAgICAgfVxyXG5cclxuICAgICAgLyoqXHJcbiAgICAgICAqIOeUn+aIkOe7hOS7tuW7uuiuruS/oeaBr1xyXG4gICAgICAgKi9cclxuICAgICAgcHJpdmF0ZSBnZW5lcmF0ZUNvbXBvbmVudFN1Z2dlc3Rpb24ocmVxdWVzdGVkVHlwZTogc3RyaW5nLCBhdmFpbGFibGVUeXBlczogc3RyaW5nW10sIHByb3BlcnR5OiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgICAgLy8g6aqM6K+B5Y+C5pWwXHJcbiAgICAgICAgICBpZiAoIXJlcXVlc3RlZFR5cGUpIHtcclxuICAgICAgICAgICAgICByZXR1cm4gJ1xcblxcbuKaoO+4jyBDb21wb25lbnQgdHlwZSBpcyBub3Qgc3BlY2lmaWVkLiBQbGVhc2UgcHJvdmlkZSBhIHZhbGlkIGNvbXBvbmVudFR5cGUgcGFyYW1ldGVyLic7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBcclxuICAgICAgICAgIGlmICghYXZhaWxhYmxlVHlwZXMgfHwgYXZhaWxhYmxlVHlwZXMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuICdcXG5cXG7imqDvuI8gTm8gYXZhaWxhYmxlIGNvbXBvbmVudHMgZm91bmQgb24gdGhlIG5vZGUuJztcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIFxyXG4gICAgICAgICAgLy8g5qOA5p+l5piv5ZCm5a2Y5Zyo55u45Ly855qE57uE5Lu257G75Z6LXHJcbiAgICAgICAgICBjb25zdCBzaW1pbGFyVHlwZXMgPSBhdmFpbGFibGVUeXBlcy5maWx0ZXIodHlwZSA9PiBcclxuICAgICAgICAgICAgICB0eXBlICYmIHR5cGUudG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhyZXF1ZXN0ZWRUeXBlLnRvTG93ZXJDYXNlKCkpIHx8IFxyXG4gICAgICAgICAgICAgIHJlcXVlc3RlZFR5cGUudG9Mb3dlckNhc2UoKS5pbmNsdWRlcyh0eXBlID8gdHlwZS50b0xvd2VyQ2FzZSgpIDogJycpXHJcbiAgICAgICAgICApO1xyXG4gICAgICAgICAgXHJcbiAgICAgICAgICBsZXQgaW5zdHJ1Y3Rpb24gPSAnJztcclxuICAgICAgICAgIFxyXG4gICAgICAgICAgaWYgKHNpbWlsYXJUeXBlcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgaW5zdHJ1Y3Rpb24gKz0gYFxcblxcbvCflI0gRm91bmQgc2ltaWxhciBjb21wb25lbnRzOiAke3NpbWlsYXJUeXBlcy5qb2luKCcsICcpfWA7XHJcbiAgICAgICAgICAgICAgaW5zdHJ1Y3Rpb24gKz0gYFxcbvCfkqEgU3VnZ2VzdGlvbjogUGVyaGFwcyB5b3UgbWVhbnQgdG8gc2V0IHRoZSAnJHtzaW1pbGFyVHlwZXNbMF19JyBjb21wb25lbnQ/YDtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIFxyXG4gICAgICAgICAgLy8gUmVjb21tZW5kIHBvc3NpYmxlIGNvbXBvbmVudHMgYmFzZWQgb24gcHJvcGVydHkgbmFtZVxyXG4gICAgICAgICAgY29uc3QgcHJvcGVydHlUb0NvbXBvbmVudE1hcDogUmVjb3JkPHN0cmluZywgc3RyaW5nW10+ID0ge1xyXG4gICAgICAgICAgICAgICdzdHJpbmcnOiBbJ2NjLkxhYmVsJywgJ2NjLlJpY2hUZXh0JywgJ2NjLkVkaXRCb3gnXSxcclxuICAgICAgICAgICAgICAndGV4dCc6IFsnY2MuTGFiZWwnLCAnY2MuUmljaFRleHQnXSxcclxuICAgICAgICAgICAgICAnZm9udFNpemUnOiBbJ2NjLkxhYmVsJywgJ2NjLlJpY2hUZXh0J10sXHJcbiAgICAgICAgICAgICAgJ3Nwcml0ZUZyYW1lJzogWydjYy5TcHJpdGUnXSxcclxuICAgICAgICAgICAgICAnY29sb3InOiBbJ2NjLkxhYmVsJywgJ2NjLlNwcml0ZScsICdjYy5HcmFwaGljcyddLFxyXG4gICAgICAgICAgICAgICdub3JtYWxDb2xvcic6IFsnY2MuQnV0dG9uJ10sXHJcbiAgICAgICAgICAgICAgJ3ByZXNzZWRDb2xvcic6IFsnY2MuQnV0dG9uJ10sXHJcbiAgICAgICAgICAgICAgJ3RhcmdldCc6IFsnY2MuQnV0dG9uJ10sXHJcbiAgICAgICAgICAgICAgJ2NvbnRlbnRTaXplJzogWydjYy5VSVRyYW5zZm9ybSddLFxyXG4gICAgICAgICAgICAgICdhbmNob3JQb2ludCc6IFsnY2MuVUlUcmFuc2Zvcm0nXVxyXG4gICAgICAgICAgfTtcclxuICAgICAgICAgIFxyXG4gICAgICAgICAgY29uc3QgcmVjb21tZW5kZWRDb21wb25lbnRzID0gcHJvcGVydHlUb0NvbXBvbmVudE1hcFtwcm9wZXJ0eV0gfHwgW107XHJcbiAgICAgICAgICBjb25zdCBhdmFpbGFibGVSZWNvbW1lbmRlZCA9IHJlY29tbWVuZGVkQ29tcG9uZW50cy5maWx0ZXIoY29tcCA9PiBhdmFpbGFibGVUeXBlcy5pbmNsdWRlcyhjb21wKSk7XHJcbiAgICAgICAgICBcclxuICAgICAgICAgIGlmIChhdmFpbGFibGVSZWNvbW1lbmRlZC5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgaW5zdHJ1Y3Rpb24gKz0gYFxcblxcbvCfjq8gQmFzZWQgb24gcHJvcGVydHkgJyR7cHJvcGVydHl9JywgcmVjb21tZW5kZWQgY29tcG9uZW50czogJHthdmFpbGFibGVSZWNvbW1lbmRlZC5qb2luKCcsICcpfWA7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBcclxuICAgICAgICAgIC8vIFByb3ZpZGUgb3BlcmF0aW9uIHN1Z2dlc3Rpb25zXHJcbiAgICAgICAgICBpbnN0cnVjdGlvbiArPSBgXFxuXFxu8J+TiyBTdWdnZXN0ZWQgQWN0aW9uczpgO1xyXG4gICAgICAgICAgaW5zdHJ1Y3Rpb24gKz0gYFxcbjEuIFVzZSBnZXRfY29tcG9uZW50cyhub2RlVXVpZD1cIiR7cmVxdWVzdGVkVHlwZS5pbmNsdWRlcygndXVpZCcpID8gJ1lPVVJfTk9ERV9VVUlEJyA6ICdub2RlVXVpZCd9XCIpIHRvIHZpZXcgYWxsIGNvbXBvbmVudHMgb24gdGhlIG5vZGVgO1xyXG4gICAgICAgICAgaW5zdHJ1Y3Rpb24gKz0gYFxcbjIuIElmIHlvdSBuZWVkIHRvIGFkZCBhIGNvbXBvbmVudCwgdXNlIGFkZF9jb21wb25lbnQobm9kZVV1aWQ9XCIuLi5cIiwgY29tcG9uZW50VHlwZT1cIiR7cmVxdWVzdGVkVHlwZX1cIilgO1xyXG4gICAgICAgICAgaW5zdHJ1Y3Rpb24gKz0gYFxcbjMuIFZlcmlmeSB0aGF0IHRoZSBjb21wb25lbnQgdHlwZSBuYW1lIGlzIGNvcnJlY3QgKGNhc2Utc2Vuc2l0aXZlKWA7XHJcbiAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgcmV0dXJuIGluc3RydWN0aW9uO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5b+r6YCf6aqM6K+B6LWE5rqQ6K6+572u57uT5p6cXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgYXN5bmMgcXVpY2tWZXJpZnlBc3NldChub2RlVXVpZDogc3RyaW5nLCBjb21wb25lbnRUeXBlOiBzdHJpbmcsIHByb3BlcnR5OiBzdHJpbmcpOiBQcm9taXNlPGFueT4ge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHJhd05vZGVEYXRhID0gYXdhaXQgRWRpdG9yLk1lc3NhZ2UucmVxdWVzdCgnc2NlbmUnLCAncXVlcnktbm9kZScsIG5vZGVVdWlkKTtcclxuICAgICAgICAgICAgaWYgKCFyYXdOb2RlRGF0YSB8fCAhcmF3Tm9kZURhdGEuX19jb21wc19fKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgLy8g5om+5Yiw57uE5Lu2XHJcbiAgICAgICAgICAgIGNvbnN0IGNvbXBvbmVudCA9IHJhd05vZGVEYXRhLl9fY29tcHNfXy5maW5kKChjb21wOiBhbnkpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGNvbXBUeXBlID0gY29tcC5fX3R5cGVfXyB8fCBjb21wLmNpZCB8fCBjb21wLnR5cGU7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gY29tcFR5cGUgPT09IGNvbXBvbmVudFR5cGU7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgaWYgKCFjb21wb25lbnQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAvLyDmj5Dlj5blsZ7mgKflgLxcclxuICAgICAgICAgICAgY29uc3QgcHJvcGVydGllcyA9IHRoaXMuZXh0cmFjdENvbXBvbmVudFByb3BlcnRpZXMoY29tcG9uZW50KTtcclxuICAgICAgICAgICAgY29uc3QgcHJvcGVydHlEYXRhID0gcHJvcGVydGllc1twcm9wZXJ0eV07XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBpZiAocHJvcGVydHlEYXRhICYmIHR5cGVvZiBwcm9wZXJ0eURhdGEgPT09ICdvYmplY3QnICYmICd2YWx1ZScgaW4gcHJvcGVydHlEYXRhKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcHJvcGVydHlEYXRhLnZhbHVlO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHByb3BlcnR5RGF0YTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoYFtxdWlja1ZlcmlmeUFzc2V0XSBFcnJvcjpgLCBlcnJvcik7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOmAmui/h+iKgueCueWQjeensOiuvue9riBTaGFwZURyYXdlciDnu4Tku7blsZ7mgKdcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBhc3luYyBzZXRTaGFwZURyYXdlclByb3BlcnRpZXMoYXJnczogYW55KTogUHJvbWlzZTxUb29sUmVzcG9uc2U+IHtcclxuICAgICAgICBjb25zdCB7IG5vZGVOYW1lLCBmaWxsQ29sb3IsIHJhZGl1cywgZW5hYmxlU3Ryb2tlLCBzaGFwZVR5cGUsIHN0cm9rZVdpZHRoLCBzdHJva2VDb2xvciwgcmVkcmF3ID0gdHJ1ZSB9ID0gYXJncztcclxuICAgICAgICBcclxuICAgICAgICBpZiAoIW5vZGVOYW1lKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogJ25vZGVOYW1lIGlzIHJlcXVpcmVkJyB9O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgLy8gMS4g5p+l5om+6IqC54K5XHJcbiAgICAgICAgICAgIGNvbnN0IGZpbmRSZXN1bHQgPSBhd2FpdCB0aGlzLmZpbmROb2RlQnlOYW1lKG5vZGVOYW1lKTtcclxuICAgICAgICAgICAgaWYgKCFmaW5kUmVzdWx0LnN1Y2Nlc3MgfHwgIWZpbmRSZXN1bHQuZGF0YT8ubm9kZVV1aWQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB7IFxyXG4gICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZhbHNlLCBcclxuICAgICAgICAgICAgICAgICAgICBlcnJvcjogYE5vZGUgJyR7bm9kZU5hbWV9JyBub3QgZm91bmQ6ICR7ZmluZFJlc3VsdC5lcnJvcn1gIFxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29uc3Qgbm9kZVV1aWQgPSBmaW5kUmVzdWx0LmRhdGEubm9kZVV1aWQ7XHJcblxyXG4gICAgICAgICAgICAvLyAyLiDojrflj5boioLngrnkuIrnmoQgU2hhcGVEcmF3ZXIg57uE5Lu2XHJcbiAgICAgICAgICAgIGNvbnN0IGNvbXBvbmVudHNSZXN1bHQgPSBhd2FpdCB0aGlzLmdldENvbXBvbmVudHMobm9kZVV1aWQpO1xyXG4gICAgICAgICAgICBpZiAoIWNvbXBvbmVudHNSZXN1bHQuc3VjY2VzcyB8fCAhY29tcG9uZW50c1Jlc3VsdC5kYXRhPy5jb21wb25lbnRzKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4geyBcclxuICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmYWxzZSwgXHJcbiAgICAgICAgICAgICAgICAgICAgZXJyb3I6IGBGYWlsZWQgdG8gZ2V0IGNvbXBvbmVudHMgZm9yIG5vZGUgJyR7bm9kZU5hbWV9JzogJHtjb21wb25lbnRzUmVzdWx0LmVycm9yfWAgXHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyDmn6Xmib4gU2hhcGVEcmF3ZXIg57uE5Lu277yI5Y+v6IO95pivIFwiU2hhcGVEcmF3ZXJcIiDmiJbohJrmnKznmoQgY2lk77yJXHJcbiAgICAgICAgICAgIGNvbnN0IHNoYXBlRHJhd2VyQ29tcCA9IGNvbXBvbmVudHNSZXN1bHQuZGF0YS5jb21wb25lbnRzLmZpbmQoXHJcbiAgICAgICAgICAgICAgICAoY29tcDogYW55KSA9PiBjb21wLnR5cGUgPT09ICdTaGFwZURyYXdlcicgfHwgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChjb21wLnByb3BlcnRpZXMgJiYgT2JqZWN0LmtleXMoY29tcC5wcm9wZXJ0aWVzKS5zb21lKGtleSA9PiBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleS5pbmNsdWRlcygnZmlsbENvbG9yJykgfHwga2V5LmluY2x1ZGVzKCdyYWRpdXMnKSB8fCBrZXkuaW5jbHVkZXMoJ3NoYXBlVHlwZScpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICkpXHJcbiAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICBpZiAoIXNoYXBlRHJhd2VyQ29tcCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgXHJcbiAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogZmFsc2UsIFxyXG4gICAgICAgICAgICAgICAgICAgIGVycm9yOiBgU2hhcGVEcmF3ZXIgY29tcG9uZW50IG5vdCBmb3VuZCBvbiBub2RlICcke25vZGVOYW1lfScuIEF2YWlsYWJsZSBjb21wb25lbnRzOiAke2NvbXBvbmVudHNSZXN1bHQuZGF0YS5jb21wb25lbnRzLm1hcCgoYzogYW55KSA9PiBjLnR5cGUpLmpvaW4oJywgJyl9YCBcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGBbQ29tcG9uZW50VG9vbHNdIEZvdW5kIFNoYXBlRHJhd2VyIG9uIG5vZGUgJyR7bm9kZU5hbWV9Jywgc2V0dGluZyBwcm9wZXJ0aWVzLi4uYCk7XHJcblxyXG4gICAgICAgICAgICAvLyAzLiDorr7nva7lsZ7mgKdcclxuICAgICAgICAgICAgY29uc3QgcHJvcGVydGllc1RvU2V0OiBBcnJheTx7IHByb3BlcnR5OiBzdHJpbmc7IHZhbHVlOiBhbnk7IHByb3BlcnR5VHlwZTogc3RyaW5nIH0+ID0gW107XHJcblxyXG4gICAgICAgICAgICBpZiAoZmlsbENvbG9yICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIHByb3BlcnRpZXNUb1NldC5wdXNoKHsgcHJvcGVydHk6ICdmaWxsQ29sb3InLCB2YWx1ZTogZmlsbENvbG9yLCBwcm9wZXJ0eVR5cGU6ICdjb2xvcicgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHJhZGl1cyAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzVG9TZXQucHVzaCh7IHByb3BlcnR5OiAncmFkaXVzJywgdmFsdWU6IHJhZGl1cywgcHJvcGVydHlUeXBlOiAnbnVtYmVyJyB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoZW5hYmxlU3Ryb2tlICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIHByb3BlcnRpZXNUb1NldC5wdXNoKHsgcHJvcGVydHk6ICdlbmFibGVTdHJva2UnLCB2YWx1ZTogZW5hYmxlU3Ryb2tlLCBwcm9wZXJ0eVR5cGU6ICdib29sZWFuJyB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoc2hhcGVUeXBlICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIHByb3BlcnRpZXNUb1NldC5wdXNoKHsgcHJvcGVydHk6ICdzaGFwZVR5cGUnLCB2YWx1ZTogc2hhcGVUeXBlLCBwcm9wZXJ0eVR5cGU6ICdpbnRlZ2VyJyB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoc3Ryb2tlV2lkdGggIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgcHJvcGVydGllc1RvU2V0LnB1c2goeyBwcm9wZXJ0eTogJ3N0cm9rZVdpZHRoJywgdmFsdWU6IHN0cm9rZVdpZHRoLCBwcm9wZXJ0eVR5cGU6ICdudW1iZXInIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChzdHJva2VDb2xvciAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzVG9TZXQucHVzaCh7IHByb3BlcnR5OiAnc3Ryb2tlQ29sb3InLCB2YWx1ZTogc3Ryb2tlQ29sb3IsIHByb3BlcnR5VHlwZTogJ2NvbG9yJyB9KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHByb3BlcnRpZXNUb1NldC5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB7IFxyXG4gICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZhbHNlLCBcclxuICAgICAgICAgICAgICAgICAgICBlcnJvcjogJ05vIHByb3BlcnRpZXMgdG8gc2V0LiBQcm92aWRlIGF0IGxlYXN0IG9uZSBvZjogZmlsbENvbG9yLCByYWRpdXMsIGVuYWJsZVN0cm9rZSwgc2hhcGVUeXBlLCBzdHJva2VXaWR0aCwgc3Ryb2tlQ29sb3InIFxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gNC4g5om56YeP6K6+572u5bGe5oCnXHJcbiAgICAgICAgICAgIGNvbnN0IHNldFJlc3VsdCA9IGF3YWl0IHRoaXMuc2V0Q29tcG9uZW50UHJvcGVydGllcyh7XHJcbiAgICAgICAgICAgICAgICBub2RlVXVpZCxcclxuICAgICAgICAgICAgICAgIGNvbXBvbmVudFR5cGU6IHNoYXBlRHJhd2VyQ29tcC50eXBlLFxyXG4gICAgICAgICAgICAgICAgcHJvcGVydGllczogcHJvcGVydGllc1RvU2V0XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgaWYgKCFzZXRSZXN1bHQuc3VjY2Vzcykge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHNldFJlc3VsdDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gNS4g5aaC5p6c6ZyA6KaB77yM6LCD55SoIHJlZHJhdygpXHJcbiAgICAgICAgICAgIGlmIChyZWRyYXcpIHtcclxuICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgRWRpdG9yLk1lc3NhZ2UucmVxdWVzdCgnc2NlbmUnLCAnZXhlY3V0ZS1jb21wb25lbnQtbWV0aG9kJywge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB1dWlkOiBub2RlVXVpZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3M6IHNoYXBlRHJhd2VyQ29tcC50eXBlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXRob2Q6ICdyZWRyYXcnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhcmdzOiBbXVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGBbQ29tcG9uZW50VG9vbHNdIENhbGxlZCByZWRyYXcoKSBvbiBTaGFwZURyYXdlcmApO1xyXG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyOiBhbnkpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oYFtDb21wb25lbnRUb29sc10gRmFpbGVkIHRvIGNhbGwgcmVkcmF3KCk6ICR7ZXJyLm1lc3NhZ2V9YCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogYFNoYXBlRHJhd2VyIHByb3BlcnRpZXMgc2V0IHN1Y2Nlc3NmdWxseSBvbiBub2RlICcke25vZGVOYW1lfSdgLFxyXG4gICAgICAgICAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgICAgICAgICAgIG5vZGVOYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgIG5vZGVVdWlkLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudFR5cGU6IHNoYXBlRHJhd2VyQ29tcC50eXBlLFxyXG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXNTZXQ6IHByb3BlcnRpZXNUb1NldC5tYXAocCA9PiBwLnByb3BlcnR5KSxcclxuICAgICAgICAgICAgICAgICAgICByZWRyYXdDYWxsZWQ6IHJlZHJhd1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICB9IGNhdGNoIChlcnJvcjogYW55KSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ1tDb21wb25lbnRUb29sc10gc2V0U2hhcGVEcmF3ZXJQcm9wZXJ0aWVzIGVycm9yOicsIGVycm9yKTtcclxuICAgICAgICAgICAgcmV0dXJuIHsgXHJcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiBmYWxzZSwgXHJcbiAgICAgICAgICAgICAgICBlcnJvcjogYEZhaWxlZCB0byBzZXQgU2hhcGVEcmF3ZXIgcHJvcGVydGllczogJHtlcnJvci5tZXNzYWdlfWAgXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog6YCa6L+H5ZCN56ew5p+l5om+6IqC54K5XHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgYXN5bmMgZmluZE5vZGVCeU5hbWUobmFtZTogc3RyaW5nKTogUHJvbWlzZTxUb29sUmVzcG9uc2U+IHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcclxuICAgICAgICAgICAgRWRpdG9yLk1lc3NhZ2UucmVxdWVzdCgnc2NlbmUnLCAncXVlcnktbm9kZS1ieS1uYW1lJywgbmFtZSkudGhlbigobm9kZVV1aWQ6IGFueSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKG5vZGVVdWlkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHsgbm9kZVV1aWQgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBgTm9kZSAnJHtuYW1lfScgbm90IGZvdW5kYCB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSkuY2F0Y2goKGVycjogRXJyb3IpID0+IHtcclxuICAgICAgICAgICAgICAgIHJlc29sdmUoeyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IGBGYWlsZWQgdG8gZmluZCBub2RlOiAke2Vyci5tZXNzYWdlfWAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59Il19