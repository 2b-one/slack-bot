import { ClassType, serviceContainer } from '../services/ServiceContainer'

/**
 * Primary dependency injection tool. Allows to inject service of specified
 * type to the class property.
 *
 * @example
 * // AuthService is a constructor of the service to be injected
 * // for sanity sake all injected members should be private and readonly
 * class MyNewShinyClass {
 *   @inject
 *   private readonly authService!: AuthService
 * }
 */
export const inject: PropertyDecorator = (target: any, propertyKey: string | symbol) => {
  const PropertyClass = Reflect.getMetadata('design:type', target, propertyKey)
  injectSafe(() => PropertyClass)(target, propertyKey)
}

/**
 * Spare injection tool. Should only be used if injected service depends
 * on class you're injecting it to.
 *
 * @param {Function} classGetter
 *
 * @example
 * // MyOtherService depends on MyNewShinyClass
 * class MyNewShinyClass {
 *   @injectSafe(() => MyOtherService)
 *   private readonly otherService!: MyOtherService
 * }
 */
export function injectSafe(classGetter: () => ClassType<any>) {
  return (target: any, propertyKey: string | symbol) => {
    let service: any
    Object.defineProperty(target, propertyKey, {
      get: () => {
        if (!service) {
          const classConstructor = classGetter()

          if (!classConstructor) {
            throw new Error(
              `Unable to inject service into property ${target.constructor.name}#${String(
                propertyKey,
              )}. Service class is undefined. Cyclic dependency?.`,
            )
          } else {
            service = serviceContainer.get(classConstructor)
          }
        }

        return service
      },
      enumerable: false,
    })
  }
}
