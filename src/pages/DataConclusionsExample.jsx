import { useState } from 'react';
import DataConclusions from './DataConclusions';
import '../styles/DataConclusionsExample.css';

const DataConclusionsExample = () => {
  // Sample data for different analysis types
  const [analysisType, setAnalysisType] = useState(1);
  const [category, setCategory] = useState('Tourism');

  // Sample data structure that would be passed from an API or parent component
  const sampleData = {
    tourism: {
      data: [
        { id: 1, value: 56, location: 'Beach', time: '2023-06-15' },
        { id: 2, value: 78, location: 'Downtown', time: '2023-06-15' },
        { id: 3, value: 45, location: 'Museum', time: '2023-06-15' },
        // ...more data points
      ],
      insights: [
        'Tourist hotspots are primarily concentrated in the downtown and beach areas',
        'Peak tourism hours are between 11 AM and 3 PM',
        'Weekend tourism is 35% higher than weekday tourism'
      ],
      recommendations: [
        'Increase public transportation options to downtown and beach areas during peak hours',
        'Consider implementing crowd management strategies at Museum during high season',
        'Develop marketing campaigns targeting off-peak hours to distribute tourist flow'
      ]
    },
    specificLocation: {
      data: [
        { id: 1, value: 56, location: 'Entrance', time: '2023-01-15' },
        { id: 2, value: 78, location: 'Main Hall', time: '2023-01-15' },
        { id: 3, value: 32, location: 'Exhibit A', time: '2023-01-15' },
        { id: 4, value: 64, location: 'Entrance', time: '2023-06-15' },
        { id: 5, value: 92, location: 'Main Hall', time: '2023-06-15' },
        { id: 6, value: 41, location: 'Exhibit A', time: '2023-06-15' },
        // ...more data points across different times
      ],
      insights: [
        'Summer attendance is 45% higher than winter attendance',
        'The Main Hall consistently experiences the highest visitor density',
        'Exhibit A sees less traffic than other areas regardless of season'
      ],
      recommendations: [
        'Adjust pricing strategy seasonally to optimize revenue during peak periods',
        'Implement crowd management in Main Hall during summer months',
        'Consider relocating popular exhibits to Exhibit A to better distribute visitors'
      ]
    },
    multipleLocations: {
      data: [
        { id: 1, value: 56, location: 'Beach A', time: '2023-06-15' },
        { id: 2, value: 78, location: 'Beach B', time: '2023-06-15' },
        { id: 3, value: 45, location: 'Beach C', time: '2023-06-15' },
        { id: 4, value: 34, location: 'Beach A', time: '2023-12-15' },
        { id: 5, value: 23, location: 'Beach B', time: '2023-12-15' },
        { id: 6, value: 12, location: 'Beach C', time: '2023-12-15' },
        // ...more data points
      ],
      insights: [
        'Beach B experiences the highest visitor numbers across all seasons',
        'Beach C has the lowest visitor count, particularly in winter',
        'All beaches show a 65% decrease in visitors during winter months'
      ],
      recommendations: [
        'Focus maintenance resources on Beach B year-round',
        'Consider seasonal repurposing of Beach C facilities during winter',
        'Implement targeted marketing for Beach A to distribute crowds from Beach B'
      ]
    }
  };

  // Get appropriate data based on selected type
  const getDataForAnalysisType = () => {
    switch(analysisType) {
      case 1:
        return {
          ...sampleData.tourism,
          length: sampleData.tourism.data.length
        };
      case 2:
        return {
          ...sampleData.specificLocation,
          length: sampleData.specificLocation.data.length
        };
      case 3:
        return {
          ...sampleData.multipleLocations,
          length: sampleData.multipleLocations.data.length
        };
      default:
        return { length: 0 };
    }
  };

  const getCategoryForType = () => {
    switch(analysisType) {
      case 1:
        return 'Tourism';
      case 2:
        return 'Specific location';
      case 3:
        return 'Multiple specific locations';
      default:
        return '';
    }
  };
  
  // Handle type change
  const handleTypeChange = (e) => {
    setAnalysisType(parseInt(e.target.value));
    setCategory(getCategoryForType());
  };

  return (
    <div className="data-conclusions-example">
      <div className="controls">
        <h2>Data Analysis Controls</h2>
        <div className="control-group">
          <label htmlFor="analysis-type">Analysis Type:</label>
          <select 
            id="analysis-type" 
            value={analysisType} 
            onChange={handleTypeChange}
          >
            <option value={1}>General Analysis</option>
            <option value={2}>Analysis of a Specific Location</option>
            <option value={3}>Analysis of Multiple Specific Locations</option>
          </select>
        </div>
        <div className="control-group">
          <label htmlFor="category">Category:</label>
          <input 
            type="text" 
            id="category" 
            value={category} 
            onChange={(e) => setCategory(e.target.value)} 
          />
        </div>
      </div>

      {/* Render the DataConclusions component with appropriate data */}
      <DataConclusions 
        // data={sampleData.tourism.data}
        conclusionsData={getDataForAnalysisType()}
        type={analysisType}
        category={category}
        title={`${getCategoryForType()} Analysis Results`}
        description="This analysis provides insights based on collected data patterns, helping to make informed decisions about resource allocation, crowd management, and business opportunities."
      />
    </div>
  );
};

export default DataConclusionsExample;