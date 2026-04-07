"use strict";
/* eslint-disable vue/one-component-per-file */
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const vue_1 = require("vue");
const panelDataMap = new WeakMap();
module.exports = Editor.Panel.define({
    listeners: {
        show() {
            console.log('[MCP Panel] Panel shown');
        },
        hide() {
            console.log('[MCP Panel] Panel hidden');
        },
    },
    template: (0, fs_extra_1.readFileSync)((0, path_1.join)(__dirname, '../../../static/template/default/index.html'), 'utf-8'),
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
                        try {
                            // 创建一个简单的对象，避免克隆错误
                            const settingsData = {
                                port: settings.value.port,
                                autoStart: settings.value.autoStart,
                                enableDebugLog: settings.value.enableDebugLog,
                                maxConnections: settings.value.maxConnections
                            };
                            const result = await Editor.Message.request('cocos-mcp-server', 'update-settings', settingsData);
                            console.log('[Vue App] Save settings result:', result);
                            // 重新加载服务器状态以更新界面
                            const serverStatus = await Editor.Message.request('cocos-mcp-server', 'get-server-status');
                            if (serverStatus && serverStatus.settings) {
                                settings.value = {
                                    port: serverStatus.settings.port || 3000,
                                    autoStart: serverStatus.settings.autoStart || false,
                                    enableDebugLog: serverStatus.settings.enableDebugLog || false,
                                    maxConnections: serverStatus.settings.maxConnections || 10
                                };
                            }
                            settingsChanged.value = false;
                        }
                        catch (error) {
                            console.error('[Vue App] Failed to save settings:', error);
                        }
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
                    // 监听设置变化
                    (0, vue_1.watch)(settings, () => {
                        settingsChanged.value = true;
                    }, { deep: true });
                    // 组件挂载时加载数据
                    (0, vue_1.onMounted)(async () => {
                        // 加载工具管理器状态
                        await loadToolManagerState();
                        // 从服务器状态获取设置信息
                        try {
                            const serverStatus = await Editor.Message.request('cocos-mcp-server', 'get-server-status');
                            if (serverStatus && serverStatus.settings) {
                                settings.value = {
                                    port: serverStatus.settings.port || 3000,
                                    autoStart: serverStatus.settings.autoStart || false,
                                    enableDebugLog: serverStatus.settings.enableDebugLog || false,
                                    maxConnections: serverStatus.settings.maxConnections || 10
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
                        setInterval(async () => {
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
                                console.error('[Vue App] Failed to get server status:', error);
                            }
                        }, 2000);
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
                        loadToolManagerState,
                        updateToolStatus,
                        selectAllTools,
                        deselectAllTools,
                        saveChanges,
                        toggleCategoryTools,
                        getToolsByCategory,
                        getCategoryDisplayName
                    };
                },
                template: (0, fs_extra_1.readFileSync)((0, path_1.join)(__dirname, '../../../static/template/vue/mcp-server-app.html'), 'utf-8'),
            }));
            app.mount(this.$.app);
            panelDataMap.set(this, app);
            console.log('[MCP Panel] Vue3 app mounted successfully');
        }
    },
    beforeClose() { },
    close() {
        const app = panelDataMap.get(this);
        if (app) {
            app.unmount();
        }
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zb3VyY2UvcGFuZWxzL2RlZmF1bHQvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLCtDQUErQzs7QUFFL0MsdUNBQXdDO0FBQ3hDLCtCQUE0QjtBQUM1Qiw2QkFBaUc7QUFFakcsTUFBTSxZQUFZLEdBQUcsSUFBSSxPQUFPLEVBQVksQ0FBQztBQTRCN0MsTUFBTSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQztJQUNqQyxTQUFTLEVBQUU7UUFDUCxJQUFJO1lBQ0EsT0FBTyxDQUFDLEdBQUcsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO1FBQzNDLENBQUM7UUFDRCxJQUFJO1lBQ0EsT0FBTyxDQUFDLEdBQUcsQ0FBQywwQkFBMEIsQ0FBQyxDQUFDO1FBQzVDLENBQUM7S0FDSjtJQUNELFFBQVEsRUFBRSxJQUFBLHVCQUFZLEVBQUMsSUFBQSxXQUFJLEVBQUMsU0FBUyxFQUFFLDZDQUE2QyxDQUFDLEVBQUUsT0FBTyxDQUFDO0lBQy9GLEtBQUssRUFBRSxJQUFBLHVCQUFZLEVBQUMsSUFBQSxXQUFJLEVBQUMsU0FBUyxFQUFFLHlDQUF5QyxDQUFDLEVBQUUsT0FBTyxDQUFDO0lBQ3hGLENBQUMsRUFBRTtRQUNDLEdBQUcsRUFBRSxNQUFNO1FBQ1gsVUFBVSxFQUFFLGFBQWE7S0FDNUI7SUFDRCxLQUFLO1FBQ0QsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO1lBQ2IsTUFBTSxHQUFHLEdBQUcsSUFBQSxlQUFTLEVBQUMsRUFBRSxDQUFDLENBQUM7WUFDMUIsR0FBRyxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUMsZUFBZSxHQUFHLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBRTVFLFVBQVU7WUFDVixHQUFHLENBQUMsU0FBUyxDQUFDLGNB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LENBQUM7Z0JBQ0QsUUFBUSxFQUFFLElBQUEsdUJBQVksRUFBQyxJQUFBLFdBQUksRUFBQyxTQUFTLEVBQUUsa0RBQWtELENBQUMsRUFBRSxPQUFPLENBQUM7YUFDdkcsQ0FBQyxDQUFDLENBQUM7WUFFSixHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDdEIsWUFBWSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFFNUIsT0FBTyxDQUFDLEdBQUcsQ0FBQywyQ0FBMkMsQ0FBQyxDQUFDO1FBQzdELENBQUM7SUFDTCxDQUFDO0lBQ0QsV0FBVyxLQUFLLENBQUM7SUFDakIsS0FBSztRQUNELE1BQU0sR0FBRyxHQUFHLFlBQVksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDbkMsSUFBSSxHQUFHLEVBQUUsQ0FBQztZQUNOLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUNsQixDQUFDO0lBQ0wsQ0FBQztDQUNKLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qIGVzbGludC1kaXNhYmxlIHZ1ZS9vbmUtY29tcG9uZW50LXBlci1maWxlICovXHJcblxyXG5pbXBvcnQgeyByZWFkRmlsZVN5bmMgfSBmcm9tICdmcy1leHRyYSc7XHJcbmltcG9ydCB7IGpvaW4gfSBmcm9tICdwYXRoJztcclxuaW1wb3J0IHsgY3JlYXRlQXBwLCBBcHAsIGRlZmluZUNvbXBvbmVudCwgcmVmLCBjb21wdXRlZCwgb25Nb3VudGVkLCB3YXRjaCwgbmV4dFRpY2sgfSBmcm9tICd2dWUnO1xyXG5cclxuY29uc3QgcGFuZWxEYXRhTWFwID0gbmV3IFdlYWtNYXA8YW55LCBBcHA+KCk7XHJcblxyXG4vLyDlrprkuYnlt6XlhbfphY3nva7mjqXlj6NcclxuaW50ZXJmYWNlIFRvb2xDb25maWcge1xyXG4gICAgY2F0ZWdvcnk6IHN0cmluZztcclxuICAgIG5hbWU6IHN0cmluZztcclxuICAgIGVuYWJsZWQ6IGJvb2xlYW47XHJcbiAgICBkZXNjcmlwdGlvbjogc3RyaW5nO1xyXG59XHJcblxyXG4vLyDlrprkuYnphY3nva7mjqXlj6NcclxuaW50ZXJmYWNlIENvbmZpZ3VyYXRpb24ge1xyXG4gICAgaWQ6IHN0cmluZztcclxuICAgIG5hbWU6IHN0cmluZztcclxuICAgIGRlc2NyaXB0aW9uOiBzdHJpbmc7XHJcbiAgICB0b29sczogVG9vbENvbmZpZ1tdO1xyXG4gICAgY3JlYXRlZEF0OiBzdHJpbmc7XHJcbiAgICB1cGRhdGVkQXQ6IHN0cmluZztcclxufVxyXG5cclxuLy8g5a6a5LmJ5pyN5Yqh5Zmo6K6+572u5o6l5Y+jXHJcbmludGVyZmFjZSBTZXJ2ZXJTZXR0aW5ncyB7XHJcbiAgICBwb3J0OiBudW1iZXI7XHJcbiAgICBhdXRvU3RhcnQ6IGJvb2xlYW47XHJcbiAgICBlbmFibGVEZWJ1Z0xvZzogYm9vbGVhbjtcclxuICAgIG1heENvbm5lY3Rpb25zOiBudW1iZXI7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gRWRpdG9yLlBhbmVsLmRlZmluZSh7XHJcbiAgICBsaXN0ZW5lcnM6IHtcclxuICAgICAgICBzaG93KCkgeyBcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ1tNQ1AgUGFuZWxdIFBhbmVsIHNob3duJyk7IFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgaGlkZSgpIHsgXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdbTUNQIFBhbmVsXSBQYW5lbCBoaWRkZW4nKTsgXHJcbiAgICAgICAgfSxcclxuICAgIH0sXHJcbiAgICB0ZW1wbGF0ZTogcmVhZEZpbGVTeW5jKGpvaW4oX19kaXJuYW1lLCAnLi4vLi4vLi4vc3RhdGljL3RlbXBsYXRlL2RlZmF1bHQvaW5kZXguaHRtbCcpLCAndXRmLTgnKSxcclxuICAgIHN0eWxlOiByZWFkRmlsZVN5bmMoam9pbihfX2Rpcm5hbWUsICcuLi8uLi8uLi9zdGF0aWMvc3R5bGUvZGVmYXVsdC9pbmRleC5jc3MnKSwgJ3V0Zi04JyksXHJcbiAgICAkOiB7XHJcbiAgICAgICAgYXBwOiAnI2FwcCcsXHJcbiAgICAgICAgcGFuZWxUaXRsZTogJyNwYW5lbFRpdGxlJyxcclxuICAgIH0sXHJcbiAgICByZWFkeSgpIHtcclxuICAgICAgICBpZiAodGhpcy4kLmFwcCkge1xyXG4gICAgICAgICAgICBjb25zdCBhcHAgPSBjcmVhdGVBcHAoe30pO1xyXG4gICAgICAgICAgICBhcHAuY29uZmlnLmNvbXBpbGVyT3B0aW9ucy5pc0N1c3RvbUVsZW1lbnQgPSAodGFnKSA9PiB0YWcuc3RhcnRzV2l0aCgndWktJyk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAvLyDliJvlu7rkuLvlupTnlKjnu4Tku7ZcclxuICAgICAgICAgICAgYXBwLmNvbXBvbmVudCgnTWNwU2VydmVyQXBwJywgZGVmaW5lQ29tcG9uZW50KHtcclxuICAgICAgICAgICAgICAgIHNldHVwKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIOWTjeW6lOW8j+aVsOaNrlxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGFjdGl2ZVRhYiA9IHJlZignc2VydmVyJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc2VydmVyUnVubmluZyA9IHJlZihmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc2VydmVyU3RhdHVzID0gcmVmKCflt7LlgZzmraInKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBjb25uZWN0ZWRDbGllbnRzID0gcmVmKDApO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGh0dHBVcmwgPSByZWYoJycpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGlzUHJvY2Vzc2luZyA9IHJlZihmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc2V0dGluZ3MgPSByZWY8U2VydmVyU2V0dGluZ3M+KHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcG9ydDogMzAwMCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXV0b1N0YXJ0OiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZW5hYmxlRGVidWdMb2c6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtYXhDb25uZWN0aW9uczogMTBcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBhdmFpbGFibGVUb29scyA9IHJlZjxUb29sQ29uZmlnW10+KFtdKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCB0b29sQ2F0ZWdvcmllcyA9IHJlZjxzdHJpbmdbXT4oW10pO1xyXG4gICAgICAgICAgICAgICAgICAgIFxyXG5cclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAvLyDorqHnrpflsZ7mgKdcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBzdGF0dXNDbGFzcyA9IGNvbXB1dGVkKCgpID0+ICh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICdzdGF0dXMtcnVubmluZyc6IHNlcnZlclJ1bm5pbmcudmFsdWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICdzdGF0dXMtc3RvcHBlZCc6ICFzZXJ2ZXJSdW5uaW5nLnZhbHVlXHJcbiAgICAgICAgICAgICAgICAgICAgfSkpO1xyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRvdGFsVG9vbHMgPSBjb21wdXRlZCgoKSA9PiBhdmFpbGFibGVUb29scy52YWx1ZS5sZW5ndGgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGVuYWJsZWRUb29scyA9IGNvbXB1dGVkKCgpID0+IGF2YWlsYWJsZVRvb2xzLnZhbHVlLmZpbHRlcih0ID0+IHQuZW5hYmxlZCkubGVuZ3RoKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBkaXNhYmxlZFRvb2xzID0gY29tcHV0ZWQoKCkgPT4gdG90YWxUb29scy52YWx1ZSAtIGVuYWJsZWRUb29scy52YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHNldHRpbmdzQ2hhbmdlZCA9IHJlZihmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgLy8g5pa55rOVXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc3dpdGNoVGFiID0gKHRhYk5hbWU6IHN0cmluZykgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhY3RpdmVUYWIudmFsdWUgPSB0YWJOYW1lO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGFiTmFtZSA9PT0gJ3Rvb2xzJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9hZFRvb2xNYW5hZ2VyU3RhdGUoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdG9nZ2xlU2VydmVyID0gYXN5bmMgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHNlcnZlclJ1bm5pbmcudmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCBFZGl0b3IuTWVzc2FnZS5yZXF1ZXN0KCdjb2Nvcy1tY3Atc2VydmVyJywgJ3N0b3Atc2VydmVyJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOWQr+WKqOacjeWKoeWZqOaXtuS9v+eUqOW9k+WJjemdouadv+iuvue9rlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRTZXR0aW5ncyA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9ydDogc2V0dGluZ3MudmFsdWUucG9ydCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXV0b1N0YXJ0OiBzZXR0aW5ncy52YWx1ZS5hdXRvU3RhcnQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuYWJsZURlYnVnTG9nOiBzZXR0aW5ncy52YWx1ZS5lbmFibGVEZWJ1Z0xvZyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWF4Q29ubmVjdGlvbnM6IHNldHRpbmdzLnZhbHVlLm1heENvbm5lY3Rpb25zXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCBFZGl0b3IuTWVzc2FnZS5yZXF1ZXN0KCdjb2Nvcy1tY3Atc2VydmVyJywgJ3VwZGF0ZS1zZXR0aW5ncycsIGN1cnJlbnRTZXR0aW5ncyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgRWRpdG9yLk1lc3NhZ2UucmVxdWVzdCgnY29jb3MtbWNwLXNlcnZlcicsICdzdGFydC1zZXJ2ZXInKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdbVnVlIEFwcF0gU2VydmVyIHRvZ2dsZWQnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ1tWdWUgQXBwXSBGYWlsZWQgdG8gdG9nZ2xlIHNlcnZlcjonLCBlcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHNhdmVTZXR0aW5ncyA9IGFzeW5jICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOWIm+W7uuS4gOS4queugOWNleeahOWvueixoe+8jOmBv+WFjeWFi+mahumUmeivr1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgc2V0dGluZ3NEYXRhID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvcnQ6IHNldHRpbmdzLnZhbHVlLnBvcnQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXV0b1N0YXJ0OiBzZXR0aW5ncy52YWx1ZS5hdXRvU3RhcnQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5hYmxlRGVidWdMb2c6IHNldHRpbmdzLnZhbHVlLmVuYWJsZURlYnVnTG9nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1heENvbm5lY3Rpb25zOiBzZXR0aW5ncy52YWx1ZS5tYXhDb25uZWN0aW9uc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBFZGl0b3IuTWVzc2FnZS5yZXF1ZXN0KCdjb2Nvcy1tY3Atc2VydmVyJywgJ3VwZGF0ZS1zZXR0aW5ncycsIHNldHRpbmdzRGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnW1Z1ZSBBcHBdIFNhdmUgc2V0dGluZ3MgcmVzdWx0OicsIHJlc3VsdCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g6YeN5paw5Yqg6L295pyN5Yqh5Zmo54q25oCB5Lul5pu05paw55WM6Z2iXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBzZXJ2ZXJTdGF0dXMgPSBhd2FpdCBFZGl0b3IuTWVzc2FnZS5yZXF1ZXN0KCdjb2Nvcy1tY3Atc2VydmVyJywgJ2dldC1zZXJ2ZXItc3RhdHVzJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc2VydmVyU3RhdHVzICYmIHNlcnZlclN0YXR1cy5zZXR0aW5ncykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldHRpbmdzLnZhbHVlID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb3J0OiBzZXJ2ZXJTdGF0dXMuc2V0dGluZ3MucG9ydCB8fCAzMDAwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdXRvU3RhcnQ6IHNlcnZlclN0YXR1cy5zZXR0aW5ncy5hdXRvU3RhcnQgfHwgZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuYWJsZURlYnVnTG9nOiBzZXJ2ZXJTdGF0dXMuc2V0dGluZ3MuZW5hYmxlRGVidWdMb2cgfHwgZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1heENvbm5lY3Rpb25zOiBzZXJ2ZXJTdGF0dXMuc2V0dGluZ3MubWF4Q29ubmVjdGlvbnMgfHwgMTBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldHRpbmdzQ2hhbmdlZC52YWx1ZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignW1Z1ZSBBcHBdIEZhaWxlZCB0byBzYXZlIHNldHRpbmdzOicsIGVycm9yKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY29weVVybCA9IGFzeW5jICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IG5hdmlnYXRvci5jbGlwYm9hcmQud3JpdGVUZXh0KGh0dHBVcmwudmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ1tWdWUgQXBwXSBVUkwgY29waWVkIHRvIGNsaXBib2FyZCcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignW1Z1ZSBBcHBdIEZhaWxlZCB0byBjb3B5IFVSTDonLCBlcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGxvYWRUb29sTWFuYWdlclN0YXRlID0gYXN5bmMgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgRWRpdG9yLk1lc3NhZ2UucmVxdWVzdCgnY29jb3MtbWNwLXNlcnZlcicsICdnZXRUb29sTWFuYWdlclN0YXRlJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzdWx0ICYmIHJlc3VsdC5zdWNjZXNzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g5oC75piv5Yqg6L295ZCO56uv54q25oCB77yM56Gu5L+d5pWw5o2u5piv5pyA5paw55qEXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXZhaWxhYmxlVG9vbHMudmFsdWUgPSByZXN1bHQuYXZhaWxhYmxlVG9vbHMgfHwgW107XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ1tWdWUgQXBwXSBMb2FkZWQgdG9vbHM6JywgYXZhaWxhYmxlVG9vbHMudmFsdWUubGVuZ3RoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDmm7TmlrDlt6XlhbfliIbnsbtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBjYXRlZ29yaWVzID0gbmV3IFNldChhdmFpbGFibGVUb29scy52YWx1ZS5tYXAodG9vbCA9PiB0b29sLmNhdGVnb3J5KSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9vbENhdGVnb3JpZXMudmFsdWUgPSBBcnJheS5mcm9tKGNhdGVnb3JpZXMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignW1Z1ZSBBcHBdIEZhaWxlZCB0byBsb2FkIHRvb2wgbWFuYWdlciBzdGF0ZTonLCBlcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHVwZGF0ZVRvb2xTdGF0dXMgPSBhc3luYyAoY2F0ZWdvcnk6IHN0cmluZywgbmFtZTogc3RyaW5nLCBlbmFibGVkOiBib29sZWFuKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnW1Z1ZSBBcHBdIHVwZGF0ZVRvb2xTdGF0dXMgY2FsbGVkOicsIGNhdGVnb3J5LCBuYW1lLCBlbmFibGVkKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g5YWI5pu05paw5pys5Zyw54q25oCBXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB0b29sSW5kZXggPSBhdmFpbGFibGVUb29scy52YWx1ZS5maW5kSW5kZXgodCA9PiB0LmNhdGVnb3J5ID09PSBjYXRlZ29yeSAmJiB0Lm5hbWUgPT09IG5hbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRvb2xJbmRleCAhPT0gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdmFpbGFibGVUb29scy52YWx1ZVt0b29sSW5kZXhdLmVuYWJsZWQgPSBlbmFibGVkO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOW8uuWItuinpuWPkeWTjeW6lOW8j+abtOaWsFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF2YWlsYWJsZVRvb2xzLnZhbHVlID0gWy4uLmF2YWlsYWJsZVRvb2xzLnZhbHVlXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnW1Z1ZSBBcHBdIExvY2FsIHN0YXRlIHVwZGF0ZWQsIHRvb2wgZW5hYmxlZDonLCBhdmFpbGFibGVUb29scy52YWx1ZVt0b29sSW5kZXhdLmVuYWJsZWQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDosIPnlKjlkI7nq6/mm7TmlrBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IEVkaXRvci5NZXNzYWdlLnJlcXVlc3QoJ2NvY29zLW1jcC1zZXJ2ZXInLCAndXBkYXRlVG9vbFN0YXR1cycsIGNhdGVnb3J5LCBuYW1lLCBlbmFibGVkKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghcmVzdWx0IHx8ICFyZXN1bHQuc3VjY2Vzcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOWmguaenOWQjuerr+abtOaWsOWksei0pe+8jOWbnua7muacrOWcsOeKtuaAgVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0b29sSW5kZXggIT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF2YWlsYWJsZVRvb2xzLnZhbHVlW3Rvb2xJbmRleF0uZW5hYmxlZCA9ICFlbmFibGVkO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdmFpbGFibGVUb29scy52YWx1ZSA9IFsuLi5hdmFpbGFibGVUb29scy52YWx1ZV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ1tWdWUgQXBwXSBCYWNrZW5kIHVwZGF0ZSBmYWlsZWQsIHJvbGxlZCBiYWNrIGxvY2FsIHN0YXRlJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdbVnVlIEFwcF0gQmFja2VuZCB1cGRhdGUgc3VjY2Vzc2Z1bCcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g5aaC5p6c5Y+R55Sf6ZSZ6K+v77yM5Zue5rua5pys5Zyw54q25oCBXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB0b29sSW5kZXggPSBhdmFpbGFibGVUb29scy52YWx1ZS5maW5kSW5kZXgodCA9PiB0LmNhdGVnb3J5ID09PSBjYXRlZ29yeSAmJiB0Lm5hbWUgPT09IG5hbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRvb2xJbmRleCAhPT0gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdmFpbGFibGVUb29scy52YWx1ZVt0b29sSW5kZXhdLmVuYWJsZWQgPSAhZW5hYmxlZDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdmFpbGFibGVUb29scy52YWx1ZSA9IFsuLi5hdmFpbGFibGVUb29scy52YWx1ZV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdbVnVlIEFwcF0gRmFpbGVkIHRvIHVwZGF0ZSB0b29sIHN0YXR1czonLCBlcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHNlbGVjdEFsbFRvb2xzID0gYXN5bmMgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g55u05o6l5pu05paw5pys5Zyw54q25oCB77yM54S25ZCO5L+d5a2YXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdmFpbGFibGVUb29scy52YWx1ZS5mb3JFYWNoKHRvb2wgPT4gdG9vbC5lbmFibGVkID0gdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCBzYXZlQ2hhbmdlcygpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignW1Z1ZSBBcHBdIEZhaWxlZCB0byBzZWxlY3QgYWxsIHRvb2xzOicsIGVycm9yKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZGVzZWxlY3RBbGxUb29scyA9IGFzeW5jICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOebtOaOpeabtOaWsOacrOWcsOeKtuaAge+8jOeEtuWQjuS/neWtmFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXZhaWxhYmxlVG9vbHMudmFsdWUuZm9yRWFjaCh0b29sID0+IHRvb2wuZW5hYmxlZCA9IGZhbHNlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IHNhdmVDaGFuZ2VzKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdbVnVlIEFwcF0gRmFpbGVkIHRvIGRlc2VsZWN0IGFsbCB0b29sczonLCBlcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgc2F2ZUNoYW5nZXMgPSBhc3luYyAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDliJvlu7rmma7pgJrlr7nosaHvvIzpgb/lhY1WdWUz5ZON5bqU5byP5a+56LGh5YWL6ZqG6ZSZ6K+vXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB1cGRhdGVzID0gYXZhaWxhYmxlVG9vbHMudmFsdWUubWFwKHRvb2wgPT4gKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXRlZ29yeTogU3RyaW5nKHRvb2wuY2F0ZWdvcnkpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IFN0cmluZyh0b29sLm5hbWUpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuYWJsZWQ6IEJvb2xlYW4odG9vbC5lbmFibGVkKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnW1Z1ZSBBcHBdIFNlbmRpbmcgdXBkYXRlczonLCB1cGRhdGVzLmxlbmd0aCwgJ3Rvb2xzJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IEVkaXRvci5NZXNzYWdlLnJlcXVlc3QoJ2NvY29zLW1jcC1zZXJ2ZXInLCAndXBkYXRlVG9vbFN0YXR1c0JhdGNoJywgdXBkYXRlcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXN1bHQgJiYgcmVzdWx0LnN1Y2Nlc3MpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnW1Z1ZSBBcHBdIFRvb2wgY2hhbmdlcyBzYXZlZCBzdWNjZXNzZnVsbHknKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ1tWdWUgQXBwXSBGYWlsZWQgdG8gc2F2ZSB0b29sIGNoYW5nZXM6JywgZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICBcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdG9nZ2xlQ2F0ZWdvcnlUb29scyA9IGFzeW5jIChjYXRlZ29yeTogc3RyaW5nLCBlbmFibGVkOiBib29sZWFuKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDnm7TmjqXmm7TmlrDmnKzlnLDnirbmgIHvvIznhLblkI7kv53lrZhcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF2YWlsYWJsZVRvb2xzLnZhbHVlLmZvckVhY2godG9vbCA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRvb2wuY2F0ZWdvcnkgPT09IGNhdGVnb3J5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvb2wuZW5hYmxlZCA9IGVuYWJsZWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCBzYXZlQ2hhbmdlcygpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignW1Z1ZSBBcHBdIEZhaWxlZCB0byB0b2dnbGUgY2F0ZWdvcnkgdG9vbHM6JywgZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBnZXRUb29sc0J5Q2F0ZWdvcnkgPSAoY2F0ZWdvcnk6IHN0cmluZykgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYXZhaWxhYmxlVG9vbHMudmFsdWUuZmlsdGVyKHRvb2wgPT4gdG9vbC5jYXRlZ29yeSA9PT0gY2F0ZWdvcnkpO1xyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZ2V0Q2F0ZWdvcnlEaXNwbGF5TmFtZSA9IChjYXRlZ29yeTogc3RyaW5nKTogc3RyaW5nID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgY2F0ZWdvcnlOYW1lczogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfSA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdzY2VuZSc6ICflnLrmma/lt6XlhbcnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ25vZGUnOiAn6IqC54K55bel5YW3JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdjb21wb25lbnQnOiAn57uE5Lu25bel5YW3JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdwcmVmYWInOiAn6aKE5Yi25L2T5bel5YW3JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdwcm9qZWN0JzogJ+mhueebruW3peWFtycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnZGVidWcnOiAn6LCD6K+V5bel5YW3JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdwcmVmZXJlbmNlcyc6ICflgY/lpb3orr7nva7lt6XlhbcnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3NlcnZlcic6ICfmnI3liqHlmajlt6XlhbcnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2Jyb2FkY2FzdCc6ICflub/mkq3lt6XlhbcnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3NjZW5lQWR2YW5jZWQnOiAn6auY57qn5Zy65pmv5bel5YW3JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdzY2VuZVZpZXcnOiAn5Zy65pmv6KeG5Zu+5bel5YW3JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdyZWZlcmVuY2VJbWFnZSc6ICflj4LogIPlm77niYflt6XlhbcnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2Fzc2V0QWR2YW5jZWQnOiAn6auY57qn6LWE5rqQ5bel5YW3JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICd2YWxpZGF0aW9uJzogJ+mqjOivgeW3peWFtydcclxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNhdGVnb3J5TmFtZXNbY2F0ZWdvcnldIHx8IGNhdGVnb3J5O1xyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIFxyXG5cclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAvLyDnm5HlkKzorr7nva7lj5jljJZcclxuICAgICAgICAgICAgICAgICAgICB3YXRjaChzZXR0aW5ncywgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXR0aW5nc0NoYW5nZWQudmFsdWUgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sIHsgZGVlcDogdHJ1ZSB9KTtcclxuICAgICAgICAgICAgICAgICAgICBcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgLy8g57uE5Lu25oyC6L295pe25Yqg6L295pWw5o2uXHJcbiAgICAgICAgICAgICAgICAgICAgb25Nb3VudGVkKGFzeW5jICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8g5Yqg6L295bel5YW3566h55CG5Zmo54q25oCBXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IGxvYWRUb29sTWFuYWdlclN0YXRlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyDku47mnI3liqHlmajnirbmgIHojrflj5borr7nva7kv6Hmga9cclxuICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHNlcnZlclN0YXR1cyA9IGF3YWl0IEVkaXRvci5NZXNzYWdlLnJlcXVlc3QoJ2NvY29zLW1jcC1zZXJ2ZXInLCAnZ2V0LXNlcnZlci1zdGF0dXMnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzZXJ2ZXJTdGF0dXMgJiYgc2VydmVyU3RhdHVzLnNldHRpbmdzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0dGluZ3MudmFsdWUgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvcnQ6IHNlcnZlclN0YXR1cy5zZXR0aW5ncy5wb3J0IHx8IDMwMDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF1dG9TdGFydDogc2VydmVyU3RhdHVzLnNldHRpbmdzLmF1dG9TdGFydCB8fCBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5hYmxlRGVidWdMb2c6IHNlcnZlclN0YXR1cy5zZXR0aW5ncy5lbmFibGVEZWJ1Z0xvZyB8fCBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWF4Q29ubmVjdGlvbnM6IHNlcnZlclN0YXR1cy5zZXR0aW5ncy5tYXhDb25uZWN0aW9ucyB8fCAxMFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ1tWdWUgQXBwXSBTZXJ2ZXIgc2V0dGluZ3MgbG9hZGVkIGZyb20gc3RhdHVzOicsIHNlcnZlclN0YXR1cy5zZXR0aW5ncyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHNlcnZlclN0YXR1cyAmJiBzZXJ2ZXJTdGF0dXMucG9ydCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOWFvOWuueaXp+eJiOacrO+8jOWPquiOt+WPluerr+WPo+S/oeaBr1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldHRpbmdzLnZhbHVlLnBvcnQgPSBzZXJ2ZXJTdGF0dXMucG9ydDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnW1Z1ZSBBcHBdIFBvcnQgbG9hZGVkIGZyb20gc2VydmVyIHN0YXR1czonLCBzZXJ2ZXJTdGF0dXMucG9ydCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdbVnVlIEFwcF0gRmFpbGVkIHRvIGdldCBzZXJ2ZXIgc3RhdHVzOicsIGVycm9yKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdbVnVlIEFwcF0gVXNpbmcgZGVmYXVsdCBzZXJ2ZXIgc2V0dGluZ3MnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8g5a6a5pyf5pu05paw5pyN5Yqh5Zmo54q25oCBXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldEludGVydmFsKGFzeW5jICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgRWRpdG9yLk1lc3NhZ2UucmVxdWVzdCgnY29jb3MtbWNwLXNlcnZlcicsICdnZXQtc2VydmVyLXN0YXR1cycpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VydmVyUnVubmluZy52YWx1ZSA9IHJlc3VsdC5ydW5uaW5nO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXJ2ZXJTdGF0dXMudmFsdWUgPSByZXN1bHQucnVubmluZyA/ICfov5DooYzkuK0nIDogJ+W3suWBnOatoic7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbm5lY3RlZENsaWVudHMudmFsdWUgPSByZXN1bHQuY2xpZW50cyB8fCAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBodHRwVXJsLnZhbHVlID0gcmVzdWx0LnJ1bm5pbmcgPyBgaHR0cDovL2xvY2FsaG9zdDoke3Jlc3VsdC5wb3J0fWAgOiAnJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNQcm9jZXNzaW5nLnZhbHVlID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdbVnVlIEFwcF0gRmFpbGVkIHRvIGdldCBzZXJ2ZXIgc3RhdHVzOicsIGVycm9yKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgMjAwMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8g5pWw5o2uXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjdGl2ZVRhYixcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2VydmVyUnVubmluZyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2VydmVyU3RhdHVzLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25uZWN0ZWRDbGllbnRzLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBodHRwVXJsLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpc1Byb2Nlc3NpbmcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldHRpbmdzLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhdmFpbGFibGVUb29scyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdG9vbENhdGVnb3JpZXMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldHRpbmdzQ2hhbmdlZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIOiuoeeul+WxnuaAp1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGF0dXNDbGFzcyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdG90YWxUb29scyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZW5hYmxlZFRvb2xzLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkaXNhYmxlZFRvb2xzLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8g5pa55rOVXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN3aXRjaFRhYixcclxuICAgICAgICAgICAgICAgICAgICAgICAgdG9nZ2xlU2VydmVyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzYXZlU2V0dGluZ3MsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvcHlVcmwsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvYWRUb29sTWFuYWdlclN0YXRlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGVUb29sU3RhdHVzLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RBbGxUb29scyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVzZWxlY3RBbGxUb29scyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2F2ZUNoYW5nZXMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvZ2dsZUNhdGVnb3J5VG9vbHMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGdldFRvb2xzQnlDYXRlZ29yeSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZ2V0Q2F0ZWdvcnlEaXNwbGF5TmFtZVxyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGU6IHJlYWRGaWxlU3luYyhqb2luKF9fZGlybmFtZSwgJy4uLy4uLy4uL3N0YXRpYy90ZW1wbGF0ZS92dWUvbWNwLXNlcnZlci1hcHAuaHRtbCcpLCAndXRmLTgnKSxcclxuICAgICAgICAgICAgfSkpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgYXBwLm1vdW50KHRoaXMuJC5hcHApO1xyXG4gICAgICAgICAgICBwYW5lbERhdGFNYXAuc2V0KHRoaXMsIGFwcCk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnW01DUCBQYW5lbF0gVnVlMyBhcHAgbW91bnRlZCBzdWNjZXNzZnVsbHknKTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgYmVmb3JlQ2xvc2UoKSB7IH0sXHJcbiAgICBjbG9zZSgpIHtcclxuICAgICAgICBjb25zdCBhcHAgPSBwYW5lbERhdGFNYXAuZ2V0KHRoaXMpO1xyXG4gICAgICAgIGlmIChhcHApIHtcclxuICAgICAgICAgICAgYXBwLnVubW91bnQoKTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG59KTsiXX0=