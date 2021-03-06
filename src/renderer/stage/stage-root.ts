import { Component } from "../scriptable/component";
import { Entity } from "../scriptable/entity";
import { Transform } from "../transform";

/**
 * The root of the Scene-Graph or on this case, Stage-Graph. All root objects
 * have StageRoot as a parent
 */
export class StageRoot extends Entity {

    constructor() {
        super({
            visibility: true,
            autoCreate: false
        });
    }

    protected update(dt: number) {
        if (this.visibility) {
            const childObjects: Array<Entity> = this.children;
            const len: number = childObjects.length;

            if (len > 0) {
                // normal loop so we don't get concurrent modification problems
                for (let i = 0; i < len; i++) {
                    const entity: Entity = childObjects[i];

                    if (entity && entity.visibility) {
                        // recursively run update on all children
                        this.recurseUpdate(entity, dt);
                    }
                }

                // update all the transforms
                for (let i = 0; i < len; i++) {
                    const entity: Entity = childObjects[i];

                    if (entity && entity.visibility) {
                        // recursively update all children object transforms
                        this.recurseUpdateTransforms(entity, this.transform);
                    }
                }

                // update all components
                for (let i = 0; i < len; i++) {
                    const entity: Entity = childObjects[i];

                    if (entity && entity.visibility) {
                        // recursively update all children object components
                        this.recurseUpdateComponents(entity, dt);
                    }
                }
            }
        }
    }

    protected lateUpdate(dt: number) {
        if (this.visibility) {
            const childObjects: Array<Entity> = this.children;
            const len: number = childObjects.length;

            if (len > 0) {
                // normal loop so we don't get concurrent modification problems
                for (let i = 0; i < len; i++) {
                    const entity: Entity = childObjects[i];

                    if (entity && entity.visibility) {
                        // recursively run update on all children
                        this.recurseLateUpdate(entity, dt);
                    }
                }
            }
        }
    }

    private recurseUpdate(entity: Entity, dt: number) {
        const result: Error | undefined = entity._execUpdate(dt);

        if (result !== undefined) {
            throw result;
        }

        const childObjects: Array<Entity> = entity.children;
        const len: number = childObjects.length;

        if (len > 0) {
            // normal loop so we don't get concurrent modification problems
            for (let i = 0; i < len; i++) {
                const entity: Entity = childObjects[i];

                if (entity && entity.visibility) {
                    // recursively run update on all children
                    this.recurseUpdate(entity, dt);
                }
            }
        }
    }

    private recurseLateUpdate(entity: Entity, dt: number) {
        const result: Error | undefined = entity._execLateUpdate(dt);

        if (result !== undefined) {
            throw result;
        }

        const childObjects: Array<Entity> = entity.children;
        const len: number = childObjects.length;

        if (len > 0) {
            // normal loop so we don't get concurrent modification problems
            for (let i = 0; i < len; i++) {
                const entity: Entity = childObjects[i];

                if (entity && entity.visibility) {
                    // recursively run update on all children
                    this.recurseLateUpdate(entity, dt);
                }
            }
        }
    }

    private recurseUpdateTransforms(child: Entity, parent: Transform) {
        child.transform.apply(parent);

        const childObjects: Array<Entity> = child.children;
        const len: number = childObjects.length;

        if (len > 0) {
            // normal loop so we don't get concurrent modification problems
            for (let i = 0; i < len; i++) {
                const entity: Entity = childObjects[i];

                if (entity && entity.visibility) {
                    // recursively update all children transforms
                    this.recurseUpdateTransforms(entity, child.transform);
                }
            }
        }
    }

    private recurseUpdateComponents(child: Entity, dt: number) {
        const components: Array<Component> = child.components;
        const len: number = components.length;

        if (len > 0) {
            // normal loop so we don't get concurrent modification problems
            for (let i = 0; i < len; i++) {
                const component: Component = components[i];

                if (component) {
                    // recursively update all children transforms
                    component.update(dt);
                }
            }
        }

        const childObjects: Array<Entity> = child.children;
        const clen: number = childObjects.length;

        if (clen > 0) {
            // normal loop so we don't get concurrent modification problems
            for (let i = 0; i < clen; i++) {
                const entity: Entity = childObjects[i];

                if (entity && entity.visibility) {
                    // recursively update all children components
                    this.recurseUpdateComponents(entity, dt);
                }
            }
        }
    }

    /**
     * Make sure engine does not accidentally break, root cannot have a parent
     */
    public set parent(newParent: Entity | undefined) {
        throw new Error("set StageRoot.parent - cannot modify property for root object");
    }

    /**
     * Return this as the root object
     */
    public get isRoot(): boolean {
        return true;
    }
}