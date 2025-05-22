'use client';

import Content from "@/components/template/Content";
import Configuration from "@/services/lib/config";
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react';
import axios from 'axios';

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

export default function DashboardViewPage() {
  const [dashboardData, setDashboardData] = useState<DashboardDataType>({
    loading: true,
    dashboard: [],
    indicatorData: [],
    datasetsData: []
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
    loadDashboard(id)
  }, []);

  return !dashboardData.loading && (
    <>
      <Content headerTitle={`Visualização do Painel - ${id}`}>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Configurações</h2>
          <br />

          <h1 className="text-1xl font-bold tracking-tight text-gray-900">Dashboards</h1>
          <DashboardTable dashboardData={dashboardData.dashboard} />

          {dashboardData.dashboard.map((dashboard, index) => (
            <JsonDataTable key={index} jsonData={dashboard.dashboardData} title={`Dashboard ${index + 1} Configuration`} />
          ))}
          <br />
          
          <h1 className="text-1xl font-bold tracking-tight text-gray-900">Indicators</h1>
          <IndicatorTable indicatorData={dashboardData.indicatorData} />

          {dashboardData.indicatorData.map((indicator, index) => (
            <>
              <JsonDataTable key={index} jsonData={indicator.formulaData} title={`Indicator ${index + 1} Formula`} />
              <JsonDataTable key={index} jsonData={indicator.equivalentFieldsData} title={`Indicator ${index + 1} Equivalent Fields`} />
            </>
          ))}
          <br />
          
          <h1 className="text-1xl font-bold tracking-tight text-gray-900">Datasets</h1>
          <DatasetsTable datasetsData={dashboardData.datasetsData} />

          {dashboardData.datasetsData.map((dataset, index) => (
            <>
              <JsonDataTable key={index} jsonData={dataset.data} title={`Dataset ${index + 1} Data`} />
            </>
          ))}
        </div>
      </Content>
    </>
  )
}
const DashboardTable: React.FC<TableProps>  = ({ dashboardData }) => {
  return (
    <table className="min-w-full bg-white">
      <thead className="bg-gray-800 text-white">
        <tr>
          <th className="w-1/3 py-2">ID</th>
          <th className="w-1/3 py-2">Name</th>
          <th className="w-1/3 py-2">Company ID</th>
          <th className="w-1/3 py-2">Created At</th>
          <th className="w-1/3 py-2">Updated At</th>
        </tr>
      </thead>
      <tbody className="text-gray-700">
        {dashboardData.map((dashboard) => (
          <tr key={dashboard.id}>
            <td className="w-1/3 py-2">{dashboard.id}</td>
            <td className="w-1/3 py-2">{dashboard.name}</td>
            <td className="w-1/3 py-2">{dashboard.companyId}</td>
            <td className="w-1/3 py-2">{dashboard.created_at}</td>
            <td className="w-1/3 py-2">{dashboard.updated_at}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
const IndicatorTable: React.FC<TableProps> = ({ indicatorData }) => {
  return (
    <table className="min-w-full bg-white">
      <thead className="bg-gray-800 text-white">
        <tr>
          <th className="w-1/5 py-2">ID</th>
          <th className="w-1/5 py-2">Name</th>
          <th className="w-1/5 py-2">Graph</th>
          <th className="w-1/5 py-2">Accumulation Type</th>
          <th className="w-1/5 py-2">Created At</th>
          <th className="w-1/5 py-2">Updated At</th>
        </tr>
      </thead>
      <tbody className="text-gray-700">
        {indicatorData.map((indicator) => (
          <tr key={indicator.id}>
            <td className="w-1/5 py-2">{indicator.id}</td>
            <td className="w-1/5 py-2">{indicator.name}</td>
            <td className="w-1/5 py-2">{indicator.graph}</td>
            <td className="w-1/5 py-2">{indicator.accumulationType}</td>
            <td className="w-1/5 py-2">{indicator.created_at}</td>
            <td className="w-1/5 py-2">{indicator.updated_at}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const DatasetsTable: React.FC<TableProps> = ({ datasetsData }) => {
  return (
    <table className="min-w-full bg-white">
      <thead className="bg-gray-800 text-white">
        <tr>
          <th className="w-1/5 py-2">ID</th>
          <th className="w-1/5 py-2">Name</th>
          <th className="w-1/5 py-2">Created At</th>
          <th className="w-1/5 py-2">Updated At</th>
        </tr>
      </thead>
      <tbody className="text-gray-700">
        {datasetsData.map((dataset) => (
          <tr key={dataset.id}>
            <td className="w-1/5 py-2">{dataset.id}</td>
            <td className="w-1/5 py-2">{dataset.name}</td>
            <td className="w-1/5 py-2">{dataset.created_at}</td>
            <td className="w-1/5 py-2">{dataset.updated_at}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};


const JsonDataTable: React.FC<JsonDataTableProps> = ({ jsonData, title }) => {
  const parsedData = JSON.parse(jsonData);
  const headers = parsedData.length > 0 ? Object.keys(parsedData[0]) : [];

  return (
    <div className="my-6">
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <table className="min-w-full bg-white">
        <thead className="bg-gray-800 text-white">
          <tr>
            {headers.map((header, index) => (
              <th className="py-2" key={index}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody className="text-gray-700">
          {parsedData.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {headers.map((header, colIndex) => (
                <td className="py-2" key={colIndex}>{row[header]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};