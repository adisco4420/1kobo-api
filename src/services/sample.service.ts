import { Response, Request } from 'express';
import SampleController from '../controllers/sample.control';
import { RootService, Status } from './_root.service';
class SampleService extends RootService {
    create = async (req: Request, res: Response) => {
        try {
            const sample = await SampleController.create(req.body);
            this.sendResponse({status: Status.SUCCESS, data: sample}, res);
        } catch (error) {
            this.sendResponse({status: Status.ERROR, data: error}, res)
        } 
    }
    getAll = async (req: Request, res: Response) => {
        try {
            const samples = await SampleController.getAll(null, req.query)
            this.sendResponse({status: Status.SUCCESS, data: samples}, res);
        } catch (error) {
            this.sendResponse({status: Status.ERROR, data: error}, res)
        } 
    }
    getOne = async (req: Request, res: Response) => {
        try {
            const sample = await SampleController.getOne(req.query)
            this.sendResponse({status: Status.SUCCESS, data: sample}, res);
        } catch (error) {
            this.sendResponse({status: Status.ERROR, data: error}, res)
        } 
    }
    getById = async (req: Request, res: Response) => {
        try {            
            const sample = await SampleController.getById(req.params.id)
            this.sendResponse({status: Status.SUCCESS, data: sample}, res);
        } catch (error) {
            this.sendResponse({status: Status.ERROR, data: error}, res)
        } 
    }
    updateOne = async (req: Request, res: Response) => {
        try {            
            const sample = await SampleController.updateOne(req.query, req.body)
            if(sample.n) return this.sendResponse({status: Status.SUCCESS, data: sample}, res);
            this.sendResponse({status: Status.UNPROCESSABLE_ENTRY, data: 'data not updated'}, res)
        } catch (error) {
            this.sendResponse({status: Status.ERROR, data: error}, res)
        } 
    }
    updateMany = async (req: Request, res: Response) => {
        try {                        
            const sample = await SampleController.updateMany(req.query, req.body)
            if(sample.n) return this.sendResponse({status: Status.SUCCESS, data: sample}, res);
            this.sendResponse({status: Status.UNPROCESSABLE_ENTRY, data: 'data not updated'}, res)
        } catch (error) {
            this.sendResponse({status: Status.ERROR, data: error}, res)
        } 
    }
    updateById = async (req: Request, res: Response) => {
        try {            
            const sample = await SampleController.updateById(req.params.id, req.body);
            if(sample) return this.sendResponse({status: Status.SUCCESS, data: sample}, res);
            this.sendResponse({status: Status.PRECONDITION_FAILED, data: 'data not updated'}, res)
        } catch (error) {
            this.sendResponse({status: Status.ERROR, data: error}, res)
        } 
    }
    deleteOne = async (req: Request, res: Response) => {
        try {            
            const sample = await SampleController.deleteOne(req.query)
            if(sample.n) return this.sendResponse({status: Status.SUCCESS_NO_CONTENT, data: sample}, res);
            this.sendResponse({status: Status.UNPROCESSABLE_ENTRY, data: 'data not deleted'}, res)
        } catch (error) {
            this.sendResponse({status: Status.ERROR, data: error}, res)
        } 
    }
    deleteMany = async (req: Request, res: Response) => {
        try {            
            const sample = await SampleController.deleteMany(req.query)
            if(sample.n) return this.sendResponse({status: Status.SUCCESS_NO_CONTENT, data: sample}, res);
            this.sendResponse({status: Status.UNPROCESSABLE_ENTRY, data: 'data not deleted'}, res)
        } catch (error) {
            console.log('error',error);
            this.sendResponse({status: Status.ERROR, data: error}, res)
        } 
    }
    deleteById = async (req: Request, res: Response) => {
        try {            
            const sample = await SampleController.deleteById(req.params.id);
            if(sample) return this.sendResponse({status: Status.SUCCESS_NO_CONTENT, data: sample}, res);
            this.sendResponse({status: Status.PRECONDITION_FAILED, data: 'data not deleted'}, res)
        } catch (error) {
            this.sendResponse({status: Status.ERROR, data: error}, res)
        } 
    }
    
}
export default new SampleService;