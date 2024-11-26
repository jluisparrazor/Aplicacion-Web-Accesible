import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({
  providedIn: 'root',
})
export class ArasaacService {
  private baseUrl: string = 'https://api.arasaac.org/api';

  constructor() {}

  async getPictograms(keyword: string): Promise<any> {
    try {
      const response = await axios.get(`${this.baseUrl}/pictograms/es/search/${keyword}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching pictograms', error);
      throw error;
    }
  }

  getPictogramImageUrl(pictogram: any): string {
    return `https://api.arasaac.org/api/pictograms/${pictogram._id}`;
  }
}
