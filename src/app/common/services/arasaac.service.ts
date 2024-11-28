import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({
  providedIn: 'root',
})
export class ArasaacService {
  private baseUrl: string = 'https://api.arasaac.org/api';

  // numbersPictograms array contains pictogram IDs
  numbersPictograms: string[] = [
    "6972",  // 0
    "7291",  // 1
    "7027",  // 2
    "7283",  // 3
    "7005",  // 4
    "6979",  // 5
    "7241",  // 6
    "7248",  // 7
    "7189",  // 8
    "7188",  // 9
    "7025",  // 10
    "29260", // 11
    "29262", // 12
    "29264", // 13
    "29266", // 14
    "29268", // 15
    "29270", // 16
    "29272", // 17
    "29274", // 18
    "29276", // 19
    "29278", // 20
    "29280", // 21
    "29282", // 22
    "29284", // 23
    "29286", // 24
    "29288", // 25
    "29290", // 26
    "29292", // 27
    "29294", // 28
    "29296", // 29
    "29298"  // 30
  ];

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
