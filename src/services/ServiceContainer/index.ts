//type AbstractClassType<T> = Function & { prototype: T }
export type ClassType<T> = { new (...args: any[]): T }

export class ServiceContainer {
  private services: { [key: string]: any } = {}

  register<T>(serviceName: string, instance: T) {
    this.services[serviceName] = instance
  }

  get<T>(ServiceClass: ClassType<T>): T {
    if (ServiceClass === undefined) {
      throw new Error(
        `Unable to retrieve service of undefined class. 'Possible circular dependency, try using @injectSafe(() => ServiceClassName).'`,
      )
    }

    const result = Object.entries(this.services).find(
      ([, service]: any) => service instanceof ServiceClass,
    )
    if (!result) {
      throw new Error(`Service "${ServiceClass.name}" is not registered.`)
    }

    return result?.[1]
  }
}

export const serviceContainer = new ServiceContainer()
