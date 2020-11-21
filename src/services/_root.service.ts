import { Response } from "express";
import { Document } from 'mongoose';

export enum Status {
    SUCCESS,
    CREATED,
    FAILED_VALIDATION,
    UN_AUTHORIZED,
    ERROR,
    NOT_FOUND,
    PRECONDITION_FAILED,
    SUCCESS_NO_CONTENT,
    FORBIDDEN,
    UNPROCESSABLE_ENTRY
}

export class RootService {
    public jsonize(data: Document) {
        return data.toJSON()
    }
    public sendResponse(serviceResponse: {status: Status , data: any}, res: Response): any {        
        var response = {
            status: this.getStatusString(serviceResponse.status),
            data: serviceResponse.data
        }
        console.log('responding with', response.status);
        res.status(this.getHttpStatus(response.status)).json(response);
    }
    private getHttpStatus(status: any): number {
        switch (status) {
            case 'SUCCESS':
                return 200;
            case 'CREATED':
                return 201;
            case 'SUCCESS_NO_CONTENT':
                return 204;
            case 'FAILED_VALIDATION':
                return 400;
            case 'UN_AUTHORIZED':
                return 401;
            case 'FORBIDDEN':
                return 403;
            case 'NOT_FOUND':
                return 404;
            case 'CONFLICT':
                return 409;
            case 'UNPROCESSABLE_ENTRY':
                return 422;
            case 'UNATHORIZED':
                return 401;
            case 'PRECONDITION_FAILED':
                return 412;
            default:
                return 500;
        }
    }
    private getStatusString(status) {              
        return Status[status];
    }
}