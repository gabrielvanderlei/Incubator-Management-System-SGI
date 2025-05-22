'use client';
import { Chart, registerables } from 'chart.js';

import Content from "@/components/template/Content";
import Configuration from "@/services/lib/config";
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';

// TypeScript types for state and props
interface DashboardDataType {
  loading: boolean;
  dashboard: any[]; // Defina a estrutura do dashboard aqui
  indicatorData: any[]; // Defina a estrutura do indicatorData aqui
  datasetsData: any[]; // Defina a estrutura do datasetsData aqui
}

interface TableProps {
  dashboardData?: any[]; // Defina a estrutura do dashboard aqui
  indicatorData?: any[]; // Defina a estrutura do indicatorData aqui
  datasetsData?: any[]; // Defina a estrutura do datasetsData aqui
}

interface JsonDataTableProps {
  jsonData: any; // Defina a estrutura do jsonData aqui
  title: string;
}

const calculateAverage = (values) => {
  const total = values.reduce((acc, val) => acc + val, 0);
  return total / values.length;
}

export default function DashboardViewPage() {
  interface DashboardDataType {
    loading: boolean;
    dashboard: any[]; // Replace any[] with the specific type you expect
    indicatorData: any[]; // Replace any[] with the specific type you expect
    datasetsData: any[]; // Replace any[] with the specific type you expect
  }

  const [dashboardData, setDashboardData] = useState<DashboardDataType>({
    loading: true,
    dashboard: [],
    indicatorData: [],
    datasetsData: []
  });

  interface GraphDataType {
  labels: any;  // Consider using a more specific type here
  datasets: { label: any; data: any[]; borderWidth: number }[];
}

const [graphData, setGraphData] = useState<GraphDataType>({
  labels: [],  // Replace with your default value
  datasets: []  // Replace with your default value
});

  const searchParams = useSearchParams()
  const id = searchParams.get('id')

  const axiosConfig = () => {
    const token = localStorage.getItem('token');

    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  };

  let loadDashboard = function(dashboardId){
    axios.get(`${Configuration.backendEndpoint}/getDashboardData?id=${dashboardId}`, axiosConfig())
      .then(response => {
        setDashboardData(response.data)
      })
      .catch(error => alert(error));
  }

  useEffect(() => {
    Chart.register(...registerables);
    loadDashboard(id)
  }, []);

  const calculateIndicatorValue = (data, indicator) => {
    const formula = indicator.formulaParsed;
    const equivalentFields = indicator.equivalentFieldsParsed;
  
    const getFieldFromDataset = (fieldName) => {
      console.log({ fieldName, equivalentFields })
      const field = equivalentFields.find(f => f.FIELD_NAME === fieldName);
      return field ? field.DATASET_FIELD_NAME : null;
    };
  
    const evaluateFormula = (row, formula) => {
      let accumulator = 0;
      let nextOperator = null;
    
      for (const elem of formula) {
        const { TYPE, FUNCTION, VALUE1, VALUE2, VALUE3 } = elem;
        
        if (TYPE === "FIELD") {
          const datasetField = getFieldFromDataset(VALUE1);
          if (datasetField) {
            const fieldValue = parseFloat(row[datasetField]);
            if (isNaN(fieldValue)) {
              console.error(`Field value for ${datasetField} is not a number: ${row[datasetField]}`);
              return NaN;
            }
    
            if (nextOperator) {
              switch (nextOperator) {
                case "DIVISION":
                  if (fieldValue === 0) {
                    console.error("Division by zero.");
                    return NaN;
                  }
                  accumulator /= fieldValue;
                  break;
                // Add more operators here
                default:
                  console.error(`Operator ${nextOperator} not supported.`);
                  return NaN;
              }
              nextOperator = null; // Reset the operator
            } else {
              accumulator = fieldValue;
            }
          } else {
            console.error(`Field ${VALUE1} not found in dataset.`);
            return NaN;
          }
        } else if (TYPE === "OPERATOR") {
          nextOperator = FUNCTION;
        }
      }
    
      if (nextOperator) {
        console.error("Last element in formula is an operator, which is not allowed.");
        return NaN;
      }
    
      return accumulator;
    };
  
    const results = [];
    for (const row of data) {
      try {
        const result = evaluateFormula(row, formula);
        if (!isNaN(result)) {
          results.push(result);
        } else {
          console.warn(`Skipped a row due to NaN result.`);
        }
      } catch (e) {
        console.error(e);
      }
    }
    return results;
  };
  useEffect(() => {
    // Seu trecho de código para carregar os dados do gráfico
    if (dashboardData.datasetsData && dashboardData.datasetsData[0] && dashboardData.datasetsData[0].dataParsed) {
      const dataset = dashboardData.datasetsData[0].dataParsed;
      const indicator = dashboardData.indicatorData[0];
      
      let results = calculateIndicatorValue(dataset, indicator);
      
      if (indicator.accumulationType === "AVERAGE") {
        results = [calculateAverage(results)];
      }
  
      let newGraphData = {
        labels: dataset.map((_, i) => 'Item ' + (i + 1)),
        datasets: [
          {
            label: indicator.name,
            data: results,
            borderWidth: 1,
          },
        ],
      }
    
      setGraphData(newGraphData as any);
    }
  }, [dashboardData]);

  return !dashboardData.loading && (
    <>
      <Content headerTitle={`Visualização do Painel - ${id}`}>
        {dashboardData && dashboardData.dashboard && dashboardData.dashboard[0].name && (
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            {dashboardData?.dashboard[0].name}
          </h1>
        )}
        <div id="dashboardContainer">
          {graphData && graphData.datasets && dashboardData.indicatorData[0].graph === "BAR" && (
            <Bar
              data={graphData}
            />
          )}
          {graphData && graphData.datasets && dashboardData.indicatorData[0].graph === "TEXT" && (
            <div className="rounded-lg shadow-md p-6 bg-white border border-gray-200 mt-6">
              <h2 className="text-xl font-semibold mb-4">Resultado</h2>
              <p className="text-3xl font-bold">{graphData.datasets &&  graphData.datasets[0] && graphData.datasets[0].data[0]}</p>
            </div>
          )}
        </div>
      </Content>
    </>
  )
}