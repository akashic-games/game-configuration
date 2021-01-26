export interface PlatformLike {
	loadGameConfiguration(url: string, callback: (err: any, configuration: any) => void): void;
}
