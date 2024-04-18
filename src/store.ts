import { JSONArray, JSONObject, JSONPrimitive } from "./json-types";

export type Permission = "r" | "w" | "rw" | "none";

export type StoreResult = Store | JSONPrimitive | undefined;

export type StoreValue =
  | JSONObject
  | JSONArray
  | StoreResult
  | (() => StoreResult);

export interface IStore {
  defaultPolicy: Permission;
  allowedToRead(key: string): boolean;
  allowedToWrite(key: string): boolean;
  read(path: string): StoreResult;
  write(path: string, value: StoreValue): StoreValue;
  writeEntries(entries: JSONObject): void;
  entries(): JSONObject;
}

export function Restrict(permission: Permission): MethodDecorator {
  return function (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      if (permission === "none") {
        throw new Error("No acess.");
      } else if (permission === "r" ) {
        throw new Error("Error Read access.");
      } else if (permission === "w") {
        throw new Error("Error Write access.");
      }

      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
}

export class Store implements IStore {
  defaultPolicy: Permission = "rw";

  allowedToRead(key: string): boolean {
    return this.defaultPolicy === "rw" || this.defaultPolicy === "r";
  }

  allowedToWrite(key: string): boolean {
    return this.defaultPolicy === "rw" || this.defaultPolicy === "w";
  }

  @Restrict("r")
  read(path: string): StoreResult {
    return null
  }

  @Restrict("w")
  write(path: string, value: StoreValue): StoreValue {
    return null
  }

  @Restrict("rw")
  writeEntries(entries: JSONObject): void {

  }

  @Restrict("rw")
  entries(): JSONObject {
    return {}
  }
}
