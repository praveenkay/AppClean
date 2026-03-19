/**
 * Plugin System for Custom Detectors
 * Allows users to create custom app detectors via plugins
 * v1.5.0 Feature
 */

import { ArtifactPath } from '../types';
import { Logger } from '../utils/logger';

export interface AppDetectorPlugin {
  name: string;
  version: string;
  detect(appName: string): Promise<boolean>;
  findArtifacts(appName: string): Promise<ArtifactPath[]>;
  remove(appName: string): Promise<boolean>;
  getInfo(): PluginInfo;
}

export interface PluginInfo {
  name: string;
  version: string;
  description: string;
  author: string;
  website?: string;
  supportedPlatforms: string[];
  capabilities: string[];
}

export interface PluginConfig {
  enabled: boolean;
  settings?: Record<string, any>;
}

export class PluginSystem {
  private plugins: Map<string, AppDetectorPlugin> = new Map();
  private pluginConfigs: Map<string, PluginConfig> = new Map();

  /**
   * Register a plugin
   */
  registerPlugin(plugin: AppDetectorPlugin, config?: PluginConfig): void {
    this.plugins.set(plugin.name, plugin);
    this.pluginConfigs.set(plugin.name, config || { enabled: true });
    Logger.info(`Plugin registered: ${plugin.name} v${plugin.version}`);
  }

  /**
   * Unregister a plugin
   */
  unregisterPlugin(pluginName: string): void {
    this.plugins.delete(pluginName);
    this.pluginConfigs.delete(pluginName);
    Logger.info(`Plugin unregistered: ${pluginName}`);
  }

  /**
   * Get all registered plugins
   */
  getPlugins(): AppDetectorPlugin[] {
    return Array.from(this.plugins.values());
  }

  /**
   * Get plugin by name
   */
  getPlugin(pluginName: string): AppDetectorPlugin | null {
    return this.plugins.get(pluginName) || null;
  }

  /**
   * Execute plugin detection
   */
  async executeDetection(appName: string): Promise<Map<string, boolean>> {
    const results = new Map<string, boolean>();

    for (const [name, plugin] of this.plugins) {
      const config = this.pluginConfigs.get(name);
      if (config?.enabled) {
        try {
          const detected = await plugin.detect(appName);
          results.set(name, detected);
        } catch (error) {
          Logger.debug(`Plugin ${name} detection failed: ${(error as Error).message}`);
          results.set(name, false);
        }
      }
    }

    return results;
  }

  /**
   * Execute plugin artifact finding
   */
  async executeFindArtifacts(appName: string): Promise<Map<string, ArtifactPath[]>> {
    const results = new Map<string, ArtifactPath[]>();

    for (const [name, plugin] of this.plugins) {
      const config = this.pluginConfigs.get(name);
      if (config?.enabled) {
        try {
          const artifacts = await plugin.findArtifacts(appName);
          results.set(name, artifacts);
        } catch (error) {
          Logger.debug(`Plugin ${name} artifact finding failed: ${(error as Error).message}`);
          results.set(name, []);
        }
      }
    }

    return results;
  }

  /**
   * Execute plugin removal
   */
  async executeRemoval(appName: string, pluginName?: string): Promise<Map<string, boolean>> {
    const results = new Map<string, boolean>();

    if (pluginName) {
      const plugin = this.plugins.get(pluginName);
      if (plugin) {
        const config = this.pluginConfigs.get(pluginName);
        if (config?.enabled) {
          try {
            const removed = await plugin.remove(appName);
            results.set(pluginName, removed);
          } catch (error) {
            Logger.debug(`Plugin ${pluginName} removal failed: ${(error as Error).message}`);
            results.set(pluginName, false);
          }
        }
      }
    } else {
      for (const [name, plugin] of this.plugins) {
        const config = this.pluginConfigs.get(name);
        if (config?.enabled) {
          try {
            const removed = await plugin.remove(appName);
            results.set(name, removed);
          } catch (error) {
            Logger.debug(`Plugin ${name} removal failed: ${(error as Error).message}`);
            results.set(name, false);
          }
        }
      }
    }

    return results;
  }

  /**
   * Enable/disable plugin
   */
  setPluginEnabled(pluginName: string, enabled: boolean): void {
    const config = this.pluginConfigs.get(pluginName);
    if (config) {
      config.enabled = enabled;
      Logger.info(`Plugin ${pluginName} ${enabled ? 'enabled' : 'disabled'}`);
    }
  }

  /**
   * Get plugin configuration
   */
  getPluginConfig(pluginName: string): PluginConfig | null {
    return this.pluginConfigs.get(pluginName) || null;
  }

  /**
   * Update plugin configuration
   */
  updatePluginConfig(pluginName: string, config: Partial<PluginConfig>): void {
    const existing = this.pluginConfigs.get(pluginName);
    if (existing) {
      this.pluginConfigs.set(pluginName, { ...existing, ...config });
    }
  }

  /**
   * Get plugin info
   */
  getPluginInfo(pluginName: string): PluginInfo | null {
    const plugin = this.plugins.get(pluginName);
    return plugin?.getInfo() || null;
  }

  /**
   * List all plugins with info
   */
  listPlugins(): PluginInfo[] {
    return Array.from(this.plugins.values()).map((p) => p.getInfo());
  }
}
