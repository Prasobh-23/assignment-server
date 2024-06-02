export class ResponseData<T> {
    success: boolean;
    message: string;
    data: T[];
    status: number;
    count: number

    constructor(success: boolean, message: string, data: T[], status: number, count: number) {
        this.success = success;
        this.message = message;
        this.data = data;
        this.status = status;
        this.count = count;
    }
}