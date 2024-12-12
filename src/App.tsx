import React, { useState } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { Upload } from 'lucide-react';
import { ParsedData } from './types/DataTypes';
import { parseExcelFile } from './utils/excelParser';
import { BarChart } from './components/BarChart';
import { DataTable } from './components/DataTable';

function App() {
  const [data, setData] = useState<ParsedData | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const parsedData = await parseExcelFile(file);
        setData(parsedData);
        setCurrentIndex(0);
        setIsPlaying(false);
      } catch (error) {
        console.error('Error parsing file:', error);
        alert('Error parsing file. Please check the format and try again.');
      }
    }
  };

  const togglePlay = () => {
    if (!data) return;
    
    if (!isPlaying) {
      setIsPlaying(true);
      const interval = setInterval(() => {
        setCurrentIndex((prev) => {
          if (prev >= data.labels.length - 1) {
            clearInterval(interval);
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1500);
    } else {
      setIsPlaying(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold mb-6">Animated Bar Chart Race</h1>
          
          <div className="mb-8">
            <label className="flex items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Upload className="w-6 h-6 mr-2" />
              <span>Upload Excel File</span>
            </label>
          </div>

          {data && (
            <>
              <div className="mb-4 flex items-center gap-4">
                <button
                  onClick={togglePlay}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  {isPlaying ? 'Pause' : 'Play'}
                </button>
                <span className="font-bold">{data.labels[currentIndex]}</span>
              </div>

              <Tabs>
                <TabList className="flex border-b mb-4">
                  <Tab className="px-4 py-2 cursor-pointer border-b-2 border-transparent hover:border-blue-500">
                    Chart
                  </Tab>
                  <Tab className="px-4 py-2 cursor-pointer border-b-2 border-transparent hover:border-blue-500">
                    Data
                  </Tab>
                </TabList>

                <TabPanel>
                  <BarChart data={data} currentIndex={currentIndex} />
                </TabPanel>
                <TabPanel>
                  <DataTable data={data} />
                </TabPanel>
              </Tabs>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;