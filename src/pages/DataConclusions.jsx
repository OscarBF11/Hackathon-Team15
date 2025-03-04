import { useState, useEffect } from 'react';
import '../styles/DataConclusions.css';

// Component to display heatmap visualizations
const HeatMap = ({ data, title }) => {
  return (
    <div className="heatmap-container">
      <h3>{title}</h3>
      <div className="heatmap-visual">
        {/* Placeholder for actual heatmap visualization */}
        <div className="heatmap-placeholder">
          <p>Heatmap Visualization</p>
          <p>Data points: {data.length}</p>
        </div>
      </div>
    </div>
  );
};

// Component to display timeline visualizations
const Timeline = ({ data, title }) => {
  return (
    <div className="timeline-container">
      <h3>{title}</h3>
      <div className="timeline-visual">
        {/* Placeholder for actual timeline visualization */}
        <div className="timeline-placeholder">
          <p>Timeline Visualization</p>
          <p>Time periods: {data.length}</p>
        </div>
      </div>
    </div>
  );
};

const DataConclusions = ({ 
  conclusionsData, 
  type, 
  category,
  title,
  description
}) => {
  const [visualizationType, setVisualizationType] = useState(null);
  
  useEffect(() => {
    // Determine visualization type based on input parameters
    if (type === 1) {
      // General Analysis - Tourism
      setVisualizationType('heatmap');
    } else if (type === 2) {
      // Specific Location
      setVisualizationType('timeline-heatmap');
    } else if (type === 3) {
      // Multiple Specific Locations
      setVisualizationType('timeline-heatmap-multiple');
    }
  }, [type]);

  const renderAnalysisType = () => {
    let analysisType = "";
    
    switch(type) {
      case 1:
        analysisType = "General Analysis";
        break;
      case 2:
        analysisType = "Analysis of a Specific Location";
        break;
      case 3:
        analysisType = "Analysis of Multiple Specific Locations";
        break;
      default:
        analysisType = "Unknown Analysis Type";
    }
    
    return analysisType;
  };

  const renderVisualization = () => {
    if (!conclusionsData || conclusionsData.length === 0) {
      return <div className="no-data">No data available for visualization</div>;
    }

    switch (visualizationType) {
      case 'heatmap':
        return (
          <div className="visualization-container">
            <HeatMap data={conclusionsData} title="Crowd Density Heatmap" />
            <div className="analysis-purpose">
              <h4>Purpose:</h4>
              <p>Analyze specific events or crowds in the tourism sector, identifying hotspots and peak times.</p>
            </div>
          </div>
        );
      case 'timeline-heatmap':
        return (
          <div className="visualization-container">
            <Timeline data={conclusionsData} title="Seasonal Trends" />
            <HeatMap data={conclusionsData} title="Location Density" />
            <div className="analysis-purpose">
              <h4>Purpose:</h4>
              <p>Determine the best times of the year and business opportunities for rentals and pricing based on real attendance data by season. Useful for understanding which areas of specific events are most crowded.</p>
            </div>
          </div>
        );
      case 'timeline-heatmap-multiple':
        return (
          <div className="visualization-container">
            <Timeline data={conclusionsData} title="Comparative Seasonal Trends" />
            <HeatMap data={conclusionsData} title="Multiple Locations Density" />
            <div className="analysis-purpose">
              <h4>Purpose:</h4>
              <p>Analyze multiple locations to understand patterns such as passenger flow in public transportation or crowd density at different beaches by season, helping to determine resource allocation and maintenance needs.</p>
            </div>
          </div>
        );
      default:
        return <div className="no-visualization">No visualization type selected</div>;
    }
  };

  return (
    <div className="data-conclusions-container">
      <div className="conclusions-header">
        <h1>{title || 'Data Analysis Conclusions'}</h1>
        <div className="analysis-metadata">
          <div className="type-category">
            <span className="label">Analysis Type:</span> {renderAnalysisType()}
          </div>
          <div className="type-category">
            <span className="label">Category:</span> {category}
          </div>
        </div>
        {description && (
          <div className="description">
            <p>{description}</p>
          </div>
        )}
      </div>

      <div className="conclusions-content">
        {renderVisualization()}
      </div>

      {conclusionsData && conclusionsData.insights && (
        <div className="conclusions-insights">
          <h2>Key Insights</h2>
          <ul>
            {conclusionsData.insights.map((insight, index) => (
              <li key={index}>{insight}</li>
            ))}
          </ul>
        </div>
      )}

      {conclusionsData && conclusionsData.recommendations && (
        <div className="conclusions-recommendations">
          <h2>Recommendations</h2>
          <ul>
            {conclusionsData.recommendations.map((recommendation, index) => (
              <li key={index}>{recommendation}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DataConclusions;