import { makeAutoObservable, runInAction } from 'mobx';

export interface WorkType {
  id: number;
  name: string;
  nameGt5: string;
  nameLt5: string;
  nameOne: string;
}

export interface Shift {
  id: string;
  logo: string;
  address: string;
  companyName: string;
  dateStartByCity: string;
  timeStartByCity: string;
  timeEndByCity: string;
  currentWorkers: number;
  planWorkers: number;
  workTypes: WorkType[];
  priceWorker: number;
  bonusPriceWorker: number;
  customerFeedbacksCount: string; 
  customerRating: number;
  isPromotionEnabled: boolean;
}

class ShiftStore {
  shifts: Shift[] = [];
  loading: boolean = false;
  error: string = '';
  selectedShift: Shift | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  async fetchShifts(latitude: number, longitude: number) {
    this.loading = true;
    this.error = '';
    try {
      const response = await fetch(
        `https://mobile.handswork.pro/api/shifts/map-list-unauthorized?latitude=${latitude}&longitude=${longitude}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      runInAction(() => {
        this.shifts = data.data || [];
        this.loading = false;
      });
    } catch (e: any) {
      runInAction(() => {
        this.error = e.message || 'Неизвестная ошибка';
        this.loading = false;
      });
    }
  }

  selectShift(shift: Shift) {
    this.selectedShift = shift;
  }

  clearSelectedShift() {
    this.selectedShift = null;
  }
}

export const shiftStore = new ShiftStore();