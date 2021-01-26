import { PlatformLike } from "../../utils/types";

export class Platform implements PlatformLike {
	loadGameConfiguration(_url: string, _callback: (err: any, configuration: any) => void): void {
		throw new Error("not implemented");
	}
}
