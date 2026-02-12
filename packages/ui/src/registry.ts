import type React from 'react';
import type { ComponentMeta } from '@mpstack/schema';

export interface RegistryEntry {
  component: React.ComponentType<any>;
  meta: ComponentMeta;
}

class ComponentRegistry {
  private registry = new Map<string, RegistryEntry>();

  register(type: string, component: React.ComponentType<any>, meta: ComponentMeta): void {
    if (this.registry.has(type)) {
      console.warn(`[ComponentRegistry] Component "${type}" is already registered. Overwriting.`);
    }
    this.registry.set(type, { component, meta });
  }

  getComponent(type: string): React.ComponentType<any> | undefined {
    return this.registry.get(type)?.component;
  }

  getMeta(type: string): ComponentMeta | undefined {
    return this.registry.get(type)?.meta;
  }

  getAllMeta(): ComponentMeta[] {
    return Array.from(this.registry.values()).map((entry) => entry.meta);
  }

  getMetaByGroup(group: string): ComponentMeta[] {
    return this.getAllMeta().filter((meta) => meta.group === group);
  }

  has(type: string): boolean {
    return this.registry.has(type);
  }

  getRegisteredTypes(): string[] {
    return Array.from(this.registry.keys());
  }
}

export const componentRegistry = new ComponentRegistry();
