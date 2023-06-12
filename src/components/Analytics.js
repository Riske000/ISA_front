import React, { useEffect, useState } from 'react';
import { FlexibleXYPlot, VerticalBarSeries, XAxis, YAxis,XYPlot, DiscreteColorLegend  } from 'react-vis';
import { FcAbout } from 'react-icons/fc';
import axios from 'axios';
import '../css/Analytics.css';

const Analytics = () => {
  const [averageRating, setAverageRating] = useState(0);
  const [medicalCenterId, setMedicalCenterId] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [centerName, setCenterName] = useState('');
  const [termCountsData, setTermCountsData] = useState([]);
  const [expandedGraphs, setExpandedGraphs] = useState([]);
  const [tickValues, setTickValues] = useState([]);
  const [termCountsByQuarters, setTermCountsByQuarters] = useState({});
  const [termCountsByQuartersData, setTermCountsByQuartersData] = useState([]);
  const [termCountsByYears, setTermCountsByYears] = useState({}); 
  const [termCountsByYearsData, setTermCountsByYearsData] = useState([]); 
  const [equipmentData, setEquipmentData] = useState([]); 
  const [equipmentQuarterData, setEquipmentQuarterData] = useState([]);
  const [equipmentYearData, setEquipmentYearData] = useState([]);
  const [bloodData, setBloodData] = useState([]);
  const [bloodQuarterData, setBloodQuarterData] = useState([]);
  const [yearlyBloodData, setYearlyBloodData] = useState([]);


  const handleIconClick = (index) => {
    setExpandedGraphs((prevExpandedGraphs) => {
      const updatedExpandedGraphs = [...prevExpandedGraphs];
      updatedExpandedGraphs[index] = !updatedExpandedGraphs[index];
      return updatedExpandedGraphs;
    });
  };
  
  const fetchUserDetails = async (token, userId) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/user/${userId}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      });

      if (response.data.medicalCenter) {
        const centerId = response.data.medicalCenter.id;
        setMedicalCenterId(centerId);
        fetchData(centerId);
      } else {
        setErrorMessage('You are not assigned to a medical center.');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchData = async (centerId) => {
    try {
      const token = localStorage.getItem('token');
      const headers = {
        Authorization: token,
      };

      const response = await axios.get(`http://localhost:8080/api/medical/${centerId}`, {
        headers,
      });

      setCenterName(response.data.centerName);
      setAverageRating(response.data.averageRating);
    } catch (error) {
      console.error(error);
    }
  };

  const handleValueMouseOver = (datapoint, event) => {
    const { x, y } = datapoint;
    const tooltip = document.createElement('div');
    tooltip.className = 'graph-tooltip';
    tooltip.style.position = 'absolute';
    tooltip.style.top = `${event.pageY}px`;
    tooltip.style.left = `${event.pageX}px`;
    tooltip.innerHTML = `X: ${x}, Y: ${y}`;
    document.body.appendChild(tooltip);
  };

  const handleValueMouseOut = () => {
    const tooltip = document.querySelector('.graph-tooltip');
    if (tooltip) {
      document.body.removeChild(tooltip);
    }
  };

  const fetchTermCounts = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = {
        Authorization: token,
      };

      const response = await axios.get(`http://localhost:8080/api/term/counts?medicalCenterId=${medicalCenterId}`, {
        headers,
      });
      const termCounts = response.data;

      const data = Object.keys(termCounts).map((month, index) => ({
        x: month,
        y: termCounts[month],
        color: `rgb(${index * 30}, ${index * 50}, ${index * 70})`,
      }));

      data.sort((a, b) => {
        const monthOrder = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];
        return monthOrder.indexOf(a.x) - monthOrder.indexOf(b.x);
      });

      const maxTickValue = Math.max(...data.map((d) => d.y));

      setTermCountsData(data);
      setTickValues(getTickValues(maxTickValue));

      const responseQuarters = await axios.get(`http://localhost:8080/api/term/counts/quarters?medicalCenterId=${medicalCenterId}`, {
        headers,
      });
      const termCountsQuarters = responseQuarters.data;
      const termCountsByQuartersData = Object.keys(termCountsQuarters).map((quarter) => ({
        x: mapQuarterLabel(quarter),
        y: termCountsQuarters[quarter],
      }));

      setTermCountsByQuartersData(termCountsByQuartersData);
      setTermCountsByQuarters(termCountsQuarters);
      setTickValues(getTickValues(Math.max(...Object.values(termCountsQuarters))));

      const responseYears = await axios.get(`http://localhost:8080/api/term/counts/years?medicalCenterId=${medicalCenterId}`, {
        headers,
      });
      const termCountsYears = responseYears.data;
      const termCountsByYearsData = Object.keys(termCountsYears).map((year) => ({
        x: year,
        y: termCountsYears[year],
      }));

      setTermCountsByYearsData(termCountsByYearsData);
      setTermCountsByYears(termCountsYears);
    } catch (error) {
      console.error(error);
    }
  };

  const getTickValues = (maxTickValue) => {
    if (maxTickValue <= 10) {
      return [...Array(maxTickValue + 1).keys()];
    } else {
      const step = Math.ceil(maxTickValue / 10);
      return [...Array(11).keys()].map((index) => index * step);
    }
  };

  const mapQuarterLabel = (quarter) => {
    const quartersLabels = {
      Q1: 'JAN-MAR',
      Q2: 'APR-JUN',
      Q3: 'JUL-SEP',
      Q4: 'OCT-DEC',
    };
    return quartersLabels[quarter] || quarter;
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const userMedicalCenterId = localStorage.getItem('medicalCenterId');

    const fetchDataAndTermCounts = async () => {
      if (userMedicalCenterId) {
        setMedicalCenterId(userMedicalCenterId);
        await fetchData(userMedicalCenterId);
      } else {
        await fetchUserDetails(token, userId);
      }
    };

    fetchDataAndTermCounts();
  }, []);

  useEffect(() => {
    if (medicalCenterId) {
      fetchTermCounts();
    }
  }, [medicalCenterId]);

  const fetchEquipmentCounts = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = {
        Authorization: token,
      };

      const response = await axios.get('http://localhost:8080/api/medical-equipment/monthly-equipment-count', {
        headers,
      });

      const equipmentCounts = response.data;
      const equipmentData = Object.keys(equipmentCounts).map((month) => {
        const { band_aids, dressings, needles } = equipmentCounts[month];
        return {
          x: month,
          band_aids,
          dressings,
          needles,
        };
      });

      setEquipmentData(equipmentData);
    } catch (error) {
      console.error(error);
    }
  };
  
  
  useEffect(() => {
    if (medicalCenterId) {
      fetchEquipmentCounts();
    }
  }, [medicalCenterId]);

  const renderEquipmentGraph = (isGraphExpanded) => {
    const equipmentTypes = ['band_aids', 'dressings', 'needles'];
  
    const equipmentDataCombined = equipmentData.map((dataPoint) => ({
      x: dataPoint.x,
      ...equipmentTypes.reduce((acc, type) => {
        acc[type] = dataPoint[type];
        return acc;
      }, {}),
    }));
  
    const colorPalette = ['#ff00009c', '#0ebe0e83', '#1bcfeb7d'];
  
    return (
      <div className={`graph-container ${isGraphExpanded ? 'expanded' : ''}`}>
        <h2>
          <FcAbout
            onClick={() => handleIconClick(4)}
            className={`expand-icon ${isGraphExpanded ? 'expanded' : ''}`}
          />
          Equipment Counts by Month
        </h2>
        {isGraphExpanded && (
          <div>
            <FlexibleXYPlot xType="ordinal" height={400} width={1300} margin={{ left: 50 }}>
              <XAxis title="" />
              <YAxis title="Count" />
              {equipmentTypes.map((equipmentType, index) => (
                <VerticalBarSeries
                  key={equipmentType}
                  data={equipmentDataCombined.map((dataPoint) => ({
                    x: dataPoint.x,
                    y: dataPoint[equipmentType],
                  }))}
                  color={colorPalette[index]} 
                />
              ))}
            </FlexibleXYPlot>
            <DiscreteColorLegend
              items={equipmentTypes.map((equipmentType, index) => ({
                title: equipmentType,
                color: colorPalette[index],
              }))}
            />
          </div>
        )}
      </div>
    );
  };

  const fetchEquipmentByQuarterCount = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = {
        Authorization: token,
      };

      const response = await axios.get(
        'http://localhost:8080/api/medical-equipment/quarterly-equipment-count',
        {
          headers,
        }
      );

      const equipmentQuarterCounts = response.data;
      const equipmentQuarterData = Object.keys(equipmentQuarterCounts).map((quarter) => {
        const { band_aids, dressings, needles } = equipmentQuarterCounts[quarter];
        return {
          x: quarter,
          band_aids,
          dressings,
          needles,
        };
      });

      setEquipmentQuarterData(equipmentQuarterData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (medicalCenterId) {
      fetchEquipmentByQuarterCount();
    }
  }, [medicalCenterId]);

  const renderEquipmentQuarterGraph = (isGraphExpanded) => {
    const equipmentTypes = ['band_aids', 'dressings', 'needles'];

    const equipmentQuarterDataCombined = equipmentQuarterData.map((dataPoint) => ({
      x: dataPoint.x,
      ...equipmentTypes.reduce((acc, type) => {
        acc[type] = dataPoint[type];
        return acc;
      }, {}),
    }));

    const colorPalette = ['#ff00009c', '#0ebe0e83', '#1bcfeb7d'];

    return (
      <div className={`graph-container ${isGraphExpanded ? 'expanded' : ''}`}>
        <h2>
          <FcAbout
            onClick={() => handleIconClick(5)}
            className={`expand-icon ${isGraphExpanded ? 'expanded' : ''}`}
          />
          Equipment Counts by Quarter
        </h2>
        {isGraphExpanded && (
          <div>
            <FlexibleXYPlot xType="ordinal" height={400} width={800} margin={{ left: 50 }}>
              <XAxis title="" />
              <YAxis title="Count" />
              {equipmentTypes.map((equipmentType, index) => (
                <VerticalBarSeries
                  key={equipmentType}
                  data={equipmentQuarterDataCombined.map((dataPoint) => ({
                    x: dataPoint.x,
                    y: dataPoint[equipmentType],
                  }))}
                  color={colorPalette[index]}
                />
              ))}
            </FlexibleXYPlot>
            <DiscreteColorLegend
              items={equipmentTypes.map((equipmentType, index) => ({
                title: equipmentType,
                color: colorPalette[index],
              }))}
            />
          </div>
        )}
      </div>
    );
  };

  const fetchEquipmentByYearCount = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = {
        Authorization: token,
      };
  
      const response = await axios.get(
        'http://localhost:8080/api/medical-equipment/yearly-equipment-count',
        {
          headers,
        }
      );
  
      const equipmentYearData = Object.keys(response.data).map((year) => {
        const equipmentCounts = response.data[year].split(', ');
        const equipmentData = {};
  
        equipmentCounts.forEach((count) => {
          const [type, value] = count.split(': ');
          equipmentData[type] = parseInt(value);
        });
  
        return {
          x: year,
          ...equipmentData,
        };
      });
  
      setEquipmentYearData(equipmentYearData);
    } catch (error) {
      console.error(error);
    }
  };
  
  useEffect(() => {
    if (medicalCenterId) {
      fetchEquipmentByYearCount();
    }
  }, [medicalCenterId]);
  
 

  const renderEquipmentYearGraph = (isGraphExpanded) => {
    const equipmentTypes = ['band_aids', 'dressings', 'needles'];

    const equipmentYearDataCombined = equipmentYearData.map((dataPoint) => ({
      x: dataPoint.x,
      ...equipmentTypes.reduce((acc, type) => {
        acc[type] = dataPoint[type];
        return acc;
      }, {}),
    }));

    const colorPalette = ['#ff00009c', '#0ebe0e83', '#1bcfeb7d'];

    return (
      <div className={`graph-container ${isGraphExpanded ? 'expanded' : ''}`}>
        <h2>
          <FcAbout
            onClick={() => handleIconClick(6)}
            className={`expand-icon ${isGraphExpanded ? 'expanded' : ''}`}
          />
          Equipment Counts by Year
        </h2>
        {isGraphExpanded && (
          <div>
            <XYPlot xType="ordinal" height={400} width={800} margin={{ left: 50 }}>
              <XAxis title="" />
              <YAxis title="Count" />
              {equipmentTypes.map((equipmentType, index) => (
                <VerticalBarSeries
                  key={equipmentType}
                  data={equipmentYearDataCombined.map((dataPoint) => ({
                    x: dataPoint.x,
                    y: dataPoint[equipmentType],
                  }))}
                  color={colorPalette[index]}
                />
              ))}
            </XYPlot>
            <DiscreteColorLegend
              items={equipmentTypes.map((equipmentType, index) => ({
                title: equipmentType,
                color: colorPalette[index],
              }))}
            />
          </div>
        )}
      </div>
    );
  };

  const fetchBloodCounts = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = {
        Authorization: token,
      };
  
      const response = await axios.get(
        'http://localhost:8080/api/blood-supply/monthly-blood-count',
        {
          headers,
        }
      );      const bloodCounts = response.data;

      const bloodData = Object.keys(bloodCounts).map((month) => {
        const { given, taken } = bloodCounts[month];
        return {
          x: month,
          given,
          taken,
        };
      });

      setBloodData(bloodData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchBloodCounts();
  }, []);

  const renderBloodGraph = (isGraphExpanded) => {
    const bloodTypes = ['given', 'taken'];

    const bloodDataCombined = bloodData.map((dataPoint) => ({
      x: dataPoint.x,
      ...bloodTypes.reduce((acc, type) => {
        acc[type] = dataPoint[type];
        return acc;
      }, {}),
    }));

    const colorPalette = ['#ff00009c', '#0ebe0e83'];

    return (
      <div className={`graph-container ${isGraphExpanded ? 'expanded' : ''}`}>
        <h2>
          <FcAbout
            onClick={() => handleIconClick(7)}
            className={`expand-icon ${isGraphExpanded ? 'expanded' : ''}`}
          />
          Blood Counts by Month
        </h2>
        {isGraphExpanded && (
          <div>
            <FlexibleXYPlot xType="ordinal" height={400} width={1300} margin={{ left: 50 }}>
              <XAxis title="" />
              <YAxis title="Liter" />
              {bloodTypes.map((bloodType, index) => (
                <VerticalBarSeries
                  key={bloodType}
                  data={bloodDataCombined.map((dataPoint) => ({
                    x: dataPoint.x,
                    y: dataPoint[bloodType],
                  }))}
                  color={colorPalette[index]}
                />
              ))}
            </FlexibleXYPlot>
            <DiscreteColorLegend
              items={bloodTypes.map((bloodType, index) => ({
                title: bloodType,
                color: colorPalette[index],
              }))}
            />
          </div>
        )}
      </div>
    );
  };

  const fetchQuarterlyBloodCounts = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = {
        Authorization: token,
      };
  
      const response = await axios.get(
        'http://localhost:8080/api/blood-supply/quarterly-blood-count',
        {
          headers,
        }
      );
  
      const bloodQuarterCounts = response.data;
      const bloodQuarterData = Object.keys(bloodQuarterCounts).map((quarter) => {
        const { given, taken } = bloodQuarterCounts[quarter];
        return {
          x: quarter,
          given,
          taken,
        };
      });
  
      setBloodQuarterData(bloodQuarterData);
    } catch (error) {
      console.error(error);
    }
  };
  
  useEffect(() => {
    if (medicalCenterId) {
      fetchQuarterlyBloodCounts();
    }
  }, [medicalCenterId]);
  
  const renderQuarterlyBloodGraph = (isGraphExpanded) => {
    const bloodTypes = ['given', 'taken'];
  
    const bloodQuarterDataCombined = bloodQuarterData.map((dataPoint) => ({
      x: dataPoint.x,
      ...bloodTypes.reduce((acc, type) => {
        acc[type] = dataPoint[type];
        return acc;
      }, {}),
    }));
  
    const colorPalette = ['#ff00009c', '#0ebe0e83'];
  
    return (
      <div className={`graph-container ${isGraphExpanded ? 'expanded' : ''}`}>
        <h2>
          <FcAbout
            onClick={() => handleIconClick(8)}
            className={`expand-icon ${isGraphExpanded ? 'expanded' : ''}`}
          />
          Blood Counts by Quarter
        </h2>
        {isGraphExpanded && (
          <div>
            <FlexibleXYPlot xType="ordinal" height={400} width={800} margin={{ left: 50 }}>
              <XAxis title="" />
              <YAxis title="Liter" />
              {bloodTypes.map((bloodType, index) => (
                <VerticalBarSeries
                  key={bloodType}
                  data={bloodQuarterDataCombined.map((dataPoint) => ({
                    x: dataPoint.x,
                    y: dataPoint[bloodType],
                  }))}
                  color={colorPalette[index]}
                />
              ))}
            </FlexibleXYPlot>
            <DiscreteColorLegend
              items={bloodTypes.map((bloodType, index) => ({
                title: bloodType,
                color: colorPalette[index],
              }))}
            />
          </div>
        )}
      </div>
    );
  };

  const fetchYearlyBloodCounts = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = {
        Authorization: token,
      };
  
      const response = await axios.get(
        'http://localhost:8080/api/blood-supply/yearly-blood-count',
        {
          headers,
        }
      );
  
      const yearlyBloodData = Object.keys(response.data).map((year) => {
        const bloodCounts = response.data[year].split(', ');
        const bloodData = {};
  
        bloodCounts.forEach((count) => {
          const [type, value] = count.split(': ');
          bloodData[type] = parseFloat(value);
        });
  
        return {
          x: year,
          ...bloodData,
        };
      });
  
      setYearlyBloodData(yearlyBloodData);
    } catch (error) {
      console.error(error);
    }
  };
  
  useEffect(() => {
    if (medicalCenterId) {
      fetchYearlyBloodCounts();
    }
  }, [medicalCenterId]);
  
  const renderYearlyBloodGraph = (isGraphExpanded) => {
    const bloodTypes = ['given', 'taken'];
  
    const yearlyBloodDataCombined = yearlyBloodData.map((dataPoint) => ({
      x: dataPoint.x,
      ...bloodTypes.reduce((acc, type) => {
        acc[type] = dataPoint[type];
        return acc;
      }, {}),
    }));
  
    const colorPalette = ['#ff00009c', '#0ebe0e83'];
  
    return (
      <div className={`graph-container ${isGraphExpanded ? 'expanded' : ''}`}>
        <h2>
          <FcAbout
            onClick={() => handleIconClick(9)}
            className={`expand-icon ${isGraphExpanded ? 'expanded' : ''}`}
          />
          Blood Counts by Year
        </h2>
        {isGraphExpanded && (
          <div>
            <XYPlot xType="ordinal" height={400} width={800} margin={{ left: 50 }}>
              <XAxis title="" />
              <YAxis title="Liter" />
              {bloodTypes.map((bloodType, index) => (
                <VerticalBarSeries
                  key={bloodType}
                  data={yearlyBloodDataCombined.map((dataPoint) => ({
                    x: dataPoint.x,
                    y: dataPoint[bloodType],
                  }))}
                  color={colorPalette[index]}
                />
              ))}
            </XYPlot>
            <DiscreteColorLegend
              items={bloodTypes.map((bloodType, index) => ({
                title: bloodType,
                color: colorPalette[index],
              }))}
            />
          </div>
        )}
      </div>
    );
  };
  

  const renderGraph = (index, title, data, height, width) => {
    const isGraphExpanded = expandedGraphs[index];
    let tickValues = index === 0 ? [0] : [];

    if (Array.isArray(data) && data.length > 0) {
      const maxRating = Math.max(...data.map((dataPoint) => dataPoint.y));
      tickValues = index === 0 ? [0, maxRating] : getTickValues(maxRating);
    }

    return (
      <div key={index} className={`graph-container ${isGraphExpanded ? 'expanded' : ''}`}>
        <h2>
          <FcAbout
            onClick={() => handleIconClick(index)}
            className={`expand-icon ${isGraphExpanded ? 'expanded' : ''}`}
          />
          {title}
        </h2>
        {isGraphExpanded && (
          <FlexibleXYPlot xType="ordinal" height={height} width={width} margin={{ left: 50 }}>
            <XAxis title="" />
            <YAxis
              tickFormat={(value) => value.toFixed(1)}
              tickValues={tickValues}
              title="Number"
            />
            {Array.isArray(data) ? (
              data.map((dataPoint, i) => (
                <VerticalBarSeries
                  key={i}
                  className="bar-series"
                  data={[dataPoint]}
                  color={dataPoint.color}
                  onValueMouseOver={(datapoint, event) => handleValueMouseOver(datapoint, event)}
                  onValueMouseOut={handleValueMouseOut}
                />
              ))
            ) : (
              <p>No data available.</p>
            )}
          </FlexibleXYPlot>
        )}
      </div>
    );
  };

  return (
    <div className="analytics-container">
      {errorMessage ? (
        <p>{errorMessage}</p>
      ) : (
        <div>
          {renderGraph(0, 'Average Rating', [{ x: centerName, y: averageRating }], 400, 400)}
          {renderGraph(1, 'Term Counts by Months', termCountsData, 400, 1300)}
          {renderGraph(2, 'Term Counts by Quarters', termCountsByQuartersData, 400, 800)}
          {renderGraph(3, 'Term Counts by Years', termCountsByYearsData, 400, 800)}
          {renderEquipmentGraph(expandedGraphs[4])}
          {renderEquipmentQuarterGraph(expandedGraphs[5])}
          {renderEquipmentYearGraph(expandedGraphs[6])}
          {renderBloodGraph(expandedGraphs[7])}
          {renderQuarterlyBloodGraph(expandedGraphs[8])}
          {renderYearlyBloodGraph(expandedGraphs[9])}
        </div>
      )}
    </div>
  );
};

export default Analytics;






