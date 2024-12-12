import { read, utils } from 'xlsx';
import { ParsedData, BarData } from '../types/DataTypes';

export const parseExcelFile = async (file: File): Promise<ParsedData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = utils.sheet_to_json(worksheet, { header: 1 });

        const headers = jsonData[0] as string[];
        const labels = headers.slice(3);
        
        const parsedData: BarData[] = [];
        
        for (let i = 1; i < jsonData.length; i++) {
          const row = jsonData[i] as any[];
          parsedData.push({
            label: row[0],
            image: row[1],
            color: row[2],
            values: row.slice(3).map(Number)
          });
        }

        resolve({
          labels,
          data: parsedData
        });
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsArrayBuffer(file);
  });
}