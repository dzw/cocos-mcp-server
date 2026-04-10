"use strict";
/* eslint-disable vue/one-component-per-file */
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const vue_1 = require("vue");
const panelDataMap = new WeakMap();
const timerMap = new WeakMap();
module.exports = Editor.Panel.define({
    listeners: {
        show() {
            console.log('[MCP Panel] Panel shown');
        },
        hide() {
            console.log('[MCP Panel] Panel hidden');
        },
    },
    template: (0, fs_extra_1.readFileSync)((0, path_1.join)(__dirname, '../../../static/template/default/index.vue'), 'utf-8'),
    style: (0, fs_extra_1.readFileSync)((0, path_1.join)(__dirname, '../../../static/style/default/index.css'), 'utf-8'),
    $: {
        app: '#app',
        panelTitle: '#panelTitle',
    },
    ready() {
        if (this.$.app) {
            const app = (0, vue_1.createApp)({});
            app.config.compilerOptions.isCustomElement = (tag) => tag.startsWith('ui-');
            // 创建主应用组件
            app.component('McpServerApp', (0, vue_1.defineComponent)({
                setup() {
                    // 响应式数据
                    const activeTab = (0, vue_1.ref)('server');
                    const serverRunning = (0, vue_1.ref)(false);
                    const serverStatus = (0, vue_1.ref)('已停止');
                    const connectedClients = (0, vue_1.ref)(0);
                    const httpUrl = (0, vue_1.ref)('');
                    const isProcessing = (0, vue_1.ref)(false);
                    const settings = (0, vue_1.ref)({
                        port: 3000,
                        autoStart: false,
                        enableDebugLog: false,
                        maxConnections: 10
                    });
                    const availableTools = (0, vue_1.ref)([]);
                    const toolCategories = (0, vue_1.ref)([]);
                    const collapsedCategories = (0, vue_1.ref)({});
                    // 计算属性
                    const statusClass = (0, vue_1.computed)(() => ({
                        'status-running': serverRunning.value,
                        'status-stopped': !serverRunning.value
                    }));
                    const totalTools = (0, vue_1.computed)(() => availableTools.value.length);
                    const enabledTools = (0, vue_1.computed)(() => availableTools.value.filter(t => t.enabled).length);
                    const disabledTools = (0, vue_1.computed)(() => totalTools.value - enabledTools.value);
                    const settingsChanged = (0, vue_1.ref)(false);
                    // 方法
                    const switchTab = (tabName) => {
                        activeTab.value = tabName;
                        if (tabName === 'tools') {
                            loadToolManagerState();
                        }
                    };
                    const toggleServer = async () => {
                        try {
                            if (serverRunning.value) {
                                await Editor.Message.request('cocos-mcp-server', 'stop-server');
                            }
                            else {
                                // 启动服务器时使用当前面板设置
                                const currentSettings = {
                                    port: settings.value.port,
                                    autoStart: settings.value.autoStart,
                                    enableDebugLog: settings.value.enableDebugLog,
                                    maxConnections: settings.value.maxConnections
                                };
                                await Editor.Message.request('cocos-mcp-server', 'update-settings', currentSettings);
                                await Editor.Message.request('cocos-mcp-server', 'start-server');
                            }
                            console.log('[Vue App] Server toggled');
                        }
                        catch (error) {
                            console.error('[Vue App] Failed to toggle server:', error);
                        }
                    };
                    const saveSettings = async () => {
                        var _a, _b;
                        try {
                            // 创建一个简单的对象，避免克隆错误
                            const settingsData = {
                                port: settings.value.port,
                                autoStart: settings.value.autoStart,
                                enableDebugLog: settings.value.enableDebugLog,
                                maxConnections: settings.value.maxConnections
                            };
                            console.log('[Vue App] Saving settings:', JSON.stringify(settingsData));
                            // update-settings 直接返回保存后的设置，使用返回值更新界面
                            const savedSettings = await Editor.Message.request('cocos-mcp-server', 'update-settings', settingsData);
                            console.log('[Vue App] Save settings result:', savedSettings);
                            // 使用返回的设置更新本地状态（而不是重新获取服务器状态）
                            if (savedSettings) {
                                settings.value = {
                                    port: (_a = savedSettings.port) !== null && _a !== void 0 ? _a : 3000,
                                    autoStart: !!savedSettings.autoStart,
                                    enableDebugLog: !!savedSettings.enableDebugLog,
                                    maxConnections: (_b = savedSettings.maxConnections) !== null && _b !== void 0 ? _b : 10
                                };
                                console.log('[Vue App] Settings updated from saved result:', settings.value);
                            }
                            settingsChanged.value = false;
                        }
                        catch (error) {
                            console.error('[Vue App] Failed to save settings:', error);
                        }
                    };
                    // Checkbox 事件处理函数
                    const onAutoStartChange = (event) => {
                        const newValue = event.target.checked;
                        console.log('[Vue App] AutoStart changed to:', newValue);
                        settings.value.autoStart = newValue;
                    };
                    const onDebugLogChange = (event) => {
                        const newValue = event.target.checked;
                        console.log('[Vue App] EnableDebugLog changed to:', newValue);
                        settings.value.enableDebugLog = newValue;
                    };
                    const copyUrl = async () => {
                        try {
                            await navigator.clipboard.writeText(httpUrl.value);
                            console.log('[Vue App] URL copied to clipboard');
                        }
                        catch (error) {
                            console.error('[Vue App] Failed to copy URL:', error);
                        }
                    };
                    const loadToolManagerState = async () => {
                        try {
                            const result = await Editor.Message.request('cocos-mcp-server', 'getToolManagerState');
                            if (result && result.success) {
                                // 总是加载后端状态，确保数据是最新的
                                availableTools.value = result.availableTools || [];
                                console.log('[Vue App] Loaded tools:', availableTools.value.length);
                                // 更新工具分类
                                const categories = new Set(availableTools.value.map(tool => tool.category));
                                toolCategories.value = Array.from(categories);
                            }
                        }
                        catch (error) {
                            console.error('[Vue App] Failed to load tool manager state:', error);
                        }
                    };
                    const updateToolStatus = async (category, name, enabled) => {
                        try {
                            console.log('[Vue App] updateToolStatus called:', category, name, enabled);
                            // 先更新本地状态
                            const toolIndex = availableTools.value.findIndex(t => t.category === category && t.name === name);
                            if (toolIndex !== -1) {
                                availableTools.value[toolIndex].enabled = enabled;
                                // 强制触发响应式更新
                                availableTools.value = [...availableTools.value];
                                console.log('[Vue App] Local state updated, tool enabled:', availableTools.value[toolIndex].enabled);
                            }
                            // 调用后端更新
                            const result = await Editor.Message.request('cocos-mcp-server', 'updateToolStatus', category, name, enabled);
                            if (!result || !result.success) {
                                // 如果后端更新失败，回滚本地状态
                                if (toolIndex !== -1) {
                                    availableTools.value[toolIndex].enabled = !enabled;
                                    availableTools.value = [...availableTools.value];
                                }
                                console.error('[Vue App] Backend update failed, rolled back local state');
                            }
                            else {
                                console.log('[Vue App] Backend update successful');
                            }
                        }
                        catch (error) {
                            // 如果发生错误，回滚本地状态
                            const toolIndex = availableTools.value.findIndex(t => t.category === category && t.name === name);
                            if (toolIndex !== -1) {
                                availableTools.value[toolIndex].enabled = !enabled;
                                availableTools.value = [...availableTools.value];
                            }
                            console.error('[Vue App] Failed to update tool status:', error);
                        }
                    };
                    const selectAllTools = async () => {
                        try {
                            // 直接更新本地状态，然后保存
                            availableTools.value.forEach(tool => tool.enabled = true);
                            await saveChanges();
                        }
                        catch (error) {
                            console.error('[Vue App] Failed to select all tools:', error);
                        }
                    };
                    const deselectAllTools = async () => {
                        try {
                            // 直接更新本地状态，然后保存
                            availableTools.value.forEach(tool => tool.enabled = false);
                            await saveChanges();
                        }
                        catch (error) {
                            console.error('[Vue App] Failed to deselect all tools:', error);
                        }
                    };
                    const saveChanges = async () => {
                        try {
                            // 创建普通对象，避免Vue3响应式对象克隆错误
                            const updates = availableTools.value.map(tool => ({
                                category: String(tool.category),
                                name: String(tool.name),
                                enabled: Boolean(tool.enabled)
                            }));
                            console.log('[Vue App] Sending updates:', updates.length, 'tools');
                            const result = await Editor.Message.request('cocos-mcp-server', 'updateToolStatusBatch', updates);
                            if (result && result.success) {
                                console.log('[Vue App] Tool changes saved successfully');
                            }
                        }
                        catch (error) {
                            console.error('[Vue App] Failed to save tool changes:', error);
                        }
                    };
                    const toggleCategoryTools = async (category, enabled) => {
                        try {
                            // 直接更新本地状态，然后保存
                            availableTools.value.forEach(tool => {
                                if (tool.category === category) {
                                    tool.enabled = enabled;
                                }
                            });
                            await saveChanges();
                        }
                        catch (error) {
                            console.error('[Vue App] Failed to toggle category tools:', error);
                        }
                    };
                    const getToolsByCategory = (category) => {
                        return availableTools.value.filter(tool => tool.category === category);
                    };
                    const getCategoryDisplayName = (category) => {
                        const categoryNames = {
                            'scene': '场景工具',
                            'node': '节点工具',
                            'component': '组件工具',
                            'prefab': '预制体工具',
                            'project': '项目工具',
                            'debug': '调试工具',
                            'preferences': '偏好设置工具',
                            'server': '服务器工具',
                            'broadcast': '广播工具',
                            'sceneAdvanced': '高级场景工具',
                            'sceneView': '场景视图工具',
                            'referenceImage': '参考图片工具',
                            'assetAdvanced': '高级资源工具',
                            'validation': '验证工具'
                        };
                        return categoryNames[category] || category;
                    };
                    // 分类折叠相关方法
                    const toggleCategoryCollapse = (category) => {
                        collapsedCategories.value[category] = !collapsedCategories.value[category];
                    };
                    const isCategoryAllEnabled = (category) => {
                        const tools = getToolsByCategory(category);
                        return tools.length > 0 && tools.every(t => t.enabled);
                    };
                    const getCategoryEnabledCount = (category) => {
                        return getToolsByCategory(category).filter(t => t.enabled).length;
                    };
                    const toggleCategoryCheckbox = async (category, enabled) => {
                        const tools = getToolsByCategory(category);
                        for (const tool of tools) {
                            const toolIndex = availableTools.value.findIndex(t => t.category === category && t.name === tool.name);
                            if (toolIndex !== -1) {
                                availableTools.value[toolIndex].enabled = enabled;
                            }
                        }
                        availableTools.value = [...availableTools.value];
                        await saveChanges();
                    };
                    // 折叠/展开全部
                    const collapseAll = () => {
                        toolCategories.value.forEach(cat => {
                            collapsedCategories.value[cat] = true;
                        });
                    };
                    const expandAll = () => {
                        toolCategories.value.forEach(cat => {
                            collapsedCategories.value[cat] = false;
                        });
                    };
                    // 重新加载扩展
                    const reloadExtension = async () => {
                        try {
                            // @ts-ignore
                            var ext_path = Editor.Package.getPath("cocos-mcp-server");
                            console.log("reload " + ext_path);
                            if (ext_path != null) {
                                await Editor.Package.disable(ext_path);
                                setTimeout(() => {
                                    if (ext_path != null) {
                                        Editor.Package.enable(ext_path);
                                    }
                                }, 500);
                            }
                        }
                        catch (error) {
                            console.error('[Vue App] Failed to reload extension:', error);
                        }
                    };
                    // 监听设置变化
                    (0, vue_1.watch)(settings, () => {
                        settingsChanged.value = true;
                    }, { deep: true });
                    // 组件挂载时加载数据
                    (0, vue_1.onMounted)(async () => {
                        var _a, _b;
                        // 加载工具管理器状态
                        await loadToolManagerState();
                        // 从服务器状态获取设置信息
                        try {
                            const serverStatus = await Editor.Message.request('cocos-mcp-server', 'get-server-status');
                            if (serverStatus && serverStatus.settings) {
                                settings.value = {
                                    port: (_a = serverStatus.settings.port) !== null && _a !== void 0 ? _a : 3000,
                                    autoStart: !!serverStatus.settings.autoStart,
                                    enableDebugLog: !!serverStatus.settings.enableDebugLog,
                                    maxConnections: (_b = serverStatus.settings.maxConnections) !== null && _b !== void 0 ? _b : 10
                                };
                                console.log('[Vue App] Server settings loaded from status:', serverStatus.settings);
                            }
                            else if (serverStatus && serverStatus.port) {
                                // 兼容旧版本，只获取端口信息
                                settings.value.port = serverStatus.port;
                                console.log('[Vue App] Port loaded from server status:', serverStatus.port);
                            }
                        }
                        catch (error) {
                            console.error('[Vue App] Failed to get server status:', error);
                            console.log('[Vue App] Using default server settings');
                        }
                        // 定期更新服务器状态
                        const timer = setInterval(async () => {
                            try {
                                const result = await Editor.Message.request('cocos-mcp-server', 'get-server-status');
                                if (result) {
                                    serverRunning.value = result.running;
                                    serverStatus.value = result.running ? '运行中' : '已停止';
                                    connectedClients.value = result.clients || 0;
                                    httpUrl.value = result.running ? `http://localhost:${result.port}` : '';
                                    isProcessing.value = false;
                                }
                            }
                            catch (error) {
                                // 静默处理错误，避免日志刷屏
                            }
                        }, 2000);
                        // 保存定时器ID以便清理
                        timerMap.set(this, timer);
                    });
                    return {
                        // 数据
                        activeTab,
                        serverRunning,
                        serverStatus,
                        connectedClients,
                        httpUrl,
                        isProcessing,
                        settings,
                        availableTools,
                        toolCategories,
                        settingsChanged,
                        collapsedCategories,
                        // 计算属性
                        statusClass,
                        totalTools,
                        enabledTools,
                        disabledTools,
                        // 方法
                        switchTab,
                        toggleServer,
                        saveSettings,
                        copyUrl,
                        onAutoStartChange,
                        onDebugLogChange,
                        loadToolManagerState,
                        updateToolStatus,
                        selectAllTools,
                        deselectAllTools,
                        saveChanges,
                        toggleCategoryTools,
                        getToolsByCategory,
                        getCategoryDisplayName,
                        toggleCategoryCollapse,
                        isCategoryAllEnabled,
                        getCategoryEnabledCount,
                        toggleCategoryCheckbox,
                        collapseAll,
                        expandAll,
                        reloadExtension
                    };
                },
                template: (0, fs_extra_1.readFileSync)((0, path_1.join)(__dirname, '../../../static/template/vue/mcp-server-app.vue'), 'utf-8'),
            }));
            app.mount(this.$.app);
            panelDataMap.set(this, app);
            console.log('[MCP Panel] Vue3 app mounted successfully');
        }
    },
    beforeClose() {
    },
    close() {
        // 清除定时器
        const timer = timerMap.get(this);
        if (timer) {
            clearInterval(timer);
            timerMap.delete(this);
        }
        // 卸载Vue应用
        const app = panelDataMap.get(this);
        if (app) {
            app.unmount();
            panelDataMap.delete(this);
        }
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zb3VyY2UvcGFuZWxzL2RlZmF1bHQvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLCtDQUErQzs7QUFFL0MsdUNBQXNDO0FBQ3RDLCtCQUEwQjtBQUMxQiw2QkFBNEc7QUFFNUcsTUFBTSxZQUFZLEdBQUcsSUFBSSxPQUFPLEVBQVksQ0FBQztBQUM3QyxNQUFNLFFBQVEsR0FBRyxJQUFJLE9BQU8sRUFBdUIsQ0FBQztBQTRCcEQsTUFBTSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQztJQUNqQyxTQUFTLEVBQUU7UUFDUCxJQUFJO1lBQ0EsT0FBTyxDQUFDLEdBQUcsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO1FBQzNDLENBQUM7UUFDRCxJQUFJO1lBQ0EsT0FBTyxDQUFDLEdBQUcsQ0FBQywwQkFBMEIsQ0FBQyxDQUFDO1FBQzVDLENBQUM7S0FDSjtJQUNELFFBQVEsRUFBRSxJQUFBLHVCQUFZLEVBQUMsSUFBQSxXQUFJLEVBQUMsU0FBUyxFQUFFLDRDQUE0QyxDQUFDLEVBQUUsT0FBTyxDQUFDO0lBQzlGLEtBQUssRUFBRSxJQUFBLHVCQUFZLEVBQUMsSUFBQSxXQUFJLEVBQUMsU0FBUyxFQUFFLHlDQUF5QyxDQUFDLEVBQUUsT0FBTyxDQUFDO0lBQ3hGLENBQUMsRUFBRTtRQUNDLEdBQUcsRUFBRSxNQUFNO1FBQ1gsVUFBVSxFQUFFLGFBQWE7S0FDNUI7SUFDRCxLQUFLO1FBQ0QsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO1lBQ2IsTUFBTSxHQUFHLEdBQUcsSUFBQSxlQUFTLEVBQUMsRUFBRSxDQUFDLENBQUM7WUFDMUIsR0FBRyxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUMsZUFBZSxHQUFHLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxD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QkFDdEIsV0FBVzt3QkFDWCxTQUFTO3dCQUNULGVBQWU7cUJBQ2xCLENBQUM7Z0JBQ04sQ0FBQztnQkFDRCxRQUFRLEVBQUUsSUFBQSx1QkFBWSxFQUFDLElBQUEsV0FBSSxFQUFDLFNBQVMsRUFBRSxpREFBaUQsQ0FBQyxFQUFFLE9BQU8sQ0FBQzthQUN0RyxDQUFDLENBQUMsQ0FBQztZQUVKLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUN0QixZQUFZLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztZQUU1QixPQUFPLENBQUMsR0FBRyxDQUFDLDJDQUEyQyxDQUFDLENBQUM7UUFDN0QsQ0FBQztJQUNMLENBQUM7SUFDRCxXQUFXO0lBQ1gsQ0FBQztJQUNELEtBQUs7UUFDRCxRQUFRO1FBQ1IsTUFBTSxLQUFLLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNqQyxJQUFJLEtBQUssRUFBRSxDQUFDO1lBQ1IsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3JCLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDMUIsQ0FBQztRQUNELFVBQVU7UUFDVixNQUFNLEdBQUcsR0FBRyxZQUFZLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ25DLElBQUksR0FBRyxFQUFFLENBQUM7WUFDTixHQUFHLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDZCxZQUFZLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzlCLENBQUM7SUFDTCxDQUFDO0NBQ0osQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyogZXNsaW50LWRpc2FibGUgdnVlL29uZS1jb21wb25lbnQtcGVyLWZpbGUgKi9cclxuXHJcbmltcG9ydCB7cmVhZEZpbGVTeW5jfSBmcm9tICdmcy1leHRyYSc7XHJcbmltcG9ydCB7am9pbn0gZnJvbSAncGF0aCc7XHJcbmltcG9ydCB7Y3JlYXRlQXBwLCBBcHAsIGRlZmluZUNvbXBvbmVudCwgcmVmLCBjb21wdXRlZCwgb25Nb3VudGVkLCBvblVubW91bnRlZCwgd2F0Y2gsIG5leHRUaWNrfSBmcm9tICd2dWUnO1xyXG5cclxuY29uc3QgcGFuZWxEYXRhTWFwID0gbmV3IFdlYWtNYXA8YW55LCBBcHA+KCk7XHJcbmNvbnN0IHRpbWVyTWFwID0gbmV3IFdlYWtNYXA8YW55LCBOb2RlSlMuVGltZW91dD4oKTtcclxuXHJcbi8vIOWumuS5ieW3peWFt+mFjee9ruaOpeWPo1xyXG5pbnRlcmZhY2UgVG9vbENvbmZpZyB7XHJcbiAgICBjYXRlZ29yeTogc3RyaW5nO1xyXG4gICAgbmFtZTogc3RyaW5nO1xyXG4gICAgZW5hYmxlZDogYm9vbGVhbjtcclxuICAgIGRlc2NyaXB0aW9uOiBzdHJpbmc7XHJcbn1cclxuXHJcbi8vIOWumuS5iemFjee9ruaOpeWPo1xyXG5pbnRlcmZhY2UgQ29uZmlndXJhdGlvbiB7XHJcbiAgICBpZDogc3RyaW5nO1xyXG4gICAgbmFtZTogc3RyaW5nO1xyXG4gICAgZGVzY3JpcHRpb246IHN0cmluZztcclxuICAgIHRvb2xzOiBUb29sQ29uZmlnW107XHJcbiAgICBjcmVhdGVkQXQ6IHN0cmluZztcclxuICAgIHVwZGF0ZWRBdDogc3RyaW5nO1xyXG59XHJcblxyXG4vLyDlrprkuYnmnI3liqHlmajorr7nva7mjqXlj6NcclxuaW50ZXJmYWNlIFNlcnZlclNldHRpbmdzIHtcclxuICAgIHBvcnQ6IG51bWJlcjtcclxuICAgIGF1dG9TdGFydDogYm9vbGVhbjtcclxuICAgIGVuYWJsZURlYnVnTG9nOiBib29sZWFuO1xyXG4gICAgbWF4Q29ubmVjdGlvbnM6IG51bWJlcjtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBFZGl0b3IuUGFuZWwuZGVmaW5lKHtcclxuICAgIGxpc3RlbmVyczoge1xyXG4gICAgICAgIHNob3coKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdbTUNQIFBhbmVsXSBQYW5lbCBzaG93bicpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgaGlkZSgpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ1tNQ1AgUGFuZWxdIFBhbmVsIGhpZGRlbicpO1xyXG4gICAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAgdGVtcGxhdGU6IHJlYWRGaWxlU3luYyhqb2luKF9fZGlybmFtZSwgJy4uLy4uLy4uL3N0YXRpYy90ZW1wbGF0ZS9kZWZhdWx0L2luZGV4LnZ1ZScpLCAndXRmLTgnKSxcclxuICAgIHN0eWxlOiByZWFkRmlsZVN5bmMoam9pbihfX2Rpcm5hbWUsICcuLi8uLi8uLi9zdGF0aWMvc3R5bGUvZGVmYXVsdC9pbmRleC5jc3MnKSwgJ3V0Zi04JyksXHJcbiAgICAkOiB7XHJcbiAgICAgICAgYXBwOiAnI2FwcCcsXHJcbiAgICAgICAgcGFuZWxUaXRsZTogJyNwYW5lbFRpdGxlJyxcclxuICAgIH0sXHJcbiAgICByZWFkeSgpIHtcclxuICAgICAgICBpZiAodGhpcy4kLmFwcCkge1xyXG4gICAgICAgICAgICBjb25zdCBhcHAgPSBjcmVhdGVBcHAoe30pO1xyXG4gICAgICAgICAgICBhcHAuY29uZmlnLmNvbXBpbGVyT3B0aW9ucy5pc0N1c3RvbUVsZW1lbnQgPSAodGFnKSA9PiB0YWcuc3RhcnRzV2l0aCgndWktJyk7XHJcblxyXG4gICAgICAgICAgICAvLyDliJvlu7rkuLvlupTnlKjnu4Tku7ZcclxuICAgICAgICAgICAgYXBwLmNvbXBvbmVudCgnTWNwU2VydmVyQXBwJywgZGVmaW5lQ29tcG9uZW50KHtcclxuICAgICAgICAgICAgICAgIHNldHVwKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIOWTjeW6lOW8j+aVsOaNrlxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGFjdGl2ZVRhYiA9IHJlZignc2VydmVyJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc2VydmVyUnVubmluZyA9IHJlZihmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc2VydmVyU3RhdHVzID0gcmVmKCflt7LlgZzmraInKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBjb25uZWN0ZWRDbGllbnRzID0gcmVmKDApO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGh0dHBVcmwgPSByZWYoJycpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGlzUHJvY2Vzc2luZyA9IHJlZihmYWxzZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHNldHRpbmdzID0gcmVmPFNlcnZlclNldHRpbmdzPih7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvcnQ6IDMwMDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGF1dG9TdGFydDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVuYWJsZURlYnVnTG9nOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWF4Q29ubmVjdGlvbnM6IDEwXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGF2YWlsYWJsZVRvb2xzID0gcmVmPFRvb2xDb25maWdbXT4oW10pO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRvb2xDYXRlZ29yaWVzID0gcmVmPHN0cmluZ1tdPihbXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY29sbGFwc2VkQ2F0ZWdvcmllcyA9IHJlZjxSZWNvcmQ8c3RyaW5nLCBib29sZWFuPj4oe30pO1xyXG5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8g6K6h566X5bGe5oCnXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc3RhdHVzQ2xhc3MgPSBjb21wdXRlZCgoKSA9PiAoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAnc3RhdHVzLXJ1bm5pbmcnOiBzZXJ2ZXJSdW5uaW5nLnZhbHVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAnc3RhdHVzLXN0b3BwZWQnOiAhc2VydmVyUnVubmluZy52YWx1ZVxyXG4gICAgICAgICAgICAgICAgICAgIH0pKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdG90YWxUb29scyA9IGNvbXB1dGVkKCgpID0+IGF2YWlsYWJsZVRvb2xzLnZhbHVlLmxlbmd0aCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZW5hYmxlZFRvb2xzID0gY29tcHV0ZWQoKCkgPT4gYXZhaWxhYmxlVG9vbHMudmFsdWUuZmlsdGVyKHQgPT4gdC5lbmFibGVkKS5sZW5ndGgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGRpc2FibGVkVG9vbHMgPSBjb21wdXRlZCgoKSA9PiB0b3RhbFRvb2xzLnZhbHVlIC0gZW5hYmxlZFRvb2xzLnZhbHVlKTtcclxuXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHNldHRpbmdzQ2hhbmdlZCA9IHJlZihmYWxzZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIOaWueazlVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHN3aXRjaFRhYiA9ICh0YWJOYW1lOiBzdHJpbmcpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWN0aXZlVGFiLnZhbHVlID0gdGFiTmFtZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRhYk5hbWUgPT09ICd0b29scycpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvYWRUb29sTWFuYWdlclN0YXRlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjb25zdCB0b2dnbGVTZXJ2ZXIgPSBhc3luYyAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc2VydmVyUnVubmluZy52YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IEVkaXRvci5NZXNzYWdlLnJlcXVlc3QoJ2NvY29zLW1jcC1zZXJ2ZXInLCAnc3RvcC1zZXJ2ZXInKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g5ZCv5Yqo5pyN5Yqh5Zmo5pe25L2/55So5b2T5YmN6Z2i5p2/6K6+572uXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgY3VycmVudFNldHRpbmdzID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb3J0OiBzZXR0aW5ncy52YWx1ZS5wb3J0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdXRvU3RhcnQ6IHNldHRpbmdzLnZhbHVlLmF1dG9TdGFydCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5hYmxlRGVidWdMb2c6IHNldHRpbmdzLnZhbHVlLmVuYWJsZURlYnVnTG9nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXhDb25uZWN0aW9uczogc2V0dGluZ3MudmFsdWUubWF4Q29ubmVjdGlvbnNcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IEVkaXRvci5NZXNzYWdlLnJlcXVlc3QoJ2NvY29zLW1jcC1zZXJ2ZXInLCAndXBkYXRlLXNldHRpbmdzJywgY3VycmVudFNldHRpbmdzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCBFZGl0b3IuTWVzc2FnZS5yZXF1ZXN0KCdjb2Nvcy1tY3Atc2VydmVyJywgJ3N0YXJ0LXNlcnZlcicpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ1tWdWUgQXBwXSBTZXJ2ZXIgdG9nZ2xlZCcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignW1Z1ZSBBcHBdIEZhaWxlZCB0byB0b2dnbGUgc2VydmVyOicsIGVycm9yKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHNhdmVTZXR0aW5ncyA9IGFzeW5jICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOWIm+W7uuS4gOS4queugOWNleeahOWvueixoe+8jOmBv+WFjeWFi+mahumUmeivr1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgc2V0dGluZ3NEYXRhID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvcnQ6IHNldHRpbmdzLnZhbHVlLnBvcnQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXV0b1N0YXJ0OiBzZXR0aW5ncy52YWx1ZS5hdXRvU3RhcnQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5hYmxlRGVidWdMb2c6IHNldHRpbmdzLnZhbHVlLmVuYWJsZURlYnVnTG9nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1heENvbm5lY3Rpb25zOiBzZXR0aW5ncy52YWx1ZS5tYXhDb25uZWN0aW9uc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnW1Z1ZSBBcHBdIFNhdmluZyBzZXR0aW5nczonLCBKU09OLnN0cmluZ2lmeShzZXR0aW5nc0RhdGEpKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB1cGRhdGUtc2V0dGluZ3Mg55u05o6l6L+U5Zue5L+d5a2Y5ZCO55qE6K6+572u77yM5L2/55So6L+U5Zue5YC85pu05paw55WM6Z2iXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBzYXZlZFNldHRpbmdzID0gYXdhaXQgRWRpdG9yLk1lc3NhZ2UucmVxdWVzdCgnY29jb3MtbWNwLXNlcnZlcicsICd1cGRhdGUtc2V0dGluZ3MnLCBzZXR0aW5nc0RhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ1tWdWUgQXBwXSBTYXZlIHNldHRpbmdzIHJlc3VsdDonLCBzYXZlZFNldHRpbmdzKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDkvb/nlKjov5Tlm57nmoTorr7nva7mm7TmlrDmnKzlnLDnirbmgIHvvIjogIzkuI3mmK/ph43mlrDojrflj5bmnI3liqHlmajnirbmgIHvvIlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzYXZlZFNldHRpbmdzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0dGluZ3MudmFsdWUgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvcnQ6IHNhdmVkU2V0dGluZ3MucG9ydCA/PyAzMDAwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdXRvU3RhcnQ6ICEhc2F2ZWRTZXR0aW5ncy5hdXRvU3RhcnQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuYWJsZURlYnVnTG9nOiAhIXNhdmVkU2V0dGluZ3MuZW5hYmxlRGVidWdMb2csXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1heENvbm5lY3Rpb25zOiBzYXZlZFNldHRpbmdzLm1heENvbm5lY3Rpb25zID8/IDEwXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnW1Z1ZSBBcHBdIFNldHRpbmdzIHVwZGF0ZWQgZnJvbSBzYXZlZCByZXN1bHQ6Jywgc2V0dGluZ3MudmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldHRpbmdzQ2hhbmdlZC52YWx1ZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignW1Z1ZSBBcHBdIEZhaWxlZCB0byBzYXZlIHNldHRpbmdzOicsIGVycm9yKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIENoZWNrYm94IOS6i+S7tuWkhOeQhuWHveaVsFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG9uQXV0b1N0YXJ0Q2hhbmdlID0gKGV2ZW50OiBhbnkpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbmV3VmFsdWUgPSBldmVudC50YXJnZXQuY2hlY2tlZDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ1tWdWUgQXBwXSBBdXRvU3RhcnQgY2hhbmdlZCB0bzonLCBuZXdWYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldHRpbmdzLnZhbHVlLmF1dG9TdGFydCA9IG5ld1ZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG9uRGVidWdMb2dDaGFuZ2UgPSAoZXZlbnQ6IGFueSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBuZXdWYWx1ZSA9IGV2ZW50LnRhcmdldC5jaGVja2VkO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnW1Z1ZSBBcHBdIEVuYWJsZURlYnVnTG9nIGNoYW5nZWQgdG86JywgbmV3VmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXR0aW5ncy52YWx1ZS5lbmFibGVEZWJ1Z0xvZyA9IG5ld1ZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNvcHlVcmwgPSBhc3luYyAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCBuYXZpZ2F0b3IuY2xpcGJvYXJkLndyaXRlVGV4dChodHRwVXJsLnZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdbVnVlIEFwcF0gVVJMIGNvcGllZCB0byBjbGlwYm9hcmQnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ1tWdWUgQXBwXSBGYWlsZWQgdG8gY29weSBVUkw6JywgZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbG9hZFRvb2xNYW5hZ2VyU3RhdGUgPSBhc3luYyAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBFZGl0b3IuTWVzc2FnZS5yZXF1ZXN0KCdjb2Nvcy1tY3Atc2VydmVyJywgJ2dldFRvb2xNYW5hZ2VyU3RhdGUnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXN1bHQgJiYgcmVzdWx0LnN1Y2Nlc3MpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDmgLvmmK/liqDovb3lkI7nq6/nirbmgIHvvIznoa7kv53mlbDmja7mmK/mnIDmlrDnmoRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdmFpbGFibGVUb29scy52YWx1ZSA9IHJlc3VsdC5hdmFpbGFibGVUb29scyB8fCBbXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnW1Z1ZSBBcHBdIExvYWRlZCB0b29sczonLCBhdmFpbGFibGVUb29scy52YWx1ZS5sZW5ndGgpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDmm7TmlrDlt6XlhbfliIbnsbtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBjYXRlZ29yaWVzID0gbmV3IFNldChhdmFpbGFibGVUb29scy52YWx1ZS5tYXAodG9vbCA9PiB0b29sLmNhdGVnb3J5KSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9vbENhdGVnb3JpZXMudmFsdWUgPSBBcnJheS5mcm9tKGNhdGVnb3JpZXMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignW1Z1ZSBBcHBdIEZhaWxlZCB0byBsb2FkIHRvb2wgbWFuYWdlciBzdGF0ZTonLCBlcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjb25zdCB1cGRhdGVUb29sU3RhdHVzID0gYXN5bmMgKGNhdGVnb3J5OiBzdHJpbmcsIG5hbWU6IHN0cmluZywgZW5hYmxlZDogYm9vbGVhbikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ1tWdWUgQXBwXSB1cGRhdGVUb29sU3RhdHVzIGNhbGxlZDonLCBjYXRlZ29yeSwgbmFtZSwgZW5hYmxlZCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g5YWI5pu05paw5pys5Zyw54q25oCBXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB0b29sSW5kZXggPSBhdmFpbGFibGVUb29scy52YWx1ZS5maW5kSW5kZXgodCA9PiB0LmNhdGVnb3J5ID09PSBjYXRlZ29yeSAmJiB0Lm5hbWUgPT09IG5hbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRvb2xJbmRleCAhPT0gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdmFpbGFibGVUb29scy52YWx1ZVt0b29sSW5kZXhdLmVuYWJsZWQgPSBlbmFibGVkO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOW8uuWItuinpuWPkeWTjeW6lOW8j+abtOaWsFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF2YWlsYWJsZVRvb2xzLnZhbHVlID0gWy4uLmF2YWlsYWJsZVRvb2xzLnZhbHVlXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnW1Z1ZSBBcHBdIExvY2FsIHN0YXRlIHVwZGF0ZWQsIHRvb2wgZW5hYmxlZDonLCBhdmFpbGFibGVUb29scy52YWx1ZVt0b29sSW5kZXhdLmVuYWJsZWQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOiwg+eUqOWQjuerr+abtOaWsFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgRWRpdG9yLk1lc3NhZ2UucmVxdWVzdCgnY29jb3MtbWNwLXNlcnZlcicsICd1cGRhdGVUb29sU3RhdHVzJywgY2F0ZWdvcnksIG5hbWUsIGVuYWJsZWQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFyZXN1bHQgfHwgIXJlc3VsdC5zdWNjZXNzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g5aaC5p6c5ZCO56uv5pu05paw5aSx6LSl77yM5Zue5rua5pys5Zyw54q25oCBXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRvb2xJbmRleCAhPT0gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXZhaWxhYmxlVG9vbHMudmFsdWVbdG9vbEluZGV4XS5lbmFibGVkID0gIWVuYWJsZWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF2YWlsYWJsZVRvb2xzLnZhbHVlID0gWy4uLmF2YWlsYWJsZVRvb2xzLnZhbHVlXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignW1Z1ZSBBcHBdIEJhY2tlbmQgdXBkYXRlIGZhaWxlZCwgcm9sbGVkIGJhY2sgbG9jYWwgc3RhdGUnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ1tWdWUgQXBwXSBCYWNrZW5kIHVwZGF0ZSBzdWNjZXNzZnVsJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDlpoLmnpzlj5HnlJ/plJnor6/vvIzlm57mu5rmnKzlnLDnirbmgIFcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHRvb2xJbmRleCA9IGF2YWlsYWJsZVRvb2xzLnZhbHVlLmZpbmRJbmRleCh0ID0+IHQuY2F0ZWdvcnkgPT09IGNhdGVnb3J5ICYmIHQubmFtZSA9PT0gbmFtZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodG9vbEluZGV4ICE9PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF2YWlsYWJsZVRvb2xzLnZhbHVlW3Rvb2xJbmRleF0uZW5hYmxlZCA9ICFlbmFibGVkO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF2YWlsYWJsZVRvb2xzLnZhbHVlID0gWy4uLmF2YWlsYWJsZVRvb2xzLnZhbHVlXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ1tWdWUgQXBwXSBGYWlsZWQgdG8gdXBkYXRlIHRvb2wgc3RhdHVzOicsIGVycm9yKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHNlbGVjdEFsbFRvb2xzID0gYXN5bmMgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g55u05o6l5pu05paw5pys5Zyw54q25oCB77yM54S25ZCO5L+d5a2YXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdmFpbGFibGVUb29scy52YWx1ZS5mb3JFYWNoKHRvb2wgPT4gdG9vbC5lbmFibGVkID0gdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCBzYXZlQ2hhbmdlcygpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignW1Z1ZSBBcHBdIEZhaWxlZCB0byBzZWxlY3QgYWxsIHRvb2xzOicsIGVycm9yKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGRlc2VsZWN0QWxsVG9vbHMgPSBhc3luYyAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDnm7TmjqXmm7TmlrDmnKzlnLDnirbmgIHvvIznhLblkI7kv53lrZhcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF2YWlsYWJsZVRvb2xzLnZhbHVlLmZvckVhY2godG9vbCA9PiB0b29sLmVuYWJsZWQgPSBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCBzYXZlQ2hhbmdlcygpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignW1Z1ZSBBcHBdIEZhaWxlZCB0byBkZXNlbGVjdCBhbGwgdG9vbHM6JywgZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc2F2ZUNoYW5nZXMgPSBhc3luYyAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDliJvlu7rmma7pgJrlr7nosaHvvIzpgb/lhY1WdWUz5ZON5bqU5byP5a+56LGh5YWL6ZqG6ZSZ6K+vXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB1cGRhdGVzID0gYXZhaWxhYmxlVG9vbHMudmFsdWUubWFwKHRvb2wgPT4gKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXRlZ29yeTogU3RyaW5nKHRvb2wuY2F0ZWdvcnkpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IFN0cmluZyh0b29sLm5hbWUpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuYWJsZWQ6IEJvb2xlYW4odG9vbC5lbmFibGVkKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdbVnVlIEFwcF0gU2VuZGluZyB1cGRhdGVzOicsIHVwZGF0ZXMubGVuZ3RoLCAndG9vbHMnKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBFZGl0b3IuTWVzc2FnZS5yZXF1ZXN0KCdjb2Nvcy1tY3Atc2VydmVyJywgJ3VwZGF0ZVRvb2xTdGF0dXNCYXRjaCcsIHVwZGF0ZXMpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXN1bHQgJiYgcmVzdWx0LnN1Y2Nlc3MpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnW1Z1ZSBBcHBdIFRvb2wgY2hhbmdlcyBzYXZlZCBzdWNjZXNzZnVsbHknKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ1tWdWUgQXBwXSBGYWlsZWQgdG8gc2F2ZSB0b29sIGNoYW5nZXM6JywgZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRvZ2dsZUNhdGVnb3J5VG9vbHMgPSBhc3luYyAoY2F0ZWdvcnk6IHN0cmluZywgZW5hYmxlZDogYm9vbGVhbikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g55u05o6l5pu05paw5pys5Zyw54q25oCB77yM54S25ZCO5L+d5a2YXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdmFpbGFibGVUb29scy52YWx1ZS5mb3JFYWNoKHRvb2wgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0b29sLmNhdGVnb3J5ID09PSBjYXRlZ29yeSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b29sLmVuYWJsZWQgPSBlbmFibGVkO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgc2F2ZUNoYW5nZXMoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ1tWdWUgQXBwXSBGYWlsZWQgdG8gdG9nZ2xlIGNhdGVnb3J5IHRvb2xzOicsIGVycm9yKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGdldFRvb2xzQnlDYXRlZ29yeSA9IChjYXRlZ29yeTogc3RyaW5nKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBhdmFpbGFibGVUb29scy52YWx1ZS5maWx0ZXIodG9vbCA9PiB0b29sLmNhdGVnb3J5ID09PSBjYXRlZ29yeSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZ2V0Q2F0ZWdvcnlEaXNwbGF5TmFtZSA9IChjYXRlZ29yeTogc3RyaW5nKTogc3RyaW5nID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgY2F0ZWdvcnlOYW1lczogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfSA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdzY2VuZSc6ICflnLrmma/lt6XlhbcnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ25vZGUnOiAn6IqC54K55bel5YW3JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdjb21wb25lbnQnOiAn57uE5Lu25bel5YW3JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdwcmVmYWInOiAn6aKE5Yi25L2T5bel5YW3JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdwcm9qZWN0JzogJ+mhueebruW3peWFtycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnZGVidWcnOiAn6LCD6K+V5bel5YW3JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdwcmVmZXJlbmNlcyc6ICflgY/lpb3orr7nva7lt6XlhbcnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3NlcnZlcic6ICfmnI3liqHlmajlt6XlhbcnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2Jyb2FkY2FzdCc6ICflub/mkq3lt6XlhbcnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3NjZW5lQWR2YW5jZWQnOiAn6auY57qn5Zy65pmv5bel5YW3JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdzY2VuZVZpZXcnOiAn5Zy65pmv6KeG5Zu+5bel5YW3JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdyZWZlcmVuY2VJbWFnZSc6ICflj4LogIPlm77niYflt6XlhbcnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2Fzc2V0QWR2YW5jZWQnOiAn6auY57qn6LWE5rqQ5bel5YW3JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICd2YWxpZGF0aW9uJzogJ+mqjOivgeW3peWFtydcclxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNhdGVnb3J5TmFtZXNbY2F0ZWdvcnldIHx8IGNhdGVnb3J5O1xyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIOWIhuexu+aKmOWPoOebuOWFs+aWueazlVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRvZ2dsZUNhdGVnb3J5Q29sbGFwc2UgPSAoY2F0ZWdvcnk6IHN0cmluZykgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xsYXBzZWRDYXRlZ29yaWVzLnZhbHVlW2NhdGVnb3J5XSA9ICFjb2xsYXBzZWRDYXRlZ29yaWVzLnZhbHVlW2NhdGVnb3J5XTtcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBpc0NhdGVnb3J5QWxsRW5hYmxlZCA9IChjYXRlZ29yeTogc3RyaW5nKTogYm9vbGVhbiA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHRvb2xzID0gZ2V0VG9vbHNCeUNhdGVnb3J5KGNhdGVnb3J5KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRvb2xzLmxlbmd0aCA+IDAgJiYgdG9vbHMuZXZlcnkodCA9PiB0LmVuYWJsZWQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGdldENhdGVnb3J5RW5hYmxlZENvdW50ID0gKGNhdGVnb3J5OiBzdHJpbmcpOiBudW1iZXIgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZ2V0VG9vbHNCeUNhdGVnb3J5KGNhdGVnb3J5KS5maWx0ZXIodCA9PiB0LmVuYWJsZWQpLmxlbmd0aDtcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjb25zdCB0b2dnbGVDYXRlZ29yeUNoZWNrYm94ID0gYXN5bmMgKGNhdGVnb3J5OiBzdHJpbmcsIGVuYWJsZWQ6IGJvb2xlYW4pID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdG9vbHMgPSBnZXRUb29sc0J5Q2F0ZWdvcnkoY2F0ZWdvcnkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IHRvb2wgb2YgdG9vbHMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHRvb2xJbmRleCA9IGF2YWlsYWJsZVRvb2xzLnZhbHVlLmZpbmRJbmRleCh0ID0+IHQuY2F0ZWdvcnkgPT09IGNhdGVnb3J5ICYmIHQubmFtZSA9PT0gdG9vbC5uYW1lKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0b29sSW5kZXggIT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXZhaWxhYmxlVG9vbHMudmFsdWVbdG9vbEluZGV4XS5lbmFibGVkID0gZW5hYmxlZDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhdmFpbGFibGVUb29scy52YWx1ZSA9IFsuLi5hdmFpbGFibGVUb29scy52YWx1ZV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IHNhdmVDaGFuZ2VzKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8g5oqY5Y+gL+WxleW8gOWFqOmDqFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNvbGxhcHNlQWxsID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0b29sQ2F0ZWdvcmllcy52YWx1ZS5mb3JFYWNoKGNhdCA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xsYXBzZWRDYXRlZ29yaWVzLnZhbHVlW2NhdF0gPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBleHBhbmRBbGwgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvb2xDYXRlZ29yaWVzLnZhbHVlLmZvckVhY2goY2F0ID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbGxhcHNlZENhdGVnb3JpZXMudmFsdWVbY2F0XSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyDph43mlrDliqDovb3mianlsZVcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCByZWxvYWRFeHRlbnNpb24gPSBhc3luYyAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBAdHMtaWdub3JlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZXh0X3BhdGggPSBFZGl0b3IuUGFja2FnZS5nZXRQYXRoKFwiY29jb3MtbWNwLXNlcnZlclwiKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJyZWxvYWQgXCIgKyBleHRfcGF0aClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChleHRfcGF0aCAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgRWRpdG9yLlBhY2thZ2UuZGlzYWJsZShleHRfcGF0aClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGV4dF9wYXRoICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEVkaXRvci5QYWNrYWdlLmVuYWJsZShleHRfcGF0aClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIDUwMClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ1tWdWUgQXBwXSBGYWlsZWQgdG8gcmVsb2FkIGV4dGVuc2lvbjonLCBlcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8g55uR5ZCs6K6+572u5Y+Y5YyWXHJcbiAgICAgICAgICAgICAgICAgICAgd2F0Y2goc2V0dGluZ3MsICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0dGluZ3NDaGFuZ2VkLnZhbHVlID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9LCB7ZGVlcDogdHJ1ZX0pO1xyXG5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8g57uE5Lu25oyC6L295pe25Yqg6L295pWw5o2uXHJcbiAgICAgICAgICAgICAgICAgICAgb25Nb3VudGVkKGFzeW5jICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8g5Yqg6L295bel5YW3566h55CG5Zmo54q25oCBXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IGxvYWRUb29sTWFuYWdlclN0YXRlKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyDku47mnI3liqHlmajnirbmgIHojrflj5borr7nva7kv6Hmga9cclxuICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHNlcnZlclN0YXR1cyA9IGF3YWl0IEVkaXRvci5NZXNzYWdlLnJlcXVlc3QoJ2NvY29zLW1jcC1zZXJ2ZXInLCAnZ2V0LXNlcnZlci1zdGF0dXMnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzZXJ2ZXJTdGF0dXMgJiYgc2VydmVyU3RhdHVzLnNldHRpbmdzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0dGluZ3MudmFsdWUgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvcnQ6IHNlcnZlclN0YXR1cy5zZXR0aW5ncy5wb3J0ID8/IDMwMDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF1dG9TdGFydDogISFzZXJ2ZXJTdGF0dXMuc2V0dGluZ3MuYXV0b1N0YXJ0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmFibGVEZWJ1Z0xvZzogISFzZXJ2ZXJTdGF0dXMuc2V0dGluZ3MuZW5hYmxlRGVidWdMb2csXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1heENvbm5lY3Rpb25zOiBzZXJ2ZXJTdGF0dXMuc2V0dGluZ3MubWF4Q29ubmVjdGlvbnMgPz8gMTBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdbVnVlIEFwcF0gU2VydmVyIHNldHRpbmdzIGxvYWRlZCBmcm9tIHN0YXR1czonLCBzZXJ2ZXJTdGF0dXMuc2V0dGluZ3MpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChzZXJ2ZXJTdGF0dXMgJiYgc2VydmVyU3RhdHVzLnBvcnQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDlhbzlrrnml6fniYjmnKzvvIzlj6rojrflj5bnq6/lj6Pkv6Hmga9cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXR0aW5ncy52YWx1ZS5wb3J0ID0gc2VydmVyU3RhdHVzLnBvcnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ1tWdWUgQXBwXSBQb3J0IGxvYWRlZCBmcm9tIHNlcnZlciBzdGF0dXM6Jywgc2VydmVyU3RhdHVzLnBvcnQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignW1Z1ZSBBcHBdIEZhaWxlZCB0byBnZXQgc2VydmVyIHN0YXR1czonLCBlcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnW1Z1ZSBBcHBdIFVzaW5nIGRlZmF1bHQgc2VydmVyIHNldHRpbmdzJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIOWumuacn+abtOaWsOacjeWKoeWZqOeKtuaAgVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB0aW1lciA9IHNldEludGVydmFsKGFzeW5jICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgRWRpdG9yLk1lc3NhZ2UucmVxdWVzdCgnY29jb3MtbWNwLXNlcnZlcicsICdnZXQtc2VydmVyLXN0YXR1cycpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VydmVyUnVubmluZy52YWx1ZSA9IHJlc3VsdC5ydW5uaW5nO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXJ2ZXJTdGF0dXMudmFsdWUgPSByZXN1bHQucnVubmluZyA/ICfov5DooYzkuK0nIDogJ+W3suWBnOatoic7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbm5lY3RlZENsaWVudHMudmFsdWUgPSByZXN1bHQuY2xpZW50cyB8fCAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBodHRwVXJsLnZhbHVlID0gcmVzdWx0LnJ1bm5pbmcgPyBgaHR0cDovL2xvY2FsaG9zdDoke3Jlc3VsdC5wb3J0fWAgOiAnJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNQcm9jZXNzaW5nLnZhbHVlID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDpnZnpu5jlpITnkIbplJnor6/vvIzpgb/lhY3ml6Xlv5fliLflsY9cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgMjAwMCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyDkv53lrZjlrprml7blmahJROS7peS+v+a4heeQhlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aW1lck1hcC5zZXQodGhpcywgdGltZXIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyDmlbDmja5cclxuICAgICAgICAgICAgICAgICAgICAgICAgYWN0aXZlVGFiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXJ2ZXJSdW5uaW5nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXJ2ZXJTdGF0dXMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbm5lY3RlZENsaWVudHMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGh0dHBVcmwsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzUHJvY2Vzc2luZyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0dGluZ3MsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGF2YWlsYWJsZVRvb2xzLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0b29sQ2F0ZWdvcmllcyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0dGluZ3NDaGFuZ2VkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xsYXBzZWRDYXRlZ29yaWVzLFxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8g6K6h566X5bGe5oCnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXR1c0NsYXNzLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0b3RhbFRvb2xzLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbmFibGVkVG9vbHMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpc2FibGVkVG9vbHMsXHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyDmlrnms5VcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3dpdGNoVGFiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0b2dnbGVTZXJ2ZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNhdmVTZXR0aW5ncyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29weVVybCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgb25BdXRvU3RhcnRDaGFuZ2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uRGVidWdMb2dDaGFuZ2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvYWRUb29sTWFuYWdlclN0YXRlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGVUb29sU3RhdHVzLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RBbGxUb29scyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVzZWxlY3RBbGxUb29scyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2F2ZUNoYW5nZXMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvZ2dsZUNhdGVnb3J5VG9vbHMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGdldFRvb2xzQnlDYXRlZ29yeSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZ2V0Q2F0ZWdvcnlEaXNwbGF5TmFtZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdG9nZ2xlQ2F0ZWdvcnlDb2xsYXBzZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgaXNDYXRlZ29yeUFsbEVuYWJsZWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGdldENhdGVnb3J5RW5hYmxlZENvdW50LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0b2dnbGVDYXRlZ29yeUNoZWNrYm94LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xsYXBzZUFsbCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZXhwYW5kQWxsLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZWxvYWRFeHRlbnNpb25cclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlOiByZWFkRmlsZVN5bmMoam9pbihfX2Rpcm5hbWUsICcuLi8uLi8uLi9zdGF0aWMvdGVtcGxhdGUvdnVlL21jcC1zZXJ2ZXItYXBwLnZ1ZScpLCAndXRmLTgnKSxcclxuICAgICAgICAgICAgfSkpO1xyXG5cclxuICAgICAgICAgICAgYXBwLm1vdW50KHRoaXMuJC5hcHApO1xyXG4gICAgICAgICAgICBwYW5lbERhdGFNYXAuc2V0KHRoaXMsIGFwcCk7XHJcblxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnW01DUCBQYW5lbF0gVnVlMyBhcHAgbW91bnRlZCBzdWNjZXNzZnVsbHknKTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgYmVmb3JlQ2xvc2UoKSB7XHJcbiAgICB9LFxyXG4gICAgY2xvc2UoKSB7XHJcbiAgICAgICAgLy8g5riF6Zmk5a6a5pe25ZmoXHJcbiAgICAgICAgY29uc3QgdGltZXIgPSB0aW1lck1hcC5nZXQodGhpcyk7XHJcbiAgICAgICAgaWYgKHRpbWVyKSB7XHJcbiAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwodGltZXIpO1xyXG4gICAgICAgICAgICB0aW1lck1hcC5kZWxldGUodGhpcyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIOWNuOi9vVZ1ZeW6lOeUqFxyXG4gICAgICAgIGNvbnN0IGFwcCA9IHBhbmVsRGF0YU1hcC5nZXQodGhpcyk7XHJcbiAgICAgICAgaWYgKGFwcCkge1xyXG4gICAgICAgICAgICBhcHAudW5tb3VudCgpO1xyXG4gICAgICAgICAgICBwYW5lbERhdGFNYXAuZGVsZXRlKHRoaXMpO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbn0pOyJdfQ==