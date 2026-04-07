"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.methods = void 0;
exports.load = load;
exports.unload = unload;
const mcp_server_1 = require("./mcp-server");
const settings_1 = require("./settings");
const tool_manager_1 = require("./tools/tool-manager");
let mcpServer = null;
let toolManager;
/**
 * @en Registration method for the main process of Extension
 * @zh 为扩展的主进程的注册方法
 */
exports.methods = {
    /**
     * @en Open the MCP server panel
     * @zh 打开 MCP 服务器面板
     */
    openPanel() {
        Editor.Panel.open('cocos-mcp-server');
    },
    /**
     * @en Start the MCP server
     * @zh 启动 MCP 服务器
     */
    async startServer() {
        if (mcpServer) {
            // 确保使用最新的工具配置
            const enabledTools = toolManager.getEnabledTools();
            mcpServer.updateEnabledTools(enabledTools);
            await mcpServer.start();
        }
        else {
            console.warn('[MCP插件] mcpServer 未初始化');
        }
    },
    /**
     * @en Stop the MCP server
     * @zh 停止 MCP 服务器
     */
    async stopServer() {
        if (mcpServer) {
            mcpServer.stop();
        }
        else {
            console.warn('[MCP插件] mcpServer 未初始化');
        }
    },
    /**
     * @en Get server status
     * @zh 获取服务器状态
     */
    getServerStatus() {
        const status = mcpServer ? mcpServer.getStatus() : { running: false, port: 0, clients: 0 };
        const settings = mcpServer ? mcpServer.getSettings() : (0, settings_1.readSettings)();
        return Object.assign(Object.assign({}, status), { settings: settings });
    },
    /**
     * @en Update server settings
     * @zh 更新服务器设置
     */
    updateSettings(settings) {
        const wasRunning = mcpServer ? mcpServer.getStatus().running : false;
        const willAutoStart = settings.autoStart;
        // 确保所有必填字段都有值
        const completeSettings = {
            port: settings.port || 3000,
            autoStart: settings.autoStart || false,
            enableDebugLog: settings.enableDebugLog || false,
            allowedOrigins: settings.allowedOrigins || ['*'],
            maxConnections: settings.maxConnections || 10
        };
        (0, settings_1.saveSettings)(completeSettings);
        if (mcpServer) {
            mcpServer.stop();
            const enabledTools = toolManager.getEnabledTools();
            mcpServer = new mcp_server_1.MCPServer(completeSettings);
            mcpServer.updateEnabledTools(enabledTools);
            // 只在 autoStart 为 true 或之前正在运行时才启动
            if (willAutoStart || wasRunning) {
                mcpServer.start();
            }
        }
        else {
            mcpServer = new mcp_server_1.MCPServer(completeSettings);
            const enabledTools = toolManager.getEnabledTools();
            mcpServer.updateEnabledTools(enabledTools);
            if (willAutoStart) {
                mcpServer.start();
            }
        }
        // 返回保存后的完整设置
        return completeSettings;
    },
    /**
     * @en Get tools list
     * @zh 获取工具列表
     */
    getToolsList() {
        return mcpServer ? mcpServer.getAvailableTools() : [];
    },
    getFilteredToolsList() {
        if (!mcpServer)
            return [];
        // 获取当前启用的工具
        const enabledTools = toolManager.getEnabledTools();
        // 更新MCP服务器的启用工具列表
        mcpServer.updateEnabledTools(enabledTools);
        return mcpServer.getFilteredTools(enabledTools);
    },
    /**
     * @en Get server settings
     * @zh 获取服务器设置
     */
    async getServerSettings() {
        return mcpServer ? mcpServer.getSettings() : (0, settings_1.readSettings)();
    },
    /**
     * @en Get server settings (alternative method)
     * @zh 获取服务器设置（替代方法）
     */
    async getSettings() {
        return mcpServer ? mcpServer.getSettings() : (0, settings_1.readSettings)();
    },
    // 工具管理器相关方法
    async getToolManagerState() {
        return toolManager.getToolManagerState();
    },
    async createToolConfiguration(name, description) {
        try {
            const config = toolManager.createConfiguration(name, description);
            return { success: true, id: config.id, config };
        }
        catch (error) {
            throw new Error(`创建配置失败: ${error.message}`);
        }
    },
    async updateToolConfiguration(configId, updates) {
        try {
            return toolManager.updateConfiguration(configId, updates);
        }
        catch (error) {
            throw new Error(`更新配置失败: ${error.message}`);
        }
    },
    async deleteToolConfiguration(configId) {
        try {
            toolManager.deleteConfiguration(configId);
            return { success: true };
        }
        catch (error) {
            throw new Error(`删除配置失败: ${error.message}`);
        }
    },
    async setCurrentToolConfiguration(configId) {
        try {
            toolManager.setCurrentConfiguration(configId);
            return { success: true };
        }
        catch (error) {
            throw new Error(`设置当前配置失败: ${error.message}`);
        }
    },
    async updateToolStatus(category, toolName, enabled) {
        try {
            const currentConfig = toolManager.getCurrentConfiguration();
            if (!currentConfig) {
                throw new Error('没有当前配置');
            }
            toolManager.updateToolStatus(currentConfig.id, category, toolName, enabled);
            // 更新MCP服务器的工具列表
            if (mcpServer) {
                const enabledTools = toolManager.getEnabledTools();
                mcpServer.updateEnabledTools(enabledTools);
            }
            return { success: true };
        }
        catch (error) {
            throw new Error(`更新工具状态失败: ${error.message}`);
        }
    },
    async updateToolStatusBatch(updates) {
        try {
            console.log(`[Main] updateToolStatusBatch called with updates count:`, updates ? updates.length : 0);
            const currentConfig = toolManager.getCurrentConfiguration();
            if (!currentConfig) {
                throw new Error('没有当前配置');
            }
            toolManager.updateToolStatusBatch(currentConfig.id, updates);
            // 更新MCP服务器的工具列表
            if (mcpServer) {
                const enabledTools = toolManager.getEnabledTools();
                mcpServer.updateEnabledTools(enabledTools);
            }
            return { success: true };
        }
        catch (error) {
            throw new Error(`批量更新工具状态失败: ${error.message}`);
        }
    },
    async exportToolConfiguration(configId) {
        try {
            return { configJson: toolManager.exportConfiguration(configId) };
        }
        catch (error) {
            throw new Error(`导出配置失败: ${error.message}`);
        }
    },
    async importToolConfiguration(configJson) {
        try {
            return toolManager.importConfiguration(configJson);
        }
        catch (error) {
            throw new Error(`导入配置失败: ${error.message}`);
        }
    },
    async getEnabledTools() {
        return toolManager.getEnabledTools();
    }
};
/**
 * @en Method Triggered on Extension Startup
 * @zh 扩展启动时触发的方法
 */
function load() {
    console.log('Cocos MCP Server extension loaded');
    // 初始化工具管理器
    toolManager = new tool_manager_1.ToolManager();
    // 读取设置
    const settings = (0, settings_1.readSettings)();
    mcpServer = new mcp_server_1.MCPServer(settings);
    // 初始化MCP服务器的工具列表
    const enabledTools = toolManager.getEnabledTools();
    mcpServer.updateEnabledTools(enabledTools);
    // 如果设置了自动启动，则启动服务器
    if (settings.autoStart) {
        mcpServer.start().catch(err => {
            console.error('Failed to auto-start MCP server:', err);
        });
    }
}
/**
 * @en Method triggered when uninstalling the extension
 * @zh 卸载扩展时触发的方法
 */
function unload() {
    if (mcpServer) {
        mcpServer.stop();
        mcpServer = null;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NvdXJjZS9tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQXdQQSxvQkFvQkM7QUFNRCx3QkFLQztBQXZSRCw2Q0FBeUM7QUFDekMseUNBQXdEO0FBRXhELHVEQUFtRDtBQUVuRCxJQUFJLFNBQVMsR0FBcUIsSUFBSSxDQUFDO0FBQ3ZDLElBQUksV0FBd0IsQ0FBQztBQUU3Qjs7O0dBR0c7QUFDVSxRQUFBLE9BQU8sR0FBNEM7SUFDNUQ7OztPQUdHO0lBQ0gsU0FBUztRQUNMLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUM7SUFDMUMsQ0FBQztJQUlEOzs7T0FHRztJQUNILEtBQUssQ0FBQyxXQUFXO1FBQ2IsSUFBSSxTQUFTLEVBQUUsQ0FBQztZQUNaLGNBQWM7WUFDZCxNQUFNLFlBQVksR0FBRyxXQUFXLENBQUMsZUFBZSxFQUFFLENBQUM7WUFDbkQsU0FBUyxDQUFDLGtCQUFrQixDQUFDLFlBQVksQ0FBQyxDQUFDO1lBQzNDLE1BQU0sU0FBUyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQzVCLENBQUM7YUFBTSxDQUFDO1lBQ0osT0FBTyxDQUFDLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO1FBQzNDLENBQUM7SUFDTCxDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsS0FBSyxDQUFDLFVBQVU7UUFDWixJQUFJLFNBQVMsRUFBRSxDQUFDO1lBQ1osU0FBUyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ3JCLENBQUM7YUFBTSxDQUFDO1lBQ0osT0FBTyxDQUFDLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO1FBQzNDLENBQUM7SUFDTCxDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsZUFBZTtRQUNYLE1BQU0sTUFBTSxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLE9BQU8sRUFBRSxL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Q1BTZXJ2ZXIgfSBmcm9tICcuL21jcC1zZXJ2ZXInO1xyXG5pbXBvcnQgeyByZWFkU2V0dGluZ3MsIHNhdmVTZXR0aW5ncyB9IGZyb20gJy4vc2V0dGluZ3MnO1xyXG5pbXBvcnQgeyBNQ1BTZXJ2ZXJTZXR0aW5ncyB9IGZyb20gJy4vdHlwZXMnO1xyXG5pbXBvcnQgeyBUb29sTWFuYWdlciB9IGZyb20gJy4vdG9vbHMvdG9vbC1tYW5hZ2VyJztcclxuXHJcbmxldCBtY3BTZXJ2ZXI6IE1DUFNlcnZlciB8IG51bGwgPSBudWxsO1xyXG5sZXQgdG9vbE1hbmFnZXI6IFRvb2xNYW5hZ2VyO1xyXG5cclxuLyoqXHJcbiAqIEBlbiBSZWdpc3RyYXRpb24gbWV0aG9kIGZvciB0aGUgbWFpbiBwcm9jZXNzIG9mIEV4dGVuc2lvblxyXG4gKiBAemgg5Li65omp5bGV55qE5Li76L+b56iL55qE5rOo5YaM5pa55rOVXHJcbiAqL1xyXG5leHBvcnQgY29uc3QgbWV0aG9kczogeyBba2V5OiBzdHJpbmddOiAoLi4uYW55OiBhbnkpID0+IGFueSB9ID0ge1xyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gT3BlbiB0aGUgTUNQIHNlcnZlciBwYW5lbFxyXG4gICAgICogQHpoIOaJk+W8gCBNQ1Ag5pyN5Yqh5Zmo6Z2i5p2/XHJcbiAgICAgKi9cclxuICAgIG9wZW5QYW5lbCgpIHtcclxuICAgICAgICBFZGl0b3IuUGFuZWwub3BlbignY29jb3MtbWNwLXNlcnZlcicpO1xyXG4gICAgfSxcclxuXHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFN0YXJ0IHRoZSBNQ1Agc2VydmVyXHJcbiAgICAgKiBAemgg5ZCv5YqoIE1DUCDmnI3liqHlmahcclxuICAgICAqL1xyXG4gICAgYXN5bmMgc3RhcnRTZXJ2ZXIoKSB7XHJcbiAgICAgICAgaWYgKG1jcFNlcnZlcikge1xyXG4gICAgICAgICAgICAvLyDnoa7kv53kvb/nlKjmnIDmlrDnmoTlt6XlhbfphY3nva5cclxuICAgICAgICAgICAgY29uc3QgZW5hYmxlZFRvb2xzID0gdG9vbE1hbmFnZXIuZ2V0RW5hYmxlZFRvb2xzKCk7XHJcbiAgICAgICAgICAgIG1jcFNlcnZlci51cGRhdGVFbmFibGVkVG9vbHMoZW5hYmxlZFRvb2xzKTtcclxuICAgICAgICAgICAgYXdhaXQgbWNwU2VydmVyLnN0YXJ0KCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uc29sZS53YXJuKCdbTUNQ5o+S5Lu2XSBtY3BTZXJ2ZXIg5pyq5Yid5aeL5YyWJyk7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBTdG9wIHRoZSBNQ1Agc2VydmVyXHJcbiAgICAgKiBAemgg5YGc5q2iIE1DUCDmnI3liqHlmahcclxuICAgICAqL1xyXG4gICAgYXN5bmMgc3RvcFNlcnZlcigpIHtcclxuICAgICAgICBpZiAobWNwU2VydmVyKSB7XHJcbiAgICAgICAgICAgIG1jcFNlcnZlci5zdG9wKCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uc29sZS53YXJuKCdbTUNQ5o+S5Lu2XSBtY3BTZXJ2ZXIg5pyq5Yid5aeL5YyWJyk7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBHZXQgc2VydmVyIHN0YXR1c1xyXG4gICAgICogQHpoIOiOt+WPluacjeWKoeWZqOeKtuaAgVxyXG4gICAgICovXHJcbiAgICBnZXRTZXJ2ZXJTdGF0dXMoKSB7XHJcbiAgICAgICAgY29uc3Qgc3RhdHVzID0gbWNwU2VydmVyID8gbWNwU2VydmVyLmdldFN0YXR1cygpIDogeyBydW5uaW5nOiBmYWxzZSwgcG9ydDogMCwgY2xpZW50czogMCB9O1xyXG4gICAgICAgIGNvbnN0IHNldHRpbmdzID0gbWNwU2VydmVyID8gbWNwU2VydmVyLmdldFNldHRpbmdzKCkgOiByZWFkU2V0dGluZ3MoKTtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAuLi5zdGF0dXMsXHJcbiAgICAgICAgICAgIHNldHRpbmdzOiBzZXR0aW5nc1xyXG4gICAgICAgIH07XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFVwZGF0ZSBzZXJ2ZXIgc2V0dGluZ3NcclxuICAgICAqIEB6aCDmm7TmlrDmnI3liqHlmajorr7nva5cclxuICAgICAqL1xyXG4gICAgdXBkYXRlU2V0dGluZ3Moc2V0dGluZ3M6IE1DUFNlcnZlclNldHRpbmdzKSB7XHJcbiAgICAgICAgY29uc3Qgd2FzUnVubmluZyA9IG1jcFNlcnZlciA/IG1jcFNlcnZlci5nZXRTdGF0dXMoKS5ydW5uaW5nIDogZmFsc2U7XHJcbiAgICAgICAgY29uc3Qgd2lsbEF1dG9TdGFydCA9IHNldHRpbmdzLmF1dG9TdGFydDtcclxuXHJcbiAgICAgICAgLy8g56Gu5L+d5omA5pyJ5b+F5aGr5a2X5q616YO95pyJ5YC8XHJcbiAgICAgICAgY29uc3QgY29tcGxldGVTZXR0aW5nczogTUNQU2VydmVyU2V0dGluZ3MgPSB7XHJcbiAgICAgICAgICAgIHBvcnQ6IHNldHRpbmdzLnBvcnQgfHwgMzAwMCxcclxuICAgICAgICAgICAgYXV0b1N0YXJ0OiBzZXR0aW5ncy5hdXRvU3RhcnQgfHwgZmFsc2UsXHJcbiAgICAgICAgICAgIGVuYWJsZURlYnVnTG9nOiBzZXR0aW5ncy5lbmFibGVEZWJ1Z0xvZyB8fCBmYWxzZSxcclxuICAgICAgICAgICAgYWxsb3dlZE9yaWdpbnM6IHNldHRpbmdzLmFsbG93ZWRPcmlnaW5zIHx8IFsnKiddLFxyXG4gICAgICAgICAgICBtYXhDb25uZWN0aW9uczogc2V0dGluZ3MubWF4Q29ubmVjdGlvbnMgfHwgMTBcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzYXZlU2V0dGluZ3MoY29tcGxldGVTZXR0aW5ncyk7XHJcblxyXG4gICAgICAgIGlmIChtY3BTZXJ2ZXIpIHtcclxuICAgICAgICAgICAgbWNwU2VydmVyLnN0b3AoKTtcclxuICAgICAgICAgICAgY29uc3QgZW5hYmxlZFRvb2xzID0gdG9vbE1hbmFnZXIuZ2V0RW5hYmxlZFRvb2xzKCk7XHJcbiAgICAgICAgICAgIG1jcFNlcnZlciA9IG5ldyBNQ1BTZXJ2ZXIoY29tcGxldGVTZXR0aW5ncyk7XHJcbiAgICAgICAgICAgIG1jcFNlcnZlci51cGRhdGVFbmFibGVkVG9vbHMoZW5hYmxlZFRvb2xzKTtcclxuICAgICAgICAgICAgLy8g5Y+q5ZyoIGF1dG9TdGFydCDkuLogdHJ1ZSDmiJbkuYvliY3mraPlnKjov5DooYzml7bmiY3lkK/liqhcclxuICAgICAgICAgICAgaWYgKHdpbGxBdXRvU3RhcnQgfHwgd2FzUnVubmluZykge1xyXG4gICAgICAgICAgICAgICAgbWNwU2VydmVyLnN0YXJ0KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBtY3BTZXJ2ZXIgPSBuZXcgTUNQU2VydmVyKGNvbXBsZXRlU2V0dGluZ3MpO1xyXG4gICAgICAgICAgICBjb25zdCBlbmFibGVkVG9vbHMgPSB0b29sTWFuYWdlci5nZXRFbmFibGVkVG9vbHMoKTtcclxuICAgICAgICAgICAgbWNwU2VydmVyLnVwZGF0ZUVuYWJsZWRUb29scyhlbmFibGVkVG9vbHMpO1xyXG4gICAgICAgICAgICBpZiAod2lsbEF1dG9TdGFydCkge1xyXG4gICAgICAgICAgICAgICAgbWNwU2VydmVyLnN0YXJ0KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIOi/lOWbnuS/neWtmOWQjueahOWujOaVtOiuvue9rlxyXG4gICAgICAgIHJldHVybiBjb21wbGV0ZVNldHRpbmdzO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBHZXQgdG9vbHMgbGlzdFxyXG4gICAgICogQHpoIOiOt+WPluW3peWFt+WIl+ihqFxyXG4gICAgICovXHJcbiAgICBnZXRUb29sc0xpc3QoKSB7XHJcbiAgICAgICAgcmV0dXJuIG1jcFNlcnZlciA/IG1jcFNlcnZlci5nZXRBdmFpbGFibGVUb29scygpIDogW107XHJcbiAgICB9LFxyXG5cclxuICAgIGdldEZpbHRlcmVkVG9vbHNMaXN0KCkge1xyXG4gICAgICAgIGlmICghbWNwU2VydmVyKSByZXR1cm4gW107XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8g6I635Y+W5b2T5YmN5ZCv55So55qE5bel5YW3XHJcbiAgICAgICAgY29uc3QgZW5hYmxlZFRvb2xzID0gdG9vbE1hbmFnZXIuZ2V0RW5hYmxlZFRvb2xzKCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8g5pu05pawTUNQ5pyN5Yqh5Zmo55qE5ZCv55So5bel5YW35YiX6KGoXHJcbiAgICAgICAgbWNwU2VydmVyLnVwZGF0ZUVuYWJsZWRUb29scyhlbmFibGVkVG9vbHMpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHJldHVybiBtY3BTZXJ2ZXIuZ2V0RmlsdGVyZWRUb29scyhlbmFibGVkVG9vbHMpO1xyXG4gICAgfSxcclxuICAgIC8qKlxyXG4gICAgICogQGVuIEdldCBzZXJ2ZXIgc2V0dGluZ3NcclxuICAgICAqIEB6aCDojrflj5bmnI3liqHlmajorr7nva5cclxuICAgICAqL1xyXG4gICAgYXN5bmMgZ2V0U2VydmVyU2V0dGluZ3MoKSB7XHJcbiAgICAgICAgcmV0dXJuIG1jcFNlcnZlciA/IG1jcFNlcnZlci5nZXRTZXR0aW5ncygpIDogcmVhZFNldHRpbmdzKCk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIEdldCBzZXJ2ZXIgc2V0dGluZ3MgKGFsdGVybmF0aXZlIG1ldGhvZClcclxuICAgICAqIEB6aCDojrflj5bmnI3liqHlmajorr7nva7vvIjmm7/ku6Pmlrnms5XvvIlcclxuICAgICAqL1xyXG4gICAgYXN5bmMgZ2V0U2V0dGluZ3MoKSB7XHJcbiAgICAgICAgcmV0dXJuIG1jcFNlcnZlciA/IG1jcFNlcnZlci5nZXRTZXR0aW5ncygpIDogcmVhZFNldHRpbmdzKCk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8vIOW3peWFt+euoeeQhuWZqOebuOWFs+aWueazlVxyXG4gICAgYXN5bmMgZ2V0VG9vbE1hbmFnZXJTdGF0ZSgpIHtcclxuICAgICAgICByZXR1cm4gdG9vbE1hbmFnZXIuZ2V0VG9vbE1hbmFnZXJTdGF0ZSgpO1xyXG4gICAgfSxcclxuXHJcbiAgICBhc3luYyBjcmVhdGVUb29sQ29uZmlndXJhdGlvbihuYW1lOiBzdHJpbmcsIGRlc2NyaXB0aW9uPzogc3RyaW5nKSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgY29uc3QgY29uZmlnID0gdG9vbE1hbmFnZXIuY3JlYXRlQ29uZmlndXJhdGlvbihuYW1lLCBkZXNjcmlwdGlvbik7XHJcbiAgICAgICAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IHRydWUsIGlkOiBjb25maWcuaWQsIGNvbmZpZyB9O1xyXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yOiBhbnkpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGDliJvlu7rphY3nva7lpLHotKU6ICR7ZXJyb3IubWVzc2FnZX1gKTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIGFzeW5jIHVwZGF0ZVRvb2xDb25maWd1cmF0aW9uKGNvbmZpZ0lkOiBzdHJpbmcsIHVwZGF0ZXM6IGFueSkge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0b29sTWFuYWdlci51cGRhdGVDb25maWd1cmF0aW9uKGNvbmZpZ0lkLCB1cGRhdGVzKTtcclxuICAgICAgICB9IGNhdGNoIChlcnJvcjogYW55KSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihg5pu05paw6YWN572u5aSx6LSlOiAke2Vycm9yLm1lc3NhZ2V9YCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBhc3luYyBkZWxldGVUb29sQ29uZmlndXJhdGlvbihjb25maWdJZDogc3RyaW5nKSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgdG9vbE1hbmFnZXIuZGVsZXRlQ29uZmlndXJhdGlvbihjb25maWdJZCk7XHJcbiAgICAgICAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IHRydWUgfTtcclxuICAgICAgICB9IGNhdGNoIChlcnJvcjogYW55KSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihg5Yig6Zmk6YWN572u5aSx6LSlOiAke2Vycm9yLm1lc3NhZ2V9YCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBhc3luYyBzZXRDdXJyZW50VG9vbENvbmZpZ3VyYXRpb24oY29uZmlnSWQ6IHN0cmluZykge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIHRvb2xNYW5hZ2VyLnNldEN1cnJlbnRDb25maWd1cmF0aW9uKGNvbmZpZ0lkKTtcclxuICAgICAgICAgICAgcmV0dXJuIHsgc3VjY2VzczogdHJ1ZSB9O1xyXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yOiBhbnkpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGDorr7nva7lvZPliY3phY3nva7lpLHotKU6ICR7ZXJyb3IubWVzc2FnZX1gKTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIGFzeW5jIHVwZGF0ZVRvb2xTdGF0dXMoY2F0ZWdvcnk6IHN0cmluZywgdG9vbE5hbWU6IHN0cmluZywgZW5hYmxlZDogYm9vbGVhbikge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRDb25maWcgPSB0b29sTWFuYWdlci5nZXRDdXJyZW50Q29uZmlndXJhdGlvbigpO1xyXG4gICAgICAgICAgICBpZiAoIWN1cnJlbnRDb25maWcpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcign5rKh5pyJ5b2T5YmN6YWN572uJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHRvb2xNYW5hZ2VyLnVwZGF0ZVRvb2xTdGF0dXMoY3VycmVudENvbmZpZy5pZCwgY2F0ZWdvcnksIHRvb2xOYW1lLCBlbmFibGVkKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIC8vIOabtOaWsE1DUOacjeWKoeWZqOeahOW3peWFt+WIl+ihqFxyXG4gICAgICAgICAgICBpZiAobWNwU2VydmVyKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBlbmFibGVkVG9vbHMgPSB0b29sTWFuYWdlci5nZXRFbmFibGVkVG9vbHMoKTtcclxuICAgICAgICAgICAgICAgIG1jcFNlcnZlci51cGRhdGVFbmFibGVkVG9vbHMoZW5hYmxlZFRvb2xzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgcmV0dXJuIHsgc3VjY2VzczogdHJ1ZSB9O1xyXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yOiBhbnkpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGDmm7TmlrDlt6XlhbfnirbmgIHlpLHotKU6ICR7ZXJyb3IubWVzc2FnZX1gKTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIGFzeW5jIHVwZGF0ZVRvb2xTdGF0dXNCYXRjaCh1cGRhdGVzOiBhbnlbXSkge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGBbTWFpbl0gdXBkYXRlVG9vbFN0YXR1c0JhdGNoIGNhbGxlZCB3aXRoIHVwZGF0ZXMgY291bnQ6YCwgdXBkYXRlcyA/IHVwZGF0ZXMubGVuZ3RoIDogMCk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBjb25zdCBjdXJyZW50Q29uZmlnID0gdG9vbE1hbmFnZXIuZ2V0Q3VycmVudENvbmZpZ3VyYXRpb24oKTtcclxuICAgICAgICAgICAgaWYgKCFjdXJyZW50Q29uZmlnKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ+ayoeacieW9k+WJjemFjee9ricpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB0b29sTWFuYWdlci51cGRhdGVUb29sU3RhdHVzQmF0Y2goY3VycmVudENvbmZpZy5pZCwgdXBkYXRlcyk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAvLyDmm7TmlrBNQ1DmnI3liqHlmajnmoTlt6XlhbfliJfooahcclxuICAgICAgICAgICAgaWYgKG1jcFNlcnZlcikge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZW5hYmxlZFRvb2xzID0gdG9vbE1hbmFnZXIuZ2V0RW5hYmxlZFRvb2xzKCk7XHJcbiAgICAgICAgICAgICAgICBtY3BTZXJ2ZXIudXBkYXRlRW5hYmxlZFRvb2xzKGVuYWJsZWRUb29scyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IHRydWUgfTtcclxuICAgICAgICB9IGNhdGNoIChlcnJvcjogYW55KSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihg5om56YeP5pu05paw5bel5YW354q25oCB5aSx6LSlOiAke2Vycm9yLm1lc3NhZ2V9YCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBhc3luYyBleHBvcnRUb29sQ29uZmlndXJhdGlvbihjb25maWdJZDogc3RyaW5nKSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgcmV0dXJuIHsgY29uZmlnSnNvbjogdG9vbE1hbmFnZXIuZXhwb3J0Q29uZmlndXJhdGlvbihjb25maWdJZCkgfTtcclxuICAgICAgICB9IGNhdGNoIChlcnJvcjogYW55KSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihg5a+85Ye66YWN572u5aSx6LSlOiAke2Vycm9yLm1lc3NhZ2V9YCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBhc3luYyBpbXBvcnRUb29sQ29uZmlndXJhdGlvbihjb25maWdKc29uOiBzdHJpbmcpIHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICByZXR1cm4gdG9vbE1hbmFnZXIuaW1wb3J0Q29uZmlndXJhdGlvbihjb25maWdKc29uKTtcclxuICAgICAgICB9IGNhdGNoIChlcnJvcjogYW55KSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihg5a+85YWl6YWN572u5aSx6LSlOiAke2Vycm9yLm1lc3NhZ2V9YCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBhc3luYyBnZXRFbmFibGVkVG9vbHMoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRvb2xNYW5hZ2VyLmdldEVuYWJsZWRUb29scygpO1xyXG4gICAgfVxyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBlbiBNZXRob2QgVHJpZ2dlcmVkIG9uIEV4dGVuc2lvbiBTdGFydHVwXHJcbiAqIEB6aCDmianlsZXlkK/liqjml7bop6blj5HnmoTmlrnms5VcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBsb2FkKCkge1xyXG4gICAgY29uc29sZS5sb2coJ0NvY29zIE1DUCBTZXJ2ZXIgZXh0ZW5zaW9uIGxvYWRlZCcpO1xyXG4gICAgXHJcbiAgICAvLyDliJ3lp4vljJblt6XlhbfnrqHnkIblmahcclxuICAgIHRvb2xNYW5hZ2VyID0gbmV3IFRvb2xNYW5hZ2VyKCk7XHJcbiAgICBcclxuICAgIC8vIOivu+WPluiuvue9rlxyXG4gICAgY29uc3Qgc2V0dGluZ3MgPSByZWFkU2V0dGluZ3MoKTtcclxuICAgIG1jcFNlcnZlciA9IG5ldyBNQ1BTZXJ2ZXIoc2V0dGluZ3MpO1xyXG4gICAgXHJcbiAgICAvLyDliJ3lp4vljJZNQ1DmnI3liqHlmajnmoTlt6XlhbfliJfooahcclxuICAgIGNvbnN0IGVuYWJsZWRUb29scyA9IHRvb2xNYW5hZ2VyLmdldEVuYWJsZWRUb29scygpO1xyXG4gICAgbWNwU2VydmVyLnVwZGF0ZUVuYWJsZWRUb29scyhlbmFibGVkVG9vbHMpO1xyXG4gICAgXHJcbiAgICAvLyDlpoLmnpzorr7nva7kuoboh6rliqjlkK/liqjvvIzliJnlkK/liqjmnI3liqHlmahcclxuICAgIGlmIChzZXR0aW5ncy5hdXRvU3RhcnQpIHtcclxuICAgICAgICBtY3BTZXJ2ZXIuc3RhcnQoKS5jYXRjaChlcnIgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdGYWlsZWQgdG8gYXV0by1zdGFydCBNQ1Agc2VydmVyOicsIGVycik7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBAZW4gTWV0aG9kIHRyaWdnZXJlZCB3aGVuIHVuaW5zdGFsbGluZyB0aGUgZXh0ZW5zaW9uXHJcbiAqIEB6aCDljbjovb3mianlsZXml7bop6blj5HnmoTmlrnms5VcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiB1bmxvYWQoKSB7XHJcbiAgICBpZiAobWNwU2VydmVyKSB7XHJcbiAgICAgICAgbWNwU2VydmVyLnN0b3AoKTtcclxuICAgICAgICBtY3BTZXJ2ZXIgPSBudWxsO1xyXG4gICAgfVxyXG59Il19