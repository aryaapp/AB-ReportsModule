export class transportOptions{
    private level:string;

    constructor(level: string) {
        this.level = level;
    }

    public getLevel(): string {
        return this.level;
    }

    public setLevel(level: string):void {
        this.level = level;
    }
}