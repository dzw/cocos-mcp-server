<div class="mcp-app">
    <!-- 选项卡导航 -->
    <div class="tab-navigation">
        <button class="tab-button" :class="{ active: activeTab === 'server' }" @click="switchTab('server')">
            <span>服务器</span>
        </button>
        <button class="tab-button" :class="{ active: activeTab === 'tools' }" @click="switchTab('tools')">
            <span>工具管理</span>
        </button>
        <button class="reload-btn" @click="reloadExtension" title="重新加载扩展">↻</button>
    </div>
    
    <!-- 服务器选项卡 -->
    <div class="tab-content server-tab" v-show="activeTab === 'server'">
        <section class="server-status">
            <h3>服务器状态</h3>
            <div class="status-info">
                <ui-prop>
                    <ui-label slot="label">状态</ui-label>
                    <ui-label slot="content" class="status-value" :class="statusClass">{{ serverStatus }}</ui-label>
                </ui-prop>
                <ui-prop v-if="serverRunning">
                    <ui-label slot="label">连接数</ui-label>
                    <ui-label slot="content">{{ connectedClients }}</ui-label>
                </ui-prop>
            </div>
        </section>

        <section class="server-controls">
            <ui-button @click="toggleServer" :disabled="isProcessing" class="primary">
                {{ serverRunning ? '停止服务器' : '启动服务器' }}
            </ui-button>
        </section>

        <section class="server-settings">
            <h3>服务器设置</h3>
            <ui-prop>
                <ui-label slot="label">端口</ui-label>
                <ui-num-input slot="content" v-model="settings.port" :min="1024" :max="65535" :step="1" :disabled="serverRunning">
                </ui-num-input>
            </ui-prop>
            <ui-prop>
                <ui-label slot="label">自动启动</ui-label>
                <ui-checkbox slot="content" :value="settings.autoStart" @change="onAutoStartChange"></ui-checkbox>
            </ui-prop>
            <ui-prop>
                <ui-label slot="label">调试日志</ui-label>
                <ui-checkbox slot="content" :value="settings.enableDebugLog" @change="onDebugLogChange"></ui-checkbox>
            </ui-prop>
            <ui-prop>
                <ui-label slot="label">最大连接数</ui-label>
                <ui-num-input slot="content" v-model="settings.maxConnections" :min="1" :max="100" :step="1">
                </ui-num-input>
            </ui-prop>
        </section>

        <section class="server-info" v-if="serverRunning">
            <h3>连接信息</h3>
            <div class="connection-details">
                <ui-prop>
                    <ui-label slot="label">HTTP URL</ui-label>
                    <ui-input slot="content" :value="httpUrl" readonly>
                        <ui-button slot="suffix" @click="copyUrl">复制</ui-button>
                    </ui-input>
                </ui-prop>
            </div>
        </section>

        <footer>
            <ui-button @click="saveSettings" :disabled="!settingsChanged">保存设置</ui-button>
        </footer>
    </div>

    <!-- 工具管理选项卡 -->
    <div class="tab-content tools-tab" v-show="activeTab === 'tools'">
        <section class="tool-manager">
            <div class="tools-section">
                <div class="tools-section-header">
                    <div class="tools-section-title">
                        <h4>可用工具 ({{ enabledTools }}/{{ totalTools }})</h4>
                    </div>
                    <div class="tools-section-controls">
                        <ui-button @click="selectAllTools" class="small">全选</ui-button>
                        <ui-button @click="deselectAllTools" class="small">全不选</ui-button>
                        <ui-button @click="collapseAll" class="small">折叠</ui-button>
                        <ui-button @click="expandAll" class="small">展开</ui-button>
                        <ui-button @click="saveChanges" class="primary small">保存</ui-button>
                    </div>
                </div>

                <div class="tools-container">
                    <div v-for="category in toolCategories" :key="category" class="tool-category">
                        <div class="category-header" @click="toggleCategoryCollapse(category)">
                            <div class="category-left">
                                <span class="collapse-icon" :class="{ collapsed: collapsedCategories[category] }">▶</span>
                                <ui-checkbox
                                    :value="isCategoryAllEnabled(category)"
                                    @change="(event) => { event.stopPropagation(); toggleCategoryCheckbox(category, event.target.checked); }"
                                    @click.stop
                                ></ui-checkbox>
                                <h5>{{ getCategoryDisplayName(category) }}</h5>
                            </div>
                            <span class="category-count">{{ getCategoryEnabledCount(category) }}/{{ getToolsByCategory(category).length }}</span>
                        </div>
                        <div class="tool-items" v-show="!collapsedCategories[category]">
                            <div v-for="tool in getToolsByCategory(category)" :key="tool.name" class="tool-item">
                                <ui-checkbox
                                    :value="tool.enabled"
                                    @change="(event) => updateToolStatus(category, tool.name, event.target.checked)"
                                ></ui-checkbox>
                                <div class="tool-info">
                                    <div class="tool-name">{{ tool.name }}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</div>

 