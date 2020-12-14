import { add , isFuture } from 'date-fns';
import { SavingsI } from '../interfaces/interface';
const maxDuration = {daily: 360, weekly: 48, monthly: 12};
export const planTypesUtil = {
    bronze: {
        rate: {daily: 0.166666, weekly: 1.25, monthly: 5},
        minAmount: 5000, minDuration: { daily: 120, weekly: 16, monthly: 4}, maxDuration: {...maxDuration}
    },
    silver: {
        rate: {daily: 0.25, weekly: 1.875, monthly: 7.5}, 
        minAmount: 15000, minDuration: {daily: 180, weekly: 24, monthly: 6}, maxDuration: {...maxDuration}
    },
    gold: {
        rate: {daily: 0.33333, weekly: 2.5, monthly: 10}, 
        minAmount: 30000, minDuration: {daily: 360, weekly: 48, monthly: 12}, maxDuration: {...maxDuration}
    } 
};
export const durationLists = {
    bronze: {
      daily: [120, 150, 180, 210, 240, 270, 300, 330, 360],
      weekly: [16, 20, 24, 28, 32, 36, 40, 44, 48],
      monthly: [4, 5, 6, 7, 8, 9, 10, 11, 12]
    },
    silver: {
      daily: [180, 210, 240, 270, 300, 330, 360],
      weekly: [24, 28, 32, 36, 40, 44, 48],
      monthly: [6, 7, 8, 9, 10, 11, 12]
    },
    gold: {
      daily: [360],
      weekly: [48],
      monthly: [12]
    }
  };
class DateUtils {
    getMaturityDate = (payload: SavingsI) => {
        const { frequency, duration, startDate } = payload;
        const time = frequency === 'daily' ? 'days' :  frequency === 'weekly' ? 'weeks' : 'months';
        const result = add(new Date(startDate), {[time]: duration, hours: 2});
        return new Date(result).getTime();
    }
}
class CalculateUtil {
    savingsInterest = (payload: SavingsI): number => {
        const {frequency, planType,  amount, duration} = payload;
        const rate = planTypesUtil[planType].rate[frequency] / 100;
        const durationRate = rate * duration;
        const interestRate = (durationRate * amount);
        return Math.round((interestRate + Number.EPSILON) * 100) / 100;
    }
    withdrawFee = ({planType}): number => {
        const fee = planType === 'gold' ? 0.01 : 0.015;
        return fee; 
    }
}
export const dateUtils =  new DateUtils();
export const calculateUtils = new CalculateUtil();
